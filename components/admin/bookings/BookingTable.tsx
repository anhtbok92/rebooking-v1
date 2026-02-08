"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Download, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface Booking {
	id: string
	service: { name: string; price: number }
	userName: string
	phone: string
	email?: string | null
	date: string
	time: string
	status: string
	paymentMethod?: string | null
	createdAt?: string | null
	user?: { email?: string | null } | null
}

interface BookingTableProps {
	bookings: Booking[]
	onStatusChange: (bookingId: string, status: string) => void
	onDownloadReceipt: (bookingId: string) => void
	onDelete: (bookingId: string) => void
	showConfirmButton?: boolean
	currency?: string
}

export function BookingTable({
	bookings,
	onStatusChange,
	onDownloadReceipt,
	onDelete,
	showConfirmButton = false,
	currency = "USD",
}: BookingTableProps) {
	const t = useTranslations("Admin.bookings.card")
	const tStats = useTranslations("Admin.stats")

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PENDING":
				return (
					<Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
						{tStats("pending")}
					</Badge>
				)
			case "CONFIRMED":
				return (
					<Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
						{tStats("confirmed")}
					</Badge>
				)
			case "COMPLETED":
				return (
					<Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
						{tStats("completed")}
					</Badge>
				)
			case "CANCELLED":
				return (
					<Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
						{tStats("cancelled")}
					</Badge>
				)
			default:
				return null
		}
	}

	const formatCurrency = (amount: number) => {
		if (currency === "VND") {
			return `${amount.toLocaleString('vi-VN')} đ`
		}
		return `${amount.toLocaleString()}`
	}

	const getPaymentMethodLabel = (method: string | null | undefined) => {
		if (!method) return "N/A"
		const tPayment = useTranslations("Admin.bookings.payment")
		return method === "cash" ? tPayment("cash") : tPayment("card")
	}

	return (
		<div className="rounded-md border overflow-hidden">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="sticky left-0 z-10 bg-background">Khách hàng</TableHead>
							<TableHead className="sticky left-[180px] z-10 bg-background">Liên hệ</TableHead>
							<TableHead>Dịch vụ</TableHead>
							<TableHead>Ngày</TableHead>
							<TableHead>Giờ</TableHead>
							<TableHead>Giá</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Thanh toán</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{bookings.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
									{t("noBookings")}
								</TableCell>
							</TableRow>
						) : (
							bookings.map((booking) => {
								const userEmail = booking.user?.email || booking.email || null
								return (
									<TableRow key={booking.id}>
										<TableCell className="sticky left-0 z-10 bg-background">
											<div className="space-y-1 min-w-[180px]">
												<div className="font-medium whitespace-nowrap">{booking.userName}</div>
												{userEmail && (
													<div className="text-xs text-muted-foreground">{userEmail}</div>
												)}
											</div>
										</TableCell>
										<TableCell className="sticky left-[180px] z-10 bg-background whitespace-nowrap min-w-[120px]">{booking.phone}</TableCell>
										<TableCell className="font-medium whitespace-nowrap">{booking.service.name}</TableCell>
										<TableCell className="whitespace-nowrap">{new Date(booking.date).toLocaleDateString('vi-VN')}</TableCell>
										<TableCell className="whitespace-nowrap">{booking.time}</TableCell>
										<TableCell className="font-semibold whitespace-nowrap">{formatCurrency(booking.service.price)}</TableCell>
										<TableCell>
											<Select value={booking.status} onValueChange={(value) => onStatusChange(booking.id, value)}>
												<SelectTrigger className="w-[130px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PENDING">{tStats("pending")}</SelectItem>
													<SelectItem value="CONFIRMED">{tStats("confirmed")}</SelectItem>
													<SelectItem value="COMPLETED">{tStats("completed")}</SelectItem>
													<SelectItem value="CANCELLED">{tStats("cancelled")}</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{getPaymentMethodLabel(booking.paymentMethod)}</Badge>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground whitespace-nowrap">
											{booking.createdAt ? new Date(booking.createdAt).toLocaleString('vi-VN') : 'N/A'}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1">
												{showConfirmButton && booking.status === "PENDING" && (
													<Button 
														size="sm" 
														variant="outline"
														onClick={() => onStatusChange(booking.id, "CONFIRMED")} 
														className="gap-1 h-8 px-2"
													>
														<CheckCircle2 className="w-3 h-3" />
														<span className="hidden sm:inline">{t("confirm")}</span>
													</Button>
												)}
												<Button 
													variant="outline" 
													size="sm" 
													onClick={() => onDownloadReceipt(booking.id)}
													className="h-8 w-8 p-0"
												>
													<Download className="w-3 h-3" />
												</Button>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button variant="destructive" size="sm" className="h-8 w-8 p-0">
															<Trash2 className="w-3 h-3" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
														<AlertDialogDescription>
															{t("deleteConfirmDescription")}
														</AlertDialogDescription>
														<div className="flex gap-2 justify-end">
															<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => onDelete(booking.id)}
																className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															>
																{t("delete")}
															</AlertDialogAction>
														</div>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
