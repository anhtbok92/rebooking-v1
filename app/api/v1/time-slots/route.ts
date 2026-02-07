import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const slots = await prisma.timeSlot.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        })

        return NextResponse.json(slots)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 })
    }
}
