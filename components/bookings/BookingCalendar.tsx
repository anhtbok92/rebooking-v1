"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookingDetailsDialog } from "./BookingDetailsDialog"
import { useSession } from "next-auth/react"

interface Booking {
	id: string
	service: {
		id: string
		name: string
		price: number
	}
	userName: string
	phone: string
	email?: string | null
	date: string
	time: string
	status: string
	paymentMethod: string
	user?: {
		id: string
		name: string | null
		email: string
		phone: string | null
	} | null
	photos?: Array<{ url: string }>
	createdAt?: string
}

interface BookingCalendarProps {
	userId?: string | null
}

import { useTranslations, useLocale } from "next-intl"

export function BookingCalendar({ userId }: BookingCalendarProps) {
	const { data: session } = useSession()
	const t = useTranslations("Admin.calendar")
	const tStats = useTranslations("Admin.stats")
	const locale = useLocale()
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [bookings, setBookings] = useState<Booking[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow">("all")
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)

	const today = new Date()
	const todayYear = today.getFullYear()
	const todayMonth = today.getMonth() + 1
	const todayDay = today.getDate()

	const monthNames = [
		t("months.0"), t("months.1"), t("months.2"), t("months.3"),
		t("months.4"), t("months.5"), t("months.6"), t("months.7"),
		t("months.8"), t("months.9"), t("months.10"), t("months.11")
	]

	const weekDays = [
		t("weekdays.0"), t("weekdays.1"), t("weekdays.2"), t("weekdays.3"),
		t("weekdays.4"), t("weekdays.5"), t("weekdays.6")
	]

	const [timeSlots, setTimeSlots] = useState<string[]>([])

	useEffect(() => {
		const fetchTimeSlots = async () => {
			try {
				const res = await fetch("/api/v1/time-slots")
				if (res.ok) {
					const data = await res.json()
					// data is array of { time: string, available: boolean } or similar from public API?
					// Let's check public API response structure.
					// Step 246 shows /api/v1/time-slots returns array of { time: string, available: boolean }? 
					// NO, Step 246 shows creating /api/v1/time-slots. Let's check content.
					// View file /app/api/v1/time-slots/route.ts in step 246 showed:
					// const slots = await prisma.timeSlot.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })
					// return NextResponse.json(slots)
					// So it returns TimeSlot objects: { id, time, isActive, order }.
					if (Array.isArray(data)) {
						setTimeSlots(data.map((slot: any) => slot.time))
					}
				}
			} catch (error) {
				console.error("Failed to fetch time slots:", error)
			}
		}
		fetchTimeSlots()
	}, [])

	const generateCalendarDays = (month: number, year: number) => {
		const days: (number | null)[] = []
		const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
		const daysInMonth = new Date(year, month, 0).getDate()
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(null)
		}
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(day)
		}
		return days
	}

	const calendarDays = generateCalendarDays(currentMonth, currentYear)

	const fetchBookings = async () => {
		setIsLoading(true)
		try {
			// Fetch all bookings (without startDate/endDate to get full details)
			let url = `/api/v1/bookings?limit=1000`
			if (userId) {
				url += `&userId=${userId}`
			}

			const response = await fetch(url)
			if (response.ok) {
				const data = await response.json()
				let fetchedBookings = data.bookings || []

				// Filter by current month
				const startDate = new Date(currentYear, currentMonth - 1, 1)
				startDate.setHours(0, 0, 0, 0)
				const endDate = new Date(currentYear, currentMonth, 0) // Last day of month
				endDate.setHours(23, 59, 59, 999)
				fetchedBookings = fetchedBookings.filter((b: Booking) => {
					const bookingDate = new Date(b.date)
					bookingDate.setHours(0, 0, 0, 0)
					return bookingDate >= startDate && bookingDate <= endDate
				})

				// Apply date filter
				if (dateFilter === "today") {
					const todayStr = `${todayYear}-${todayMonth.toString().padStart(2, "0")}-${todayDay.toString().padStart(2, "0")}`
					fetchedBookings = fetchedBookings.filter((b: Booking) => {
						const bookingDate = new Date(b.date).toISOString().split("T")[0]
						return bookingDate === todayStr
					})
				} else if (dateFilter === "tomorrow") {
					const tomorrow = new Date(today)
					tomorrow.setDate(tomorrow.getDate() + 1)
					const tomorrowStr = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}-${tomorrow.getDate().toString().padStart(2, "0")}`
					fetchedBookings = fetchedBookings.filter((b: Booking) => {
						const bookingDate = new Date(b.date).toISOString().split("T")[0]
						return bookingDate === tomorrowStr
					})
				}

				setBookings(fetchedBookings)
			}
		} catch (error) {
			console.error("Failed to fetch bookings:", error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchBookings()
	}, [currentMonth, currentYear, dateFilter, userId])

	const getBookingsForDay = (day: number) => {
		const dayDate = new Date(currentYear, currentMonth - 1, day)
		const dayStr = dayDate.toISOString().split("T")[0]
		return bookings.filter((booking) => {
			const bookingDate = new Date(booking.date).toISOString().split("T")[0]
			return bookingDate === dayStr
		})
	}

	const getBookingForTimeSlot = (day: number, timeSlot: string) => {
		const dayBookings = getBookingsForDay(day)
		return dayBookings.find((booking) => booking.time === timeSlot)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "CONFIRMED":
				return "bg-green-600"
			case "COMPLETED":
				return "bg-blue-600"
			case "PENDING":
				return "bg-amber-600"
			case "CANCELLED":
				return "bg-red-600"
			default:
				return "bg-gray-600"
		}
	}

	const handlePreviousMonth = () => {
		if (currentMonth === 1) {
			setCurrentMonth(12)
			setCurrentYear(currentYear - 1)
		} else {
			setCurrentMonth(currentMonth - 1)
		}
	}

	const handleNextMonth = () => {
		if (currentMonth === 12) {
			setCurrentMonth(1)
			setCurrentYear(currentYear + 1)
		} else {
			setCurrentMonth(currentMonth + 1)
		}
	}

	const handleBookingClick = (booking: Booking) => {
		setSelectedBooking(booking)
		setIsDetailsOpen(true)
	}

	return (
		<div className="space-y-4">
			{/* Legend - Status Guide */}
			<div className="bg-card rounded-lg p-4 border border-border">
				<h3 className="text-sm font-semibold mb-3 text-card-foreground">Chú thích trạng thái</h3>
				<div className="flex flex-wrap gap-4">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-green-600"></div>
						<span className="text-sm text-muted-foreground">{tStats("confirmed")}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-blue-600"></div>
						<span className="text-sm text-muted-foreground">{tStats("completed")}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-amber-600"></div>
						<span className="text-sm text-muted-foreground">{tStats("pending")}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-red-600"></div>
						<span className="text-sm text-muted-foreground">{tStats("cancelled")}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded border-2 border-dashed border-slate-500 bg-slate-50 dark:bg-slate-900"></div>
						<span className="text-sm text-muted-foreground">Trống</span>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex items-center gap-4">
					<Select value={dateFilter} onValueChange={(value: "all" | "today" | "tomorrow") => setDateFilter(value)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("filterLabel")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t("filterAll")}</SelectItem>
							<SelectItem value="today">{t("filterToday")}</SelectItem>
							<SelectItem value="tomorrow">{t("filterTomorrow")}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Calendar */}
			<div className="bg-card rounded-lg p-6 border border-border">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						{monthNames[currentMonth - 1]} {currentYear}
					</h2>
					<div className="flex gap-1">
						<Button variant="ghost" size="sm" onClick={handlePreviousMonth} aria-label="Previous month">
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={handleNextMonth} aria-label="Next month">
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t("loading")}</div>
				) : (
					<>
						<div className="grid grid-cols-7 gap-1 mb-2">
							{weekDays.map((day) => (
								<div
									key={day}
									className="text-center text-xs font-medium text-muted-foreground py-1"
									style={{ fontFamily: "var(--font-dm-sans)" }}
								>
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7 gap-2">
							{calendarDays.map((day, index) => {
								if (day === null) {
									return <div key={`empty-${index}`} className="min-h-[360px]" />
								}

								const isToday = day === todayDay && currentMonth === todayMonth && currentYear === todayYear

								return (
									<div
										key={day}
										className={`min-h-[360px] rounded-lg border-2 p-2 flex flex-col ${isToday ? "border-primary bg-primary/5" : "border-border"
											}`}
									>
										<div
											className={`text-sm font-semibold mb-2 ${isToday ? "text-primary font-bold" : "text-card-foreground"}`}
											style={{ fontFamily: "var(--font-dm-sans)" }}
										>
											{day}
										</div>
										<div className="flex-1 space-y-1">
											{timeSlots.map((timeSlot) => {
												const booking = getBookingForTimeSlot(day, timeSlot)

												if (booking) {
													const statusColor = getStatusColor(booking.status)
													const statusBgColor =
														booking.status === "CONFIRMED"
															? "bg-green-100 dark:bg-green-950/30"
															: booking.status === "COMPLETED"
																? "bg-blue-100 dark:bg-blue-950/30"
																: booking.status === "PENDING"
																	? "bg-amber-100 dark:bg-amber-950/30"
																	: "bg-red-100 dark:bg-red-950/30"
													const statusTextColor =
														booking.status === "CONFIRMED"
															? "text-green-800 dark:text-green-300"
															: booking.status === "COMPLETED"
																? "text-blue-800 dark:text-blue-300"
																: booking.status === "PENDING"
																	? "text-amber-800 dark:text-amber-300"
																	: "text-red-800 dark:text-red-300"
													const statusBorderColor =
														booking.status === "CONFIRMED"
															? "#16a34a"
															: booking.status === "COMPLETED"
																? "#2563eb"
																: booking.status === "PENDING"
																	? "#d97706"
																	: "#dc2626"

													let displayStatus = booking.status
													if (booking.status === "PENDING") displayStatus = tStats("pending")
													else if (booking.status === "CONFIRMED") displayStatus = tStats("confirmed")
													else if (booking.status === "COMPLETED") displayStatus = tStats("completed")
													else if (booking.status === "CANCELLED") displayStatus = tStats("cancelled")

													return (
														<button
															key={`${day}-${timeSlot}`}
															onClick={() => handleBookingClick(booking)}
															className={`w-full text-left p-2 rounded-md text-xs cursor-pointer border-l-4 ${statusBgColor} border hover:shadow-md transition-shadow`}
															style={{
																borderLeftColor: statusBorderColor,
																borderColor: statusBorderColor + "40"
															}}
															title={t("viewDetails")}
														>
															<div className="font-bold text-[11px] mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: statusBorderColor }}>
																{booking.time}
															</div>
															<div className={`font-semibold text-[11px] mb-0.5 truncate ${statusTextColor}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
																{booking.service.name}
															</div>
															<div className="text-[10px] truncate text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
																{booking.userName}
															</div>
															<div className="text-[9px] mt-0.5 font-bold" style={{ fontFamily: "var(--font-dm-sans)", color: statusBorderColor }}>
																{displayStatus}
															</div>
														</button>
													)
												} else {
													return (
														<div
															key={`${day}-${timeSlot}`}
															className="w-full p-2 rounded-md text-xs border-2 border-dashed border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
														>
															<div className="font-medium text-[11px] text-slate-700 dark:text-slate-300" style={{ fontFamily: "var(--font-space-grotesk)" }}>
																{timeSlot}
															</div>
															<div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-0.5 flex items-center gap-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
																<span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
																Trống
															</div>
														</div>
													)
												}
											})}
										</div>
									</div>
								)
							})}
						</div>
					</>
				)}
			</div>

			{/* Booking Details Dialog */}
			{selectedBooking && (
				<BookingDetailsDialog
					booking={selectedBooking}
					open={isDetailsOpen}
					onOpenChange={setIsDetailsOpen}
					userRole={(session?.user as any)?.role}
				/>
			)}
		</div>
	)
}

