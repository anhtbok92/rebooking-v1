import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { generatePayrollSchema, getPayrollQuerySchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createGetHandler, createPostHandler } from "@/lib/api-wrapper"

async function handleGetPayrolls(req: NextRequest) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const { searchParams } = new URL(req.url)
		const queryParams = Object.fromEntries(searchParams.entries())

		const validation = validateRequest(getPayrollQuerySchema, queryParams)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}

		const { userId, month, year, status, page, limit } = validation.data
		const skip = (page - 1) * limit

		const where: any = {}
		if (userId) where.userId = userId
		if (month) where.month = month
		if (year) where.year = year
		if (status !== "ALL") where.status = status

		const [payrolls, total] = await Promise.all([
			prisma.payroll.findMany({
				where,
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							role: true,
						},
					},
					salary: true,
				},
				orderBy: [{ year: "desc" }, { month: "desc" }],
				skip,
				take: limit,
			}),
			prisma.payroll.count({ where }),
		])

		return NextResponse.json({
			payrolls,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error("Get payrolls error:", error)
		return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 })
	}
}

async function handleGeneratePayroll(req: NextRequest) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const body = await req.json()
		const validation = validateRequest(generatePayrollSchema, body)

		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}

		const { userId, month, year, bonus, deduction, notes } = validation.data

		// Check if payroll already exists
		const existingPayroll = await prisma.payroll.findUnique({
			where: {
				userId_month_year: { userId, month, year },
			},
		})

		if (existingPayroll) {
			return NextResponse.json({ error: "Payroll already exists for this period" }, { status: 409 })
		}

		// Get employee salary
		const salary = await prisma.employeeSalary.findUnique({
			where: { userId },
		})

		if (!salary) {
			return NextResponse.json({ error: "Employee salary not found" }, { status: 404 })
		}

		// Calculate working days from attendance
		const startDate = new Date(year, month - 1, 1)
		const endDate = new Date(year, month, 0)

		const attendances = await prisma.attendance.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
		})

		// Count working days (PRESENT = 1, HALF_DAY = 0.5)
		const workingDays = attendances.reduce((sum, att) => {
			if (att.status === "PRESENT") return sum + 1
			if (att.status === "HALF_DAY") return sum + 0.5
			return sum
		}, 0)

		// Calculate salary components
		const baseSalaryAmount = Math.round((salary.baseSalary / salary.workingDaysPerMonth) * workingDays)
		const allowanceAmount = Math.round((salary.allowance / salary.workingDaysPerMonth) * workingDays)

		// Calculate commission from completed bookings
		const bookings = await prisma.booking.findMany({
			where: {
				doctorId: userId,
				status: "COMPLETED",
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				service: true,
			},
		})

		const totalRevenue = bookings.reduce((sum, booking) => sum + booking.service.price, 0)
		const commissionAmount = Math.round(totalRevenue * (salary.commissionRate / 100))

		const totalAmount = baseSalaryAmount + allowanceAmount + commissionAmount
		const finalAmount = totalAmount + bonus - deduction

		const payroll = await prisma.payroll.create({
			data: {
				userId,
				salaryId: salary.id,
				month,
				year,
				workingDays,
				baseSalaryAmount,
				allowanceAmount,
				commissionAmount,
				totalRevenue,
				totalAmount,
				bonus,
				deduction,
				finalAmount,
				notes,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
				salary: true,
			},
		})

		return NextResponse.json(payroll, { status: 201 })
	} catch (error) {
		console.error("Generate payroll error:", error)
		return NextResponse.json({ error: "Failed to generate payroll" }, { status: 500 })
	}
}

export const GET = createGetHandler(handleGetPayrolls)
export const POST = createPostHandler(handleGeneratePayroll)
