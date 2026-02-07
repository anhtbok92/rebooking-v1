import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET: List all ratings for admin (with filters)
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const { searchParams } = new URL(req.url)
		const status = searchParams.get("status") // PENDING, APPROVED, REJECTED
		const serviceId = searchParams.get("serviceId")
		const page = Number.parseInt(searchParams.get("page") || "1")
		const limit = Number.parseInt(searchParams.get("limit") || "20")
		const skip = (page - 1) * limit

		const where: any = {}
		if (status) {
			where.status = status
		}
		if (serviceId) {
			where.serviceId = serviceId
		}

		const [ratings, total] = await Promise.all([
			prisma.rating.findMany({
				where,
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
					service: {
						select: {
							id: true,
							name: true,
							price: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.rating.count({ where }),
		])

		return NextResponse.json({
			ratings,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error("Get ratings error:", error)
		return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
	}
}

