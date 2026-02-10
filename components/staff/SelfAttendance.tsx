"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Clock, CheckCircle, XCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SelfAttendance() {
	const [isCheckingIn, setIsCheckingIn] = useState(false)
	const [isCheckingOut, setIsCheckingOut] = useState(false)
	const [currentTime, setCurrentTime] = useState(new Date())

	// Fetch today's attendance status
	const { data: todayData, mutate: mutateToday } = useSWR("/api/v1/attendance/self/today", fetcher, {
		refreshInterval: 30000, // Refresh every 30 seconds
	})

	// Fetch this month's attendance
	const currentDate = new Date()
	const month = currentDate.getMonth() + 1
	const year = currentDate.getFullYear()
	const { data: monthData } = useSWR(
		`/api/v1/attendance/self?month=${month}&year=${year}`,
		fetcher
	)

	// Update current time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const handleCheckIn = async () => {
		setIsCheckingIn(true)
		try {
			const res = await fetch("/api/v1/attendance/self", {
				method: "POST",
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to check in")
			}

			toast.success("Đã chấm công vào thành công!")
			mutateToday()
		} catch (error: any) {
			toast.error(error.message || "Không thể chấm công vào")
		} finally {
			setIsCheckingIn(false)
		}
	}

	const handleCheckOut = async () => {
		setIsCheckingOut(true)
		try {
			const res = await fetch("/api/v1/attendance/self/check-out", {
				method: "POST",
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to check out")
			}

			toast.success("Đã chấm công ra thành công!")
			mutateToday()
		} catch (error: any) {
			toast.error(error.message || "Không thể chấm công ra")
		} finally {
			setIsCheckingOut(false)
		}
	}

	const hasCheckedIn = todayData?.hasCheckedIn
	const hasCheckedOut = todayData?.hasCheckedOut
	const todayAttendance = todayData?.attendance

	const attendances = monthData?.attendances || []
	const stats = {
		present: attendances.filter((a: any) => a.status === "PRESENT").length,
		absent: attendances.filter((a: any) => a.status === "ABSENT").length,
		halfDay: attendances.filter((a: any) => a.status === "HALF_DAY").length,
		leave: attendances.filter((a: any) => a.status === "LEAVE").length,
	}

	return (
		<div className="space-y-6">
			{/* Current Time & Check-in/out */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Chấm Công
					</CardTitle>
					<CardDescription>
						{format(currentDate, "EEEE, dd MMMM yyyy", { locale: vi })}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Current Time Display */}
					<div className="text-center py-6">
						<div className="text-5xl font-bold text-primary">
							{format(currentTime, "HH:mm:ss")}
						</div>
						<div className="text-sm text-muted-foreground mt-2">
							{format(currentTime, "dd/MM/yyyy")}
						</div>
					</div>

					{/* Today's Status */}
					{todayAttendance && (
						<div className="bg-accent p-4 rounded-lg space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Trạng thái hôm nay:</span>
								<Badge variant="default">Có mặt</Badge>
							</div>
							{todayAttendance.checkIn && (
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Giờ vào:</span>
									<span className="font-medium">
										{format(new Date(todayAttendance.checkIn), "HH:mm:ss")}
									</span>
								</div>
							)}
							{todayAttendance.checkOut && (
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Giờ ra:</span>
									<span className="font-medium">
										{format(new Date(todayAttendance.checkOut), "HH:mm:ss")}
									</span>
								</div>
							)}
							{todayAttendance.checkIn && todayAttendance.checkOut && (
								<div className="flex items-center justify-between text-sm pt-2 border-t">
									<span className="text-muted-foreground">Tổng giờ làm:</span>
									<span className="font-medium">
										{(() => {
											const diff = new Date(todayAttendance.checkOut).getTime() - new Date(todayAttendance.checkIn).getTime()
											const hours = Math.floor(diff / (1000 * 60 * 60))
											const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
											return `${hours}h ${minutes}m`
										})()}
									</span>
								</div>
							)}
						</div>
					)}

					{/* Check-in/out Buttons */}
					<div className="grid grid-cols-2 gap-4">
						<Button
							size="lg"
							onClick={handleCheckIn}
							disabled={hasCheckedIn || isCheckingIn}
							className="h-20"
						>
							{hasCheckedIn ? (
								<>
									<CheckCircle className="mr-2 h-5 w-5" />
									Đã Chấm Công Vào
								</>
							) : (
								<>
									<Clock className="mr-2 h-5 w-5" />
									{isCheckingIn ? "Đang xử lý..." : "Chấm Công Vào"}
								</>
							)}
						</Button>

						<Button
							size="lg"
							variant={hasCheckedOut ? "secondary" : "default"}
							onClick={handleCheckOut}
							disabled={!hasCheckedIn || hasCheckedOut || isCheckingOut}
							className="h-20"
						>
							{hasCheckedOut ? (
								<>
									<CheckCircle className="mr-2 h-5 w-5" />
									Đã Chấm Công Ra
								</>
							) : (
								<>
									<Clock className="mr-2 h-5 w-5" />
									{isCheckingOut ? "Đang xử lý..." : "Chấm Công Ra"}
								</>
							)}
						</Button>
					</div>

					{!hasCheckedIn && (
						<p className="text-sm text-muted-foreground text-center">
							Nhấn "Chấm Công Vào" khi bắt đầu làm việc
						</p>
					)}
					{hasCheckedIn && !hasCheckedOut && (
						<p className="text-sm text-muted-foreground text-center">
							Nhớ nhấn "Chấm Công Ra" khi kết thúc ca làm việc
						</p>
					)}
				</CardContent>
			</Card>

			{/* Monthly Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Có Mặt</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{stats.present}</div>
						<p className="text-xs text-muted-foreground">ngày trong tháng</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Vắng</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{stats.absent}</div>
						<p className="text-xs text-muted-foreground">ngày trong tháng</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Nửa Ngày</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">{stats.halfDay}</div>
						<p className="text-xs text-muted-foreground">ngày trong tháng</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Nghỉ Phép</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{stats.leave}</div>
						<p className="text-xs text-muted-foreground">ngày trong tháng</p>
					</CardContent>
				</Card>
			</div>

			{/* Recent Attendance */}
			<Card>
				<CardHeader>
					<CardTitle>Lịch Sử Chấm Công Tháng Này</CardTitle>
					<CardDescription>
						{format(currentDate, "MMMM yyyy", { locale: vi })}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{attendances.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Chưa có dữ liệu chấm công
						</div>
					) : (
						<div className="space-y-2">
							{attendances.slice(0, 10).map((attendance: any) => (
								<div
									key={attendance.id}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<div>
										<div className="font-medium">
											{format(new Date(attendance.date), "dd/MM/yyyy - EEEE", { locale: vi })}
										</div>
										<div className="text-sm text-muted-foreground">
											{attendance.checkIn && (
												<span>
													Vào: {format(new Date(attendance.checkIn), "HH:mm")}
												</span>
											)}
											{attendance.checkOut && (
												<span className="ml-3">
													Ra: {format(new Date(attendance.checkOut), "HH:mm")}
												</span>
											)}
										</div>
									</div>
									<Badge variant={attendance.status === "PRESENT" ? "default" : "secondary"}>
										{attendance.status === "PRESENT" && "Có mặt"}
										{attendance.status === "ABSENT" && "Vắng"}
										{attendance.status === "HALF_DAY" && "Nửa ngày"}
										{attendance.status === "LEAVE" && "Nghỉ phép"}
									</Badge>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
