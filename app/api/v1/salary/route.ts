import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { createEmployeeSalarySchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createGetHandler, createPostHandler } from "@/lib/api-wrapper"

async function handleGetSalaries(req: NextRequest) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const salaries = await prisma.employeeSalary.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
						phone: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json(salaries)
	} catch (error) {
		console.error("Get salaries error:", error)
		return NextResponse.json({ error: "Failed to fetch salaries" }, { status: 500 })
	}
}

async function handleCreateSalary(req: NextRequest) {
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
		const validation = validateRequest(createEmployeeSalarySchema, body)

		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}

		const { userId, baseSalary, allowance, commissionRate, workingDaysPerMonth } = validation.data

		// Check if user exists and is staff/doctor
		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		if (!["STAFF", "DOCTOR"].includes(user.role)) {
			return NextResponse.json({ error: "User must be STAFF or DOCTOR" }, { status: 400 })
		}

		// Check if salary already exists
		const existingSalary = await prisma.employeeSalary.findUnique({
			where: { userId },
		})

		if (existingSalary) {
			return NextResponse.json({ error: "Salary already exists for this user" }, { status: 409 })
		}

		const salary = await prisma.employeeSalary.create({
			data: {
				userId,
				baseSalary,
				allowance,
				commissionRate,
				workingDaysPerMonth,
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
			},
		})

		return NextResponse.json(salary, { status: 201 })
	} catch (error) {
		console.error("Create salary error:", error)
		return NextResponse.json({ error: "Failed to create salary" }, { status: 500 })
	}
}

export const GET = createGetHandler(handleGetSalaries)
export const POST = createPostHandler(handleCreateSalary)
