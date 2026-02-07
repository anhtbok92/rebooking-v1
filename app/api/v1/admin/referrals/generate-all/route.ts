import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ensureReferralCode } from "@/lib/referral-code-utils"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * Generate referral codes for all users who don't have one
 * Only accessible by Super Admin and Admin
 */
export async function POST() {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		// Find all users without referral codes
		const usersWithoutCodes = await prisma.user.findMany({
			where: {
				OR: [{ referralCode: null }, { referralCode: "" }],
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		})

		const results = {
			total: usersWithoutCodes.length,
			generated: 0,
			failed: 0,
			errors: [] as string[],
		}

		// Generate codes for each user
		for (const user of usersWithoutCodes) {
			try {
				await ensureReferralCode(user.id, user.email)
				results.generated++
			} catch (error) {
				results.failed++
				results.errors.push(`${user.email}: ${error instanceof Error ? error.message : "Unknown error"}`)
			}
		}

		return NextResponse.json({
			message: `Generated ${results.generated} referral codes. ${results.failed} failed.`,
			results,
		})
	} catch (error) {
		console.error("Generate all referral codes error:", error)
		return NextResponse.json({ error: "Failed to generate referral codes" }, { status: 500 })
	}
}

