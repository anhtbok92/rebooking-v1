// app/api/discount/apply/route.ts
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { applyDiscountSchema, validateRequest, validationErrorResponse } from "@/lib/validations"

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions)
		const body = await req.json()
		
		const validation = validateRequest(applyDiscountSchema, body)
		if (!validation.success) {
			return validationErrorResponse(validation.error)
		}
		
		const { code, cartTotal } = validation.data

		const discountCode = await prisma.discountCode.findUnique({
			where: { code: code.toUpperCase() },
		})

		if (!discountCode) {
			return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
		}

		if (!discountCode.active) {
			return NextResponse.json({ error: "Coupon is not active" }, { status: 400 })
		}

		if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
			return NextResponse.json({ error: "Coupon has expired" }, { status: 400 })
		}

		if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
			return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
		}

		if (discountCode.minAmount && cartTotal < discountCode.minAmount) {
			return NextResponse.json(
				{ error: `Minimum order of $${discountCode.minAmount} required` },
				{ status: 400 }
			)
		}

		let discountAmount = 0
		if (discountCode.type === "PERCENT") {
			discountAmount = Math.floor(cartTotal * (discountCode.value / 100))
		} else if (discountCode.type === "FIXED") {
			discountAmount = discountCode.value
		}

		const finalTotal = cartTotal - discountAmount

		// INCREMENT usedCount
		await prisma.discountCode.update({
			where: { id: discountCode.id },
			data: { usedCount: { increment: 1 } },
		})

		return NextResponse.json({
			success: true,
			discountAmount,
			finalTotal,
			code: discountCode.code,
			type: discountCode.type,
			value: discountCode.value,
		})
	} catch (error) {
		console.error("[DISCOUNT_APPLY]", error)
		return NextResponse.json({ error: "Failed to apply discount" }, { status: 500 })
	}
}