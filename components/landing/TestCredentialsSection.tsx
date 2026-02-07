"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Lock, Mail, Shield, User, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const testCredentials = [
	{
		role: "Super Admin",
		email: "super@demo.com",
		password: "123456",
		description: "Full system access and user management",
		features: ["Manage all users", "Manage roles", "System settings", "View all analytics"],
		icon: Shield,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
	},
	{
		role: "Admin",
		email: "admin@demo.com",
		password: "123456",
		description: "Manage services, bookings, and staff",
		features: ["Manage services", "Manage bookings", "Approve/reject ratings", "View booking calendar", "View analytics", "Manage staff"],
		icon: Lock,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
	},
	{
		role: "Staff",
		email: "staff@demo.com",
		password: "123456",
		description: "View and update booking status",
		features: ["View bookings", "Update booking status", "View services"],
		icon: Users,
		color: "text-green-600",
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
	},
	{
		role: "Client",
		email: "client@demo.com",
		password: "123456",
		description: "Book services and manage own bookings",
		features: ["Book services", "View own bookings", "Rate completed services", "View booking calendar", "Manage favorites"],
		icon: User,
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
	},
]

export function TestCredentialsSection() {
	const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

	const copyToClipboard = (text: string, email: string) => {
		navigator.clipboard.writeText(text)
		setCopiedEmail(email)
		setTimeout(() => setCopiedEmail(null), 2000)
	}

	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
			<div className="max-w-7xl mx-auto">
				{/* <div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">Test Credentials</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
						Use these credentials to test different user roles and explore all features of the system.
					</p>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm max-w-2xl mx-auto">
						<CheckCircle2 className="w-4 h-4" />
						<span>
							<strong>Note:</strong> Make sure these test users exist in your database. If not, create them with the
							password: <code className="bg-blue-100 px-1 rounded">123456</code>
						</span>
					</div>
				</div> */}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{testCredentials.map((cred) => {
						const Icon = cred.icon
						return (
							<Card key={cred.role}>
								<CardHeader>
									<div className="flex items-center gap-3 mb-2">
										<Icon className={`w-6 h-6 ${cred.color}`} />
										<CardTitle className="text-xl">{cred.role}</CardTitle>
									</div>
									<CardDescription>{cred.description}</CardDescription>
								</CardHeader>
								<CardContent className="pt-6 space-y-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-muted-foreground">Email:</span>
											<button
												onClick={() => copyToClipboard(cred.email, cred.email)}
												className="text-sm text-primary hover:underline flex items-center gap-1"
											>
												{copiedEmail === cred.email ? (
													<>
														<CheckCircle2 className="w-4 h-4" />
														Copied!
													</>
												) : (
													<>
														<Mail className="w-4 h-4" />
														Copy
													</>
												)}
											</button>
										</div>
										<div className="flex items-center gap-2 p-2 bg-muted rounded-md">
											<code className="text-sm flex-1 text-left">{cred.email}</code>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-muted-foreground">Password:</span>
											<button
												onClick={() => copyToClipboard(cred.password, cred.email)}
												className="text-sm text-primary hover:underline flex items-center gap-1"
											>
												{copiedEmail === cred.email ? (
													<>
														<CheckCircle2 className="w-4 h-4" />
														Copied!
													</>
												) : (
													<>
														<Lock className="w-4 h-4" />
														Copy
													</>
												)}
											</button>
										</div>
										<div className="flex items-center gap-2 p-2 bg-muted rounded-md">
											<code className="text-sm flex-1 text-left">••••••••</code>
										</div>
									</div>

									<div className="pt-2">
										<ul className="space-y-1 h-38 overflow-y-auto">
											{cred.features.map((feature, idx) => (
												<li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
													<CheckCircle2 className={`w-4 h-4 ${cred.color} mt-0.5 flex-shrink-0`} />
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>

									<Link href="/signin" className="block">
										<Button className="w-full">
											Sign In as {cred.role}
										</Button>
									</Link>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}

