"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function PayrollList() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quản Lý Phiếu Lương</CardTitle>
				<p className="text-sm text-muted-foreground mt-1">
					Chức năng đang được phát triển
				</p>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<FileText className="w-16 h-16 text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">Phiếu Lương Nhân Viên</h3>
					<p className="text-sm text-muted-foreground max-w-md">
						Tính năng phiếu lương sẽ tự động tính toán lương dựa trên:
						Lương cứng, Trợ cấp, Hoa hồng, Số ngày công, Thưởng và Khấu trừ.
					</p>
					<div className="mt-6 p-4 bg-muted rounded-lg max-w-md">
						<p className="text-xs text-muted-foreground">
							<strong>Sắp có:</strong> Tạo phiếu lương tự động, xuất PDF,
							duyệt và thanh toán lương, lịch sử phiếu lương.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
