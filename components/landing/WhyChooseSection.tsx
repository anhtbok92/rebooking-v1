"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, Heart, BarChart3, Shield, Headphones } from "lucide-react"

const benefits = [
	{
		icon: Clock,
		title: "Save Time",
		description: "Automate booking management and reduce manual work by up to 80%. Focus on what matters - your customers.",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	{
		icon: TrendingUp,
		title: "Increase Revenue",
		description: "Optimize your schedule, reduce no-shows, and upsell services with our intelligent booking system.",
		color: "text-green-600",
		bgColor: "bg-green-50",
	},
	{
		icon: Heart,
		title: "Happy Customers",
		description: "Provide a seamless booking experience with real-time availability, instant confirmations, and easy rescheduling.",
		color: "text-pink-600",
		bgColor: "bg-pink-50",
	},
	{
		icon: BarChart3,
		title: "Data Insights",
		description: "Make informed decisions with comprehensive analytics, booking trends, and revenue reports.",
		color: "text-purple-600",
		bgColor: "bg-purple-50",
	},
	{
		icon: Shield,
		title: "Secure & Reliable",
		description: "Enterprise-grade security with role-based access control. Your data is safe and protected.",
		color: "text-orange-600",
		bgColor: "bg-orange-50",
	},
	{
		icon: Headphones,
		title: "24/7 Support",
		description: "Get help when you need it. Our support team is always ready to assist you with any questions.",
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
	},
]

export function WhyChooseSection() {
	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-to-b from-background to-muted/30">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">Why Choose Reebooking?</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need to streamline your nail salon operations and delight your customers
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{benefits.map((benefit, idx) => {
						const Icon = benefit.icon
						return (
							<Card key={idx}>
								<CardHeader>
									<div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4`}>
										<Icon className={`w-7 h-7 ${benefit.color}`} />
									</div>
									<CardTitle className="text-xl">{benefit.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">{benefit.description}</CardDescription>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}

