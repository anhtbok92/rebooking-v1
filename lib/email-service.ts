import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_cXUQzhtv_BvGgBRMF6TPfieu6SCpNRexr")

export interface EmailOptions {
	to: string | string[]
	subject: string
	html: string
	from?: string
}

export async function sendEmail({ to, subject, html, from = "bookings@luxurynailspa.com" }: EmailOptions) {
	try {
		const result = await resend.emails.send({
			from,
			to: Array.isArray(to) ? to : [to],
			subject,
			html,
		})
		return { success: true, data: result }
	} catch (error) {
		console.error("Email send error:", error)
		return { success: false, error }
	}
}

// Base email template wrapper
export function getEmailTemplate(content: string, title?: string) {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title || "Luxury Nail Spa"}</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			line-height: 1.6;
			color: #1f2937;
			background-color: #f9fafb;
		}
		.email-container {
			max-width: 600px;
			margin: 0 auto;
			background-color: #ffffff;
		}
		.email-header {
			background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
			color: white;
			padding: 40px 32px;
			text-align: center;
			border-radius: 8px 8px 0 0;
		}
		.email-header h1 {
			font-size: 28px;
			font-weight: 700;
			margin-bottom: 8px;
		}
		.email-header p {
			font-size: 14px;
			opacity: 0.95;
		}
		.email-body {
			padding: 32px;
		}
		.email-content {
			color: #374151;
			font-size: 16px;
			line-height: 1.7;
		}
		.email-button {
			display: inline-block;
			background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
			color: white;
			padding: 14px 32px;
			border-radius: 8px;
			text-decoration: none;
			font-weight: 600;
			font-size: 16px;
			margin: 24px 0;
			text-align: center;
		}
		.email-button:hover {
			opacity: 0.9;
		}
		.info-box {
			background: #f3f4f6;
			border-left: 4px solid #7c3aed;
			padding: 16px;
			border-radius: 6px;
			margin: 20px 0;
		}
		.info-box strong {
			color: #1f2937;
			display: block;
			margin-bottom: 8px;
		}
		.info-box p {
			margin: 4px 0;
			color: #6b7280;
			font-size: 14px;
		}
		.warning-box {
			background: #fef3c7;
			border-left: 4px solid #f59e0b;
			padding: 16px;
			border-radius: 6px;
			margin: 20px 0;
			color: #92400e;
		}
		.success-box {
			background: #d1fae5;
			border-left: 4px solid #10b981;
			padding: 16px;
			border-radius: 6px;
			margin: 20px 0;
			color: #065f46;
		}
		.email-footer {
			background-color: #f9fafb;
			padding: 24px 32px;
			text-align: center;
			border-radius: 0 0 8px 8px;
			border-top: 1px solid #e5e7eb;
		}
		.email-footer p {
			color: #6b7280;
			font-size: 12px;
			margin: 4px 0;
		}
		.email-footer a {
			color: #7c3aed;
			text-decoration: none;
		}
		.details-table {
			width: 100%;
			border-collapse: collapse;
			margin: 20px 0;
		}
		.details-table td {
			padding: 12px;
			border-bottom: 1px solid #e5e7eb;
		}
		.details-table td:first-child {
			font-weight: 600;
			color: #374151;
			width: 40%;
		}
		.details-table td:last-child {
			color: #6b7280;
		}
		@media only screen and (max-width: 600px) {
			.email-body {
				padding: 24px;
			}
			.email-header {
				padding: 32px 24px;
			}
			.email-header h1 {
				font-size: 24px;
			}
		}
	</style>
</head>
<body>
	<div style="padding: 20px;">
		<div class="email-container">
			<div class="email-header">
				<h1>${title || "Luxury Nail Spa"}</h1>
				<p>Your Beauty, Our Passion</p>
			</div>
			<div class="email-body">
				<div class="email-content">
					${content}
				</div>
			</div>
			<div class="email-footer">
				<p><strong>Luxury Nail Spa</strong></p>
				<p>Thank you for choosing us for your beauty needs</p>
				<p style="margin-top: 12px;">
					<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}">Visit Our Website</a>
				</p>
				<p style="margin-top: 16px; font-size: 11px; color: #9ca3af;">
					© ${new Date().getFullYear()} Luxury Nail Spa. All rights reserved.
				</p>
			</div>
		</div>
	</div>
</body>
</html>
	`
}
