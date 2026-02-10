"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"

interface MarkAttendanceDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	selectedDate: Date | null
	employees: any[]
	onSuccess: () => void
}

export function MarkAttendanceDialog({
	open,
	onOpenChange,
	selectedDate,
	employees,
	onSuccess,
}: MarkAttendanceDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		userId: "",
		date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
		status: "PRESENT",
		checkIn: "",
		checkOut: "",
		notes: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const payload: any = {
				userId: formData.userId,
				date: formData.date,
				status: formData.status,
			}

			if (formData.checkIn) {
				payload.checkIn = new Date(`${formData.date}T${formData.checkIn}:00`).toISOString()
			}
			if (formData.checkOut) {
				payload.checkOut = new Date(`${formData.date}T${formData.checkOut}:00`).toISOString()
			}
			if (formData.notes) {
				payload.notes = formData.notes
			}

			const res = await fetch("/api/v1/attendance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to mark attendance")
			}

			toast.success("Đã chấm công thành công")
			onSuccess()
			onOpenChange(false)
			setFormData({
				userId: "",
				date: format(new Date(), "yyyy-MM-dd"),
				status: "PRESENT",
				checkIn: "",
				checkOut: "",
				notes: "",
			})
		} catch (error: any) {
			toast.error(error.message || "Không thể chấm công")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Chấm Công</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="userId">Nhân Viên *</Label>
						<Select
							value={formData.userId}
							onValueChange={(value) => setFormData({ ...formData, userId: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn nhân viên" />
							</SelectTrigger>
							<SelectContent>
								{employees.map((user: any) => (
									<SelectItem key={user.id} value={user.id}>
										{user.name} ({user.role === "DOCTOR" ? "Bác sĩ" : "Nhân viên"})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="date">Ngày *</Label>
						<Input
							id="date"
							type="date"
							value={formData.date}
							onChange={(e) => setFormData({ ...formData, date: e.target.value })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="status">Trạng Thái *</Label>
						<Select
							value={formData.status}
							onValueChange={(value) => setFormData({ ...formData, status: value })}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PRESENT">Có mặt</SelectItem>
								<SelectItem value="ABSENT">Vắng</SelectItem>
								<SelectItem value="HALF_DAY">Nửa ngày</SelectItem>
								<SelectItem value="LEAVE">Nghỉ phép</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{formData.status === "PRESENT" && (
						<>
							<div>
								<Label htmlFor="checkIn">Giờ Vào</Label>
								<Input
									id="checkIn"
									type="time"
									value={formData.checkIn}
									onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
								/>
							</div>

							<div>
								<Label htmlFor="checkOut">Giờ Ra</Label>
								<Input
									id="checkOut"
									type="time"
									value={formData.checkOut}
									onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
								/>
							</div>
						</>
					)}

					<div>
						<Label htmlFor="notes">Ghi Chú</Label>
						<Textarea
							id="notes"
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							placeholder="Ghi chú thêm (nếu có)"
							rows={3}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting || !formData.userId}>
							{isSubmitting ? "Đang lưu..." : "Chấm Công"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
