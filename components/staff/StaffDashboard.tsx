"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBookings, useBookingStats } from "@/lib/swr"
import { AlertCircle, BarChart3, Calendar, CheckCircle2, Clock, DollarSign } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { BookingsManagement } from "../admin/BookingsManagement"
import { BookingCalendar } from "@/components/bookings/BookingCalendar"
import LayoutAdmin from "../layout/admin"
import { StaffAnalytics } from "./StaffAnalytics"
import { useTranslations } from "next-intl"

export function StaffDashboard() {
	const t = useTranslations("Staff.dashboard")
	const { data: session } = useSession()
	const { data: stats } = useBookingStats()
	const { data: response } = useBookings({ limit: 1000 })

	const bookings = response?.bookings || []
	const [activeTab, setActiveTab] = useState("today")

	const todayBookings =
		bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return bookingDate.toDateString() === new Date().toDateString()
		}) || []

	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") || []
	const totalRevenue = bookings?.reduce((sum, b) => sum + b.service.price, 0) || 0

	return (
		<LayoutAdmin>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">{t("title")}</h1>
					<p className="text-muted-foreground">{t("desc")}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t("todayBookings")}</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats?.today || todayBookings.length}</div>
							<p className="text-xs text-muted-foreground">{t("todayDesc")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t("completed")}</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats?.completed || completedBookings.length}</div>
							<p className="text-xs text-muted-foreground">{t("completedDesc")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t("pending")}</CardTitle>
							<AlertCircle className="h-4 w-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats?.pending || 0}</div>
							<p className="text-xs text-muted-foreground">{t("pendingDesc")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t("revenue")}</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground">{t("revenueDesc")}</p>
						</CardContent>
					</Card>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="analytics">{t("tabs.analytics")}</TabsTrigger>
						<TabsTrigger value="calendar">{t("tabs.calendar")}</TabsTrigger>
						<TabsTrigger value="today">{t("tabs.today")}</TabsTrigger>
						<TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
					</TabsList>

					<TabsContent value="analytics" className="space-y-6">
						<StaffAnalytics />
					</TabsContent>

					<TabsContent value="calendar" className="space-y-6">
						<BookingCalendar />
					</TabsContent>

					<TabsContent value="today" className="space-y-6">
						<BookingsManagement filterByToday={true} />
					</TabsContent>

					<TabsContent value="all" className="space-y-6">
						<BookingsManagement />
					</TabsContent>
				</Tabs>
			</div>
		</LayoutAdmin>
	)
}
