import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Public API endpoint to fetch doctors
 * No authentication required - accessible to all users
 */
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const page = Number.parseInt(searchParams.get("page") || "1")
		const limit = Number.parseInt(searchParams.get("limit") || "50")
		const search = searchParams.get("search") || ""
		const skip = (page - 1) * limit

		const where: any = {
			role: "DOCTOR",
		}

		// Add search filter for name or email
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			]
		}

		const [doctors, total] = await Promise.all([
			prisma.user.findMany({
				where,
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					image: true,
					createdAt: true,
				},
				orderBy: { name: "asc" },
				skip,
				take: limit,
			}),
			prisma.user.count({ where }),
		])

		return NextResponse.json({
			doctors,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error("Doctors API error:", error)
		return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
	}
}
