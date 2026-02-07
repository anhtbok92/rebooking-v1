"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUserBookings } from "@/lib/swr"
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
import { Calendar, DollarSign, Heart, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"

const COLORS = {
	primary: "#6366f1",
	success: "#10b981",
	secondary: "#8b5cf6",
}

export function ClientAnalytics() {
	const { data: session } = useSession()
	const userId = (session?.user as any)?.id
	const { data: response } = useUserBookings(userId)

	const bookings = response?.bookings || []

	// Monthly spending (last 6 months)
	const monthlySpending = Array.from({ length: 6 }, (_, i) => {
		const date = new Date()
		date.setMonth(date.getMonth() - (5 - i))
		const monthName = date.toLocaleDateString("en-US", { month: "short" })

		const monthBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear() &&
				(b.status === "COMPLETED" || b.status === "CONFIRMED")
			)
		}) || []

		const spending = monthBookings.reduce((sum, b) => sum + b.service.price, 0)
		const count = monthBookings.length

		return {
			month: monthName,
			spending,
			bookings: count,
		}
	})

	// Service preferences
	const servicePreferences = bookings?.reduce(
		(acc, booking) => {
			const serviceName = booking.service.name
			if (!acc[serviceName]) {
				acc[serviceName] = { name: serviceName, count: 0, totalSpent: 0 }
			}
			acc[serviceName].count++
			if (booking.status === "COMPLETED" || booking.status === "CONFIRMED") {
				acc[serviceName].totalSpent += booking.service.price
			}
			return acc
		},
		{} as Record<string, { name: string; count: number; totalSpent: number }>,
	)

	const topServices = Object.values(servicePreferences)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5)

	// Booking frequency (last 12 months)
	const bookingFrequency = Array.from({ length: 12 }, (_, i) => {
		const date = new Date()
		date.setMonth(date.getMonth() - (11 - i))
		const monthName = date.toLocaleDateString("en-US", { month: "short" })

		const monthBookings = bookings?.filter((b) => {
			const bookingDate = new Date(b.date)
			return (
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear()
			)
		}) || []

		return {
			month: monthName,
			bookings: monthBookings.length,
		}
	})

	// Calculate stats
	const totalSpent = bookings
		?.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
		.reduce((sum, b) => sum + b.service.price, 0) || 0
	const totalBookings = bookings?.length || 0
	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED").length || 0
	const avgBookingValue = completedBookings > 0 ? totalSpent / completedBookings : 0

	// Spending trend
	const currentMonthSpending = monthlySpending[monthlySpending.length - 1]?.spending || 0
	const previousMonthSpending = monthlySpending[monthlySpending.length - 2]?.spending || 0
	const spendingChange =
		previousMonthSpending > 0
			? ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100
			: 0

	// Favorite service
	const favoriteService = topServices[0]?.name || "N/A"

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Spent</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{spendingChange >= 0 ? "+" : ""}
							{spendingChange.toFixed(1)}% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalBookings}</div>
						<p className="text-xs text-muted-foreground mt-1">{completedBookings} completed</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${avgBookingValue.toFixed(0)}</div>
						<p className="text-xs text-muted-foreground mt-1">Per booking</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Favorite Service</CardTitle>
						<Heart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold truncate">{favoriteService}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{topServices[0]?.count || 0} bookings
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Monthly Spending */}
				<Card>
					<CardHeader>
						<CardTitle>Monthly Spending</CardTitle>
						<CardDescription>Your spending over the last 6 months</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={monthlySpending}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
									<YAxis
										tick={{ fontSize: 12, fill: "#64748b" }}
										tickFormatter={(value) => `$${value}`}
									/>
									<Tooltip
										formatter={(value: number) => `$${value.toLocaleString()}`}
										contentStyle={{
											background: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Bar dataKey="spending" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Booking Frequency */}
				<Card>
					<CardHeader>
						<CardTitle>Booking Frequency</CardTitle>
						<CardDescription>Bookings per month (last 12 months)</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={bookingFrequency}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis
										dataKey="month"
										tick={{ fontSize: 11, fill: "#64748b" }}
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
										name="Bookings"
										dot={{ fill: COLORS.secondary, r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Service Preferences */}
			<Card>
				<CardHeader>
					<CardTitle>Service Preferences</CardTitle>
					<CardDescription>Your most booked services</CardDescription>
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
								<Bar dataKey="count" fill={COLORS.success} radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

