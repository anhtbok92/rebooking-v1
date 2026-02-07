// GET: List codes
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createDiscountSchema, validateRequest, validationErrorResponse } from "@/lib/validations"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role
  
  if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(codes)
}

// POST: Create code
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role
  
  if (!userRole || (!userRole.includes("ADMIN") && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  
  const validation = validateRequest(createDiscountSchema, body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }
  
  const { code, type, value, minAmount, maxUses, expiresAt, active } = validation.data

  try {
    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        minAmount: minAmount || null,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active ?? true,
      },
    })
    return NextResponse.json(discount)
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Code already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}