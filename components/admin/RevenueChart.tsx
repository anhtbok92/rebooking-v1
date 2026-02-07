"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useBookings } from "@/lib/swr";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Label,
} from "recharts";

import { useTranslations, useLocale } from "next-intl";

export function RevenueChart() {
	const t = useTranslations("Admin.charts");
	const locale = useLocale();
	const { data: response } = useBookings({ limit: 1000 });

	const bookings = response?.bookings || [];

	// Get last 6 months of data with Full Year Month (e.g. "June 2024")
	const monthlyData = Array.from({ length: 6 }, (_, i) => {
		const date = new Date();
		date.setMonth(date.getMonth() - (5 - i));
		const monthNameFull = date.toLocaleDateString(locale, { month: "long" });
		const year = date.getFullYear();

		const monthBookings =
			bookings?.filter((b) => {
				const bookingDate = new Date(b.date);
				return (
					bookingDate.getMonth() === date.getMonth() &&
					bookingDate.getFullYear() === date.getFullYear() &&
					b.status !== "CANCELLED"
				);
			}) || [];

		const revenue = monthBookings.reduce((sum, b) => sum + b.service.price, 0);
		const count = monthBookings.length;

		return {
			month: `${monthNameFull} ${year}`,
			revenue,
			bookings: count,
		};
	});

	// Use shadcn default/neutral colors
	const revenueColor = "#6366f1"; // shadcn primary-600
	const bookingsColor = "#fbbf24"; // shadcn amber-400 for variety
	const gridColor = "#e5e7eb"; // shadcn gray-200

	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle>{t("revenueTitle")}</CardTitle>
				<CardDescription>
					{t("revenueDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="w-full h-[350px]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={monthlyData}
							barCategoryGap={18}
							margin={{ top: 24, right: 24, left: 10, bottom: 36 }}
						>
							<CartesianGrid
								strokeDasharray="6 4"
								stroke={gridColor}
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 14, fill: "#64748b", fontFamily: "inherit" }}
								axisLine={false}
								tickLine={false}
								padding={{ left: 8, right: 8 }}
							/>
							<YAxis
								yAxisId="left"
								tick={{ fontSize: 13, fill: "#94a3b8", fontFamily: "inherit" }}
								axisLine={false}
								tickLine={false}
								width={60}
								label={
									<Label
										value={t("revenue")}
										angle={-90}
										position="left"
										offset={-14}
										style={{
											textAnchor: "middle",
											fill: revenueColor,
											fontSize: 13,
											fontWeight: 500,
											fontFamily: "inherit",
										}}
									/>
								}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={{ fontSize: 13, fill: bookingsColor, fontFamily: "inherit" }}
								axisLine={false}
								tickLine={false}
								width={40}
								label={
									<Label
										value={t("bookings")}
										angle={90}
										position="right"
										offset={-15}
										style={{
											textAnchor: "middle",
											fill: bookingsColor,
											fontSize: 13,
											fontWeight: 500,
											fontFamily: "inherit",
										}}
									/>
								}
							/>
							<Tooltip
								contentStyle={{
									background: "#fff",
									border: `1px solid ${gridColor}`,
									borderRadius: "12px",
									boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
								}}
								labelStyle={{
									color: revenueColor,
									fontWeight: 600,
									fontFamily: "inherit",
									fontSize: "15px",
								}}
								formatter={(value, name) => {
									if (name === "revenue") {
										return [`$${Number(value).toLocaleString()}`, t("revenue")];
									}
									if (name === "bookings") {
										return [value, t("bookings")];
									}
									return value;
								}}
								cursor={{ fill: "rgba(99,102,241,0.07)" }}
							/>
							<Legend
								iconType="circle"
								align="right"
								verticalAlign="top"
								height={40}
								wrapperStyle={{
									marginBottom: 8,
									paddingRight: 12,
									fontFamily: "inherit",
									fontWeight: 500,
									fontSize: 13,
								}}
							/>
							<Bar
								yAxisId="left"
								dataKey="revenue"
								fill={revenueColor}
								name={t("revenue")}
								radius={[6, 6, 0, 0]}
								barSize={26}
							/>
							<Bar
								yAxisId="right"
								dataKey="bookings"
								fill={bookingsColor}
								name={t("bookings")}
								radius={[6, 6, 0, 0]}
								barSize={18}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
