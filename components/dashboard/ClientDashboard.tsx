"use client"

import LayoutAdmin from "@/components/layout/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function ClientDashboard() {
	const t = useTranslations("ClientDashboard")
	const { data: session } = useSession()

	return (
		<LayoutAdmin>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						{t("welcome", { name: session?.user?.name || "" })}
					</h1>
					<p className="text-muted-foreground">{t("desc")}</p>
				</div>

				<div className="mb-8">
					<Link href="/">
						<Button size="lg" className="gap-2">
							<Sparkles className="w-5 h-5" />
							{t("bookButton")}
						</Button>
					</Link>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Welcome to Your Dashboard</CardTitle>
							<CardDescription>
								This is your personal dashboard where you can manage your bookings and preferences.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								You can view your upcoming appointments, past bookings, and manage your account settings here.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</LayoutAdmin>
	)
}
