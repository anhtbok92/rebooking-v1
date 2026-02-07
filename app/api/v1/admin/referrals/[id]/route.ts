import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		// Get referral code details with all referrals
		const referralCode = await prisma.referralCode.findUnique({
			where: { id },
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
		})

		if (!referralCode) {
			return NextResponse.json({ error: "Referral code not found" }, { status: 404 })
		}

		// Get all referral rewards for this user
		const rewards = await prisma.referralReward.findMany({
			where: {
				referrerId: referralCode.userId,
			},
			include: {
				User: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						createdAt: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		// Group by referred user
		const referralsByUser = rewards.reduce(
			(acc, reward) => {
				const key = reward.referredId
				if (!acc[key]) {
					acc[key] = {
						referredId: reward.referredId,
						referredUser: reward.User,
						totalPoints: 0,
						referralCount: 0,
						firstReferral: reward.createdAt,
						lastReferral: reward.createdAt,
					}
				}
				acc[key].totalPoints += reward.points
				acc[key].referralCount++
				if (reward.createdAt < acc[key].firstReferral) {
					acc[key].firstReferral = reward.createdAt
				}
				if (reward.createdAt > acc[key].lastReferral) {
					acc[key].lastReferral = reward.createdAt
				}
				return acc
			},
			{} as Record<
				string,
				{
					referredId: string
					referredUser: any
					totalPoints: number
					referralCount: number
					firstReferral: Date
					lastReferral: Date
				}
			>
		)

		const statistics = {
			totalReferrals: Object.keys(referralsByUser).length,
			totalPointsAwarded: rewards.reduce((sum, r) => sum + r.points, 0),
			totalRewards: rewards.length,
		}

		return NextResponse.json({
			referralCode: {
				id: referralCode.id,
				code: referralCode.code,
				pointsPerReferral: referralCode.pointsPerReferral,
				usageCount: referralCode.usageCount,
				createdAt: referralCode.createdAt,
			},
			user: referralCode.user,
			statistics,
			referralsByUser: Object.values(referralsByUser),
			recentRewards: rewards.slice(0, 50),
		})
	} catch (error) {
		console.error("Referral details error:", error)
		return NextResponse.json({ error: "Failed to fetch referral details" }, { status: 500 })
	}
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const body = await req.json()
		const { pointsPerReferral } = body

		if (pointsPerReferral === undefined || pointsPerReferral < 0) {
			return NextResponse.json({ error: "Invalid points per referral" }, { status: 400 })
		}

		const updated = await prisma.referralCode.update({
			where: { id },
			data: {
				pointsPerReferral: parseInt(pointsPerReferral),
			},
		})

		return NextResponse.json(updated)
	} catch (error) {
		console.error("Update referral error:", error)
		return NextResponse.json({ error: "Failed to update referral code" }, { status: 500 })
	}
}

