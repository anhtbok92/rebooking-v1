import { getEmailTemplate } from "../email-service"

export function getAdminCreatedEmail(name: string, email: string, role: string, tempPassword: string) {
	const roleDisplay = role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : role === "DOCTOR" ? "Bác sĩ" : "Staff"
	
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Your ${roleDisplay} account has been created for Luxury Nail Spa management system.</p>
		
		<div class="success-box">
			<p><strong>✅ Account Created Successfully</strong></p>
			<p>You now have access to the admin dashboard with ${roleDisplay} privileges.</p>
		</div>

		<div class="info-box">
			<strong>Account Information:</strong>
			<p>Email: ${email}</p>
			<p>Role: ${roleDisplay}</p>
			<p>Temporary Password: <strong>${tempPassword}</strong></p>
		</div>

		<div class="warning-box">
			<p><strong>⚠️ Important:</strong> Please change your password immediately after your first login for security.</p>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/signin" class="email-button">Sign In to Dashboard</a>
		</div>

		<p>Your account permissions include:</p>
		<ul style="color: #6b7280; margin-left: 20px; margin-top: 12px;">
			<li>Manage bookings and appointments</li>
			<li>View customer analytics</li>
			<li>${role === "SUPER_ADMIN" ? "Manage users and staff accounts" : ""}</li>
			<li>${role === "SUPER_ADMIN" || role === "ADMIN" ? "Create and manage discount codes" : ""}</li>
			<li>${role === "DOCTOR" ? "View patient information" : ""}</li>
			<li>Access reports and statistics</li>
		</ul>
	`
	return getEmailTemplate(content, `Welcome ${roleDisplay} - Account Created`)
}

export function getRoleChangedEmail(name: string, newRole: string, oldRole: string) {
	const roleDisplay = (role: string) => {
		switch (role) {
			case "SUPER_ADMIN": return "Super Admin"
			case "ADMIN": return "Admin"
			case "STAFF": return "Staff"
			case "DOCTOR": return "Bác sĩ"
			default: return "Client"
		}
	}
	
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Your account role has been updated.</p>
		
		<div class="info-box">
			<strong>Role Change Details:</strong>
			<p>Previous Role: ${roleDisplay(oldRole)}</p>
			<p>New Role: <strong>${roleDisplay(newRole)}</strong></p>
		</div>

		<div class="success-box">
			<p><strong>✅ Role Updated Successfully</strong></p>
			<p>Your account permissions have been updated. You may need to sign out and sign back in for changes to take effect.</p>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">Access Dashboard</a>
		</div>

		<p>If you have any questions about your new role or permissions, please contact the system administrator.</p>
	`
	return getEmailTemplate(content, "Account Role Updated")
}

