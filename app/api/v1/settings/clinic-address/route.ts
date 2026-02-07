import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET clinic address settings (public endpoint)
 */
export async function GET() {
	try {
		const settings = await prisma.systemSettings.findUnique({
			where: { key: "clinic_address" },
		})

		if (!settings) {
			// Return default values if not set
			return NextResponse.json({
				address: "",
				latitude: null,
				longitude: null,
				phone: "",
				email: "",
			})
		}

		const data = JSON.parse(settings.value)
		return NextResponse.json(data)
	} catch (error) {
		console.error("Get clinic address error:", error)
		return NextResponse.json({ error: "Failed to fetch clinic address" }, { status: 500 })
	}
}

/**
 * PUT update clinic address settings (admin only)
 */
export async function PUT(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
		}

		const body = await req.json()
		const { address, latitude, longitude, phone, email } = body

		// Validate required fields
		if (!address) {
			return NextResponse.json({ error: "Address is required" }, { status: 400 })
		}

		const data = {
			address,
			latitude: latitude || null,
			longitude: longitude || null,
			phone: phone || "",
			email: email || "",
		}

		// Upsert settings
		const settings = await prisma.systemSettings.upsert({
			where: { key: "clinic_address" },
			update: {
				value: JSON.stringify(data),
				updatedAt: new Date(),
			},
			create: {
				key: "clinic_address",
				value: JSON.stringify(data),
			},
		})

		return NextResponse.json({
			success: true,
			data: JSON.parse(settings.value),
		})
	} catch (error) {
		console.error("Update clinic address error:", error)
		return NextResponse.json({ error: "Failed to update clinic address" }, { status: 500 })
	}
}
