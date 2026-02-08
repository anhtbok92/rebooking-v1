import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { getServicesQuerySchema, createServiceSchema, validateRequest, validationErrorResponse } from "@/lib/validations"

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const queryParams = Object.fromEntries(searchParams.entries())
		
		const validation = validateRequest(getServicesQuerySchema, queryParams)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { page, limit, sortBy, sortOrder } = validation.data
		const skip = (page - 1) * limit

		let orderBy: any = { [sortBy]: sortOrder }

		// Test database connection
		await prisma.$connect()

		const [services, total] = await Promise.all([
			prisma.service.findMany({
				orderBy,
				skip,
				take: limit,
				include: {
					ratings: {
						where: {
							status: "APPROVED",
						},
						select: {
							rating: true,
						},
					},
				},
			}),
			prisma.service.count(),
		])

		// Calculate average rating and count for each service
		const servicesWithRatings = services.map((service) => {
			const approvedRatings = service.ratings
			const ratingsCount = approvedRatings.length
			const averageRating =
				ratingsCount > 0
					? approvedRatings.reduce((sum, r) => sum + r.rating, 0) / ratingsCount
					: 0

			return {
				id: service.id,
				name: service.name,
				price: service.price,
				imageUrl: service.imageUrl,
				stripePriceId: service.stripePriceId,
				createdAt: service.createdAt,
				updatedAt: service.updatedAt,
				rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
				ratingsCount,
			}
		})

		return NextResponse.json(
			{
				services: servicesWithRatings,
				pagination: {
					total,
					page,
					limit,
					pages: Math.ceil(total / limit),
				},
			},
			{ status: 200 },
		)
	} catch (error: any) {
		console.error("Services API error:", error)
		console.error("Error details:", {
			message: error?.message,
			code: error?.code,
			meta: error?.meta,
		})
		
		// Return more detailed error in development
		const errorMessage = process.env.NODE_ENV === "development" 
			? `Failed to fetch services: ${error?.message || "Unknown error"}`
			: "Failed to fetch services"
		
		return NextResponse.json(
			{ 
				error: errorMessage,
				details: process.env.NODE_ENV === "development" ? error?.stack : undefined
			}, 
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Check if user has permission to create (only ADMIN and SUPER_ADMIN)
		const userRole = (session.user as any).role

		if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const body = await req.json()
		
		const validation = validateRequest(createServiceSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { name, price } = validation.data
		const { imageUrl } = body // Get imageUrl from body (not validated by schema)

		let stripePriceId: string | undefined

		try {
			const product = await stripe.products.create({
				name: name,
				description: `Spa Service: ${name}`,
			})

			const priceObj = await stripe.prices.create({
				product: product.id,
				unit_amount: Math.round(price * 100),
				currency: "usd",
			})

			stripePriceId = priceObj.id
		} catch (stripeError) {
			console.error("Stripe error:", stripeError)
			// Continue without Stripe price ID if creation fails
		}

		const service = await prisma.service.create({
			data: {
				name,
				price,
				imageUrl: imageUrl || null,
				stripePriceId,
			},
		})

		return NextResponse.json(service, { status: 201 })
	} catch (error) {
		console.error("Create service error:", error)
		return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
	}
}
