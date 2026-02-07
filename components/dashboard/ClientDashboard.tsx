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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserBookings } from "@/lib/swr"
import { Award, BarChart3, Calendar, Clock, DollarSign, Download, Heart, Sparkles, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import LayoutAdmin from "../layout/admin"
import { AIRecommendations } from "./AIRecommendations"
import { BookingStats } from "./BookingStats"
import { ClientAnalytics } from "./ClientAnalytics"
import { LoyaltyWidget } from "./LoyaltyWidget"
import { QuickRebook } from "./QuickRebook"
import { UpcomingReminders } from "./UpcomingReminders"
import { RatingDialog } from "@/components/ratings/RatingDialog"
import { BookingCalendar } from "@/components/bookings/BookingCalendar"
import { useTranslations } from "next-intl"

export function ClientDashboard() {
	const t = useTranslations("Client.dashboard")
	const { data: session } = useSession()
	const userId = (session?.user as any)?.id
	const [activeTab, setActiveTab] = useState("overview")

	const {
		data: response,
		error,
		mutate,
	} = useUserBookings(userId)

	const bookings = response?.bookings || []

	const handleCancelBooking = async (bookingId: string) => {
		try {
			const response = await fetch(`/api/v1/bookings/${bookingId}`, {
				method: "DELETE",
			})

			if (response.ok) {
				toast.success(t("messages.cancelSuccess"))
				mutate()
			} else {
				toast.error(t("messages.cancelError"))
			}
		} catch (error) {
			toast.error(t("messages.cancelError"))
		}
	}

	const handleDownloadReceipt = async (bookingId: string) => {
		try {
			const response = await fetch(`/api/v1/bookings/${bookingId}/receipt?format=pdf`)
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: "Failed to download receipt" }))
				throw new Error(errorData.error || t("messages.receiptError"))
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `receipt-${bookingId}.pdf`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
			toast.success(t("messages.receiptSuccess"))
		} catch (error) {
			console.error("Receipt download error:", error)
			toast.error(error instanceof Error ? error.message : t("messages.receiptError"))
		}
	}

	const upcomingBookings = bookings?.filter((b) => new Date(b.date) >= new Date() && b.status !== "CANCELLED") || []
	// Only show past bookings that are completed (users can only rate completed services)
	const pastBookings = bookings?.filter((b) => new Date(b.date) < new Date() && b.status === "COMPLETED") || []
	const completedBookings = bookings?.filter((b) => b.status === "COMPLETED") || []
	const totalSpent = bookings?.reduce((sum, b) => sum + b.service.price, 0) || 0

	return (
		<LayoutAdmin>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">{t("welcome", { name: session?.user?.name })}</h1>
					<p className="text-muted-foreground">
						{t("desc")}
					</p>
				</div>

				<div className="mb-8">
					<Link href="/">
						<Button size="lg" className="gap-2">
							<Sparkles className="w-5 h-5" />
							{t("bookButton")}
						</Button>
					</Link>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
						<TabsTrigger value="calendar">{t("tabs.calendar")}</TabsTrigger>
						<TabsTrigger value="analytics">{t("tabs.analytics")}</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						{bookings && bookings.length > 0 && (
							<div className="mb-8">
								<BookingStats bookings={bookings} />
							</div>
						)}

						{bookings && bookings.length > 0 && (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">{t("stats.totalBookings")}</CardTitle>
										<Calendar className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{bookings.length}</div>
										<p className="text-xs text-muted-foreground">{t("stats.totalDesc")}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">{t("stats.completed")}</CardTitle>
										<Award className="h-4 w-4 text-green-600" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{completedBookings.length}</div>
										<p className="text-xs text-muted-foreground">{t("stats.completedDesc")}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">{t("stats.totalSpent")}</CardTitle>
										<DollarSign className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
										<p className="text-xs text-muted-foreground">{t("stats.spentDesc")}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">{t("stats.upcoming")}</CardTitle>
										<Heart className="h-4 w-4 text-red-600" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{upcomingBookings.length}</div>
										<p className="text-xs text-muted-foreground">{t("stats.upcomingDesc")}</p>
									</CardContent>
								</Card>
							</div>
						)}

						{bookings && bookings.length > 0 && (
							<div className="grid gap-6 lg:grid-cols-2 mb-8">
								<LoyaltyWidget bookings={bookings || []} />
								<QuickRebook bookings={bookings} />
								<UpcomingReminders bookings={upcomingBookings} />
								<AIRecommendations bookings={bookings} />
							</div>
						)}

						<div className="grid gap-6 lg:grid-cols-2">
							<div>
								<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
									<Calendar className="w-6 h-6" />
									{t("sections.upcoming")}
								</h2>
								{upcomingBookings.length === 0 ? (
									<Card>
										<CardContent className="py-12 text-center">
											<Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
											<p className="text-muted-foreground">{t("messages.noUpcoming")}</p>
										</CardContent>
									</Card>
								) : (
									<div className="grid gap-4 md:grid-cols-1">
										{upcomingBookings.map((booking) => (
											<Card key={booking.id}>
												<CardHeader>
													<div className="flex items-start justify-between">
														<div>
															<CardTitle className="text-xl">{booking.service.name}</CardTitle>
															<CardDescription className="mt-1">
																<div className="flex items-center gap-2 mt-2">
																	<Calendar className="w-4 h-4" />
																	{booking.date ? new Date(booking.date).toLocaleDateString() : ""}
																</div>
																<div className="flex items-center gap-2 mt-1">
																	<Clock className="w-4 h-4" />
																	{booking.time}
																</div>
															</CardDescription>
														</div>
														<Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
															{booking.status}
														</Badge>
													</div>
												</CardHeader>
												<CardContent>
													<div className="flex items-center justify-between mb-3">
														<div className="flex items-center gap-2 text-lg font-semibold">
															<DollarSign className="w-5 h-5" />${booking.service.price.toLocaleString()}
														</div>
													</div>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															className="flex-1 gap-2 bg-transparent"
															onClick={() => handleDownloadReceipt(booking.id)}
														>
															<Download className="w-4 h-4" />
															{t("actions.receipt")}
														</Button>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button variant="destructive" size="sm">
																	{t("actions.cancel")}
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogTitle>{t("cancelDialog.title")}</AlertDialogTitle>
																<AlertDialogDescription>
																	{t("cancelDialog.desc")}
																</AlertDialogDescription>
																<div className="flex gap-2 justify-end">
																	<AlertDialogCancel>{t("cancelDialog.keep")}</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => handleCancelBooking(booking.id)}
																		className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
																	>
																		{t("cancelDialog.confirm")}
																	</AlertDialogAction>
																</div>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</div>

							<div>
								<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
									<TrendingUp className="w-6 h-6" />
									{t("sections.past")}
								</h2>
								{pastBookings.length === 0 ? (
									<Card>
										<CardContent className="py-12 text-center">
											<Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
											<p className="text-muted-foreground">{t("messages.noPast")}</p>
										</CardContent>
									</Card>
								) : (
									<div className="grid gap-4 md:grid-cols-2">
										{pastBookings.map((booking) => (
											<Card key={booking.id} className="opacity-75">
												<CardHeader>
													<div className="flex items-start justify-between">
														<div>
															<CardTitle className="text-xl">{booking.service.name}</CardTitle>
															<CardDescription className="mt-1">
																<div className="flex items-center gap-2 mt-2">
																	<Calendar className="w-4 h-4" />
																	{booking.date ? new Date(booking.date).toLocaleDateString() : ""}
																</div>
																<div className="flex items-center gap-2 mt-1">
																	<Clock className="w-4 h-4" />
																	{booking.time}
																</div>
															</CardDescription>
														</div>
														<Badge variant="outline">{booking.status}</Badge>
													</div>
												</CardHeader>
												<CardContent>
													<div className="flex items-center justify-between mb-3">
														<div className="flex items-center gap-2 text-lg font-semibold">
															<DollarSign className="w-5 h-5" />${booking.service.price.toLocaleString()}
														</div>
													</div>
													<div className="flex gap-2">
														<Link href={`/?serviceId=${booking.service.id}`} className="flex-1">
															<Button variant="default" size="sm" className="w-full gap-2">
																<Sparkles className="w-4 h-4" />
																{t("actions.bookAgain")}
															</Button>
														</Link>
														<RatingDialog
															serviceId={booking.service.id}
															serviceName={booking.service.name}
															onRatingSubmitted={() => mutate()}
														>
															<Button variant="outline" size="sm" className="flex-1 gap-2">
																<Sparkles className="w-4 h-4" />
																{t("actions.rate")}
															</Button>
														</RatingDialog>
														<Button
															variant="outline"
															size="sm"
															className="flex-1 gap-2 bg-transparent"
															onClick={() => handleDownloadReceipt(booking.id)}
														>
															<Download className="w-4 h-4" />
															{t("actions.receipt")}
														</Button>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="calendar" className="space-y-6">
						<BookingCalendar userId={userId} />
					</TabsContent>

					<TabsContent value="analytics" className="space-y-6">
						<ClientAnalytics />
					</TabsContent>
				</Tabs>
			</div>
		</LayoutAdmin>
	)
}
