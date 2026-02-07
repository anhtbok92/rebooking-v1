import { prisma } from "@/lib/prisma"

/**
 * Award referral points when a referred user completes their first payment
 * This function checks if the user was referred and awards points to the referrer
 */
export async function awardReferralPointsOnPayment(userId: string, bookingId?: string) {
	try {
		// Get the user who made the payment
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				referredById: true,
				name: true,
			},
		})

		if (!user || !user.referredById) {
			return null // User was not referred, no points to award
		}

		// Check if referral points have already been awarded for this user
		const existingReward = await prisma.referralReward.findFirst({
			where: {
				referredId: user.id,
			},
		})

		if (existingReward) {
			return null // Points already awarded for this referral
		}

		// Get referral code configuration and referrer info
		const referralCode = await prisma.referralCode.findFirst({
			where: { userId: user.referredById },
		})

		const points = referralCode?.pointsPerReferral || 100

		// Get referrer info for email
		const referrer = await prisma.user.findUnique({
			where: { id: user.referredById },
			select: {
				name: true,
				email: true,
				referralPoints: true,
			},
		})

		// Award points to the referrer
		const updatedReferrer = await prisma.user.update({
			where: { id: user.referredById },
			data: { referralPoints: { increment: points } },
			select: {
				referralPoints: true,
			},
		})

		// Update referral code usage count
		if (referralCode) {
			await prisma.referralCode.update({
				where: { id: referralCode.id },
				data: { usageCount: { increment: 1 } },
			})
		}

		// Create referral reward record
		await prisma.referralReward.create({
			data: {
				referrerId: user.referredById,
				referredId: user.id,
				points,
				bookingId: bookingId || null,
			},
		})

		console.log(`Referral points awarded: ${points} points to user ${user.referredById} for referral ${user.id}`)

		// Return referrer info for email
		return {
			referrerEmail: referrer?.email || null,
			referrerName: referrer?.name || null,
			pointsEarned: points,
			totalPoints: updatedReferrer.referralPoints,
		}
	} catch (error) {
		console.error("Failed to award referral points:", error)
		// Don't throw - referral rewards are not critical to payment flow
		return null
	}
}

