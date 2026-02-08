import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Validation schema
const createNewsSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	slug: z.string().min(1, "Slug is required").max(255),
	excerpt: z.string().max(500).optional(),
	content: z.string().min(1, "Content is required"),
	coverImage: z.string().url().optional(),
	category: z.enum(["NEWS", "PROMOTION", "EVENT"]).default("NEWS"),
	tags: z.array(z.string()).default([]),
	published: z.boolean().default(false),
})

/**
 * GET /api/v1/news - Get all news (public for published, auth required for drafts)
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const { searchParams } = new URL(req.url)
		
		const page = Number.parseInt(searchParams.get("page") || "1")
		const limit = Number.parseInt(searchParams.get("limit") || "10")
		const category = searchParams.get("category")
		const search = searchParams.get("search")
		const published = searchParams.get("published")
		
		const skip = (page - 1) * limit

		const where: any = {}

		// Only show published news to non-authenticated users
		if (!session) {
			where.published = true
		} else {
			// Authenticated users can see drafts if they have permission
			const userRole = (session.user as any).role
			if (!canAccessResource(userRole, "STAFF")) {
				where.published = true
			} else if (published !== null && published !== undefined) {
				where.published = published === "true"
			}
		}

		if (category) {
			where.category = category
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ excerpt: { contains: search, mode: "insensitive" } },
				{ content: { contains: search, mode: "insensitive" } },
			]
		}

		const [news, total] = await Promise.all([
			prisma.news.findMany({
				where,
				include: {
					author: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
				orderBy: { publishedAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.news.count({ where }),
		])

		return NextResponse.json({
			news,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error("Get news error:", error)
		return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
	}
}

/**
 * POST /api/v1/news - Create news (staff+ only)
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "STAFF")) {
			return NextResponse.json({ error: "Forbidden - Staff access required" }, { status: 403 })
		}

		const body = await req.json()
		const validatedData = createNewsSchema.parse(body)

		// Check if slug already exists
		const existingNews = await prisma.news.findUnique({
			where: { slug: validatedData.slug },
		})

		if (existingNews) {
			return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
		}

		const news = await prisma.news.create({
			data: {
				...validatedData,
				authorId: (session.user as any).id,
				publishedAt: validatedData.published ? new Date() : null,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
		})

		return NextResponse.json(news, { status: 201 })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		console.error("Create news error:", error)
		return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
	}
}
