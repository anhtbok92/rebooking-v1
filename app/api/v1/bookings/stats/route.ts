import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN" && userRole !== "STAFF")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		// Get all bookings for statistics
		const allBookings = await prisma.booking.findMany({
			select: {
				id: true,
				status: true,
				date: true,
				createdAt: true,
				service: {
					select: {
						price: true,
					},
				},
			},
		})

		// Calculate statistics
		const totalBookings = allBookings.length
		const todayBookings = allBookings.filter((b) => {
			const bookingDate = new Date(b.date)
			return bookingDate >= today && bookingDate < tomorrow
		}).length

		const pendingBookings = allBookings.filter((b) => b.status === "PENDING").length
		const confirmedBookings = allBookings.filter((b) => b.status === "CONFIRMED").length
		const completedBookings = allBookings.filter((b) => b.status === "COMPLETED").length
		const cancelledBookings = allBookings.filter((b) => b.status === "CANCELLED").length

		// New bookings (created in last 24 hours)
		const yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)
		const newBookings = allBookings.filter((b) => new Date(b.createdAt) >= yesterday).length

		// Total revenue
		const totalRevenue = allBookings
			.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
			.reduce((sum, b) => sum + b.service.price, 0)

		// Today's revenue
		const todayRevenue = allBookings
			.filter((b) => {
				const bookingDate = new Date(b.date)
				return bookingDate >= today && bookingDate < tomorrow && (b.status === "COMPLETED" || b.status === "CONFIRMED")
			})
			.reduce((sum, b) => sum + b.service.price, 0)

		return NextResponse.json({
			total: totalBookings,
			today: todayBookings,
			pending: pendingBookings,
			confirmed: confirmedBookings,
			completed: completedBookings,
			cancelled: cancelledBookings,
			new: newBookings,
			totalRevenue,
			todayRevenue,
		})
	} catch (error) {
		console.error("Booking stats error:", error)
		return NextResponse.json({ error: "Failed to fetch booking statistics" }, { status: 500 })
	}
}
