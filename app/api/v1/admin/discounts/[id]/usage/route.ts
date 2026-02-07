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

		// Get discount code with usage statistics
		const discountCode = await prisma.discountCode.findUnique({
			where: { id },
			include: {
				usages: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								phone: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		})

		if (!discountCode) {
			return NextResponse.json({ error: "Discount code not found" }, { status: 404 })
		}

		// Calculate statistics
		const totalUsages = discountCode.usages.length
		const uniqueUsers = new Set(
			discountCode.usages.filter((u) => u.userId || u.email).map((u) => u.userId || u.email)
		).size

		const totalDiscountAmount = discountCode.usages.reduce((sum, u) => sum + u.discountAmount, 0)
		const totalRevenue = discountCode.usages.reduce((sum, u) => sum + u.cartTotal, 0)
		const totalFinalRevenue = discountCode.usages.reduce((sum, u) => sum + u.finalTotal, 0)

		// Group by user
		const usageByUser = discountCode.usages.reduce(
			(acc, usage) => {
				const key = usage.userId || usage.email || "guest"
				if (!acc[key]) {
					acc[key] = {
						userId: usage.userId,
						email: usage.email,
						userName: usage.userName || usage.user?.name || "Guest",
						phone: usage.phone || usage.user?.phone,
						count: 0,
						totalDiscount: 0,
						totalSpent: 0,
						lastUsed: usage.createdAt,
					}
				}
				acc[key].count++
				acc[key].totalDiscount += usage.discountAmount
				acc[key].totalSpent += usage.finalTotal
				if (usage.createdAt > acc[key].lastUsed) {
					acc[key].lastUsed = usage.createdAt
				}
				return acc
			},
			{} as Record<
				string,
				{
					userId?: string | null
					email?: string | null
					userName: string
					phone?: string | null
					count: number
					totalDiscount: number
					totalSpent: number
					lastUsed: Date
				}
			>
		)

		const userStats = Object.values(usageByUser).sort((a, b) => b.count - a.count)

		return NextResponse.json({
			discountCode: {
				id: discountCode.id,
				code: discountCode.code,
				type: discountCode.type,
				value: discountCode.value,
				usedCount: discountCode.usedCount,
				active: discountCode.active,
			},
			statistics: {
				totalUsages,
				uniqueUsers,
				totalDiscountAmount,
				totalRevenue,
				totalFinalRevenue,
			},
			usageByUser: userStats,
			recentUsages: discountCode.usages.slice(0, 50).map((usage) => ({
				id: usage.id,
				userName: usage.userName || usage.user?.name || "Guest",
				email: usage.email || usage.user?.email,
				phone: usage.phone || usage.user?.phone,
				discountAmount: usage.discountAmount,
				cartTotal: usage.cartTotal,
				finalTotal: usage.finalTotal,
				createdAt: usage.createdAt,
				bookingId: usage.bookingId,
			})),
		})
	} catch (error) {
		console.error("Discount usage error:", error)
		return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
	}
}

