import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/attendance/self/today - Get today's attendance status
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

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const attendance = await prisma.attendance.findUnique({
			where: {
				userId_date: {
					userId,
					date: today,
				},
			},
		})

		return NextResponse.json({
			attendance,
			hasCheckedIn: !!attendance,
			hasCheckedOut: !!attendance?.checkOut,
		})
	} catch (error: any) {
		console.error("Get today attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to fetch today's attendance" },
			{ status: 500 }
		)
	}
}
