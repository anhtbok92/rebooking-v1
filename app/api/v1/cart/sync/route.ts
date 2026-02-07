import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"

export type SyncCartItem = {
	serviceId: string
	date: string
	time: string
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await req.json()
		const { guestCartItems } = body

		if (!Array.isArray(guestCartItems)) {
			return NextResponse.json({ error: "Invalid cart items" }, { status: 400 })
		}

		// Get user
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Normalize date function
		const normalizeDate = (date: Date | string): string => {
			const dateObj = typeof date === "string" ? new Date(date) : date
			return dateObj.toISOString().split("T")[0] // YYYY-MM-DD
		}

		// Get existing cart items
		const existingCartItems = await prisma.cart.findMany({
			where: { userId: user.id },
		})

		const existingItemsSet = new Set(
			existingCartItems.map(item => `${item.serviceId}-${normalizeDate(item.date)}-${item.time}`)
		)

		// Deduplicate guest cart items
		const uniqueGuestItems = new Map<string, SyncCartItem>()
		guestCartItems.forEach(item => {
			const key = `${item.serviceId}-${normalizeDate(item.date)}-${item.time}`
			if (!uniqueGuestItems.has(key)) uniqueGuestItems.set(key, item)
		})

		// Filter items that are not in DB yet
		let itemsToAdd = Array.from(uniqueGuestItems.values()).filter(
			item => !existingItemsSet.has(`${item.serviceId}-${normalizeDate(item.date)}-${item.time}`)
		)

		let itemsAddedCount = 0

		// Insert items one by one to avoid duplicates
		for (const item of itemsToAdd) {
			try {
				const itemDate = new Date(item.date)
				const startOfDay = new Date(itemDate)
				startOfDay.setHours(0, 0, 0, 0)
				const endOfDay = new Date(itemDate)
				endOfDay.setHours(23, 59, 59, 999)

				const exists = await prisma.cart.findFirst({
					where: {
						userId: user.id,
						serviceId: item.serviceId,
						date: { gte: startOfDay, lte: endOfDay },
						time: item.time,
					},
				})

				if (!exists) {
					await prisma.cart.create({
						data: {
							userId: user.id,
							serviceId: item.serviceId,
							date: itemDate,
							time: item.time,
						},
					})
					itemsAddedCount++
				}
			} catch (error) {
				console.error("Error adding cart item:", error)
			}
		}

		// Fetch updated cart
		const updatedCart = await prisma.cart.findMany({
			where: { userId: user.id },
			include: { service: true },
			orderBy: { createdAt: "desc" },
		})

		// Remove duplicates (keep latest createdAt)
		const uniqueCartMap = new Map<string, typeof updatedCart[0]>()
		const itemsToDelete: string[] = []

		updatedCart.forEach(item => {
			const key = `${item.serviceId}-${normalizeDate(item.date)}-${item.time}`
			if (!uniqueCartMap.has(key)) {
				uniqueCartMap.set(key, item)
			} else {
				const existing = uniqueCartMap.get(key)!
				if (item.createdAt > existing.createdAt) {
					itemsToDelete.push(existing.id)
					uniqueCartMap.set(key, item)
				} else {
					itemsToDelete.push(item.id)
				}
			}
		})

		if (itemsToDelete.length > 0) {
			await prisma.cart.deleteMany({ where: { id: { in: itemsToDelete } } })
		}

		const finalCart = await prisma.cart.findMany({
			where: { userId: user.id },
			include: { service: true },
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json({
			success: true,
			itemsAdded: itemsAddedCount,
			duplicatesRemoved: itemsToDelete.length,
			cart: finalCart,
		})
	} catch (error) {
		console.error("Cart sync error:", error)
		return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 })
	}
}
