"use client"

import { useTranslations } from "next-intl"
import { Calendar, CheckCircle, Link2, ShoppingCart, Sparkles } from "lucide-react"

const stepIcons = [Sparkles, Calendar, ShoppingCart, Link2, CheckCircle]

export function HowItWorksSection() {
	const t = useTranslations("HowItWorks")

	return (
		<section className="py-12 pb-20 px-4 bg-background">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-10">
					<h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
						{t("title")}
					</h2>
					<p className="text-base text-muted-foreground">
						{t("description")}
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
					{[0, 1, 2, 3, 4].map((idx) => {
						const Icon = stepIcons[idx]
						return (
							<div
								key={idx}
								className="relative flex flex-col items-center text-center bg-card p-5 rounded-lg"
							>
								{/* Step Number Badge */}
								<span className="absolute -top-3 -left-3 bg-primary text-white w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm border-2 border-background">
									{idx + 1}
								</span>
								<div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
									<Icon className="w-6 h-6" />
								</div>
								<h3 className="text-base font-semibold text-card-foreground mb-1">
									{t(`step${idx}.title`)}
								</h3>
								<p className="text-xs text-muted-foreground">{t(`step${idx}.description`)}</p>
								{/* Connecting card: add connector except last */}
								{idx < 4 && (
									<div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
										<div className="w-8 h-1 bg-primary/20 rounded-lg"></div>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
