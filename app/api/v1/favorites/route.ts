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

		const favorites = await prisma.favorite.findMany({
			where: { userId: user.id },
			include: { service: true },
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json(favorites)
	} catch (error) {
		console.error("Get favorites error:", error)
		return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
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

		const { serviceId } = await req.json()

		if (!serviceId) {
			return NextResponse.json({ error: "Service ID required" }, { status: 400 })
		}

		const favorite = await prisma.favorite.upsert({
			where: {
				userId_serviceId: {
					userId: user.id,
					serviceId,
				},
			},
			update: {},
			create: {
				userId: user.id,
				serviceId,
			},
			include: { service: true },
		})

		return NextResponse.json(favorite, { status: 201 })
	} catch (error) {
		console.error("Add favorite error:", error)
		return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
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

		const { searchParams } = new URL(req.url)
		const serviceId = searchParams.get("serviceId")

		if (!serviceId) {
			return NextResponse.json({ error: "Service ID required" }, { status: 400 })
		}

		await prisma.favorite.delete({
			where: {
				userId_serviceId: {
					userId: user.id,
					serviceId,
				},
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Remove favorite error:", error)
		return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
	}
}
