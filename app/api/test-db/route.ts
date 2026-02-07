import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		// Test database connection
		await prisma.$connect()
		
		// Test query
		const serviceCount = await prisma.service.count()
		const userCount = await prisma.user.count()
		
		return NextResponse.json({
			connected: true,
			serviceCount,
			userCount,
			database: process.env.DATABASE_URL ? "configured" : "missing",
			message: "Database connection successful",
		})
	} catch (error: any) {
		console.error("Database test error:", error)
		return NextResponse.json(
			{
				connected: false,
				error: error?.message || "Unknown error",
				code: error?.code,
				database: process.env.DATABASE_URL ? "configured" : "missing",
				message: "Database connection failed",
			},
			{ status: 500 },
		)
	}
}

