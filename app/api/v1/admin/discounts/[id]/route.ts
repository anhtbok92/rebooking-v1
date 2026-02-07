import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role
		
		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		const body = await req.json()
		const { type, value, minAmount, maxUses, expiresAt, active } = body

		// Build update data object
		const updateData: any = {}
		
		if (type !== undefined) updateData.type = type
		if (value !== undefined) updateData.value = value
		if (minAmount !== undefined) updateData.minAmount = minAmount || null
		if (maxUses !== undefined) updateData.maxUses = maxUses || null
		if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
		if (active !== undefined) updateData.active = active

		const updated = await prisma.discountCode.update({
			where: { id },
			data: updateData,
		})

		return NextResponse.json(updated)
	} catch (error) {
		console.error("Discount update error:", error)
		return NextResponse.json({ error: "Failed to update discount" }, { status: 500 })
	}
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const session = await getServerSession(authOptions)
		const userRole = (session?.user as any)?.role
		
		if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
		}

		await prisma.discountCode.delete({
			where: { id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Discount delete error:", error)
		return NextResponse.json({ error: "Failed to delete discount" }, { status: 500 })
	}
}
