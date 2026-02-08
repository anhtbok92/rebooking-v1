"use client"

import { BarChart3, Calendar, Clock, Newspaper, Settings, Shield, Star, Ticket, TrendingUp, UserPlus, Users } from "lucide-react"
import { useState } from "react"
import LayoutAdmin from "../layout/admin"

import { BookingsManagement } from "./BookingsManagement"
import { ComprehensiveAnalytics } from "./ComprehensiveAnalytics"
import { DiscountManagement } from "./DiscountManagement"
import { PopularServices } from "./PopularServices"
import { RatingsManagement } from "./RatingsManagement"
import { RecentActivity } from "./RecentActivity"
import { ReferralManagement } from "./ReferralManagement"
import { BookingCalendar } from "@/components/bookings/BookingCalendar"
import { RevenueChart } from "./RevenueChart"
import { ServicesManagement } from "./ServicesManagement"
import { StaffManagement } from "./StaffManagement"
import { StatsOverview } from "./StatsOverview"
import { UserManagement } from "./UserManagement"
import { TimeSlotManagement } from "./TimeSlotManagement"
import { SettingsManagement } from "./SettingsManagement"
import { NewsManagement } from "./NewsManagement"

const SIDEBAR_TABS = [
	{
		key: "overview",
		label: "Overview",
		icon: TrendingUp,
	},
	{
		key: "users",
		label: "Users",
		icon: Users,
	},
	{
		key: "staff",
		label: "Staff",
		icon: Shield,
	},
	{
		key: "bookings",
		label: "Bookings",
		icon: BarChart3,
	},
	{
		key: "calendar",
		label: "Calendar",
		icon: Calendar,
	},
	{
		key: "timeSlots",
		label: "Time Slots",
		icon: Clock,
	},
	{
		key: "services",
		label: "Services",
		icon: Settings,
	},
	{
		key: "discounts",
		label: "Discounts",
		icon: Ticket,
	},
	{
		key: "ratings",
		label: "Ratings",
		icon: Star,
	},
	{
		key: "referrals",
		label: "Referrals",
		icon: UserPlus,
	},
	{
		key: "news",
		label: "News",
		icon: Newspaper,
	},
	{
		key: "analytics",
		label: "Analytics",
		icon: TrendingUp,
	},
	{
		key: "settings",
		label: "Settings",
		icon: Settings,
	},
]

import { useTranslations } from "next-intl"

export function SuperAdminDashboard() {
	const t = useTranslations("Admin.sidebar")
	const [activeTab, setActiveTab] = useState<string>("overview")

	return (
		<LayoutAdmin>
			<div className="flex h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
				{/* Sidebar */}
				<aside className="flex flex-col w-64 bg-card rounded-xl border py-6 pr-2 relative z-10 min-h-[600px]">

					<nav className="flex-1 flex flex-col gap-1 px-4">
						{SIDEBAR_TABS.map(({ key, icon: Icon }) => (
							<button
								key={key}
								onClick={() => setActiveTab(key)}
								className={`group flex items-center gap-3 w-full px-4 py-2 my-1 rounded-lg font-medium transition-colors
									${activeTab === key
										? "bg-primary/90 text-primary-foreground"
										: "hover:bg-muted/80 hover:text-primary text-muted-foreground"
									}`}
								style={{
									fontFamily: "var(--font-dm-sans)",
								}}
								aria-current={activeTab === key ? "page" : undefined}
							>
								<span
									className={`mr-2 flex items-center justify-center rounded-full p-1
										${activeTab === key
											? "bg-primary/70 text-primary-foreground"
											: "bg-muted group-hover:bg-primary/10 text-primary"
										}
									`}
								>
									<Icon className="w-5 h-5" />
								</span>
								{t(key)}
								{activeTab === key && (
									<span
										className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80"
										aria-hidden
									></span>
								)}
							</button>
						))}
					</nav>
				</aside>

				{/* Content */}
				<div className="flex-1 space-y-5 overflow-hidden">
					{activeTab === "overview" && (
						<>
							<StatsOverview />
							<div className="grid gap-6 lg:grid-cols-3">
								<RevenueChart />
								<PopularServices />
							</div>
							<RecentActivity />
						</>
					)}

					{activeTab === "users" && <UserManagement />}
					{activeTab === "staff" && <StaffManagement />}
					{activeTab === "bookings" && <BookingsManagement />}
					{activeTab === "calendar" && <BookingCalendar />}
					{activeTab === "timeSlots" && <TimeSlotManagement />}
					{activeTab === "services" && <ServicesManagement />}
					{activeTab === "discounts" && <DiscountManagement />}
					{activeTab === "ratings" && <RatingsManagement />}
					{activeTab === "referrals" && <ReferralManagement />}
					{activeTab === "news" && <NewsManagement />}
					{activeTab === "analytics" && <ComprehensiveAnalytics />}
					{activeTab === "settings" && <SettingsManagement />}
				</div>
			</div>
		</LayoutAdmin>
	)
}
