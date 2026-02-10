import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/v1/attendance/self/check-out - Check out
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userId = (session.user as any).id
		const userRole = (session.user as any).role

		// Only STAFF and DOCTOR can check out
		if (!["STAFF", "DOCTOR"].includes(userRole)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		// Find today's attendance record
		const attendance = await prisma.attendance.findUnique({
			where: {
				userId_date: {
					userId,
					date: today,
				},
			},
		})

		if (!attendance) {
			return NextResponse.json(
				{ error: "No check-in record found for today" },
				{ status: 400 }
			)
		}

		if (attendance.checkOut) {
			return NextResponse.json(
				{ error: "Already checked out today" },
				{ status: 400 }
			)
		}

		// Update with check-out time
		const updated = await prisma.attendance.update({
			where: { id: attendance.id },
			data: {
				checkOut: new Date(),
			},
		})

		return NextResponse.json(updated)
	} catch (error: any) {
		console.error("Check-out error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to check out" },
			{ status: 500 }
		)
	}
}
