import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessResource } from "@/lib/rbac"
import { sendEmail } from "@/lib/email-service"
import { getAdminCreatedEmail, getRoleChangedEmail } from "@/lib/email-templates/roles"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		// console.log(session);

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { searchParams } = new URL(req.url)
		const roleFilter = searchParams.get("role")
		const page = Number.parseInt(searchParams.get("page") || "1")
		const limit = Number.parseInt(searchParams.get("limit") || "10")
		const sort = searchParams.get("sort") || "date-desc"
		const search = searchParams.get("search") || ""
		const skip = (page - 1) * limit

		const where: any = {}

		// Only add role filter if it's not "ALL"
		if (roleFilter && roleFilter !== "ALL") {
			where.role = roleFilter
		}

		// Add search filter for name or email
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			]
		}

		let orderBy: any = { createdAt: "desc" }
		if (sort === "name-asc") {
			orderBy = { name: "asc" }
		} else if (sort === "name-desc") {
			orderBy = { name: "desc" }
		} else if (sort === "date-asc") {
			orderBy = { createdAt: "asc" }
		} else if (sort === "date-desc") {
			orderBy = { createdAt: "desc" }
		}

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					phone: true,
					createdAt: true,
				},
				orderBy,
				skip,
				take: limit,
			}),
			prisma.user.count({ where }),
		])

		return NextResponse.json({
			users,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		})
	} catch (error) {
		console.error("Users API error:", error)
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (!canAccessResource(userRole, "ADMIN")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const { name, email, phone, password, role } = await req.json()

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUserRole = role || "STAFF"
		const newStaff = await prisma.user.create({
			data: {
				name,
				email,
				phone,
				password: hashedPassword,
				role: newUserRole,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				phone: true,
				createdAt: true,
			},
		})

		// Generate referral code for all users (admin, super admin, client, staff)
		try {
			const { ensureReferralCode } = await import("@/lib/referral-code-utils")
			await ensureReferralCode(newStaff.id, email)
		} catch (err) {
			console.error("Failed to generate referral code for staff:", err)
			// Don't fail user creation if referral code generation fails
		}

		// Send admin created email
		try {
			const roleLabel = newUserRole === "SUPER_ADMIN" ? "Super Admin" : newUserRole === "ADMIN" ? "Admin" : newUserRole === "DOCTOR" ? "Doctor" : "Staff"
			await sendEmail({
				to: email,
				subject: `Welcome ${roleLabel} - Account Created`,
				html: getAdminCreatedEmail(name, email, newUserRole, password),
			})
		} catch (emailError) {
			console.error("Failed to send admin created email:", emailError)
			// Don't fail user creation if email fails
		}

		return NextResponse.json(newStaff, { status: 201 })
	} catch (error) {
		console.error("Create staff error:", error)
		return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 })
	}
}

export async function PUT(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userRole = (session.user as any).role
		if (userRole !== "SUPER_ADMIN") {
			return NextResponse.json({ error: "Only Super Admin can manage roles" }, { status: 403 })
		}

		const { userId, role: newRole } = await req.json()

		if (userId === session.user.id) {
			return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
		}

		// Get current user to check old role
		const currentUser = await prisma.user.findUnique({
			where: { id: userId },
			select: { role: true, name: true, email: true },
		})

		if (!currentUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { role: newRole },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		})

		// Send role changed email
		if (currentUser.email && currentUser.role !== newRole) {
			try {
				await sendEmail({
					to: currentUser.email,
					subject: "Account Role Updated - Luxury Nail Spa",
					html: getRoleChangedEmail(currentUser.name || "there", newRole, currentUser.role),
				})
			} catch (emailError) {
				console.error("Failed to send role changed email:", emailError)
				// Don't fail role update if email fails
			}
		}

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.error("Update user role error:", error)
		return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
	}
}
