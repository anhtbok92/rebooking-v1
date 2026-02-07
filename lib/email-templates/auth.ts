import { getEmailTemplate } from "../email-service"

export function getWelcomeEmail(name: string, email: string) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Welcome to Luxury Nail Spa! We're thrilled to have you join our community.</p>
		
		<div class="success-box">
			<p><strong>🎉 Your account has been successfully created!</strong></p>
			<p>You can now book appointments, track your bookings, and enjoy exclusive benefits.</p>
		</div>

		<div class="info-box">
			<strong>Account Details:</strong>
			<p>Email: ${email}</p>
			<p>You can sign in anytime to manage your bookings and preferences.</p>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/signin" class="email-button">Sign In to Your Account</a>
		</div>

		<p>If you have any questions or need assistance, feel free to contact our support team.</p>
	`
	return getEmailTemplate(content, "Welcome to Luxury Nail Spa")
}

export function getPasswordResetEmail(name: string, resetLink: string) {
	const content = `
		<p>Hello <strong>${name || "there"}</strong>,</p>
		<p>You requested to reset your password for your Luxury Nail Spa account.</p>
		
		<div class="warning-box">
			<p><strong>⚠️ Security Notice</strong></p>
			<p>This link will expire in 1 hour. If you didn't request this, please ignore this email and your password will remain unchanged.</p>
		</div>

		<div style="text-align: center;">
			<a href="${resetLink}" class="email-button">Reset Your Password</a>
		</div>

		<p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
			If the button doesn't work, copy and paste this link into your browser:<br/>
			<a href="${resetLink}" style="color: #7c3aed; word-break: break-all; font-size: 12px;">${resetLink}</a>
		</p>
	`
	return getEmailTemplate(content, "Reset Your Password")
}

export function getPasswordResetSuccessEmail(name: string) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Your password has been successfully reset.</p>
		
		<div class="success-box">
			<p><strong>✅ Password Reset Successful</strong></p>
			<p>Your account is now secured with your new password.</p>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/signin" class="email-button">Sign In Now</a>
		</div>

		<div class="warning-box">
			<p><strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately.</p>
		</div>
	`
	return getEmailTemplate(content, "Password Reset Successful")
}

export function getGuestSignupEmail(name: string, email: string, phone: string, resetLink: string) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Thank you for booking with Luxury Nail Spa! Your guest account has been successfully created.</p>
		
		<div class="success-box">
			<p><strong>🎉 Welcome to Luxury Nail Spa!</strong></p>
			<p>To secure your account and set your own password, please click the button below.</p>
		</div>

		<div class="info-box">
			<strong>Account Details:</strong>
			<p>Email: ${email}</p>
			<p>Phone: ${phone}</p>
		</div>

		<div style="text-align: center;">
			<a href="${resetLink}" class="email-button">Set Your Password</a>
		</div>

		<p>Once you set your password, you'll be able to:</p>
		<ul style="color: #6b7280; margin-left: 20px; margin-top: 12px;">
			<li>View and manage your bookings</li>
			<li>Track your appointment history</li>
			<li>Earn loyalty rewards</li>
			<li>Access exclusive discounts</li>
		</ul>
	`
	return getEmailTemplate(content, "Welcome - Set Your Password")
}

