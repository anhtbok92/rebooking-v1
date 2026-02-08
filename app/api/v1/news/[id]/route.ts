import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const updateNewsSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	slug: z.string().min(1).max(255).optional(),
	excerpt: z.string().max(500).optional(),
	content: z.string().min(1).optional(),
	coverImage: z.string().url().optional().nullable(),
	category: z.enum(["NEWS", "PROMOTION", "EVENT"]).optional(),
	tags: z.array(z.string()).optional(),
	published: z.boolean().optional(),
})

/**
 * GET /api/v1/news/[id] - Get single news
 */
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await getServerSession(authOptions)

		const news = await prisma.news.findUnique({
			where: { id },
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

		if (!news) {
			return NextResponse.json({ error: "News not found" }, { status: 404 })
		}

		// Check if user can view unpublished news
		if (!news.published) {
			if (!session) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
			}
			const userRole = (session.user as any).role
			if (!canAccessResource(userRole, "STAFF")) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 })
			}
		}

		// Increment view count
		await prisma.news.update({
			where: { id },
			data: { viewCount: { increment: 1 } },
		})

		return NextResponse.json(news)
	} catch (error) {
		console.error("Get news error:", error)
		return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
	}
}

/**
 * PUT /api/v1/news/[id] - Update news (staff+ only)
 */
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "STAFF")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { id } = await params
		const body = await req.json()
		const validatedData = updateNewsSchema.parse(body)

		// Check if news exists
		const existingNews = await prisma.news.findUnique({
			where: { id },
		})

		if (!existingNews) {
			return NextResponse.json({ error: "News not found" }, { status: 404 })
		}

		// Check if slug is being changed and if it already exists
		if (validatedData.slug && validatedData.slug !== existingNews.slug) {
			const slugExists = await prisma.news.findUnique({
				where: { slug: validatedData.slug },
			})
			if (slugExists) {
				return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
			}
		}

		// Update publishedAt if publishing for the first time
		const updateData: any = { ...validatedData }
		if (validatedData.published && !existingNews.published) {
			updateData.publishedAt = new Date()
		} else if (validatedData.published === false) {
			updateData.publishedAt = null
		}

		const news = await prisma.news.update({
			where: { id },
			data: updateData,
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

		return NextResponse.json(news)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		console.error("Update news error:", error)
		return NextResponse.json({ error: "Failed to update news" }, { status: 500 })
	}
}

/**
 * DELETE /api/v1/news/[id] - Delete news (staff+ only)
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "STAFF")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { id } = await params

		await prisma.news.delete({
			where: { id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Delete news error:", error)
		return NextResponse.json({ error: "Failed to delete news" }, { status: 500 })
	}
}
