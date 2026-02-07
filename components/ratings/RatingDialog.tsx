"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface RatingDialogProps {
	serviceId: string
	serviceName: string
	onRatingSubmitted?: () => void
	children?: React.ReactNode
}

export function RatingDialog({ serviceId, serviceName, onRatingSubmitted, children }: RatingDialogProps) {
	const [open, setOpen] = useState(false)
	const [rating, setRating] = useState(0)
	const [hoveredRating, setHoveredRating] = useState(0)
	const [comment, setComment] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { data: session } = useSession()

	const handleSubmit = async () => {
		if (!session?.user?.email) {
			toast.error("Please log in to submit a rating")
			return
		}

		if (rating === 0) {
			toast.error("Please select a rating")
			return
		}

		setIsSubmitting(true)
		try {
			const response = await fetch("/api/v1/ratings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serviceId,
					rating,
					comment: comment.trim() || null,
				}),
			})

			if (response.ok) {
				toast.success("Rating submitted! It will be reviewed by an admin.")
				setOpen(false)
				setRating(0)
				setComment("")
				onRatingSubmitted?.()
			} else {
				const error = await response.json()
				toast.error(error.error || "Failed to submit rating")
			}
		} catch (error) {
			toast.error("Failed to submit rating")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" size="sm">
						Rate Service
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rate {serviceName}</DialogTitle>
					<DialogDescription>Share your experience with this service</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium mb-2 block">Rating</label>
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoveredRating(star)}
									onMouseLeave={() => setHoveredRating(0)}
									className="focus:outline-none"
								>
									<Star
										className={`w-8 h-8 transition-colors ${
											star <= (hoveredRating || rating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								</button>
							))}
						</div>
					</div>
					<div>
						<label htmlFor="comment" className="text-sm font-medium mb-2 block">
							Comment (Optional)
						</label>
						<Textarea
							id="comment"
							placeholder="Share your thoughts about this service..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={4}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
							{isSubmitting ? "Submitting..." : "Submit Rating"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

