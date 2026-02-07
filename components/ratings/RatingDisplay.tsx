"use client"

import { Star } from "lucide-react"

interface RatingDisplayProps {
	rating: number
	ratingsCount?: number
	size?: "sm" | "md" | "lg"
	showCount?: boolean
	serviceId?: string
	serviceName?: string
	clickable?: boolean
	onClick?: (e?: React.MouseEvent) => void
}

export function RatingDisplay({
	rating,
	ratingsCount,
	size = "md",
	showCount = true,
	serviceId,
	serviceName,
	clickable = false,
	onClick,
}: RatingDisplayProps) {
	const sizeClasses = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	}

	const starSize = sizeClasses[size]

	const hasNoRating = rating === 0 && (!ratingsCount || ratingsCount === 0)

	const renderStars = () => {
		if (hasNoRating) {
			// Show blurred stars for no rating
			const stars = []
			for (let i = 0; i < 5; i++) {
				stars.push(
					<Star key={i} className={`${starSize} text-gray-300 blur-[0.5px] opacity-50`} />
				)
			}
			return stars
		}

		const fullStars = Math.floor(rating)
		const halfStar = rating % 1 >= 0.5
		const stars = []

		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(<Star key={i} className={`${starSize} fill-yellow-400 text-yellow-400`} />)
			} else if (i === fullStars && halfStar) {
				stars.push(
					<div key={i} className={`relative ${starSize}`}>
						<Star className={`${starSize} text-gray-300`} />
						<Star
							className={`${starSize} fill-yellow-400 text-yellow-400 absolute top-0 left-0`}
							style={{ clipPath: "inset(0 50% 0 0)" }}
						/>
					</div>,
				)
			} else {
				stars.push(<Star key={i} className={`${starSize} text-gray-300`} />)
			}
		}
		return stars
	}

	const content = (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-1">{renderStars()}</div>
			{showCount && (
				<span className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
					{hasNoRating ? "(0)" : `(${ratingsCount || 0})`}
				</span>
			)}
		</div>
	)

	if (clickable && ratingsCount && ratingsCount > 0) {
		return (
			<button
				type="button"
				onClick={(e) => onClick?.(e)}
				className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/20 rounded cursor-pointer"
				aria-label={`View ${ratingsCount} reviews for ${serviceName || "this service"}`}
			>
				{content}
			</button>
		)
	}

	return content
}

