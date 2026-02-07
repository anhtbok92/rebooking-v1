"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, UserCircle, Users2 } from "lucide-react"
import { useTranslations } from 'next-intl'

interface CheckoutFormProps {
	bookingFor: "self" | "other"
	userName: string
	email: string
	phone: string
	onBookingForChange: (value: "self" | "other") => void
	onUserNameChange: (value: string) => void
	onEmailChange: (value: string) => void
	onPhoneChange: (value: string) => void
	isLoggedIn: boolean
}

export function CheckoutForm({
	bookingFor,
	userName,
	email,
	phone,
	onBookingForChange,
	onUserNameChange,
	onEmailChange,
	onPhoneChange,
	isLoggedIn,
}: CheckoutFormProps) {
	const t = useTranslations('Checkout');
	
	// Define booking options with translations
	const bookingOptions = [
		{
			value: "self",
			label: t('myself'),
			description: t('myselfDescription'),
			icon: UserCircle,
		},
		{
			value: "other",
			label: t('someoneElse'),
			description: t('someoneElseDescription'),
			icon: Users2,
		},
	];

	return (
		<Card>
			<CardContent className="p-6">
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-4">
						{isLoggedIn ? (
							<User className="w-5 h-5 text-primary" />
						) : (
							<Users2 className="w-5 h-5 text-primary" />
						)}
						<span className="text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
							{isLoggedIn ? t('bookingInfo') : t('guestCheckout')}
						</span>
					</div>
					{isLoggedIn && (
						<div className="mb-4">
							<RadioGroup
								value={bookingFor}
								onValueChange={(value) => onBookingForChange(value as "self" | "other")}
								className="flex gap-4"
							>
								{bookingOptions.map((option) => {
									const Icon = option.icon
									const isSelected = bookingFor === option.value
									return (
										<label
											key={option.value}
											htmlFor={option.value}
											className={`
											cursor-pointer transition-all flex-1
											bg-muted/50 border rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm
											${isSelected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/60"}
										`}
											style={{
											boxShadow: isSelected
												? "0 0 0 2px var(--color-primary-200)"
												: undefined,
										}}
									>
										<RadioGroupItem
											value={option.value}
											id={option.value}
											className="mr-3"
											aria-label={option.label}
										/>
										<div className={`flex items-center justify-center rounded-lg p-2 ${isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
											<Icon className="w-6 h-6" />
										</div>
										<div>
											<div className="font-semibold text-base" style={{ fontFamily: "var(--font-space-grotesk)" }}>{option.label}</div>
											<div className="text-sm text-muted-foreground">{option.description}</div>
										</div>
									</label>
									)
								})}
							</RadioGroup>
						</div>
					)}
					{!isLoggedIn && (
						<div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
							<p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
								<strong>{t('guestCheckout')}:</strong> {t('guestCheckoutDescription')}
							</p>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<div>
						<Label htmlFor="userName">{t('fullName')} *</Label>
						<Input
							id="userName"
							placeholder="John Doe"
							value={userName}
							onChange={(e) => onUserNameChange(e.target.value)}
							required
						/>
					</div>

					{(bookingFor === "other" || !isLoggedIn) && (
						<div>
							<Label htmlFor="email">{t('email')} *</Label>
							<Input
								id="email"
								type="email"
								placeholder="john@example.com"
								value={email}
								onChange={(e) => onEmailChange(e.target.value)}
								required
							/>
						</div>
					)}

					<div>
						<Label htmlFor="phone">{t('phoneNumber')} *</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+1 234 567 8900"
							value={phone}
							onChange={(e) => onPhoneChange(e.target.value)}
							required
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}