"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-redux-cart"
import { formatBookingDateTime, getCurrencySymbol, formatCurrency } from "@/lib/utils"
import { useSystemSettings } from "@/lib/swr/system-settings"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

interface CheckoutSummaryProps {
	appliedDiscount: { code: string; amount: number; finalTotal: number } | null
	paymentMethod: "cash" | "stripe"
	isSubmitting: boolean
	onSubmit: () => void
}

export function CheckoutSummary({ appliedDiscount, paymentMethod, isSubmitting, onSubmit }: CheckoutSummaryProps) {
	const t = useTranslations('Checkout');
	const { cart, cartTotal } = useCart()
	const { currency } = useSystemSettings()
	
	const finalTotal = appliedDiscount ? appliedDiscount.finalTotal : cartTotal

	return (
		<Card className="sticky top-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShoppingCart className="w-5 h-5" />
					{t('orderSummary')}
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
							<p className="font-semibold">{formatCurrency(item.price, currency)}</p>
						</div>
					))}
				</div>

				<Separator />

				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-muted-foreground">{t('subtotal')}</span>
						<span>{formatCurrency(cartTotal, currency)}</span>
					</div>
					{appliedDiscount && (
						<div className="flex justify-between text-green-600">
							<span>{t('discount')} ({appliedDiscount.code})</span>
							<span>-{formatCurrency(appliedDiscount.amount, currency)}</span>
						</div>
					)}
					<Separator />
					<div className="flex justify-between text-lg font-bold">
						<span>{t('total')}</span>
						<span>{formatCurrency(finalTotal, currency)}</span>
					</div>
				</div>

				<Button className="w-full" size="lg" onClick={onSubmit} disabled={isSubmitting}>
					{isSubmitting
						? paymentMethod === "stripe"
							? t('processing')
							: t('creatingBooking')
						: paymentMethod === "stripe"
							? t('payWithCard')
							: t('completeBooking')}
				</Button>

				<Link href="/cart">
					<Button variant="outline" className="w-full">
						{t('backToCart')}
					</Button>
				</Link>
			</CardContent>
		</Card>
	)
}