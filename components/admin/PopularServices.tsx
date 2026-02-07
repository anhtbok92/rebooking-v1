"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookings } from "@/lib/swr"
import { DollarSign, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSystemSettings } from "@/lib/swr/system-settings"
import { formatCurrency } from "@/lib/utils"

export function PopularServices() {
	const t = useTranslations("Admin.charts")
	const { currency } = useSystemSettings()
	const { data: response } = useBookings({ limit: 1000 })

	const bookings = response?.bookings || []

	// Calculate service popularity
	const serviceStats = bookings?.reduce(
		(acc, booking) => {
			const serviceId = booking.service.id
			if (!acc[serviceId]) {
				acc[serviceId] = {
					name: booking.service.name,
					price: booking.service.price,
					count: 0,
					revenue: 0,
				}
			}
			acc[serviceId].count += 1
			acc[serviceId].revenue += booking.service.price
			return acc
		},
		{} as Record<string, { name: string; price: number; count: number; revenue: number }>,
	)

	const topServices = Object.values(serviceStats || {})
		.sort((a, b) => b.count - a.count)
		.slice(0, 5)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="w-5 h-5" />
					{t("popularTitle")}
				</CardTitle>
				<CardDescription>{t("popularDesc")}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{topServices.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">{t("noData")}</p>
					) : (
						topServices.map((service, index) => (
							<div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
								<div className="flex items-center gap-3">
									<Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full">
										{index + 1}
									</Badge>
									<div>
										<p className="font-medium">{service.name}</p>
										<p className="text-sm text-muted-foreground">{t("bookingsCount", { count: service.count })}</p>
									</div>
								</div>
								<div className="text-right">
									<div className="flex items-center gap-1 font-semibold">
										{formatCurrency(service.revenue, currency)}
									</div>
									<p className="text-xs text-muted-foreground">{t("totalRevenue")}</p>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	)
}
