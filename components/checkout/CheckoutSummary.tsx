"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-redux-cart"
import { formatBookingDateTime } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CheckoutSummaryProps {
	appliedDiscount: { code: string; amount: number; finalTotal: number } | null
	paymentMethod: "cash" | "stripe"
	isSubmitting: boolean
	onSubmit: () => void
}

export function CheckoutSummary({ appliedDiscount, paymentMethod, isSubmitting, onSubmit }: CheckoutSummaryProps) {
	const { cart, cartTotal } = useCart()

	const finalTotal = appliedDiscount ? appliedDiscount.finalTotal : cartTotal

	return (
		<Card className="sticky top-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShoppingCart className="w-5 h-5" />
					Order Summary
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-3">
					{cart.map((item) => (
						<div key={item.id} className="flex justify-between items-start">
							<div className="flex-1">
								<p className="font-medium">{item.serviceName}</p>
								<p className="text-sm text-muted-foreground">{formatBookingDateTime(item.date, item.time)}</p>
							</div>
							<p className="font-semibold">${item.price.toLocaleString()}</p>
						</div>
					))}
				</div>

				<Separator />

				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Subtotal</span>
						<span>${cartTotal.toLocaleString()}</span>
					</div>
					{appliedDiscount && (
						<div className="flex justify-between text-green-600">
							<span>Discount ({appliedDiscount.code})</span>
							<span>-${appliedDiscount.amount.toLocaleString()}</span>
						</div>
					)}
					<Separator />
					<div className="flex justify-between text-lg font-bold">
						<span>Total</span>
						<span>${finalTotal.toLocaleString()}</span>
					</div>
				</div>

				<Button className="w-full" size="lg" onClick={onSubmit} disabled={isSubmitting}>
					{isSubmitting
						? paymentMethod === "stripe"
							? "Processing..."
							: "Creating Booking..."
						: paymentMethod === "stripe"
							? "Pay with Card"
							: "Complete Booking"}
				</Button>

				<Link href="/cart">
					<Button variant="outline" className="w-full">
						Back to Cart
					</Button>
				</Link>
			</CardContent>
		</Card>
	)
}

