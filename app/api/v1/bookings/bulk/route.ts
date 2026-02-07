import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"
import { getBookingConfirmationEmail, getBookingCompletedEmail } from "@/lib/email-templates/bookings"
import { getDiscountAppliedEmail } from "@/lib/email-templates/discounts"
import { getReferralRewardEmail } from "@/lib/email-templates/referrals"
import { awardReferralPointsOnPayment } from "@/lib/referral-utils"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"
import { bulkBookingSchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createPostHandler } from "@/lib/api-wrapper"
import { bookingRateLimit } from "@/lib/rate-limit"

async function handleBulkBooking(req: NextRequest) {
	const body = await req.json()
	const session = await getServerSession(authOptions)
		
		const validation = validateRequest(bulkBookingSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { cartItems, userName, phone, paymentMethod, userId, email, bookingFor, discountCode, discountAmount, totalPrice, finalPrice, referralCode } = validation.data

		let finalUserId = userId || session?.user?.id || null
		const finalEmail = email || session?.user?.email || null
		
		// Determine referrer ID
		let referrerId: string | null = null
		
		// If booking for someone else and logged-in user exists, automatically use their referral
		if (bookingFor === "other" && session?.user?.id) {
			referrerId = session.user.id
			// Ensure the logged-in user has a referral code
			try {
				const { ensureReferralCode } = await import("@/lib/referral-code-utils")
				await ensureReferralCode(session.user.id, session.user.email || "")
			} catch (err) {
				console.error("Failed to ensure referral code for logged-in user:", err)
				// Continue even if referral code generation fails
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
					// If user is logged in and wasn't referred before, link them to referrer
					if (finalUserId && finalUserId !== referrer.id) {
						const user = await prisma.user.findUnique({
							where: { id: finalUserId },
							select: { referredById: true },
						})
						if (user && !user.referredById) {
							await prisma.user.update({
								where: { id: finalUserId },
								data: { referredById: referrer.id },
							})
						}
					}
					referrerId = referrer.id
				}
			} catch (err) {
				console.error("Failed to find referrer by code:", err)
				// Continue without referrer if lookup fails
			}
		}

		if (bookingFor === "other" && email && !userId) {
			try {
				// Check if user already exists
				const existingUser = await prisma.user.findUnique({
					where: { email },
				})

				if (!existingUser) {
					// Create new family member user with temporary password
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
						console.error("Failed to generate referral code for family member:", err)
						// Don't fail user creation if referral code generation fails
					}

					await prisma.promotionSubscriber
						.create({
							data: {
								email,
								name: userName,
								phone,
								userId: newUser.id,
								subscribed: true,
							},
						})
						.catch(() => {
							// Ignore if already exists
						})

					if (referrerId) {
						try {
							const referralCode = await prisma.referralCode.findFirst({
								where: { userId: referrerId },
							})

							const points = referralCode?.pointsPerReferral || 100

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

					// Send password reset email to family member
					const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
					const resetLink = `${appUrl}/auth/reset-password?email=${encodeURIComponent(email)}`

					try {
						const { getGuestSignupEmail } = await import("@/lib/email-templates/auth")
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
				console.error("Failed to create family member user:", userCreationError)
			}
		}

		// Create bookings for each item in cart
		const bookings = await Promise.all(
			cartItems.map((item) =>
				prisma.booking.create({
					data: {
						serviceId: item.serviceId,
						date: new Date(item.date),
						time: item.time,
						paymentMethod,
						userName,
						phone,
						email: finalEmail,
						userId: finalUserId,
						photos: {
							create: item.photos?.map((photo: string) => ({ url: photo })) || [],
						},
					},
					include: {
						service: true,
						photos: true,
					},
				}),
			),
		)

		// Record discount usage if a discount code was applied
		if (discountCode && discountAmount && totalPrice && finalPrice) {
			try {
				const discountCodeRecord = await prisma.discountCode.findUnique({
					where: { code: discountCode.toUpperCase() },
				})

				if (discountCodeRecord) {
					await prisma.discountUsage.create({
						data: {
							discountCodeId: discountCodeRecord.id,
							userId: finalUserId || null,
							email: finalEmail || null,
							userName: userName || null,
							phone: phone || null,
							discountAmount: discountAmount,
							cartTotal: totalPrice,
							finalTotal: finalPrice,
							bookingId: bookings[0]?.id || null,
						},
					})

					// Send discount applied email
					if (finalEmail) {
						try {
							await sendEmail({
								to: finalEmail,
								subject: "Discount Applied - Thank You",
								html: getDiscountAppliedEmail(
									userName,
									{
										code: discountCodeRecord.code,
										type: discountCodeRecord.type as "PERCENT" | "FIXED",
										value: discountCodeRecord.value,
										minAmount: discountCodeRecord.minAmount || undefined,
										expiresAt: discountCodeRecord.expiresAt?.toISOString(),
									},
									discountAmount,
									finalPrice,
								),
							})
						} catch (emailError) {
							console.error("Failed to send discount applied email:", emailError)
						}
					}
				}
			} catch (discountError) {
				console.error("Failed to record discount usage:", discountError)
				// Don't fail the booking if discount tracking fails
			}
		}

		// Clear cart for authenticated users
		if (session?.user?.email) {
			const user = await prisma.user.findUnique({
				where: { email: session.user.email },
			})
			if (user) {
				await prisma.cart.deleteMany({
					where: { userId: user.id },
				})
			}
		}

		// Send WhatsApp confirmations for each booking
		for (const booking of bookings) {
			try {
				await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/send-whatsapp`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userName,
						phone,
						serviceName: booking.service.name,
						date: booking.date.toISOString().split("T")[0],
						time: booking.time,
						totalPrice: booking.service.price,
					}),
				})
			} catch (err) {
				console.error("Failed to send WhatsApp confirmation:", err)
			}
		}

		// Award referral points if user was referred (only on first payment)
		if (finalUserId) {
			try {
				const referralResult = await awardReferralPointsOnPayment(finalUserId, bookings[0]?.id)
				
				// Send referral reward email to referrer
				if (referralResult?.referrerEmail && referralResult.referrerName && referralResult.pointsEarned && referralResult.totalPoints) {
					try {
						await sendEmail({
							to: referralResult.referrerEmail,
							subject: "Referral Reward Earned - Luxury Nail Spa",
							html: getReferralRewardEmail(
								referralResult.referrerName,
								userName,
								referralResult.pointsEarned,
								referralResult.totalPoints,
							),
						})
					} catch (emailError) {
						console.error("Failed to send referral reward email:", emailError)
					}
				}
			} catch (err) {
				console.error("Failed to award referral points:", err)
				// Don't fail booking if referral reward fails
			}
		}

		// Send booking confirmation emails
		if (finalEmail) {
			for (const booking of bookings) {
				try {
					await sendEmail({
						to: finalEmail,
						subject: "Booking Confirmed - Luxury Nail Spa",
						html: getBookingConfirmationEmail({
							bookingId: booking.id,
							serviceName: booking.service.name,
							date: booking.date.toISOString(),
							time: booking.time,
							price: booking.service.price,
							status: booking.status,
							userName: booking.userName,
							phone: booking.phone || undefined,
							paymentMethod: booking.paymentMethod || undefined,
						}),
					})
				} catch (emailError) {
					console.error("Failed to send booking confirmation email:", emailError)
				}
			}
		}

	return NextResponse.json(bookings, { status: 201 })
}

export const POST = createPostHandler(handleBulkBooking, {
	rateLimit: bookingRateLimit,
})
