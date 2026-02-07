"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Link } from "@/i18n/routing"

export function HeroSection() {
	const tCommon = useTranslations("Common")
	const tHero = useTranslations("Hero")

	return (
		<section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						{tHero("demoMode")}
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-card-foreground tracking-tight">
						{tCommon("title")}
						<br />
						<span className="text-primary">{tHero("subTitle")}</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						{tHero("description")}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<a href="#booking">
							<Button size="lg" className="text-lg px-8">
								{tCommon("startBooking")}
							</Button>
						</a>
						<Link href="/signin">
							<Button size="lg" variant="outline" className="text-lg px-8">
								{tCommon("testAccount")}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

