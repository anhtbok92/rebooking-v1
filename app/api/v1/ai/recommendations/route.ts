import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { generateServiceRecommendations } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookings } = await req.json()

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    const recommendations = await generateServiceRecommendations(bookings)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ recommendations: [] })
  }
}
