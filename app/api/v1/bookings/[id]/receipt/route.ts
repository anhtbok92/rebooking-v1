import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateReceiptHTML } from "@/lib/receipt-generator"
import { generateReceiptPDF } from "@/lib/receipt-pdf-generator"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { id } = await params
		const { searchParams } = new URL(request.url)
		const format = searchParams.get("format") || "pdf" // Default to PDF
		const locale = searchParams.get("locale") || "en" // Get locale from query params
		const currency = searchParams.get("currency") || "USD" // Get currency from query params

		const booking = await prisma.booking.findUnique({
			where: { id },
			include: {
				service: true,
				user: true,
			},
		})

		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 })
		}

		// Check if user owns this booking or is admin/super admin/staff
		const userRole = (session.user as any).role
		const userId = (session.user as any).id

		// Allow access if user is admin, super admin, staff, doctor, or owns the booking
		const hasAccess = ["ADMIN", "SUPER_ADMIN", "STAFF", "DOCTOR"].includes(userRole) || booking.userId === userId
		
		if (!hasAccess) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const receiptData = {
			bookingId: booking.id,
			date: booking.date.toISOString(),
			time: booking.time,
			customerName: booking.userName,
			phone: booking.phone,
			serviceName: booking.service.name,
			servicePrice: booking.service.price,
			paymentMethod: booking.paymentMethod,
			status: booking.status,
			locale: locale, // Pass locale
			currency: currency, // Pass currency
		}

		// Generate PDF or HTML based on format parameter
		if (format === "pdf") {
			const pdfBuffer = await generateReceiptPDF(receiptData)
			return new NextResponse(new Uint8Array(pdfBuffer), {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="receipt-${booking.id}.pdf"`,
				},
			})
		} else {
			const receiptHTML = generateReceiptHTML(receiptData)
			return new NextResponse(receiptHTML, {
				headers: {
					"Content-Type": "text/html",
					"Content-Disposition": `inline; filename="receipt-${booking.id}.html"`,
				},
			})
		}
	} catch (error) {
		console.error("Error generating receipt:", error)
		return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 })
	}
}