import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { getRatingsQuerySchema, createRatingSchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createGetHandler, createPostHandler } from "@/lib/api-wrapper"
import { apiRateLimit, ratingRateLimit } from "@/lib/rate-limit"

// GET: Get ratings for a service (only approved ratings are shown to public)
async function handleGetRatings(req: NextRequest) {
		const { searchParams } = new URL(req.url)
		const queryParams = Object.fromEntries(searchParams.entries())
		
		const validation = validateRequest(getRatingsQuerySchema, queryParams)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { serviceId } = validation.data

		if (!serviceId) {
			return NextResponse.json({ error: "Service ID required" }, { status: 400 })
		}

		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		// Admins can see all ratings, others only see approved ones
		const where: any = { serviceId }
		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			where.status = "APPROVED"
		}

		const ratings = await prisma.rating.findMany({
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
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

	return NextResponse.json(ratings)
}

// POST: Create a new rating
async function handleCreateRating(req: NextRequest) {
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

		const body = await req.json()
		
		const validation = validateRequest(createRatingSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { serviceId, rating, comment } = validation.data

		// Check if service exists
		const service = await prisma.service.findUnique({
			where: { id: serviceId },
		})

		if (!service) {
			return NextResponse.json({ error: "Service not found" }, { status: 404 })
		}

		// Check if user has a completed booking for this service
		// Check by userId (if logged in when booking) or by email (if booked as guest)
		const completedBooking = await prisma.booking.findFirst({
			where: {
				OR: [
					{ userId: user.id },
					{ email: user.email },
				],
				serviceId,
				status: "COMPLETED",
			},
		})

		if (!completedBooking) {
			return NextResponse.json(
				{ error: "You can only rate services you have completed. Please complete a booking for this service first." },
				{ status: 403 },
			)
		}

		// Check if user already rated this service
		const existingRating = await prisma.rating.findUnique({
			where: {
				userId_serviceId: {
					userId: user.id,
					serviceId,
				},
			},
		})

		if (existingRating) {
			// Update existing rating
			const updatedRating = await prisma.rating.update({
				where: { id: existingRating.id },
				data: {
					rating,
					comment: comment || null,
					status: "PENDING", // Reset to pending when updated
				},
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
						},
					},
				},
			})

			return NextResponse.json(updatedRating, { status: 200 })
		}

		// Create new rating
		const newRating = await prisma.rating.create({
			data: {
				userId: user.id,
				serviceId,
				rating,
				comment: comment || null,
				status: "PENDING",
			},
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
					},
				},
			},
		})

	return NextResponse.json(newRating, { status: 201 })
}

export const GET = createGetHandler(handleGetRatings, {
	rateLimit: apiRateLimit,
})

export const POST = createPostHandler(handleCreateRating, {
	rateLimit: ratingRateLimit,
})

