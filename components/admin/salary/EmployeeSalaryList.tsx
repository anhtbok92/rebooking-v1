"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { CreateSalaryDialog } from "./CreateSalaryDialog"
import { EditSalaryDialog } from "./EditSalaryDialog"

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: "Failed to fetch" }))
		throw new Error(error.error || `HTTP ${res.status}`)
	}
	return res.json()
}

export function EmployeeSalaryList() {
	const { data, mutate, isLoading, error } = useSWR("/api/v1/salary", fetcher)
	const [createOpen, setCreateOpen] = useState(false)
	const [editSalary, setEditSalary] = useState<any>(null)

	// Safely extract salaries array
	const salaries = Array.isArray(data) ? data : []

	const handleDelete = async (id: string) => {
		if (!confirm("Bạn có chắc muốn xóa cấu hình lương này?")) return

		try {
			const res = await fetch(`/api/v1/salary/${id}`, { method: "DELETE" })
			if (!res.ok) throw new Error("Failed to delete")

			toast.success("Đã xóa cấu hình lương")
			mutate()
		} catch (error) {
			toast.error("Không thể xóa cấu hình lương")
		}
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount)
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Cấu Hình Lương Nhân Viên</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							Quản lý lương cứng, trợ cấp và hoa hồng của nhân viên
						</p>
					</div>
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Thêm Mới
					</Button>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8">Đang tải...</div>
					) : error ? (
						<div className="text-center py-8 text-red-500">
							Lỗi khi tải dữ liệu: {error.message || "Vui lòng thử lại"}
						</div>
					) : !salaries || salaries.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Chưa có cấu hình lương nào
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nhân Viên</TableHead>
										<TableHead>Chức Vụ</TableHead>
										<TableHead className="text-right">Lương Cứng</TableHead>
										<TableHead className="text-right">Trợ Cấp</TableHead>
										<TableHead className="text-right">Hoa Hồng</TableHead>
										<TableHead className="text-center">Ngày Công</TableHead>
										<TableHead className="text-center">Trạng Thái</TableHead>
										<TableHead className="text-right">Thao Tác</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{salaries.map((salary: any) => (
										<TableRow key={salary.id}>
											<TableCell>
												<div>
													<div className="font-medium">{salary.user.name}</div>
													<div className="text-xs text-muted-foreground">{salary.user.email}</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{salary.user.role}</Badge>
											</TableCell>
											<TableCell className="text-right font-medium">
												{formatCurrency(salary.baseSalary)}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(salary.allowance)}
											</TableCell>
											<TableCell className="text-right">
												{salary.commissionRate}%
											</TableCell>
											<TableCell className="text-center">
												{salary.workingDaysPerMonth} ngày
											</TableCell>
											<TableCell className="text-center">
												{salary.active ? (
													<Badge className="bg-green-600">Hoạt động</Badge>
												) : (
													<Badge variant="secondary">Tạm dừng</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setEditSalary(salary)}
													>
														<Edit className="w-4 h-4" />
													</Button>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(salary.id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<CreateSalaryDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={mutate} />
			{editSalary && (
				<EditSalaryDialog
					salary={editSalary}
					open={!!editSalary}
					onOpenChange={(open) => !open && setEditSalary(null)}
					onSuccess={mutate}
				/>
			)}
		</>
	)
}
