import { type NextRequest, NextResponse } from "next/server"
import { generateSmartAvailability } from "@/lib/openai"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter required" }, { status: 400 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      },
      select: { time: true },
    })

    const availableSlots = await generateSmartAvailability(bookings)

    return NextResponse.json({ availableSlots })
  } catch (error) {
    console.error("Availability API error:", error)
    return NextResponse.json({
      availableSlots: ["10:00 AM", "2:00 PM", "4:00 PM"],
    })
  }
}
