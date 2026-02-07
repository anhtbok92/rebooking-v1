"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Wallet } from "lucide-react"
import { useTranslations } from 'next-intl'

interface PaymentMethodSelectorProps {
	paymentMethod: "cash" | "stripe"
	onChange: (method: "cash" | "stripe") => void
}

export function PaymentMethodSelector({ paymentMethod, onChange }: PaymentMethodSelectorProps) {
	const t = useTranslations('Checkout');

	return (
		<Card>
			<CardContent className="pt-6">
				<h3 className="text-lg font-semibold mb-4">{t('paymentMethod')}</h3>
				<div className="grid grid-cols-2 gap-4">
					<Button
						type="button"
						variant={paymentMethod === "cash" ? "default" : "outline"}
						className="h-auto py-6 flex flex-col gap-2"
						onClick={() => onChange("cash")}
					>
						<Wallet className="w-6 h-6" />
						<span>{t('cashPayment')}</span>
					</Button>
					<Button
						type="button"
						variant={paymentMethod === "stripe" ? "default" : "outline"}
						className="h-auto py-6 flex flex-col gap-2"
						onClick={() => onChange("stripe")}
					>
						<CreditCard className="w-6 h-6" />
						<span>{t('cardPayment')}</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}