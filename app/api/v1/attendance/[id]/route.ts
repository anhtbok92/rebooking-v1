import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/attendance/[id] - Get single attendance
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const attendance = await prisma.attendance.findUnique({
			where: { id: params.id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		})

		if (!attendance) {
			return NextResponse.json({ error: "Attendance not found" }, { status: 404 })
		}

		return NextResponse.json(attendance)
	} catch (error: any) {
		console.error("Get attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to fetch attendance" },
			{ status: 500 }
		)
	}
}

// PUT /api/v1/attendance/[id] - Update attendance
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const body = await req.json()
		const { status, checkIn, checkOut, notes } = body

		const attendance = await prisma.attendance.update({
			where: { id: params.id },
			data: {
				...(status && { status }),
				...(checkIn !== undefined && { checkIn: checkIn ? new Date(checkIn) : null }),
				...(checkOut !== undefined && { checkOut: checkOut ? new Date(checkOut) : null }),
				...(notes !== undefined && { notes }),
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		})

		return NextResponse.json(attendance)
	} catch (error: any) {
		console.error("Update attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to update attendance" },
			{ status: 500 }
		)
	}
}

// DELETE /api/v1/attendance/[id] - Delete attendance
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await prisma.attendance.delete({
			where: { id: params.id },
		})

		return NextResponse.json({ message: "Attendance deleted successfully" })
	} catch (error: any) {
		console.error("Delete attendance error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to delete attendance" },
			{ status: 500 }
		)
	}
}
