import { getEmailTemplate } from "../email-service"

interface DiscountDetails {
	code: string
	type: "PERCENT" | "FIXED"
	value: number
	minAmount?: number
	expiresAt?: string
	description?: string
}

export function getDiscountCodeEmail(name: string, discount: DiscountDetails) {
	const discountValue = discount.type === "PERCENT" ? `${discount.value}%` : `$${discount.value}`
	const minAmountText = discount.minAmount ? ` (minimum order: $${discount.minAmount})` : ""
	const expiryText = discount.expiresAt ? ` Valid until ${new Date(discount.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""
	
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>We have an exclusive discount code just for you!</p>
		
		<div class="success-box" style="text-align: center; padding: 32px;">
			<p style="font-size: 14px; margin-bottom: 12px;">Use this code at checkout:</p>
			<p style="font-size: 36px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">${discount.code}</p>
			<p style="font-size: 18px; margin-top: 12px;">Save ${discountValue}${minAmountText}${expiryText}</p>
		</div>

		${discount.description ? `
		<div class="info-box">
			<strong>About this offer:</strong>
			<p>${discount.description}</p>
		</div>
		` : ""}

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}" class="email-button">Book Now & Save</a>
		</div>

		<div class="info-box">
			<strong>How to use:</strong>
			<p>1. Add services to your cart</p>
			<p>2. Proceed to checkout</p>
			<p>3. Enter code: <strong>${discount.code}</strong></p>
			<p>4. Enjoy your discount!</p>
		</div>

		${discount.expiresAt ? `
		<div class="warning-box">
			<p><strong>⏰ Limited Time Offer</strong></p>
			<p>This discount code expires on ${new Date(discount.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Don't miss out!</p>
		</div>
		` : ""}
	`
	return getEmailTemplate(content, "Exclusive Discount - Luxury Nail Spa")
}

export function getDiscountAppliedEmail(name: string, discount: DiscountDetails, savings: number, orderTotal: number) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Great news! Your discount code has been successfully applied to your order.</p>
		
		<div class="success-box">
			<p><strong>✅ Discount Applied</strong></p>
			<p>You saved <strong>$${savings.toLocaleString()}</strong> on your booking!</p>
		</div>

		<table class="details-table">
			<tr>
				<td>Discount Code</td>
				<td><strong>${discount.code}</strong></td>
			</tr>
			<tr>
				<td>Discount Amount</td>
				<td><strong>$${savings.toLocaleString()}</strong></td>
			</tr>
			<tr>
				<td>Order Total</td>
				<td><strong>$${orderTotal.toLocaleString()}</strong></td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Booking</a>
		</div>

		<p>Thank you for choosing Luxury Nail Spa. We look forward to serving you!</p>
	`
	return getEmailTemplate(content, "Discount Applied - Thank You")
}

