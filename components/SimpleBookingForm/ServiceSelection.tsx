"use client"

import { RatingDetailsDialog } from "@/components/ratings/RatingDetailsDialog"
import { RatingDisplay } from "@/components/ratings/RatingDisplay"
import { Skeleton } from "@/components/ui/skeleton"
import { useFavorites } from "@/hooks/use-favorites"
import { Brush, Droplet, Footprints, Hand, Heart, Palette } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

type Service = {
	id: string
	name: string
	price: number
	rating?: number
	ratingsCount?: number
}

interface ServiceSelectionProps {
	services: Service[]
	selectedService: string
	setSelectedService: (id: string) => void
	isLoading?: boolean
}

export function ServiceSelection({ services, selectedService, setSelectedService, isLoading = false }: ServiceSelectionProps) {
	const { isFavorite, addFavorite, removeFavorite } = useFavorites()
	const { data: session } = useSession()
	const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
	const [selectedServiceForRating, setSelectedServiceForRating] = useState<Service | null>(null)

	const handleRatingClick = (service: Service, e?: React.MouseEvent) => {
		if (e) {
			e.stopPropagation()
			e.preventDefault()
		}
		setSelectedServiceForRating(service)
		setRatingDialogOpen(true)
	}

	return (
		<>
			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="w-full p-4 rounded-lg border border-border bg-card flex items-center gap-3">
							<Skeleton className="w-10 h-10 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-5 w-2/3" />
								<Skeleton className="h-4 w-1/2" />
							</div>
							<Skeleton className="w-16 h-6" />
						</div>
					))}
				</div>
			) : (
				<div className="space-y-3">
					{services.map((service) => {
						// Map service names to icons (case-insensitive)
						const serviceNameLower = service.name.toLowerCase()
						const Icon =
							serviceNameLower.includes("manicure")
								? Hand
								: serviceNameLower.includes("pedicure")
									? Footprints
									: serviceNameLower.includes("refill")
										? Brush
										: serviceNameLower.includes("nail art") || serviceNameLower.includes("nail-art")
											? Palette
											: Droplet
						const isSelected = selectedService === service.id
						return (
							<button
								key={service.id}
								onClick={() => setSelectedService(service.id)}
								className={`w-full p-4 bg-card rounded-lg border-1 transition-colors bg-gradient-to-r from-primary/5 to-muted/5 ${isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
									>
										<Icon className="w-6 h-6" />
									</div>
									<div className="flex-1 text-left">
										<div className="flex items-center gap-2">
											<h3
												className="font-semibold text-card-foreground text-lg"
												style={{ fontFamily: "var(--font-space-grotesk)" }}
											>
												{service.name}
											</h3>
											{session?.user && (
												<div
													role="button"
													tabIndex={0}
													onClick={(e) => {
														e.stopPropagation()
														e.preventDefault()
														if (isFavorite(service.id)) {
															removeFavorite(service.id)
														} else {
															addFavorite(service.id)
														}
													}}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault()
															e.stopPropagation()
															if (isFavorite(service.id)) {
																removeFavorite(service.id)
															} else {
																addFavorite(service.id)
															}
														}
													}}
													className="focus:outline-none focus:ring-2 focus:ring-primary rounded cursor-pointer"
													aria-label={isFavorite(service.id) ? "Remove from favorites" : "Add to favorites"}
												>
													<Heart
														className={`w-5 h-5 transition-colors ${isFavorite(service.id)
															? "fill-red-500 text-red-500"
															: "text-gray-400 hover:text-red-500"
															}`}
													/>
												</div>
											)}
										</div>
										<div
											className="mt-1 cursor-pointer inline-block"
											onClick={(e) => {
												e.stopPropagation()
												e.preventDefault()
												if (service.ratingsCount && service.ratingsCount > 0) {
													handleRatingClick(service, e)
												}
											}}
										>
											<RatingDisplay
												rating={service.rating || 0}
												ratingsCount={service.ratingsCount}
												size="sm"
												serviceId={service.id}
												serviceName={service.name}
												clickable={false}
											/>
										</div>
									</div>
									<div className="text-right flex items-center gap-1">
										<span className="font-bold text-primary text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
											{service.price.toLocaleString("vi-VN")}
										</span>
										<span className="text-sm text-muted-foreground">đ</span>
									</div>
								</div>
							</button>
						)
					})}
				</div>
			)}
			{selectedServiceForRating && (
				<RatingDetailsDialog
					serviceId={selectedServiceForRating.id}
					serviceName={selectedServiceForRating.name}
					averageRating={selectedServiceForRating.rating || 0}
					ratingsCount={selectedServiceForRating.ratingsCount || 0}
					open={ratingDialogOpen}
					onOpenChange={setRatingDialogOpen}
				/>
			)}
		</>
	)
}
