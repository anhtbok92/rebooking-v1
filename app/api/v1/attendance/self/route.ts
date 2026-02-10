import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/attendance/self - Get own attendance records
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userId = (session.user as any).id
		const userRole = (session.user as any).role

		// Only STAFF and DOCTOR can access
		if (!["STAFF", "DOCTOR"].includes(userRole)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { searchParams } = new URL(req.url)
		const month = searchParams.get("month")
		const year = searchParams.get("year")

		const where: any = { userId }

		// Filter by month/year if provided
		if (month && year) {
			const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
			const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
			where.date = {
				gte: startDate,
				lte: endDate,
			}
		}

		const attendances = await prisma.attendance.findMany({
			where,
			orderBy: { date: "desc" },
			take: 100,
		})

		return NextResponse.json({ attendances })
	} catch (error: any) {
		console.error("Get self attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to fetch attendance" },
			{ status: 500 }
		)
	}
}

// POST /api/v1/attendance/self/check-in - Check in
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userId = (session.user as any).id
		const userRole = (session.user as any).role

		// Only STAFF and DOCTOR can check in
		if (!["STAFF", "DOCTOR"].includes(userRole)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		// Check if already checked in today
		const existing = await prisma.attendance.findUnique({
			where: {
				userId_date: {
					userId,
					date: today,
				},
			},
		})

		if (existing) {
			return NextResponse.json(
				{ error: "Already checked in today" },
				{ status: 400 }
			)
		}

		// Create attendance record with check-in time
		const attendance = await prisma.attendance.create({
			data: {
				userId,
				date: today,
				status: "PRESENT",
				checkIn: new Date(),
			},
		})

		return NextResponse.json(attendance, { status: 201 })
	} catch (error: any) {
		console.error("Check-in error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to check in" },
			{ status: 500 }
		)
	}
}
