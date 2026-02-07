import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const slots = await prisma.timeSlot.findMany({
            orderBy: { order: "asc" },
        })

        return NextResponse.json(slots)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { time, order } = await req.json()

        if (!time) {
            return NextResponse.json({ error: "Time is required" }, { status: 400 })
        }

        const existing = await prisma.timeSlot.findUnique({
            where: { time },
        })

        if (existing) {
            return NextResponse.json({ error: "Time slot already exists" }, { status: 400 })
        }

        const slot = await prisma.timeSlot.create({
            data: {
                time,
                order: order || 0,
                isActive: true,
            },
        })

        return NextResponse.json(slot)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create time slot" }, { status: 500 })
    }
}
