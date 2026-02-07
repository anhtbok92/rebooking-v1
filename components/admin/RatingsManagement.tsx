"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { RatingDisplay } from "@/components/ratings/RatingDisplay"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Rating {
	id: string
	rating: number
	comment: string | null
	status: string
	createdAt: string
	user: {
		id: string
		name: string | null
		email: string
		image: string | null
	}
	service: {
		id: string
		name: string
		price: number
	}
}

interface RatingsResponse {
	ratings: Rating[]
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

import { useTranslations } from "next-intl"

export function RatingsManagement() {
	const t = useTranslations("Admin.ratings")
	const [page, setPage] = useState(1)
	const [statusFilter, setStatusFilter] = useState<string>("PENDING")
	const [ratings, setRatings] = useState<Rating[]>([])
	const [pagination, setPagination] = useState<RatingsResponse["pagination"] | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const fetchRatings = async () => {
		setIsLoading(true)
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: "20",
			})
			if (statusFilter && statusFilter !== "ALL") {
				params.append("status", statusFilter)
			}

			const response = await fetch(`/api/v1/admin/ratings?${params.toString()}`)
			if (response.ok) {
				const data: RatingsResponse = await response.json()
				setRatings(data.ratings)
				setPagination(data.pagination)
			} else {
				toast.error(t("messages.fetchError"))
			}
		} catch (error) {
			toast.error(t("messages.fetchError"))
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchRatings()
	}, [page, statusFilter])

	const handleApprove = async (ratingId: string) => {
		try {
			const response = await fetch(`/api/v1/admin/ratings/${ratingId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "APPROVED" }),
			})

			if (response.ok) {
				toast.success(t("messages.approveSuccess"))
				fetchRatings()
			} else {
				toast.error(t("messages.approveError"))
			}
		} catch (error) {
			toast.error(t("messages.approveError"))
		}
	}

	const handleReject = async (ratingId: string) => {
		try {
			const response = await fetch(`/api/v1/admin/ratings/${ratingId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "REJECTED" }),
			})

			if (response.ok) {
				toast.success(t("messages.rejectSuccess"))
				fetchRatings()
			} else {
				toast.error(t("messages.rejectError"))
			}
		} catch (error) {
			toast.error(t("messages.rejectError"))
		}
	}

	const handleDelete = async (ratingId: string) => {
		try {
			const response = await fetch(`/api/v1/admin/ratings/${ratingId}`, {
				method: "DELETE",
			})

			if (response.ok) {
				toast.success(t("messages.deleteSuccess"))
				fetchRatings()
			} else {
				toast.error(t("messages.deleteError"))
			}
		} catch (error) {
			toast.error(t("messages.deleteError"))
		}
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "APPROVED":
				return <Badge className="bg-green-500">{t("status.approved")}</Badge>
			case "REJECTED":
				return <Badge className="bg-red-500">{t("status.rejected")}</Badge>
			case "PENDING":
				return <Badge className="bg-yellow-500">{t("status.pending")}</Badge>
			default:
				return <Badge>{status}</Badge>
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
					<CardDescription>{t("description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center gap-4">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={t("filterPlaceholder")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">{t("status.pending")}</SelectItem>
								<SelectItem value="APPROVED">{t("status.approved")}</SelectItem>
								<SelectItem value="REJECTED">{t("status.rejected")}</SelectItem>
								<SelectItem value="ALL">{t("status.all")}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">{t("loading")}</div>
					) : ratings.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">{t("noRatings")}</div>
					) : (
						<div className="space-y-4">
							{ratings.map((rating) => (
								<Card key={rating.id} className="border">
									<CardContent className="p-4">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-3">
													<div>
														<p className="font-semibold">{rating.service.name}</p>
														<p className="text-sm text-muted-foreground">
															{t("by", { name: rating.user.name || rating.user.email })}
														</p>
													</div>
													{getStatusBadge(rating.status)}
												</div>
												<div className="flex items-center gap-2">
													<RatingDisplay rating={rating.rating} size="sm" showCount={false} />
													<span className="text-sm text-muted-foreground">
														{new Date(rating.createdAt).toLocaleDateString()}
													</span>
												</div>
												{rating.comment && (
													<p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
														{rating.comment}
													</p>
												)}
											</div>
											<div className="flex items-center gap-2">
												{rating.status === "PENDING" && (
													<>
														<Button
															size="sm"
															variant="default"
															onClick={() => handleApprove(rating.id)}
															className="bg-green-600 hover:bg-green-700"
														>
															<Check className="w-4 h-4 mr-1" />
															{t("approve")}
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() => handleReject(rating.id)}
														>
															<X className="w-4 h-4 mr-1" />
															{t("reject")}
														</Button>
													</>
												)}
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button size="sm" variant="ghost">
															<Trash2 className="w-4 h-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
															<AlertDialogDescription>
																{t("delete.confirm")}
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
															<AlertDialogAction onClick={() => handleDelete(rating.id)}>
																{t("delete.button")}
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{pagination && pagination.pages > 1 && (
						<div className="mt-6 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								{t("pagination", { page: pagination.page, pages: pagination.pages, total: pagination.total })}
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
								>
									{t("prev")}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
									disabled={page === pagination.pages}
								>
									{t("next")}
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

