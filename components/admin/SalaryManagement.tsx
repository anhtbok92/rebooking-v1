"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, FileText } from "lucide-react"
import { EmployeeSalaryList } from "./salary/EmployeeSalaryList"
import { PayrollList } from "./salary/PayrollList"
import { AttendanceManagement } from "./salary/AttendanceManagement"

export function SalaryManagement() {
	const [activeTab, setActiveTab] = useState("salaries")

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Quản Lý Lương Thưởng</h1>
				<p className="text-muted-foreground mt-2">
					Quản lý lương cứng, trợ cấp, hoa hồng và chấm công nhân viên
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="salaries" className="flex items-center gap-2">
						<DollarSign className="w-4 h-4" />
						Cấu Hình Lương
					</TabsTrigger>
					<TabsTrigger value="attendance" className="flex items-center gap-2">
						<Users className="w-4 h-4" />
						Chấm Công
					</TabsTrigger>
					<TabsTrigger value="payroll" className="flex items-center gap-2">
						<FileText className="w-4 h-4" />
						Phiếu Lương
					</TabsTrigger>
				</TabsList>

				<TabsContent value="salaries" className="mt-6">
					<EmployeeSalaryList />
				</TabsContent>

				<TabsContent value="attendance" className="mt-6">
					<AttendanceManagement />
				</TabsContent>

				<TabsContent value="payroll" className="mt-6">
					<PayrollList />
				</TabsContent>
			</Tabs>
		</div>
	)
}
