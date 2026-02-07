import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Delete all cart items for this user
		await prisma.cart.deleteMany({
			where: { userId: user.id },
		})

		return NextResponse.json({ success: true, message: "Cart cleared successfully" })
	} catch (error) {
		console.error("Clear cart error:", error)
		return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
	}
}

