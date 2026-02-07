"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookings, useBookingStats } from "@/lib/swr"
import { Calendar, CheckCircle2, DollarSign, TrendingUp, Users, XCircle } from "lucide-react"

import { useTranslations } from "next-intl"

export function StatsOverview() {
	const t = useTranslations("Admin.stats")
	const { data: response } = useBookings({ limit: 1000 })
	const { data: stats } = useBookingStats()

	const bookings = response?.bookings || []

	const today = new Date()
	const todayBookings =
		bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return bookingDate.toDateString() === today.toDateString()
		}).length || 0

	const thisMonth =
		bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear()
		}) || []

	const monthlyRevenue = thisMonth.reduce((sum, b) => sum + b.service.price, 0)

	const totalBookings = bookings?.length || 0
	const pendingBookings = bookings?.filter((b) => b.status === "PENDING").length || 0
	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED").length || 0
	const cancelledBookings = stats?.cancelled || 0

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("todayBookings")}</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{todayBookings}</div>
					<p className="text-xs text-muted-foreground">{t("todayBookingsDesc")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("monthlyRevenue")}</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
					<p className="text-xs text-muted-foreground">
						{t("monthlyRevenueDesc", { count: thisMonth.length })}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("totalBookings")}</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalBookings}</div>
					<p className="text-xs text-muted-foreground">{t("totalBookingsDesc")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("pending")}</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{pendingBookings}</div>
					<p className="text-xs text-muted-foreground">{t("pendingDesc")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("completed")}</CardTitle>
					<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{completedBookings}</div>
					<p className="text-xs text-muted-foreground">{t("completedDesc")}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t("cancelled")}</CardTitle>
					<XCircle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{cancelledBookings}</div>
					<p className="text-xs text-muted-foreground">{t("cancelledDesc")}</p>
				</CardContent>
			</Card>
		</div>
	)
}
