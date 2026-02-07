import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"
import { getGuestSignupEmail } from "@/lib/email-templates/auth"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { checkoutSchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createPostHandler } from "@/lib/api-wrapper"
import { checkoutRateLimit } from "@/lib/rate-limit"

async function handleCheckout(req: NextRequest) {
		if (!process.env.STRIPE_SECRET_KEY) {
			return NextResponse.json(
				{ error: "Stripe is not configured. Please contact support or use cash payment." },
				{ status: 503 },
			)
		}

		const session = await getServerSession(authOptions)

		if (!session || !session.user) {
			return NextResponse.json({ error: "You must be logged in to proceed with payment" }, { status: 401 })
		}

		const body = await req.json()
		
		const validation = validateRequest(checkoutSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { cartItems, totalPrice, userName, phone, email, bookingFor, discountCode, discountAmount, finalPrice, referralCode } = validation.data

		const loggedInUserId = (session.user as any).id
		const finalEmail = email || session.user.email
		let finalUserId = loggedInUserId

		// Determine referrer ID - automatically use logged-in user's referral when booking for someone else
		let referrerId: string | null = null
		if (bookingFor === "other" && loggedInUserId) {
			referrerId = loggedInUserId
			// Ensure the logged-in user has a referral code
			try {
				const { ensureReferralCode } = await import("@/lib/referral-code-utils")
				await ensureReferralCode(loggedInUserId, session.user.email || "")
			} catch (err) {
				console.error("Failed to ensure referral code for logged-in user:", err)
			}
		}

		// Override with referral code from body if explicitly provided
		if (referralCode) {
			try {
				const referrer = await prisma.user.findUnique({
					where: { referralCode: referralCode.toUpperCase() },
					select: { id: true },
				})
				if (referrer) {
					referrerId = referrer.id
				}
			} catch (err) {
				console.error("Failed to find referrer by code:", err)
			}
		}

		// Create user account for "booking for other" if email is provided and user doesn't exist
		if (bookingFor === "other" && email && email !== session.user.email) {
			try {
				const existingUser = await prisma.user.findUnique({
					where: { email },
				})

				if (!existingUser) {
					// Create new user with temporary password
					const tempPassword = Math.random().toString(36).slice(-12)
					const hashedPassword = await bcrypt.hash(tempPassword, 10)

					const newUser = await prisma.user.create({
						data: {
							name: userName,
							email,
							phone,
							password: hashedPassword,
							role: "CLIENT",
							referredById: referrerId || null,
						},
					})

					finalUserId = newUser.id

					// Generate referral code for new user
					try {
						const { ensureReferralCode } = await import("@/lib/referral-code-utils")
						await ensureReferralCode(newUser.id, email)
					} catch (err) {
						console.error("Failed to generate referral code for new user:", err)
					}

					// Award referral points to logged-in user if they referred this person
					if (referrerId && referrerId === loggedInUserId) {
						try {
							const referralCodeRecord = await prisma.referralCode.findFirst({
								where: { userId: referrerId },
							})

							const points = referralCodeRecord?.pointsPerReferral || 100

							await prisma.user.update({
								where: { id: referrerId },
								data: { referralPoints: { increment: points } },
							})

							await prisma.referralReward.create({
								data: {
									referrerId,
									referredId: newUser.id,
									points,
								},
							})
						} catch (err) {
							console.error("Failed to award referral points:", err)
						}
					}

					// Send password reset email
					const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
					const resetLink = `${appUrl}/auth/reset-password?email=${encodeURIComponent(email)}`

					try {
						await sendEmail({
							to: email,
							subject: "Welcome to Luxury Nail Spa - Set Your Password",
							html: getGuestSignupEmail(userName, email, phone, resetLink),
						})
					} catch (emailError) {
						console.error("Failed to send password reset email:", emailError)
					}
				} else {
					finalUserId = existingUser.id
				}
			} catch (userCreationError) {
				console.error("Failed to create user for booking:", userCreationError)
				// Continue with logged-in user's ID if creation fails
			}
		}

		// Create bookings first (they'll be confirmed when payment succeeds)
		const bookings = await Promise.all(
			cartItems.map((item: any) =>
				prisma.booking.create({
					data: {
						serviceId: item.serviceId,
						date: new Date(item.date),
						time: item.time,
						paymentMethod: "stripe",
						userName,
						phone,
						email: finalEmail || null,
						userId: finalUserId || null,
						status: "PENDING", // Will be updated to CONFIRMED when payment succeeds
						photos: {
							create: item.photos?.map((photo: any) => ({ url: photo })) || [],
						},
					},
				}),
			),
		)

		const bookingIds = bookings.map((b) => b.id).join(",")

		const lineItems = cartItems.map((item: any) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.serviceName || "Spa Service",
					description: `Date: ${item.date} | Time: ${item.time}`,
				},
				unit_amount: Math.round(item.price * 100),
			},
			quantity: 1,
		}))

		const checkoutSession = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=success`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=cancelled`,
			customer_email: finalEmail || undefined,
			metadata: {
				userId: finalUserId || "",
				userName: userName || "",
				phone: phone || "",
				bookingIds,
				cartItemCount: cartItems.length.toString(),
				discountCode: discountCode || "",
				discountAmount: discountAmount?.toString() || "",
				finalPrice: finalPrice?.toString() || totalPrice.toString(),
				referralCode: referralCode || "",
				email: finalEmail || "",
				bookingFor: bookingFor || "",
			},
		})

		return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
}

export const POST = createPostHandler(handleCheckout, {
	rateLimit: checkoutRateLimit,
})
