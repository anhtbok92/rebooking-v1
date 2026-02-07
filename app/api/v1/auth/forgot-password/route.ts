import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"
import { getPasswordResetEmail } from "@/lib/email-templates/auth"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json()

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 })
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			// Don't reveal if user exists for security
			return NextResponse.json({
				message: "If an account with that email exists, a password reset link has been sent.",
			})
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex")
		const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

		// Store reset token in database
		await prisma.user.update({
			where: { id: user.id },
			data: {
				resetToken,
				resetTokenExpiry,
			},
		})

		// Send reset email
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
		const resetLink = `${appUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

		try {
			await sendEmail({
				to: email,
				subject: "Reset Your Password - Luxury Nail Spa",
				html: getPasswordResetEmail(user.name || "there", resetLink),
			})
		} catch (emailError) {
			console.error("Failed to send password reset email:", emailError)
			return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
		}

		return NextResponse.json({
			message: "If an account with that email exists, a password reset link has been sent.",
		})
	} catch (error) {
		console.error("Forgot password error:", error)
		return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
	}
}

