"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MarkAttendanceDialog } from "./MarkAttendanceDialog"
import { EditAttendanceDialog } from "./EditAttendanceDialog"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AttendanceManagement() {
	const currentDate = new Date()
	const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
	const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
	const [selectedUserId, setSelectedUserId] = useState<string>("")
	const [markDialogOpen, setMarkDialogOpen] = useState(false)
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedAttendance, setSelectedAttendance] = useState<any>(null)

	// Fetch employees (STAFF and DOCTOR)
	const { data: usersData } = useSWR("/api/v1/admin/users?limit=100", fetcher)
	const employees = usersData?.users?.filter((u: any) => 
		["STAFF", "DOCTOR"].includes(u.role)
	) || []

	// Fetch attendance for selected month/year and user
	const attendanceUrl = selectedUserId
		? `/api/v1/attendance?userId=${selectedUserId}&month=${selectedMonth}&year=${selectedYear}&limit=100`
		: `/api/v1/attendance?month=${selectedMonth}&year=${selectedYear}&limit=100`
	
	const { data: attendanceData, mutate } = useSWR(attendanceUrl, fetcher)
	const attendances = attendanceData?.attendances || []

	// Create a map of date -> attendance for quick lookup
	const attendanceMap = new Map()
	attendances.forEach((att: any) => {
		const dateKey = format(new Date(att.date), "yyyy-MM-dd")
		if (!attendanceMap.has(dateKey)) {
			attendanceMap.set(dateKey, [])
		}
		attendanceMap.get(dateKey).push(att)
	})

	const handleMonthChange = (value: string) => {
		setSelectedMonth(parseInt(value))
	}

	const handleYearChange = (value: string) => {
		setSelectedYear(parseInt(value))
	}

	const handleMarkAttendance = (date: Date) => {
		setSelectedDate(date)
		setMarkDialogOpen(true)
	}

	const handleEditAttendance = (attendance: any) => {
		setSelectedAttendance(attendance)
		setEditDialogOpen(true)
	}

	const handleDeleteAttendance = async (id: string) => {
		if (!confirm("Bạn có chắc muốn xóa bản ghi chấm công này?")) return

		try {
			const res = await fetch(`/api/v1/attendance/${id}`, {
				method: "DELETE",
			})

			if (!res.ok) throw new Error("Failed to delete")

			toast.success("Đã xóa bản ghi chấm công")
			mutate()
		} catch (error) {
			toast.error("Không thể xóa bản ghi chấm công")
		}
	}

	const getStatusBadge = (status: string) => {
		const variants: Record<string, any> = {
			PRESENT: { variant: "default", label: "Có mặt" },
			ABSENT: { variant: "destructive", label: "Vắng" },
			HALF_DAY: { variant: "secondary", label: "Nửa ngày" },
			LEAVE: { variant: "outline", label: "Nghỉ phép" },
		}
		const config = variants[status] || { variant: "default", label: status }
		return <Badge variant={config.variant}>{config.label}</Badge>
	}

	// Generate years for dropdown (current year ± 2)
	const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i)
	const months = [
		{ value: 1, label: "Tháng 1" },
		{ value: 2, label: "Tháng 2" },
		{ value: 3, label: "Tháng 3" },
		{ value: 4, label: "Tháng 4" },
		{ value: 5, label: "Tháng 5" },
		{ value: 6, label: "Tháng 6" },
		{ value: 7, label: "Tháng 7" },
		{ value: 8, label: "Tháng 8" },
		{ value: 9, label: "Tháng 9" },
		{ value: 10, label: "Tháng 10" },
		{ value: 11, label: "Tháng 11" },
		{ value: 12, label: "Tháng 12" },
	]

	// Calculate statistics
	const stats = {
		present: attendances.filter((a: any) => a.status === "PRESENT").length,
		absent: attendances.filter((a: any) => a.status === "ABSENT").length,
		halfDay: attendances.filter((a: any) => a.status === "HALF_DAY").length,
		leave: attendances.filter((a: any) => a.status === "LEAVE").length,
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Quản Lý Chấm Công</CardTitle>
					<CardDescription>Theo dõi và quản lý chấm công nhân viên</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="flex-1 min-w-[200px]">
							<label className="text-sm font-medium mb-2 block">Nhân Viên</label>
							<Select value={selectedUserId || "all"} onValueChange={(value) => setSelectedUserId(value === "all" ? "" : value)}>
								<SelectTrigger>
									<SelectValue placeholder="Tất cả nhân viên" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả nhân viên</SelectItem>
									{employees.map((user: any) => (
										<SelectItem key={user.id} value={user.id}>
											{user.name} ({user.role === "DOCTOR" ? "Bác sĩ" : "Nhân viên"})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="w-[150px]">
							<label className="text-sm font-medium mb-2 block">Tháng</label>
							<Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{months.map((month) => (
										<SelectItem key={month.value} value={month.value.toString()}>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="w-[120px]">
							<label className="text-sm font-medium mb-2 block">Năm</label>
							<Select value={selectedYear.toString()} onValueChange={handleYearChange}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{years.map((year) => (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-end">
							<Button onClick={() => handleMarkAttendance(new Date())}>
								Chấm Công Hôm Nay
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Có Mặt</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{stats.present}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Vắng</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{stats.absent}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Nửa Ngày</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">{stats.halfDay}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Nghỉ Phép</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{stats.leave}</div>
					</CardContent>
				</Card>
			</div>

			{/* Attendance List */}
			<Card>
				<CardHeader>
					<CardTitle>Danh Sách Chấm Công</CardTitle>
				</CardHeader>
				<CardContent>
					{attendances.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Chưa có dữ liệu chấm công cho tháng này
						</div>
					) : (
						<div className="space-y-2">
							{attendances.map((attendance: any) => (
								<div
									key={attendance.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
								>
									<div className="flex-1">
										<div className="font-medium">{attendance.user.name}</div>
										<div className="text-sm text-muted-foreground">
											{format(new Date(attendance.date), "dd/MM/yyyy", { locale: vi })}
											{attendance.checkIn && (
												<span className="ml-2">
													• Check-in: {format(new Date(attendance.checkIn), "HH:mm")}
												</span>
											)}
											{attendance.checkOut && (
												<span className="ml-2">
													• Check-out: {format(new Date(attendance.checkOut), "HH:mm")}
												</span>
											)}
										</div>
										{attendance.notes && (
											<div className="text-sm text-muted-foreground mt-1">
												Ghi chú: {attendance.notes}
											</div>
										)}
									</div>
									<div className="flex items-center gap-2">
										{getStatusBadge(attendance.status)}
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEditAttendance(attendance)}
										>
											Sửa
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteAttendance(attendance.id)}
										>
											Xóa
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Dialogs */}
			<MarkAttendanceDialog
				open={markDialogOpen}
				onOpenChange={setMarkDialogOpen}
				selectedDate={selectedDate}
				employees={employees}
				onSuccess={() => mutate()}
			/>

			{selectedAttendance && (
				<EditAttendanceDialog
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					attendance={selectedAttendance}
					onSuccess={() => mutate()}
				/>
			)}
		</div>
	)
}
