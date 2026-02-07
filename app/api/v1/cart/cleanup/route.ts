import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// This route should be called by a cron job to clean up expired carts
export async function POST(req: NextRequest) {
	try {
		// Verify the request is from a trusted source (e.g., Vercel Cron)
		const authHeader = req.headers.get("authorization")
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Delete carts that have expired
		const result = await prisma.cart.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		})

		return NextResponse.json({
			success: true,
			deletedCount: result.count,
			message: `Cleaned up ${result.count} expired cart items`,
		})
	} catch (error) {
		console.error("Cart cleanup error:", error)
		return NextResponse.json({ error: "Failed to cleanup carts" }, { status: 500 })
	}
}
