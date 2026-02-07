"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"
import { useTranslations } from 'next-intl'

interface ReferralCodeInputProps {
	referralCode: string
	onChange: (code: string) => void
}

export function ReferralCodeInput({ referralCode, onChange }: ReferralCodeInputProps) {
	const t = useTranslations('Checkout');

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center gap-2 mb-4">
					<Gift className="w-5 h-5 text-primary" />
					<h3 className="text-lg font-semibold">{t('referralCodeOpt')}</h3>
				</div>
				<div className="space-y-2">
					<Label htmlFor="referralCode">{t('enterReferralCode')}</Label>
					<Input
						id="referralCode"
						placeholder={t('referralCodePlaceholder')}
						value={referralCode}
						onChange={(e) => onChange(e.target.value.toUpperCase())}
						className='bg-background'
					/>
					<p className="text-xs text-muted-foreground">
						{t('referralCodeDescription')}
					</p>
				</div>
			</CardContent>
		</Card>
	)
}