"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookings } from "@/lib/swr"
import { Star, TrendingUp, UserCheck, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSystemSettings } from "@/lib/swr/system-settings"
import { formatCurrency } from "@/lib/utils"

export function CustomerAnalytics() {
	const { data: response } = useBookings({ limit: 1000 })
	const t = useTranslations("Admin.analytics")
	const { currency } = useSystemSettings()

	const bookings = response?.bookings || []

	// Calculate customer metrics
	const uniqueCustomers = new Set(bookings?.map((b) => b.userId).filter((id): id is string => !!id) || []).size

	const customerBookingCount = bookings?.reduce(
		(acc, booking) => {
			if (booking.userId) {
				acc[booking.userId] = (acc[booking.userId] || 0) + 1
			}
			return acc
		},
		{} as Record<string, number>,
	)

	const returningCustomers = Object.values(customerBookingCount || {}).filter((count) => count > 1).length

	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") || []
	const avgBookingValue =
		completedBookings.length > 0
			? completedBookings.reduce((sum, b) => sum + b.service.price, 0) / completedBookings.length
			: 0

	const retentionRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("kpi.totalCustomers")}</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{uniqueCustomers}</div>
					<p className="text-xs text-muted-foreground">{t("kpi.uniqueCustomers")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("kpi.returningCustomers")}</CardTitle>
					<UserCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{returningCustomers}</div>
					<p className="text-xs text-muted-foreground">{t("kpi.retentionRate", { percent: retentionRate.toFixed(1) })}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("kpi.avgBooking")}</CardTitle>
					<Star className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatCurrency(avgBookingValue, currency)}</div>
					<p className="text-xs text-muted-foreground">{t("kpi.perBooking")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("kpi.completionRate")}</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{bookings && bookings.length > 0 ? ((completedBookings.length / bookings.length) * 100).toFixed(1) : 0}%
					</div>
					<p className="text-xs text-muted-foreground">{t("kpi.completed", { count: completedBookings.length })}</p>
				</CardContent>
			</Card>
		</div>
	)
}
