"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Sparkles, XCircle } from "lucide-react"
import { BookingTable } from "./BookingTable"
import { BookingPagination } from "./BookingPagination"

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

interface BookingTabsProps {
	activeTab: "new" | "pending" | "completed" | "all"
	newBookings: Booking[]
	pendingBookings: Booking[]
	completedBookings: Booking[]
	allBookings: Booking[]
	newBookingsCount: number
	pendingPagination?: { page: number; pages: number; total: number } | null
	completedPagination?: { page: number; pages: number; total: number } | null
	allPagination?: { page: number; pages: number; total: number } | null
	itemsPerPage: number
	onTabChange: (tab: "new" | "pending" | "completed" | "all") => void
	onStatusChange: (bookingId: string, status: string) => void
	onDownloadReceipt: (bookingId: string) => void
	onDelete: (bookingId: string) => void
	onNewPageChange: (page: number) => void
	onPendingPageChange: (page: number) => void
	onCompletedPageChange: (page: number) => void
	onAllPageChange: (page: number) => void
	currency?: string
}

import { useTranslations } from "next-intl"

export function BookingTabs({
	activeTab,
	newBookings,
	pendingBookings,
	completedBookings,
	allBookings,
	newBookingsCount,
	pendingPagination,
	completedPagination,
	allPagination,
	itemsPerPage,
	onTabChange,
	onStatusChange,
	onDownloadReceipt,
	onDelete,
	onNewPageChange,
	onPendingPageChange,
	onCompletedPageChange,
	onAllPageChange,
	currency,
}: BookingTabsProps) {
	const t = useTranslations("Admin.bookings")
	const renderBookings = (bookings: Booking[], showConfirmButton = false) => {
		if (bookings.length === 0) {
			return (
				<Card>
					<CardContent className="py-12 text-center">
						<AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
						<p className="text-muted-foreground">{t("card.noBookings")}</p>
					</CardContent>
				</Card>
			)
		}

		return (
			<BookingTable
				bookings={bookings}
				onStatusChange={onStatusChange}
				onDownloadReceipt={onDownloadReceipt}
				onDelete={onDelete}
				showConfirmButton={showConfirmButton}
				currency={currency}
			/>
		)
	}

	return (
		<Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "new" | "pending" | "completed" | "all")} className="space-y-4">
			<TabsList className="grid w-full grid-cols-4">
				<TabsTrigger value="new" className="flex items-center gap-2">
					<Sparkles className="w-4 h-4" />
					<span className="hidden sm:inline">{t("tabs.new")}</span>
					{newBookingsCount > 0 && (
						<Badge variant="secondary" className="ml-2">
							{newBookingsCount}
						</Badge>
					)}
				</TabsTrigger>
				<TabsTrigger value="pending" className="flex items-center gap-2">
					<AlertCircle className="w-4 h-4" />
					<span className="hidden sm:inline">{t("tabs.pending")}</span>
					{pendingPagination && pendingPagination.total > 0 && (
						<Badge variant="secondary" className="ml-2">
							{pendingPagination.total}
						</Badge>
					)}
				</TabsTrigger>
				<TabsTrigger value="completed" className="flex items-center gap-2">
					<CheckCircle2 className="w-4 h-4" />
					<span className="hidden sm:inline">{t("tabs.completed")}</span>
					{completedPagination && completedPagination.total > 0 && (
						<Badge variant="secondary" className="ml-2">
							{completedPagination.total}
						</Badge>
					)}
				</TabsTrigger>
				<TabsTrigger value="all" className="flex items-center gap-2">
					<XCircle className="w-4 h-4" />
					<span className="hidden sm:inline">{t("tabs.all")}</span>
					{allPagination && allPagination.total > 0 && (
						<Badge variant="secondary" className="ml-2">
							{allPagination.total}
						</Badge>
					)}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="new" className="space-y-4">
				{renderBookings(newBookings)}
				{newBookings.length > itemsPerPage && (
					<BookingPagination
						currentPage={1}
						totalPages={Math.ceil(newBookings.length / itemsPerPage)}
						totalItems={newBookings.length}
						itemsPerPage={itemsPerPage}
						onPageChange={onNewPageChange}
					/>
				)}
			</TabsContent>

			<TabsContent value="pending" className="space-y-4">
				{renderBookings(pendingBookings, true)}
				{pendingPagination && pendingPagination.pages > 1 && (
					<BookingPagination
						currentPage={pendingPagination.page}
						totalPages={pendingPagination.pages}
						totalItems={pendingPagination.total}
						itemsPerPage={itemsPerPage}
						onPageChange={onPendingPageChange}
					/>
				)}
			</TabsContent>

			<TabsContent value="completed" className="space-y-4">
				{renderBookings(completedBookings)}
				{completedPagination && completedPagination.pages > 1 && (
					<BookingPagination
						currentPage={completedPagination.page}
						totalPages={completedPagination.pages}
						totalItems={completedPagination.total}
						itemsPerPage={itemsPerPage}
						onPageChange={onCompletedPageChange}
					/>
				)}
			</TabsContent>

			<TabsContent value="all" className="space-y-4">
				{renderBookings(allBookings)}
				{allPagination && allPagination.pages > 1 && (
					<BookingPagination
						currentPage={allPagination.page}
						totalPages={allPagination.pages}
						totalItems={allPagination.total}
						itemsPerPage={itemsPerPage}
						onPageChange={onAllPageChange}
					/>
				)}
			</TabsContent>
		</Tabs>
	)
}

