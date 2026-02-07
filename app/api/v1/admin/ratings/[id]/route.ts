import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// PATCH: Approve or reject a rating
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const { id } = await params
		const { status } = await req.json()

		if (!status || !["APPROVED", "REJECTED"].includes(status)) {
			return NextResponse.json({ error: "Invalid status. Must be APPROVED or REJECTED" }, { status: 400 })
		}

		const rating = await prisma.rating.findUnique({
			where: { id },
		})

		if (!rating) {
			return NextResponse.json({ error: "Rating not found" }, { status: 404 })
		}

		const updatedRating = await prisma.rating.update({
			where: { id },
			data: { status },
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
						price: true,
					},
				},
			},
		})

		return NextResponse.json(updatedRating)
	} catch (error) {
		console.error("Update rating error:", error)
		return NextResponse.json({ error: "Failed to update rating" }, { status: 500 })
	}
}

// DELETE: Delete a rating (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role

		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const { id } = await params

		await prisma.rating.delete({
			where: { id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Delete rating error:", error)
		return NextResponse.json({ error: "Failed to delete rating" }, { status: 500 })
	}
}

