"use client"

import { CheckCircle, Star, User, Zap } from "lucide-react"

const stats = [
	{ number: "10K+", label: "Happy Customers", icon: User },
	{ number: "50K+", label: "Bookings Completed", icon: CheckCircle },
	{ number: "4.9", label: "Average Rating", icon: Star },
	{ number: "99.9%", label: "Uptime", icon: Zap },
]

export function StatsSection() {
	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat, idx) => {
						const Icon = stat.icon
						return (
							<div key={idx} className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
									<Icon className="w-8 h-8" />
								</div>
								<div className="text-4xl font-bold text-card-foreground mb-2">{stat.number}</div>
								<div className="text-sm text-muted-foreground">{stat.label}</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

