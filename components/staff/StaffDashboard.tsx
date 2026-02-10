"use client"

import { useState } from "react"
import { BarChart3, CalendarDays, Clock, ClipboardList } from "lucide-react"
import LayoutAdmin from "@/components/layout/admin"
import { SelfAttendance } from "./SelfAttendance"
import { StaffAnalytics } from "./StaffAnalytics"
import { BookingCalendar } from "@/components/bookings/BookingCalendar"
import { BookingsManagement } from "@/components/admin/BookingsManagement"

const SIDEBAR_NAV = [
	{
		key: "overview",
		icon: <BarChart3 className="w-4 h-4" />,
		label: "Tổng Quan",
	},
	{
		key: "bookings",
		icon: <ClipboardList className="w-4 h-4" />,
		label: "Đặt Lịch",
	},
	{
		key: "calendar",
		icon: <CalendarDays className="w-4 h-4" />,
		label: "Lịch",
	},
	{
		key: "attendance",
		icon: <Clock className="w-4 h-4" />,
		label: "Chấm Công",
	},
]

export function StaffDashboard() {
	const [activeTab, setActiveTab] = useState<string>("overview")

	const renderContent = () => {
		switch (activeTab) {
			case "overview":
				return <StaffAnalytics />
			case "bookings":
				return <BookingsManagement />
			case "calendar":
				return <BookingCalendar userId={null} />
			case "attendance":
				return <SelfAttendance />
			default:
				return <StaffAnalytics />
		}
	}

	return (
		<LayoutAdmin>
			<div className="flex h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
				{/* Sidebar */}
				<aside className="w-64 flex-shrink-0">
					<div className="sticky top-8 space-y-1">
						<h2 className="text-lg font-semibold mb-4">Dashboard Nhân Viên</h2>
						{SIDEBAR_NAV.map((item) => (
							<button
								key={item.key}
								onClick={() => setActiveTab(item.key)}
								className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
									activeTab === item.key
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`}
							>
								{item.icon}
								<span>{item.label}</span>
							</button>
						))}
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 min-w-0">
					{renderContent()}
				</main>
			</div>
		</LayoutAdmin>
	)
}
