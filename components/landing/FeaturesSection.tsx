"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Calendar,
	CreditCard,
	Edit,
	Gift,
	Lock,
	Phone,
	Search,
	Shield,
	ShoppingCart,
	Sparkles,
	Star,
	Ticket,
	UserPlus,
	Zap,
} from "lucide-react"

const features = [
	{
		title: "Easy Booking System",
		description: "Select service, date, and time with an intuitive calendar interface",
		icon: Calendar,
	},
	{
		title: "Shopping Cart",
		description: "Add multiple services to cart, edit items, and manage bookings easily",
		icon: ShoppingCart,
	},
	{
		title: "Photo Upload",
		description: "Upload inspiration photos for your nail art designs",
		icon: Sparkles,
	},
	{
		title: "Real-time Availability",
		description: "See available time slots and booking counts in real-time",
		icon: Zap,
	},
	{
		title: "Edit Cart Items",
		description: "Update service, date, time, or photos for any cart item",
		icon: Edit,
	},
	{
		title: "WhatsApp Integration",
		description: "Receive booking confirmations via WhatsApp automatically",
		icon: Phone,
	},
	{
		title: "Role-Based Access",
		description: "Different dashboards for Admin, Staff, and Clients",
		icon: Shield,
	},
	{
		title: "Stripe Payment Integration",
		description: "Secure card payments with Stripe Checkout, automatic booking confirmation, and webhook support",
		icon: CreditCard,
	},
	{
		title: "Discount Codes",
		description: "Apply promo codes at checkout to save on your bookings",
		icon: Ticket,
	},
	{
		title: "Referral Program",
		description: "Share your unique referral code and earn points when friends complete their first payment",
		icon: Gift,
	},
	{
		title: "Loyalty Rewards",
		description: "Earn points with every booking and unlock tiered rewards (Bronze, Silver, Gold, Platinum)",
		icon: UserPlus,
	},
	{
		title: "Global Search",
		description: "Powerful search across bookings, services, users, and more with keyboard shortcuts (⌘K)",
		icon: Search,
	},
	{
		title: "Service Ratings & Reviews",
		description: "Rate and review completed services. View all reviews with star ratings. Admin approval system for quality control",
		icon: Star,
	},
	{
		title: "Booking Calendar View",
		description: "Visual calendar showing all bookings with 6 time slots per day. Filter by today, tomorrow, or all. Click to view details",
		icon: Calendar,
	},
	{
		title: "Secure Payment Processing",
		description: "PCI-compliant payment processing with automatic receipts, refund support, and payment history tracking",
		icon: Lock,
	},
]

export function FeaturesSection() {
	return (
		<section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 scroll-mt-20">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">Key Features</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need for a modern booking system
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, idx) => {
						const Icon = feature.icon
						return (
							<Card key={idx}>
								<CardHeader>
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<Icon className="w-6 h-6 text-primary" />
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}

