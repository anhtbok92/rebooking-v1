import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.timeSlot.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE Error:", error)
        return NextResponse.json({ error: "Failed to delete time slot" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { isActive, order, time } = body

        const slot = await prisma.timeSlot.update({
            where: { id },
            data: {
                isActive,
                order,
                time,
            },
        })

        return NextResponse.json(slot)
    } catch (error) {
        console.error("PATCH Error:", error)
        return NextResponse.json({ error: "Failed to update time slot" }, { status: 500 })
    }
}
