"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBookings, useBookingStats } from "@/lib/swr"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { Calendar, DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react"

const COLORS = {
	primary: "#6366f1",
	secondary: "#8b5cf6",
	success: "#10b981",
	warning: "#f59e0b",
	danger: "#ef4444",
	info: "#3b82f6",
}

import { useTranslations, useLocale } from "next-intl"

export function ComprehensiveAnalytics() {
	const { data: response } = useBookings({ limit: 1000 })
	const { data: stats } = useBookingStats()
	const t = useTranslations("Admin.analytics")
	const tStats = useTranslations("Admin.stats")
	const locale = useLocale()

	const bookings = response?.bookings || []

	// Revenue Trend (Last 12 months)
	const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
		const date = new Date()
		date.setMonth(date.getMonth() - (11 - i))
		const monthName = date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short" })
		const year = date.getFullYear()

		const monthBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear() &&
				(b.status === "COMPLETED" || b.status === "CONFIRMED")
			)
		}) || []

		const revenue = monthBookings.reduce((sum, b) => sum + b.service.price, 0)
		const count = monthBookings.length

		return {
			month: `${monthName} ${year}`,
			revenue,
			bookings: count,
		}
	})

	// Booking Status Distribution
	const statusData = [
		{ name: tStats("completed"), value: stats?.completed || 0, color: COLORS.success },
		{ name: tStats("confirmed"), value: stats?.confirmed || 0, color: COLORS.info },
		{ name: tStats("pending"), value: stats?.pending || 0, color: COLORS.warning },
		{ name: tStats("cancelled"), value: stats?.cancelled || 0, color: COLORS.danger },
	]

	// Service Performance (Top 10)
	const servicePerformance = bookings?.reduce(
		(acc, booking) => {
			const serviceName = booking.service.name
			if (!acc[serviceName]) {
				acc[serviceName] = { name: serviceName, bookings: 0, revenue: 0 }
			}
			acc[serviceName].bookings++
			if (booking.status === "COMPLETED" || booking.status === "CONFIRMED") {
				acc[serviceName].revenue += booking.service.price
			}
			return acc
		},
		{} as Record<string, { name: string; bookings: number; revenue: number }>,
	)

	const topServices = Object.values(servicePerformance)
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 10)

	// Daily Booking Trend (Last 30 days)
	const dailyBookings = Array.from({ length: 30 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - (29 - i))
		const dayName = date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { weekday: "short" })
		const day = date.getDate()

		const dayBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getDate() === date.getDate() &&
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear()
			)
		}) || []

		return {
			day: `${dayName} ${day}`,
			bookings: dayBookings.length,
		}
	})

	// Customer Growth (Last 6 months)
	const customerGrowth = Array.from({ length: 6 }, (_, i) => {
		const date = new Date()
		date.setMonth(date.getMonth() - (5 - i))
		const monthName = date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short" })

		const monthBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear()
			)
		}) || []

		const uniqueCustomers = new Set(monthBookings.map((b) => b.userId)).size

		return {
			month: monthName,
			customers: uniqueCustomers,
		}
	})

	// Calculate KPIs
	const totalRevenue = stats?.totalRevenue || 0
	const avgBookingValue = stats?.total && stats?.total > 0 ? totalRevenue / stats.total : 0
	const completionRate =
		stats?.total && stats?.total > 0 ? ((stats?.completed || 0) / stats.total) * 100 : 0
	const cancellationRate =
		stats?.total && stats?.total > 0 ? ((stats?.cancelled || 0) / stats.total) * 100 : 0

	// Revenue Growth (Month over Month)
	const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
	const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0
	const revenueGrowth =
		previousMonthRevenue > 0
			? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
			: 0

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("kpi.totalRevenue")}</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
						<div className="flex items-center gap-1 text-xs mt-1">
							{revenueGrowth >= 0 ? (
								<TrendingUp className="h-3 w-3 text-green-600" />
							) : (
								<TrendingDown className="h-3 w-3 text-red-600" />
							)}
							<span className={revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
								{t("kpi.growth", { percent: Math.abs(revenueGrowth).toFixed(1) })}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("kpi.avgBooking")}</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${avgBookingValue.toFixed(0)}</div>
						<p className="text-xs text-muted-foreground mt-1">{t("kpi.perBooking")}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("kpi.completionRate")}</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
						<div className="mt-2">
							<Progress value={completionRate} className="h-2" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("kpi.cancellationRate")}</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{cancellationRate.toFixed(1)}%</div>
						<div className="mt-2">
							<Progress value={cancellationRate} className="h-2" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 1 */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Revenue Trend Line Chart */}
				<Card>
					<CardHeader>
						<CardTitle>{t("charts.revenueTrend")}</CardTitle>
						<CardDescription>{t("charts.revenueTrendDesc")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={monthlyRevenue}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12, fill: "#64748b" }}
										angle={-45}
										textAnchor="end"
										height={80}
									/>
									<YAxis
										tick={{ fontSize: 12, fill: "#64748b" }}
										tickFormatter={(value) => `$${value / 1000}k`}
									/>
									<Tooltip
										formatter={(value: number) => `$${value.toLocaleString()}`}
										contentStyle={{
											background: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Legend />
									<Line
										type="monotone"
										dataKey="revenue"
										stroke={COLORS.primary}
										strokeWidth={2}
										name={t("kpi.totalRevenue")}
										dot={{ fill: COLORS.primary, r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Booking Status Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>{t("charts.statusDistribution")}</CardTitle>
						<CardDescription>{t("charts.statusDistributionDesc")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={statusData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{statusData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 2 */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Service Performance */}
				<Card>
					<CardHeader>
						<CardTitle>{t("charts.topServices")}</CardTitle>
						<CardDescription>{t("charts.topServicesDesc")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={topServices} layout="vertical">
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
									<YAxis
										dataKey="name"
										type="category"
										tick={{ fontSize: 11, fill: "#64748b" }}
										width={120}
									/>
									<Tooltip
										formatter={(value: number) => `$${value.toLocaleString()}`}
										contentStyle={{
											background: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Bar dataKey="revenue" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Daily Booking Trend */}
				<Card>
					<CardHeader>
						<CardTitle>{t("charts.dailyTrend")}</CardTitle>
						<CardDescription>{t("charts.dailyTrendDesc")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={dailyBookings}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis
										dataKey="day"
										tick={{ fontSize: 10, fill: "#64748b" }}
										angle={-45}
										textAnchor="end"
										height={80}
									/>
									<YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
									<Tooltip
										contentStyle={{
											background: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Line
										type="monotone"
										dataKey="bookings"
										stroke={COLORS.secondary}
										strokeWidth={2}
										dot={{ fill: COLORS.secondary, r: 3 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Customer Growth */}
			<Card>
				<CardHeader>
					<CardTitle>{t("charts.customerGrowth")}</CardTitle>
					<CardDescription>{t("charts.customerGrowthDesc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="w-full h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={customerGrowth}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
								<YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
								<Tooltip
									contentStyle={{
										background: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Bar dataKey="customers" fill={COLORS.success} radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

