"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface CreateSalaryDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
}

export function CreateSalaryDialog({ open, onOpenChange, onSuccess }: CreateSalaryDialogProps) {
	// Fetch all users and filter client-side for STAFF and DOCTOR roles
	const { data: usersData, isLoading } = useSWR("/api/v1/admin/users?limit=100", fetcher)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		userId: "",
		baseSalary: "",
		allowance: "0",
		commissionRate: "0",
		workingDaysPerMonth: "26",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const res = await fetch("/api/v1/salary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: formData.userId,
					baseSalary: parseInt(formData.baseSalary),
					allowance: parseInt(formData.allowance),
					commissionRate: parseFloat(formData.commissionRate),
					workingDaysPerMonth: parseInt(formData.workingDaysPerMonth),
				}),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || "Failed to create salary")
			}

			toast.success("Đã tạo cấu hình lương")
			onSuccess()
			onOpenChange(false)
			setFormData({
				userId: "",
				baseSalary: "",
				allowance: "0",
				commissionRate: "0",
				workingDaysPerMonth: "26",
			})
		} catch (error: any) {
			toast.error(error.message || "Không thể tạo cấu hình lương")
		} finally {
			setIsSubmitting(false)
		}
	}

	// Filter for STAFF and DOCTOR roles only
	const employees = usersData?.users?.filter((u: any) => 
		["STAFF", "DOCTOR"].includes(u.role)
	) || []

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Tạo Cấu Hình Lương</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="userId">Nhân Viên *</Label>
						<Select 
							value={formData.userId} 
							onValueChange={(value) => setFormData({ ...formData, userId: value })}
							disabled={isLoading}
						>
							<SelectTrigger>
								<SelectValue placeholder={isLoading ? "Đang tải..." : employees.length === 0 ? "Không có nhân viên" : "Chọn nhân viên"} />
							</SelectTrigger>
							<SelectContent>
								{employees.length === 0 && !isLoading ? (
									<SelectItem value="no-employees" disabled>
										Không có nhân viên
									</SelectItem>
								) : (
									employees.map((user: any) => (
										<SelectItem key={user.id} value={user.id}>
											{user.name} ({user.role === "DOCTOR" ? "Bác sĩ" : "Nhân viên"})
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>

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

					<div className="flex justify-end gap-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang tạo..." : "Tạo"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
