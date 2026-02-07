import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"
import { getBookingStatusUpdateEmail, getBookingCompletedEmail } from "@/lib/email-templates/bookings"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const booking = await prisma.booking.findUnique({
			where: { id },
			include: {
				service: true,
				photos: true,
			},
		})

		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 })
		}

		return NextResponse.json(booking, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const body = await req.json()
		const { status } = body

		// Get old status before update
		const oldBooking = await prisma.booking.findUnique({
			where: { id },
			include: { service: true },
		})

		if (!oldBooking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 })
		}

		const oldStatus = oldBooking.status

		const booking = await prisma.booking.update({
			where: { id },
			data: {
				status,
			},
			include: {
				service: true,
				photos: true,
			},
		})

		// Send status update email if status changed and email exists
		if (oldStatus !== status && booking.email) {
			try {
				await sendEmail({
					to: booking.email,
					subject: "Booking Status Updated - Luxury Nail Spa",
					html: getBookingStatusUpdateEmail(
						{
							bookingId: booking.id,
							serviceName: booking.service.name,
							date: booking.date.toISOString(),
							time: booking.time,
							price: booking.service.price,
							status: booking.status,
							userName: booking.userName,
							phone: booking.phone || undefined,
							paymentMethod: booking.paymentMethod || undefined,
						},
						oldStatus,
					),
				})

				// Send completion email if status changed to COMPLETED
				if (status === "COMPLETED") {
					await sendEmail({
						to: booking.email,
						subject: "Thank You - Service Completed",
						html: getBookingCompletedEmail({
							bookingId: booking.id,
							serviceName: booking.service.name,
							date: booking.date.toISOString(),
							time: booking.time,
							price: booking.service.price,
							status: booking.status,
							userName: booking.userName,
							phone: booking.phone || undefined,
							paymentMethod: booking.paymentMethod || undefined,
						}),
					})
				}
			} catch (emailError) {
				console.error("Failed to send booking status update email:", emailError)
				// Don't fail the update if email fails
			}
		}

		return NextResponse.json(booking, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const body = await req.json()
		const { serviceId, date, time, paymentMethod, mobileProvider, photoUrls, userName, phone, status } = body

		const booking = await prisma.booking.update({
			where: { id },
			data: {
				serviceId,
				date: date ? new Date(date) : undefined,
				time,
				paymentMethod,
				mobileProvider,
				userName,
				phone,
				status,
				photos: photoUrls
					? {
						deleteMany: {},
						create: photoUrls.map((url: string) => ({ url })),
					}
					: undefined,
			},
			include: {
				service: true,
				photos: true,
			},
		})

		return NextResponse.json(booking, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { id } = await params

		// Check if booking exists
		const booking = await prisma.booking.findUnique({
			where: { id },
		})

		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 })
		}

		// Check if user has permission to delete
		const userRole = (session.user as any).role
		const userId = (session.user as any).id

		// Only ADMIN, SUPER_ADMIN, or the booking owner can delete
		if (!["ADMIN", "SUPER_ADMIN"].includes(userRole) && booking.userId !== userId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await prisma.booking.delete({
			where: { id },
		})

		return NextResponse.json({ message: "Booking deleted" }, { status: 200 })
	} catch (error) {
		console.error("Error deleting booking:", error)
		return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
	}
}
