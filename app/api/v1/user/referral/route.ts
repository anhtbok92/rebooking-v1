import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ensureReferralCode } from "@/lib/referral-code-utils"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: {
				id: true,
				email: true,
				referralCode: true,
				referralPoints: true,
			},
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Ensure user has a referral code (generates if missing)
		const referralCode = await ensureReferralCode(user.id, user.email)

		// Get referral statistics
		let referralCodeRecord
		try {
			referralCodeRecord = await prisma.referralCode.findUnique({
				where: { code: referralCode },
			})
		} catch (err) {
			console.error("Error fetching referral code record:", err)
		}

		let referralRewards: Awaited<ReturnType<typeof prisma.referralReward.findMany>> = []
		try {
			referralRewards = await prisma.referralReward.findMany({
				where: {
					referrerId: user.id,
				},
			})
		} catch (err) {
			console.error("Error fetching referral rewards:", err)
		}

		const totalReferrals = new Set(referralRewards.map((r) => r.referredId)).size
		const totalPointsAwarded = referralRewards.reduce((sum, r) => sum + r.points, 0)

		// Generate referral link
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
		const referralLink = `${appUrl}/signup?ref=${referralCode}`

		return NextResponse.json({
			code: referralCode,
			link: referralLink,
			points: user.referralPoints || 0,
			pointsPerReferral: referralCodeRecord?.pointsPerReferral || 100,
			totalReferrals: totalReferrals || 0,
			totalPointsAwarded: totalPointsAwarded || 0,
		})
	} catch (error) {
		console.error("Referral code error:", error)
		// Try to get user and generate code even on error
		try {
			const session = await getServerSession(authOptions)
			if (session?.user?.email) {
				const user = await prisma.user.findUnique({
					where: { email: session.user.email },
					select: { id: true, email: true },
				})
				if (user) {
					const code = await ensureReferralCode(user.id, user.email)
					const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
					return NextResponse.json({
						code,
						link: `${appUrl}/signup?ref=${code}`,
						points: 0,
						pointsPerReferral: 100,
						totalReferrals: 0,
						totalPointsAwarded: 0,
					})
				}
			}
		} catch (fallbackError) {
			console.error("Fallback referral code generation failed:", fallbackError)
		}
		// Last resort: return error
		return NextResponse.json({ error: "Failed to get referral code" }, { status: 500 })
	}
}

