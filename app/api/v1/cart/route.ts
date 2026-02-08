import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
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

		const cartItems = await prisma.cart.findMany({
			where: { userId: user.id },
			include: { 
				service: true,
				doctor: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

		// Normalize date format for comparison
		const normalizeDate = (date: Date | string): string => {
			const dateObj = typeof date === "string" ? new Date(date) : date
			return dateObj.toISOString().split("T")[0] // Get YYYY-MM-DD format
		}

		// Deduplicate cart items by serviceId, date, and time
		// Keep the most recent item if duplicates exist
		const uniqueCartMap = new Map<string, typeof cartItems[0]>()
		const itemsToDelete: string[] = []

		cartItems.forEach((item) => {
			const key = `${item.serviceId}-${normalizeDate(item.date)}-${item.time}`
			if (!uniqueCartMap.has(key)) {
				uniqueCartMap.set(key, item)
			} else {
				const existing = uniqueCartMap.get(key)!
				// Keep the one with the latest createdAt
				if (item.createdAt > existing.createdAt) {
					// Mark the old one for deletion
					itemsToDelete.push(existing.id)
					uniqueCartMap.set(key, item)
				} else {
					// Mark the current one for deletion (existing is newer)
					itemsToDelete.push(item.id)
				}
			}
		})

		// Clean up duplicates from database
		if (itemsToDelete.length > 0) {
			await prisma.cart.deleteMany({
				where: {
					id: {
						in: itemsToDelete,
					},
				},
			})
		}

		return NextResponse.json(Array.from(uniqueCartMap.values()))
	} catch (error) {
		console.error("Get cart error:", error)
		return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const body = await req.json()
		const { serviceId, date, time, doctorId } = body

		if (!serviceId || !date || !time) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Normalize date format for comparison
		const normalizeDate = (date: Date | string): string => {
			const dateObj = typeof date === "string" ? new Date(date) : date
			return dateObj.toISOString().split("T")[0] // Get YYYY-MM-DD format
		}

		const normalizedDate = normalizeDate(date)

		// Normalize the date to start/end of day for comparison
		const itemDate = new Date(date)
		const startOfDay = new Date(itemDate)
		startOfDay.setHours(0, 0, 0, 0)
		const endOfDay = new Date(itemDate)
		endOfDay.setHours(23, 59, 59, 999)

		// Check if item already exists in cart using date range
		const duplicateExists = await prisma.cart.findFirst({
			where: {
				userId: user.id,
				serviceId: serviceId,
				date: {
					gte: startOfDay,
					lte: endOfDay,
				},
				time: time,
			},
		})

		if (duplicateExists) {
			return NextResponse.json({ error: "Item already in cart" }, { status: 409 })
		}

		const cartItem = await prisma.cart.create({
			data: {
				userId: user.id,
				serviceId,
				date: new Date(date),
				time,
				doctorId: doctorId || null,
			},
			include: { 
				service: true,
				doctor: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})

		return NextResponse.json(cartItem, { status: 201 })
	} catch (error) {
		console.error("Add to cart error:", error)
		return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
	}
}

export async function PUT(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const { searchParams } = new URL(req.url)
		const cartItemId = searchParams.get("id")
		const body = await req.json()
		const { serviceId, date, time, doctorId } = body

		if (!cartItemId) {
			return NextResponse.json({ error: "Cart item ID required" }, { status: 400 })
		}

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Check if the cart item belongs to the user
		const existingCartItem = await prisma.cart.findFirst({
			where: {
				id: cartItemId,
				userId: user.id,
			},
		})

		if (!existingCartItem) {
			return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
		}

		// Normalize date format for comparison
		const normalizeDate = (date: Date | string): string => {
			const dateObj = typeof date === "string" ? new Date(date) : date
			return dateObj.toISOString().split("T")[0] // Get YYYY-MM-DD format
		}

		const normalizedDate = date ? normalizeDate(date) : normalizeDate(existingCartItem.date)

		// Check for duplicates (excluding the current item)
		if (serviceId && date && time) {
			const itemDate = new Date(date)
			const startOfDay = new Date(itemDate)
			startOfDay.setHours(0, 0, 0, 0)
			const endOfDay = new Date(itemDate)
			endOfDay.setHours(23, 59, 59, 999)

			const duplicateExists = await prisma.cart.findFirst({
				where: {
					userId: user.id,
					id: { not: cartItemId },
					serviceId: serviceId || existingCartItem.serviceId,
					date: {
						gte: startOfDay,
						lte: endOfDay,
					},
					time: time || existingCartItem.time,
				},
			})

			if (duplicateExists) {
				return NextResponse.json({ error: "Item already in cart" }, { status: 409 })
			}
		}

		const updatedCartItem = await prisma.cart.update({
			where: { id: cartItemId },
			data: {
				...(serviceId && { serviceId }),
				...(date && { date: new Date(date) }),
				...(time && { time }),
				...(doctorId !== undefined && { doctorId: doctorId || null }),
			},
			include: { 
				service: true,
				doctor: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})

		return NextResponse.json(updatedCartItem)
	} catch (error) {
		console.error("Update cart item error:", error)
		return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const { searchParams } = new URL(req.url)
		const cartItemId = searchParams.get("id")

		if (!cartItemId) {
			return NextResponse.json({ error: "Cart item ID required" }, { status: 400 })
		}

		await prisma.cart.delete({
			where: { id: cartItemId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Delete cart item error:", error)
		return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
	}
}
