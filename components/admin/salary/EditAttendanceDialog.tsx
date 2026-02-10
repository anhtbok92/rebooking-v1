"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"

interface EditAttendanceDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	attendance: any
	onSuccess: () => void
}

export function EditAttendanceDialog({
	open,
	onOpenChange,
	attendance,
	onSuccess,
}: EditAttendanceDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		status: "",
		checkIn: "",
		checkOut: "",
		notes: "",
	})

	useEffect(() => {
		if (attendance) {
			setFormData({
				status: attendance.status,
				checkIn: attendance.checkIn ? format(new Date(attendance.checkIn), "HH:mm") : "",
				checkOut: attendance.checkOut ? format(new Date(attendance.checkOut), "HH:mm") : "",
				notes: attendance.notes || "",
			})
		}
	}, [attendance])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const payload: any = {
				status: formData.status,
			}

			const dateStr = format(new Date(attendance.date), "yyyy-MM-dd")

			if (formData.checkIn) {
				payload.checkIn = new Date(`${dateStr}T${formData.checkIn}:00`).toISOString()
			} else {
				payload.checkIn = null
			}

			if (formData.checkOut) {
				payload.checkOut = new Date(`${dateStr}T${formData.checkOut}:00`).toISOString()
			} else {
				payload.checkOut = null
			}

			payload.notes = formData.notes || null

			const res = await fetch(`/api/v1/attendance/${attendance.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to update attendance")
			}

			toast.success("Đã cập nhật chấm công")
			onSuccess()
			onOpenChange(false)
		} catch (error: any) {
			toast.error(error.message || "Không thể cập nhật chấm công")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Chỉnh Sửa Chấm Công</DialogTitle>
					<p className="text-sm text-muted-foreground">
						{attendance?.user?.name} - {format(new Date(attendance?.date), "dd/MM/yyyy")}
					</p>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
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
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
