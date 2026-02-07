"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBookings, useBookingStats } from "@/lib/swr"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { Calendar, CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react"

const COLORS = {
	primary: "#6366f1",
	success: "#10b981",
	warning: "#f59e0b",
}

export function StaffAnalytics() {
	const { data: response } = useBookings({ limit: 1000 })
	const { data: stats } = useBookingStats()

	const bookings = response?.bookings || []

	// Today's bookings
	const today = new Date()
	const todayBookings = bookings?.filter((b) => {
		const bookingDate = new Date(b.date)
		return bookingDate.toDateString() === today.toDateString()
	}) || []

	// This week's bookings
	const weekStart = new Date(today)
	weekStart.setDate(today.getDate() - today.getDay())
	const weekEnd = new Date(weekStart)
	weekEnd.setDate(weekStart.getDate() + 6)

	const weekBookings = bookings?.filter((b) => {
		const bookingDate = new Date(b.date)
		return bookingDate >= weekStart && bookingDate <= weekEnd
	}) || []

	// This month's bookings
	const monthBookings = bookings?.filter((b) => {
		const bookingDate = new Date(b.date)
		return (
			bookingDate.getMonth() === today.getMonth() &&
			bookingDate.getFullYear() === today.getFullYear()
		)
	}) || []

	// Completed bookings
	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") || []
	const todayCompleted = todayBookings.filter((b) => b.status === "COMPLETED").length
	const weekCompleted = weekBookings.filter((b) => b.status === "COMPLETED").length
	const monthCompleted = monthBookings.filter((b) => b.status === "COMPLETED").length

	// Revenue calculations
	const todayRevenue = todayBookings
		.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
		.reduce((sum, b) => sum + b.service.price, 0)
	const weekRevenue = weekBookings
		.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
		.reduce((sum, b) => sum + b.service.price, 0)
	const monthRevenue = monthBookings
		.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
		.reduce((sum, b) => sum + b.service.price, 0)

	// Completion rates
	const todayCompletionRate =
		todayBookings.length > 0 ? (todayCompleted / todayBookings.length) * 100 : 0
	const weekCompletionRate = weekBookings.length > 0 ? (weekCompleted / weekBookings.length) * 100 : 0
	const monthCompletionRate =
		monthBookings.length > 0 ? (monthCompleted / monthBookings.length) * 100 : 0

	// Weekly performance (last 4 weeks)
	const weeklyPerformance = Array.from({ length: 4 }, (_, i) => {
		const weekStartDate = new Date(today)
		weekStartDate.setDate(today.getDate() - (today.getDay() + 7 * (3 - i)))
		const weekEndDate = new Date(weekStartDate)
		weekEndDate.setDate(weekStartDate.getDate() + 6)

		const weekBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return bookingDate >= weekStartDate && bookingDate <= weekEndDate
		}) || []

		const completed = weekBookings.filter((b) => b.status === "COMPLETED").length
		const revenue = weekBookings
			.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
			.reduce((sum, b) => sum + b.service.price, 0)

		return {
			week: `Week ${4 - i}`,
			bookings: weekBookings.length,
			completed,
			revenue,
		}
	})

	// Daily performance (last 7 days)
	const dailyPerformance = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(today)
		date.setDate(today.getDate() - (6 - i))
		const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

		const dayBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getDate() === date.getDate() &&
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear()
			)
		}) || []

		const completed = dayBookings.filter((b) => b.status === "COMPLETED").length

		return {
			day: dayName,
			bookings: dayBookings.length,
			completed,
		}
	})

	// Service breakdown
	const serviceBreakdown = bookings?.reduce(
		(acc, booking) => {
			const serviceName = booking.service.name
			if (!acc[serviceName]) {
				acc[serviceName] = { name: serviceName, count: 0 }
			}
			acc[serviceName].count++
			return acc
		},
		{} as Record<string, { name: string; count: number }>,
	)

	const topServices = Object.values(serviceBreakdown)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5)

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{todayBookings.length}</div>
						<div className="mt-2">
							<Progress value={todayCompletionRate} className="h-2" />
							<p className="text-xs text-muted-foreground mt-1">
								{todayCompleted} completed ({todayCompletionRate.toFixed(0)}%)
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">This Week</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{weekBookings.length}</div>
						<div className="mt-2">
							<Progress value={weekCompletionRate} className="h-2" />
							<p className="text-xs text-muted-foreground mt-1">
								{weekCompleted} completed ({weekCompletionRate.toFixed(0)}%)
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">This Month</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{monthBookings.length}</div>
						<div className="mt-2">
							<Progress value={monthCompletionRate} className="h-2" />
							<p className="text-xs text-muted-foreground mt-1">
								{monthCompleted} completed ({monthCompletionRate.toFixed(0)}%)
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Month Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${monthRevenue.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground mt-1">From completed bookings</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Weekly Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Weekly Performance</CardTitle>
						<CardDescription>Last 4 weeks overview</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={weeklyPerformance}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} />
									<YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
									<Tooltip
										contentStyle={{
											background: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Bar dataKey="bookings" fill={COLORS.primary} name="Total Bookings" radius={[4, 4, 0, 0]} />
									<Bar dataKey="completed" fill={COLORS.success} name="Completed" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Daily Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Daily Performance</CardTitle>
						<CardDescription>Last 7 days</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={dailyPerformance}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
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
										stroke={COLORS.primary}
										strokeWidth={2}
										name="Total Bookings"
										dot={{ fill: COLORS.primary, r: 4 }}
									/>
									<Line
										type="monotone"
										dataKey="completed"
										stroke={COLORS.success}
										strokeWidth={2}
										name="Completed"
										dot={{ fill: COLORS.success, r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Top Services */}
			<Card>
				<CardHeader>
					<CardTitle>Top Services Handled</CardTitle>
					<CardDescription>Most frequently booked services</CardDescription>
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
									contentStyle={{
										background: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Bar dataKey="count" fill={COLORS.warning} radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

