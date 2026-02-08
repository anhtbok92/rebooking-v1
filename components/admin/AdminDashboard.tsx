"use client"

import currentUserClient from "@/lib/currentUserClient"
import { BarChart3, Calendar, Settings, Star, Ticket, TrendingUp, UserPlus, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import LayoutAdmin from "../layout/admin"

import { BookingsManagement } from "./BookingsManagement"
import { ComprehensiveAnalytics } from "./ComprehensiveAnalytics"
import { CustomerAnalytics } from "./CustomerAnalytics"
import { CustomersManagement } from "./CustomersManagement"
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

const SIDEBAR_NAV = [
	{
		key: "overview",
		icon: <TrendingUp className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "analytics",
		icon: <BarChart3 className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "customers",
		icon: <Users className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "bookings",
		icon: <BarChart3 className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "calendar",
		icon: <Calendar className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "services",
		icon: <Settings className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "discounts",
		icon: <Ticket className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "ratings",
		icon: <Star className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "referrals",
		icon: <UserPlus className="w-4 h-4" />,
		forSuperAdmin: false,
	},
	{
		key: "staff",
		icon: <Users className="w-4 h-4" />,
		forSuperAdmin: true,
	},
	{
		key: "users",
		icon: <Users className="w-4 h-4" />,
		forSuperAdmin: true,
	},
]

export function AdminDashboard() {
	const t = useTranslations("Admin.sidebar")
	const currentUser = currentUserClient()
	const { isSuperAdmin } = currentUser || {}
	const [activeTab, setActiveTab] = useState<string>("overview")
	
	const navItems = SIDEBAR_NAV.filter(
		(item) => !item.forSuperAdmin || isSuperAdmin
	)

	return (
		<LayoutAdmin>
			<div className="flex h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
				{/* Sidebar */}
				<aside className="flex flex-col w-64 min-h-[32rem] rounded-xl  bg-card overflow-hidden">
					<nav className="flex-1 py-4 px-2 space-y-1">
						{navItems.map((item) => (
							<button
								key={item.key}
								className={[
									"flex items-center w-full gap-3 px-3 py-2 text-left rounded-lg transition",
									activeTab === item.key
										? "bg-primary/10 text-primary font-semibold"
										: "hover:bg-muted",
									"focus:outline-none focus:ring-2 focus:ring-primary/20"
								].join(" ")}
								onClick={() => setActiveTab(item.key)}
							>
								<span className="shrink-0">{item.icon}</span>
								<span className="truncate">{t(item.key)}</span>
							</button>
						))}
					</nav>
				</aside>
				{/* Content */}
				<main className="flex-1 space-y-5 overflow-hidden">
					{activeTab === "overview" && (
						<>
							<StatsOverview />
							<CustomerAnalytics />
							<div className="grid gap-6 lg:grid-cols-3">
								<RevenueChart />
								<PopularServices />
							</div>
							<RecentActivity />
						</>
					)}
					{activeTab === "analytics" && <ComprehensiveAnalytics />}
					{activeTab === "customers" && <CustomersManagement />}
					{activeTab === "bookings" && <BookingsManagement />}
					{activeTab === "calendar" && <BookingCalendar />}
					{activeTab === "services" && <ServicesManagement />}
					{activeTab === "discounts" && <DiscountManagement />}
					{activeTab === "ratings" && <RatingsManagement />}
					{activeTab === "referrals" && <ReferralManagement />}
					{isSuperAdmin && activeTab === "staff" && <StaffManagement />}
					{isSuperAdmin && activeTab === "users" && <UserManagement />}
				</main>
			</div>
		</LayoutAdmin>
	)
}
