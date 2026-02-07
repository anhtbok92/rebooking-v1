import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		// Get all referral codes with user info and statistics
		const referralCodes = await prisma.referralCode.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						referralPoints: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		// Get referral rewards for statistics
		const referralRewards = await prisma.referralReward.findMany({
			include: {
				User: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		})

		// Calculate statistics for each referral code
		const codesWithStats = referralCodes.map((code) => {
			// Find rewards where the referrer is the owner of this code
			const rewards = referralRewards.filter((r) => r.referrerId === code.userId)

			const totalPointsAwarded = rewards.reduce((sum, r) => sum + r.points, 0)
			const uniqueReferrals = new Set(rewards.map((r) => r.referredId)).size

			return {
				id: code.id,
				code: code.code,
				userId: code.userId,
				userName: code.user.name,
				userEmail: code.user.email,
				userPhone: code.user.phone,
				userPoints: code.user.referralPoints,
				pointsPerReferral: code.pointsPerReferral,
				usageCount: code.usageCount,
				totalPointsAwarded,
				uniqueReferrals,
				createdAt: code.createdAt,
				updatedAt: code.updatedAt,
			}
		})

		return NextResponse.json(codesWithStats)
	} catch (error) {
		console.error("Referral management error:", error)
		return NextResponse.json({ error: "Failed to fetch referral data" }, { status: 500 })
	}
}

