"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { BadgeCheck, User, Users, Lock, Shield, ShoppingBag } from "lucide-react"

const steps = [
	{
		id: 1,
		title: "Try Guest Booking",
		icon: <ShoppingBag className="w-7 h-7" />,
		description:
			"Book a service without signing in. Add items to your cart, edit them, and experience the guest booking flow.",
		tip: "No login required: just try booking anything!",
		bg: "bg-primary",
		fg: "text-primary-foreground",
	},
	{
		id: 2,
		title: "Test as Client",
		icon: <User className="w-7 h-7" />,
		description:
			"Sign in as a Client to view and manage your bookings, update your profile, and explore the client dashboard.",
		tip: "Use the Client test account from the credentials section.",
		bg: "bg-orange-500",
		fg: "text-white",
	},
	{
		id: 3,
		title: "Test as Staff",
		icon: <Users className="w-7 h-7" />,
		description:
			"Sign in as Staff to view all bookings for services you offer and update the status of each booking.",
		tip: "Staff see different dashboard & calendar tools.",
		bg: "bg-green-500",
		fg: "text-white",
	},
	{
		id: 4,
		title: "Test as Admin",
		icon: <Lock className="w-7 h-7" />,
		description:
			"Sign in as Admin to manage services, bookings, staff members and view rich analytics and system reports.",
		tip: "Great for seeing features available to managers.",
		bg: "bg-blue-500",
		fg: "text-white",
	},
	{
		id: 5,
		title: "Test as Super Admin",
		icon: <Shield className="w-7 h-7" />,
		description:
			"Sign in as Super Admin to access all features — user & role management, system settings, and more.",
		tip: "Super Admin has access to everything in the system.",
		bg: "bg-purple-600",
		fg: "text-white",
	},
]

export function HowToTestSection() {
	return (
		<section className="py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-muted/40 to-background">
			<div className="max-w-7xl mx-auto">
				<Card>
					<CardHeader className="border-b pb-6">
						<CardTitle className="text-3xl flex gap-2 items-center">
							<BadgeCheck className="w-6 h-6 text-primary" />
							How to Test
						</CardTitle>
						<CardDescription className="text-lg flex flex-col sm:flex-row sm:items-center gap-2">
							<span>
								Step-by-step guide to experience all roles and features.
							</span>
							<span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 text-xs font-medium">
								Demo mode
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-8">
						<div
							className="
								grid 
								gap-6
								sm:grid-cols-2 
								lg:grid-cols-3 
							"
						>
							{steps.map((step) => (
								<div
									key={step.id}
									className="group flex flex-col gap-3 p-5 rounded-2xl bg-muted/40 hover:bg-muted/60 shadow transition border ring-1 ring-muted/10 hover:ring-primary/40"
								>
									<div
										className={`flex items-center justify-center w-12 h-12 rounded-xl shadow ${step.bg} ${step.fg} text-xl font-bold transition group-hover:scale-105 group-hover:shadow-lg mb-1`}
									>
										{step.icon}
									</div>
									<div className="flex items-center gap-2 mb-1">
										<span className="font-semibold text-base md:text-lg">
											{step.title}
										</span>
										{step.id === 1 && (
											<span className="ml-2 bg-gray-100 border border-gray-200 text-xs px-2 py-0.5 rounded-full text-gray-600">
												No sign in
											</span>
										)}
									</div>
									<p className="text-sm text-muted-foreground">{step.description}</p>
									{step.tip && (
										<p className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full  shadow-sm">
											<span className="font-medium">Tip:</span> {step.tip}
										</p>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

