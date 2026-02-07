import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: {
				referralPoints: true,
				bookings: {
					where: {
						status: "COMPLETED",
					},
					select: {
						id: true,
					},
				},
			},
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		const bookingPoints = user.bookings.length * 10 // 10 points per completed booking
		const totalPoints = user.referralPoints + bookingPoints

		return NextResponse.json({
			referralPoints: user.referralPoints,
			bookingPoints,
			totalPoints,
		})
	} catch (error) {
		console.error("User points error:", error)
		return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 })
	}
}

