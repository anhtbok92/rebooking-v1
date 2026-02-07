import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, Download, Mail, Phone, User } from "lucide-react"
import { formatBookingDateTime } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useSystemSettings } from "@/lib/swr/system-settings"

interface BookingDetailsDialogProps {
	booking: {
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
	}
	isOpen: boolean
	onClose: () => void
}

export function BookingDetailsDialog({ booking, isOpen, onClose }: BookingDetailsDialogProps) {
	const t = useTranslations("Admin.bookings")
	const tStats = useTranslations("Admin.stats")
	const locale = useLocale()
	const { currency } = useSystemSettings()

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "CONFIRMED":
			case "COMPLETED":
				return <Badge className="bg-green-500"> {status === "CONFIRMED" ? tStats("confirmed") : tStats("completed")}</Badge>
			case "PENDING":
				return <Badge className="bg-yellow-500"> {tStats("pending")}</Badge>
			case "CANCELLED":
				return <Badge className="bg-red-500"> {tStats("cancelled")}</Badge>
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

	// Format currency
	const formatCurrency = (amount: number) => {
		if (currency === "VND") {
			return `${amount.toLocaleString('vi-VN')} đ`
		}
		return `$${amount.toLocaleString()}`
	}

	// Translate payment method
	const getPaymentMethodLabel = (method: string | null | undefined) => {
		if (!method) return "N/A"
		const tPayment = useTranslations("Admin.bookings.payment")
		return method === "cash" ? tPayment("cash") : tPayment("card")
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{booking.service.name}</DialogTitle>
					<DialogDescription>
						{formatBookingDateTime(booking.date, booking.time)}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Booking Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<User className="w-5 h-5 text-muted-foreground" />
								<span className="font-medium">{booking.userName}</span>
							</div>
							{booking.email && (
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-muted-foreground" />
									<span>{booking.email}</span>
								</div>
							)}
							<div className="flex items-center gap-3">
								<Phone className="w-5 h-5 text-muted-foreground" />
								<span>{booking.phone}</span>
							</div>
							<div className="flex items-center gap-3">
								<Calendar className="w-5 h-5 text-muted-foreground" />
								<span>{new Date(booking.date).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center gap-3">
								<Clock className="w-5 h-5 text-muted-foreground" />
								<span>{booking.time}</span>
							</div>
							<div className="flex items-center gap-3">
								<DollarSign className="w-5 h-5 text-muted-foreground" />
								<span className="font-semibold">{formatCurrency(booking.service.price)}</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-muted-foreground">Payment Method:</span>
								<Badge variant="outline">{getPaymentMethodLabel(booking.paymentMethod)}</Badge>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-muted-foreground">Status:</span>
								{getStatusBadge(booking.status)}
							</div>
						</CardContent>
					</Card>
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={handleDownloadReceipt}>
							<Download className="w-4 h-4 mr-2" />
							{t("card.receipt")}
						</Button>
						<Button onClick={onClose}>Close</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}