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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, Clock, DollarSign, Download, Mail, Phone, Trash2, User } from "lucide-react"

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

interface BookingCardProps {
	booking: Booking
	viewMode: "list" | "grid"
	onStatusChange: (bookingId: string, status: string) => void
	onDownloadReceipt: (bookingId: string) => void
	onDelete: (bookingId: string) => void
	showConfirmButton?: boolean
}

import { useTranslations } from "next-intl"

export function BookingCard({
	booking,
	viewMode,
	onStatusChange,
	onDownloadReceipt,
	onDelete,
	showConfirmButton = false,
}: BookingCardProps) {
	const t = useTranslations("Admin.bookings.card")
	const tStats = useTranslations("Admin.stats")
	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "border-l-amber-500"
			case "CONFIRMED":
				return "border-l-green-500"
			case "COMPLETED":
				return "border-l-blue-500"
			case "CANCELLED":
				return "border-l-red-500"
			default:
				return ""
		}
	}

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

	const userEmail = booking.user?.email || booking.email || null

	return (
		<Card className={`border-l-4 ${getStatusColor(booking.status)}`}>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="space-y-1 flex-1">
						<CardTitle className="text-xl">{booking.service.name}</CardTitle>
						<CardDescription>
							<div className={viewMode === "grid" ? "space-y-2 mt-2" : "flex flex-wrap gap-4 mt-2"}>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4" />
										<span className="font-medium">{booking.userName}</span>
									</div>
									{userEmail && (
										<div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
											<Mail className="w-3 h-3" />
											{userEmail}
										</div>
									)}
								</div>
								<div className="flex items-center gap-2">
									<Phone className="w-4 h-4" />
									{booking.phone}
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									{new Date(booking.date).toLocaleDateString()}
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									{booking.time}
								</div>
								{booking.createdAt && (
									<div className="text-xs text-muted-foreground">
										{t("created")}: {new Date(booking.createdAt).toLocaleString()}
									</div>
								)}
							</div>
						</CardDescription>
					</div>
					<div className="flex flex-col items-end gap-2">
						<div className="flex items-center gap-2">
							<DollarSign className="w-5 h-5" />
							<span className="text-lg font-semibold">${booking.service.price.toLocaleString()}</span>
						</div>
						{getStatusBadge(booking.status)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className={viewMode === "grid" ? "space-y-3" : "flex items-center justify-between gap-4"}>
					<div className="flex items-center gap-4">
						<Select value={booking.status} onValueChange={(value) => onStatusChange(booking.id, value)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">{tStats("pending")}</SelectItem>
								<SelectItem value="CONFIRMED">{tStats("confirmed")}</SelectItem>
								<SelectItem value="COMPLETED">{tStats("completed")}</SelectItem>
								<SelectItem value="CANCELLED">{tStats("cancelled")}</SelectItem>
							</SelectContent>
						</Select>
						<Badge variant="outline">{booking.paymentMethod || "N/A"}</Badge>
					</div>
					<div className="flex gap-2">
						{showConfirmButton && booking.status === "PENDING" && (
							<Button size="sm" onClick={() => onStatusChange(booking.id, "CONFIRMED")} className="gap-2">
								<CheckCircle2 className="w-4 h-4" />
								{t("confirm")}
							</Button>
						)}
						<Button variant="outline" size="sm" onClick={() => onDownloadReceipt(booking.id)}>
							<Download className="w-4 h-4 mr-2" />
							{t("receipt")}
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" size="sm" className="gap-2">
									<Trash2 className="w-4 h-4" />
									{t("delete")}
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
				</div>
			</CardContent>
		</Card>
	)
}

