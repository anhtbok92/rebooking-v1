import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"
import { getPasswordResetSuccessEmail } from "@/lib/email-templates/auth"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
	try {
		const { token, email, newPassword } = await req.json()

		if (!token || !email || !newPassword) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		if (newPassword.length < 6) {
			return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
		}

		// Find user with valid reset token
		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user || !user.resetToken || user.resetToken !== token) {
			return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
		}

		if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
			return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
		}

		// Hash new password and clear reset token
		const hashedPassword = await bcrypt.hash(newPassword, 10)
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null,
			},
		})

		// Send success email
		try {
			await sendEmail({
				to: email,
				subject: "Password Reset Successful - Luxury Nail Spa",
				html: getPasswordResetSuccessEmail(updatedUser.name || "there"),
			})
		} catch (emailError) {
			console.error("Failed to send password reset success email:", emailError)
			// Don't fail the reset if email fails
		}

		return NextResponse.json({ message: "Password reset successfully" })
	} catch (error) {
		console.error("Reset password error:", error)
		return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
	}
}

