import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const settings = await prisma.systemSettings.findMany()

        // Convert to key-value object
        const settingsObj = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {} as Record<string, string>)

        // Set defaults if not exists
        if (!settingsObj.currency) {
            settingsObj.currency = "VND" // Default to Vietnamese Dong
        }

        return NextResponse.json(settingsObj)
    } catch (error) {
        console.error("Error fetching settings:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { key, value } = body

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
        }

        const setting = await prisma.systemSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        })

        return NextResponse.json(setting)
    } catch (error) {
        console.error("Error updating setting:", error)
        return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
    }
}
