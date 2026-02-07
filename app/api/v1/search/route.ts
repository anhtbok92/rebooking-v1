import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role || null

		const { searchParams } = new URL(req.url)
		const query = searchParams.get("q")?.trim() || ""

		if (!query || query.length < 2) {
			return NextResponse.json({
				bookings: [],
				services: [],
				users: [],
			})
		}

		// Search bookings (accessible to all authenticated users, but filtered by role)
		let bookings: any[] = []
		if (userRole) {
			const bookingWhere: any = {
				OR: [
					{ userName: { contains: query, mode: "insensitive" } },
					{ phone: { contains: query, mode: "insensitive" } },
					{ email: { contains: query, mode: "insensitive" } },
					{ service: { name: { contains: query, mode: "insensitive" } } },
				],
			}

			// Clients can only see their own bookings
			if (userRole === "CLIENT") {
				bookingWhere.userId = (session?.user as any)?.id
			}

			bookings = await prisma.booking.findMany({
				where: bookingWhere,
				include: {
					service: {
						select: {
							id: true,
							name: true,
							price: true,
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			})
		}

		// Search services (accessible to all)
		const services = await prisma.service.findMany({
			where: {
				name: { contains: query, mode: "insensitive" },
			},
			select: {
				id: true,
				name: true,
				price: true,
			},
			take: 5,
		})

		// Search users (only for admins and super admins)
		let users: any[] = []
		if (userRole && (userRole.includes("ADMIN") || userRole === "SUPER_ADMIN")) {
			const searchConditions = {
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ email: { contains: query, mode: "insensitive" } },
					{ phone: { contains: query, mode: "insensitive" } },
					{ referralCode: { contains: query, mode: "insensitive" } },
				],
			}

			// Admin can only see their own account and clients/staff
			// Super admin can see everyone
			let userWhere: any = searchConditions
			if (userRole === "ADMIN") {
				userWhere = {
					AND: [
						searchConditions,
						{
							OR: [
								{ id: (session?.user as any)?.id }, // Admin's own account
								{ role: { in: ["CLIENT", "STAFF"] } }, // Clients and staff
							],
						},
					],
				}
			}

			users = await prisma.user.findMany({
				where: userWhere,
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					role: true,
					image: true,
					referralCode: true,
				},
				take: 5,
			})
		}

		// Search discount codes (only for admins and super admins)
		let discountCodes: any[] = []
		if (userRole && (userRole.includes("ADMIN") || userRole === "SUPER_ADMIN")) {
			discountCodes = await prisma.discountCode.findMany({
				where: {
					code: { contains: query.toUpperCase(), mode: "insensitive" },
				},
				select: {
					id: true,
					code: true,
					type: true,
					value: true,
					active: true,
					usedCount: true,
				},
				take: 5,
			})
		}

		// Search referral codes (only for super admin)
		let referralCodes: any[] = []
		if (userRole === "SUPER_ADMIN") {
			referralCodes = await prisma.referralCode.findMany({
				where: {
					OR: [
						{ code: { contains: query.toUpperCase(), mode: "insensitive" } },
						{ user: { name: { contains: query, mode: "insensitive" } } },
						{ user: { email: { contains: query, mode: "insensitive" } } },
					],
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				take: 5,
			})
		}

		return NextResponse.json({
			bookings: bookings.map((b) => ({
				id: b.id,
				type: "booking",
				title: b.service.name,
				subtitle: `${b.userName} • ${new Date(b.date).toLocaleDateString()} at ${b.time}`,
				status: b.status,
				url: userRole && (userRole.includes("ADMIN") || userRole === "SUPER_ADMIN" || userRole === "STAFF")
					? `/admin/bookings`
					: `/dashboard`,
			})),
			services: services.map((s) => ({
				id: s.id,
				type: "service",
				title: s.name,
				subtitle: `$${s.price.toLocaleString()}`,
				url: "/",
			})),
			users: users.map((u) => ({
				id: u.id,
				type: "user",
				title: u.name || "No name",
				subtitle: u.email || u.phone || "No contact info",
				role: u.role,
				image: u.image,
				referralCode: u.referralCode,
				url: userRole === "SUPER_ADMIN" ? `/admin/super?tab=users` : `/admin?tab=users`,
			})),
			discountCodes: discountCodes.map((d) => ({
				id: d.id,
				type: "discount",
				title: d.code,
				subtitle: `${d.type === "PERCENT" ? `${d.value}%` : `$${d.value}`} off • ${d.usedCount} uses`,
				active: d.active,
				url: userRole === "SUPER_ADMIN" ? `/admin/super?tab=discounts` : `/admin?tab=discounts`,
			})),
			referralCodes: referralCodes.map((r) => ({
				id: r.id,
				type: "referral",
				title: r.code,
				subtitle: `${r.user.name || r.user.email} • ${r.usageCount} uses`,
				url: `/admin/super?tab=referrals`,
			})),
		})
	} catch (error) {
		console.error("Search error:", error)
		return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
	}
}

