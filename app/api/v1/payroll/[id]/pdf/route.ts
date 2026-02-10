import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const userRole = (session.user as any).role
	if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 })
	}

	try {
		const { id } = await params
		const payroll = await prisma.payroll.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
						phone: true,
					},
				},
				salary: true,
			},
		})

		if (!payroll) {
			return NextResponse.json({ error: "Payroll not found" }, { status: 404 })
		}

		// Create PDF
		const doc = new jsPDF()

		// Add title
		doc.setFontSize(20)
		doc.text("PHIEU LUONG", 105, 20, { align: "center" })

		doc.setFontSize(12)
		doc.text(`Thang ${payroll.month}/${payroll.year}`, 105, 30, { align: "center" })

		// Employee info
		doc.setFontSize(11)
		doc.text("THONG TIN NHAN VIEN", 20, 45)
		doc.setFontSize(10)
		doc.text(`Ho ten: ${payroll.user.name || "N/A"}`, 20, 55)
		doc.text(`Email: ${payroll.user.email}`, 20, 62)
		doc.text(`Chuc vu: ${payroll.user.role}`, 20, 69)
		if (payroll.user.phone) {
			doc.text(`Dien thoai: ${payroll.user.phone}`, 20, 76)
		}

		// Salary details table
		const tableData = [
			["Luong co ban", `${payroll.baseSalaryAmount.toLocaleString("vi-VN")} VND`],
			["Tro cap", `${payroll.allowanceAmount.toLocaleString("vi-VN")} VND`],
			["Hoa hong", `${payroll.commissionAmount.toLocaleString("vi-VN")} VND`],
			["Doanh thu", `${payroll.totalRevenue.toLocaleString("vi-VN")} VND`],
			["Ty le hoa hong", `${payroll.salary.commissionRate}%`],
			["So ngay cong", `${payroll.workingDays}/${payroll.salary.workingDaysPerMonth}`],
			["Tong luong", `${payroll.totalAmount.toLocaleString("vi-VN")} VND`],
		]

		if (payroll.bonus > 0) {
			tableData.push(["Thuong", `${payroll.bonus.toLocaleString("vi-VN")} VND`])
		}

		if (payroll.deduction > 0) {
			tableData.push(["Khau tru", `-${payroll.deduction.toLocaleString("vi-VN")} VND`])
		}

		tableData.push(["THUC NHAN", `${payroll.finalAmount.toLocaleString("vi-VN")} VND`])

		;(doc as any).autoTable({
			startY: 90,
			head: [["Khoan muc", "So tien"]],
			body: tableData,
			theme: "grid",
			headStyles: { fillColor: [41, 128, 185] },
			styles: { font: "helvetica", fontSize: 10 },
			columnStyles: {
				0: { cellWidth: 100 },
				1: { cellWidth: 70, halign: "right" },
			},
		})

		// Notes
		if (payroll.notes) {
			const finalY = (doc as any).lastAutoTable.finalY || 90
			doc.text("Ghi chu:", 20, finalY + 15)
			doc.setFontSize(9)
			const splitNotes = doc.splitTextToSize(payroll.notes, 170)
			doc.text(splitNotes, 20, finalY + 22)
		}

		// Footer
		const pageHeight = doc.internal.pageSize.height
		doc.setFontSize(9)
		doc.text(`Ngay in: ${new Date().toLocaleDateString("vi-VN")}`, 20, pageHeight - 20)
		doc.text("Chu ky nguoi nhan", 140, pageHeight - 30)

		// Generate PDF buffer
		const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

		return new NextResponse(pdfBuffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="payroll-${payroll.user.name}-${payroll.month}-${payroll.year}.pdf"`,
			},
		})
	} catch (error) {
		console.error("Generate PDF error:", error)
		return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
	}
}
