"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface EditSalaryDialogProps {
	salary: any
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
}

export function EditSalaryDialog({ salary, open, onOpenChange, onSuccess }: EditSalaryDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		baseSalary: "",
		allowance: "",
		commissionRate: "",
		workingDaysPerMonth: "",
		active: true,
	})

	useEffect(() => {
		if (salary) {
			setFormData({
				baseSalary: salary.baseSalary.toString(),
				allowance: salary.allowance.toString(),
				commissionRate: salary.commissionRate.toString(),
				workingDaysPerMonth: salary.workingDaysPerMonth.toString(),
				active: salary.active,
			})
		}
	}, [salary])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const res = await fetch(`/api/v1/salary/${salary.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					baseSalary: parseInt(formData.baseSalary),
					allowance: parseInt(formData.allowance),
					commissionRate: parseFloat(formData.commissionRate),
					workingDaysPerMonth: parseInt(formData.workingDaysPerMonth),
					active: formData.active,
				}),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to update salary")
			}

			toast.success("Đã cập nhật cấu hình lương")
			onSuccess()
			onOpenChange(false)
		} catch (error: any) {
			toast.error(error.message || "Không thể cập nhật cấu hình lương")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Chỉnh Sửa Cấu Hình Lương</DialogTitle>
					<p className="text-sm text-muted-foreground">
						{salary?.user?.name} ({salary?.user?.email})
					</p>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="baseSalary">Lương Cứng (VND/tháng) *</Label>
						<Input
							id="baseSalary"
							type="number"
							value={formData.baseSalary}
							onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
							placeholder="10000000"
							required
						/>
					</div>

					<div>
						<Label htmlFor="allowance">Trợ Cấp (VND/tháng)</Label>
						<Input
							id="allowance"
							type="number"
							value={formData.allowance}
							onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
							placeholder="0"
						/>
					</div>

					<div>
						<Label htmlFor="commissionRate">Hoa Hồng (%)</Label>
						<Input
							id="commissionRate"
							type="number"
							step="0.1"
							min="0"
							max="100"
							value={formData.commissionRate}
							onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
							placeholder="0"
						/>
					</div>

					<div>
						<Label htmlFor="workingDaysPerMonth">Số Ngày Công Chuẩn/Tháng</Label>
						<Input
							id="workingDaysPerMonth"
							type="number"
							value={formData.workingDaysPerMonth}
							onChange={(e) => setFormData({ ...formData, workingDaysPerMonth: e.target.value })}
							placeholder="26"
						/>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="active">Trạng thái hoạt động</Label>
						<Switch
							id="active"
							checked={formData.active}
							onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
