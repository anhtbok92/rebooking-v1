import { prisma } from "@/lib/prisma"
import { ensureReferralCode } from "@/lib/referral-code-utils"
import { sendEmail } from "@/lib/email-service"
import { getWelcomeEmail } from "@/lib/email-templates/auth"
import { getReferralSignupEmail as getReferralSignupEmailTemplate } from "@/lib/email-templates/referrals"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"
import { registerUserSchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createPostHandler } from "@/lib/api-wrapper"
import { authRateLimit } from "@/lib/rate-limit"

async function handleRegister(req: NextRequest) {
		const body = await req.json()
		
		const validation = validateRequest(registerUserSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { email, password, name, phone, role, referralCode } = validation.data

		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		// Find referrer if referral code is provided
		let referredById: string | null = null
		if (referralCode) {
			const referrer = await prisma.user.findUnique({
				where: { referralCode: referralCode.toUpperCase() },
				select: { id: true },
			})
			if (referrer) {
				referredById = referrer.id
			}
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				phone,
				role: role || "CLIENT",
				referredById,
			},
		})

		// Generate referral code for all users (admin, super admin, client)
		try {
			await ensureReferralCode(user.id, email)
		} catch (err) {
			console.error("Failed to generate referral code on registration:", err)
			// Don't fail user creation if referral code generation fails
		}

		// Send welcome email
		try {
			await sendEmail({
				to: email,
				subject: "Welcome to Luxury Nail Spa",
				html: getWelcomeEmail(name, email),
			})
		} catch (emailError) {
			console.error("Failed to send welcome email:", emailError)
			// Don't fail registration if email fails
		}

		// Send referral signup email if referred
		if (referredById) {
			try {
				const referrer = await prisma.user.findUnique({
					where: { id: referredById },
					select: { name: true, referralCode: true },
				})
				if (referrer && referrer.referralCode) {
					await sendEmail({
						to: email,
						subject: "Welcome - You Were Referred",
						html: getReferralSignupEmailTemplate(name, referrer.name || "a friend", referrer.referralCode),
					})
				}
			} catch (emailError) {
				console.error("Failed to send referral signup email:", emailError)
			}
		}

		// Note: Referral points are now awarded only when the referred user completes their first payment
		// This is handled in the booking completion flow (both cash and Stripe payments)

		return NextResponse.json(
			{
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			},
			{ status: 201 },
		)
}

export const POST = createPostHandler(handleRegister, {
	rateLimit: authRateLimit,
})
