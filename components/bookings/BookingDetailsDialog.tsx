"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, Download, Mail, Phone, User, Stethoscope, CreditCard, Hash } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useSystemSettings } from "@/lib/swr/system-settings"

interface Booking {
	id: string
	service: {
		id: string
		name: string
		price: number
	}
	userName: string
	phone: string
	email?: string | null
	date: string
	time: string
	status: string
	paymentMethod: string
	user?: {
		id: string
		name: string | null
		email: string
		phone: string | null
	} | null
	doctor?: {
		id: string
		name: string
		email: string
		phone: string | null
	} | null
	photos?: Array<{ url: string }>
	createdAt?: string
}

interface BookingDetailsDialogProps {
	booking: Booking
	open: boolean
	onOpenChange: (open: boolean) => void
	userRole?: string
}

export function BookingDetailsDialog({ booking, open, onOpenChange, userRole }: BookingDetailsDialogProps) {
	const t = useTranslations("Admin.bookings")
	const tStats = useTranslations("Admin.stats")
	const tPayment = useTranslations("Admin.bookings.payment")
	const locale = useLocale()
	const { currency } = useSystemSettings()

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "CONFIRMED":
				return (
					<Badge className="bg-green-600 hover:bg-green-700 text-white">
						{tStats("confirmed")}
					</Badge>
				)
			case "COMPLETED":
				return (
					<Badge className="bg-blue-600 hover:bg-blue-700 text-white">
						{tStats("completed")}
					</Badge>
				)
			case "PENDING":
				return (
					<Badge className="bg-amber-600 hover:bg-amber-700 text-white">
						{tStats("pending")}
					</Badge>
				)
			case "CANCELLED":
				return (
					<Badge className="bg-red-600 hover:bg-red-700 text-white">
						{tStats("cancelled")}
					</Badge>
				)
			default:
				return <Badge>{status}</Badge>
		}
	}

	const handleDownloadReceipt = async () => {
		try {
			const response = await fetch(`/api/v1/bookings/${booking.id}/receipt?format=pdf&locale=${locale}&currency=${currency}`)
			if (!response.ok) {
				throw new Error("Failed to download receipt")
			}
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `receipt-${booking.id}.pdf`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
		} catch (error) {
			console.error("Failed to download receipt:", error)
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
		return method === "cash" ? tPayment("cash") : tPayment("card")
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">{booking.service.name}</DialogTitle>
					<DialogDescription className="text-base">
						{new Date(booking.date).toLocaleDateString('vi-VN', { 
							weekday: 'long', 
							year: 'numeric', 
							month: 'long', 
							day: 'numeric' 
						})} - {booking.time}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Status Badge */}
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-muted-foreground">Trạng thái</span>
						{getStatusBadge(booking.status)}
					</div>

					{/* Customer Information */}
					<Card>
						<CardContent className="pt-6 space-y-4">
							<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
								<User className="w-5 h-5 text-primary" />
								Thông tin khách hàng
							</h3>
							
							<div className="grid gap-3">
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Họ tên</p>
										<p className="font-medium">{booking.userName}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Số điện thoại</p>
										<p className="font-medium">{booking.phone}</p>
									</div>
								</div>

								{(booking.email || booking.user?.email) && (
									<div className="flex items-start gap-3">
										<Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="font-medium">{booking.email || booking.user?.email}</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Service & Appointment Information */}
					<Card>
						<CardContent className="pt-6 space-y-4">
							<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
								<Calendar className="w-5 h-5 text-primary" />
								Thông tin dịch vụ & lịch hẹn
							</h3>
							
							<div className="grid gap-3">
								<div className="flex items-start gap-3">
									<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Ngày hẹn</p>
										<p className="font-medium">{new Date(booking.date).toLocaleDateString('vi-VN')}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Giờ hẹn</p>
										<p className="font-medium">{booking.time}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Giá dịch vụ</p>
										<p className="font-semibold text-lg text-primary">{formatCurrency(booking.service.price)}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
										<Badge variant="outline" className="mt-1">{getPaymentMethodLabel(booking.paymentMethod)}</Badge>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Stethoscope className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Bác sĩ phụ trách</p>
										{booking.doctor ? (
											<div className="mt-1">
												<p className="font-medium">BS. {booking.doctor.name}</p>
												<p className="text-sm text-muted-foreground">{booking.doctor.email}</p>
												{booking.doctor.phone && (
													<p className="text-sm text-muted-foreground">{booking.doctor.phone}</p>
												)}
											</div>
										) : (
											<p className="font-medium text-muted-foreground">Chưa chỉ định</p>
										)}
									</div>
								</div>

								{booking.createdAt && (
									<div className="flex items-start gap-3">
										<Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Ngày tạo</p>
											<p className="font-medium text-sm">{new Date(booking.createdAt).toLocaleString('vi-VN')}</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Photos if available */}
					{booking.photos && booking.photos.length > 0 && (
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold text-lg mb-4">Hình ảnh đính kèm</h3>
								<div className="grid grid-cols-3 gap-2">
									{booking.photos.map((photo, index) => (
										<img
											key={index}
											src={photo.url}
											alt={`Photo ${index + 1}`}
											className="w-full h-24 object-cover rounded-lg"
										/>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4">
						<Button variant="outline" onClick={handleDownloadReceipt}>
							<Download className="w-4 h-4 mr-2" />
							Tải hóa đơn
						</Button>
						<Button onClick={() => onOpenChange(false)}>
							Đóng
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
