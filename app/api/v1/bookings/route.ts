import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"
import { getBookingsQuerySchema, createBookingSchema, validateRequest, validationErrorResponse } from "@/lib/validations"
import { createGetHandler, createPostHandler } from "@/lib/api-wrapper"
import { apiRateLimit } from "@/lib/rate-limit"

async function handleGetBookings(req: NextRequest) {
		const { searchParams } = new URL(req.url)
		const queryParams = Object.fromEntries(searchParams.entries())
		
		const validation = validateRequest(getBookingsQuerySchema, queryParams)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { date, startDate, endDate, userId, serviceId, page = 1, limit = 10, sort = "date-desc", status = "ALL" } = validation.data
		const skip = (page - 1) * limit

		if (startDate && endDate) {
			const bookings = await prisma.booking.findMany({
				where: {
					date: {
						gte: new Date(startDate),
						lte: new Date(endDate),
					},
				},
				select: {
					date: true,
					time: true,
				},
			})
			return NextResponse.json(bookings, { status: 200 })
		}

		const where: any = {}

		if (date) {
			where.date = {
				gte: new Date(date),
				lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
			}
		}

		if (serviceId) {
			where.serviceId = serviceId
		}

		if (userId) {
			where.userId = userId
		}

		if (status !== "ALL") {
			where.status = status
		}

		let orderBy: any = { date: "desc" }
		if (sort === "date-asc") {
			orderBy = { date: "asc" }
		} else if (sort === "price-desc") {
			orderBy = { service: { price: "desc" } }
		} else if (sort === "price-asc") {
			orderBy = { service: { price: "asc" } }
		}

		const [bookings, total] = await Promise.all([
			prisma.booking.findMany({
				where,
				include: {
					service: true,
					photos: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
							role: true,
						},
					},
					doctor: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
						},
					},
				},
				orderBy,
				skip,
				take: limit,
			}),
			prisma.booking.count({ where }),
		])

		return NextResponse.json(
			{
				bookings,
				pagination: {
					total,
					page,
					limit,
					pages: Math.ceil(total / limit),
				},
			},
			{ status: 200 },
		)
}

async function handleCreateBooking(req: NextRequest) {
		const body = await req.json()
		
		const validation = validateRequest(createBookingSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { serviceIds, date, time, paymentMethod, mobileProvider, photoUrls, userName, phone } = validation.data

		// Create bookings for each selected service
		const bookings = await Promise.all(
			serviceIds.map((serviceId: string) =>
				prisma.booking.create({
					data: {
						serviceId,
						date: new Date(date),
						time,
						paymentMethod,
						mobileProvider,
						userName,
						phone,
						photos: {
							create: photoUrls?.map((url: string) => ({ url })) || [],
						},
					},
					include: {
						service: true,
						photos: true,
					},
				}),
			),
		)

	return NextResponse.json(bookings, { status: 201 })
}

export const GET = createGetHandler(handleGetBookings, {
	rateLimit: apiRateLimit,
})

export const POST = createPostHandler(handleCreateBooking, {
	rateLimit: apiRateLimit,
})
