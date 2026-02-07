"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"

interface ReferralCodeInputProps {
	referralCode: string
	onChange: (code: string) => void
}

export function ReferralCodeInput({ referralCode, onChange }: ReferralCodeInputProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center gap-2 mb-4">
					<Gift className="w-5 h-5 text-primary" />
					<h3 className="text-lg font-semibold">Referral Code (Optional)</h3>
				</div>
				<div className="space-y-2">
					<Label htmlFor="referralCode">Enter referral code to earn rewards</Label>
					<Input
						id="referralCode"
						placeholder="ABC123"
						value={referralCode}
						onChange={(e) => onChange(e.target.value.toUpperCase())}
						className='bg-background'
					/>
					<p className="text-xs text-muted-foreground">
						If you were referred by someone, enter their code here to earn rewards
					</p>
				</div>
			</CardContent>
		</Card>
	)
}

