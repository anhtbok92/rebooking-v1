import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { updateEmployeeSalarySchema, validateRequest, validationErrorResponse } from "@/lib/validations"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const { id } = await params
		const salary = await prisma.employeeSalary.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
						phone: true,
					},
				},
			},
		})

		if (!salary) {
			return NextResponse.json({ error: "Salary not found" }, { status: 404 })
		}

		return NextResponse.json(salary)
	} catch (error) {
		console.error("Get salary error:", error)
		return NextResponse.json({ error: "Failed to fetch salary" }, { status: 500 })
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const { id } = await params
		const body = await req.json()
		const validation = validateRequest(updateEmployeeSalarySchema, body)

		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}

		const salary = await prisma.employeeSalary.update({
			where: { id },
			data: validation.data,
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

		return NextResponse.json(salary)
	} catch (error) {
		console.error("Update salary error:", error)
		return NextResponse.json({ error: "Failed to update salary" }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const { id } = await params
		await prisma.employeeSalary.delete({
			where: { id },
		})

		return NextResponse.json({ message: "Salary deleted successfully" })
	} catch (error) {
		console.error("Delete salary error:", error)
		return NextResponse.json({ error: "Failed to delete salary" }, { status: 500 })
	}
}
