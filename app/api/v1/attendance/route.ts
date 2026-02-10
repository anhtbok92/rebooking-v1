import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { createAttendanceSchema, getAttendanceQuerySchema } from "@/lib/validations/schemas"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/attendance - Get attendance records
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { searchParams } = new URL(req.url)
		const queryParams = {
			userId: searchParams.get("userId") || undefined,
			startDate: searchParams.get("startDate") || undefined,
			endDate: searchParams.get("endDate") || undefined,
			month: searchParams.get("month") || undefined,
			year: searchParams.get("year") || undefined,
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "31",
		}

		const validated = getAttendanceQuerySchema.parse(queryParams)
		const skip = (validated.page - 1) * validated.limit

		const where: any = {}

		if (validated.userId) {
			where.userId = validated.userId
		}

		// Filter by date range
		if (validated.startDate && validated.endDate) {
			where.date = {
				gte: new Date(validated.startDate),
				lte: new Date(validated.endDate),
			}
		} else if (validated.month && validated.year) {
			// Filter by month/year
			const startDate = new Date(validated.year, validated.month - 1, 1)
			const endDate = new Date(validated.year, validated.month, 0, 23, 59, 59)
			where.date = {
				gte: startDate,
				lte: endDate,
			}
		}

		const [attendances, total] = await Promise.all([
			prisma.attendance.findMany({
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
				},
				orderBy: { date: "desc" },
				skip,
				take: validated.limit,
			}),
			prisma.attendance.count({ where }),
		])

		return NextResponse.json({
			attendances,
			pagination: {
				total,
				page: validated.page,
				limit: validated.limit,
				pages: Math.ceil(total / validated.limit),
			},
		})
	} catch (error: any) {
		console.error("Get attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to fetch attendance" },
			{ status: 500 }
		)
	}
}

// POST /api/v1/attendance - Create attendance record
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const body = await req.json()
		const validated = createAttendanceSchema.parse(body)

		// Check if attendance already exists for this user and date
		const existing = await prisma.attendance.findUnique({
			where: {
				userId_date: {
					userId: validated.userId,
					date: new Date(validated.date),
				},
			},
		})

		if (existing) {
			return NextResponse.json(
				{ error: "Attendance already exists for this date" },
				{ status: 400 }
			)
		}

		const attendance = await prisma.attendance.create({
			data: {
				userId: validated.userId,
				date: new Date(validated.date),
				status: validated.status,
				checkIn: validated.checkIn ? new Date(validated.checkIn) : null,
				checkOut: validated.checkOut ? new Date(validated.checkOut) : null,
				notes: validated.notes,
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

		return NextResponse.json(attendance, { status: 201 })
	} catch (error: any) {
		console.error("Create attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to create attendance" },
			{ status: 500 }
		)
	}
}
