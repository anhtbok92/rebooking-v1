import { getEmailTemplate } from "../email-service"

interface BookingDetails {
	bookingId: string
	serviceName: string
	date: string
	time: string
	price: number
	status: string
	userName: string
	phone?: string
	paymentMethod?: string
}

export function getBookingConfirmationEmail(booking: BookingDetails) {
	const statusColor = booking.status === "CONFIRMED" ? "#10b981" : booking.status === "PENDING" ? "#f59e0b" : "#6b7280"
	
	const content = `
		<p>Hello <strong>${booking.userName}</strong>,</p>
		<p>Your appointment has been confirmed! We're excited to see you.</p>
		
		<div class="success-box">
			<p><strong>✅ Booking Confirmed</strong></p>
			<p style="color: ${statusColor}; font-weight: 600;">Status: ${booking.status}</p>
		</div>

		<table class="details-table">
			<tr>
				<td>Service</td>
				<td><strong>${booking.serviceName}</strong></td>
			</tr>
			<tr>
				<td>Date</td>
				<td>${new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
			</tr>
			<tr>
				<td>Time</td>
				<td><strong>${booking.time}</strong></td>
			</tr>
			<tr>
				<td>Price</td>
				<td><strong>$${booking.price.toLocaleString()}</strong></td>
			</tr>
			${booking.paymentMethod ? `
			<tr>
				<td>Payment Method</td>
				<td>${booking.paymentMethod}</td>
			</tr>
			` : ""}
			<tr>
				<td>Booking ID</td>
				<td><code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${booking.bookingId}</code></td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Booking Details</a>
		</div>

		<div class="info-box">
			<strong>📅 Reminder:</strong>
			<p>We'll send you a reminder 24 hours before your appointment. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
		</div>
	`
	return getEmailTemplate(content, "Booking Confirmed - Luxury Nail Spa")
}

export function getBookingStatusUpdateEmail(booking: BookingDetails, oldStatus: string) {
	const content = `
		<p>Hello <strong>${booking.userName}</strong>,</p>
		<p>Your booking status has been updated.</p>
		
		<div class="info-box">
			<strong>Status Change:</strong>
			<p>Previous Status: ${oldStatus}</p>
			<p>New Status: <strong>${booking.status}</strong></p>
		</div>

		<table class="details-table">
			<tr>
				<td>Service</td>
				<td><strong>${booking.serviceName}</strong></td>
			</tr>
			<tr>
				<td>Date</td>
				<td>${new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
			</tr>
			<tr>
				<td>Time</td>
				<td><strong>${booking.time}</strong></td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Booking</a>
		</div>

		${booking.status === "CANCELLED" ? `
		<div class="warning-box">
			<p><strong>Booking Cancelled</strong></p>
			<p>If you have any questions or would like to reschedule, please contact us.</p>
		</div>
		` : ""}
	`
	return getEmailTemplate(content, "Booking Status Updated")
}

export function getBookingReminderEmail(booking: BookingDetails) {
	const appointmentDate = new Date(booking.date)
	const isToday = appointmentDate.toDateString() === new Date().toDateString()
	
	const content = `
		<p>Hello <strong>${booking.userName}</strong>,</p>
		<p>This is a friendly reminder about your upcoming appointment.</p>
		
		<div class="info-box">
			<strong>📅 Appointment Reminder</strong>
			<p>${isToday ? "Your appointment is <strong>today</strong>!" : `Your appointment is in 24 hours`}</p>
		</div>

		<table class="details-table">
			<tr>
				<td>Service</td>
				<td><strong>${booking.serviceName}</strong></td>
			</tr>
			<tr>
				<td>Date</td>
				<td><strong>${appointmentDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong></td>
			</tr>
			<tr>
				<td>Time</td>
				<td><strong>${booking.time}</strong></td>
			</tr>
			<tr>
				<td>Price</td>
				<td>$${booking.price.toLocaleString()}</td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Booking</a>
		</div>

		<div class="info-box">
			<strong>💡 Tips for your visit:</strong>
			<p>• Please arrive 10 minutes early</p>
			<p>• Bring any reference photos or inspiration</p>
			<p>• If you need to reschedule, please do so as soon as possible</p>
		</div>
	`
	return getEmailTemplate(content, "Appointment Reminder - Luxury Nail Spa")
}

export function getBookingCompletedEmail(booking: BookingDetails) {
	const content = `
		<p>Hello <strong>${booking.userName}</strong>,</p>
		<p>Thank you for visiting Luxury Nail Spa! We hope you enjoyed your service.</p>
		
		<div class="success-box">
			<p><strong>✨ Service Completed</strong></p>
			<p>Your appointment has been marked as completed. We'd love to hear about your experience!</p>
		</div>

		<table class="details-table">
			<tr>
				<td>Service</td>
				<td><strong>${booking.serviceName}</strong></td>
			</tr>
			<tr>
				<td>Date</td>
				<td>${new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
			</tr>
			<tr>
				<td>Amount Paid</td>
				<td><strong>$${booking.price.toLocaleString()}</strong></td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Receipt</a>
		</div>

		<div class="info-box">
			<strong>💝 Special Offer:</strong>
			<p>Book your next appointment within 30 days and receive 10% off! Use code: <strong>RETURN10</strong></p>
		</div>

		<p>We appreciate your business and look forward to serving you again soon!</p>
	`
	return getEmailTemplate(content, "Thank You - Service Completed")
}

