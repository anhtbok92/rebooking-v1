"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RatingDisplay } from "./RatingDisplay"

interface Rating {
	id: string
	rating: number
	comment: string | null
	createdAt: string
	user: {
		id: string
		name: string | null
		email: string
		image: string | null
	}
}

interface RatingDetailsDialogProps {
	serviceId: string
	serviceName: string
	averageRating: number
	ratingsCount: number
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function RatingDetailsDialog({
	serviceId,
	serviceName,
	averageRating,
	ratingsCount,
	open,
	onOpenChange,
}: RatingDetailsDialogProps) {
	const [ratings, setRatings] = useState<Rating[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (open && serviceId) {
			fetchRatings()
		}
	}, [open, serviceId])

	const fetchRatings = async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`/api/v1/ratings?serviceId=${serviceId}`)
			if (response.ok) {
				const data = await response.json()
				setRatings(data)
			}
		} catch (error) {
			console.error("Failed to fetch ratings:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const getInitials = (name: string | null, email: string) => {
		if (name) {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		}
		return email[0].toUpperCase()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{serviceName} - Reviews</DialogTitle>
					<DialogDescription>
						<div className="flex items-center gap-4 mt-2">
							<div className="flex items-center gap-2">
								<RatingDisplay rating={averageRating} ratingsCount={ratingsCount} size="lg" showCount={true} />
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
				) : ratings.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">No reviews yet</div>
				) : (
					<div className="space-y-4 mt-4">
						{ratings.map((rating) => (
							<div key={rating.id} className="border-b pb-4 last:border-0">
								<div className="flex items-start gap-3">
									<Avatar className="h-10 w-10">
										<AvatarImage src={rating.user.image || undefined} alt={rating.user.name || rating.user.email} />
										<AvatarFallback>{getInitials(rating.user.name, rating.user.email)}</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold">{rating.user.name || rating.user.email.split("@")[0]}</span>
											<span className="text-xs text-muted-foreground">
												{new Date(rating.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div className="mb-2">
											<RatingDisplay rating={rating.rating} size="sm" showCount={false} />
										</div>
										{rating.comment && (
											<p className="text-sm text-muted-foreground mt-2">{rating.comment}</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

