"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"
import React, { useState } from "react"

interface TimeSlot {
	time: string
	available: boolean
	isBooked?: boolean
}

interface TimeSelectionProps {
	timeSlots: TimeSlot[]
	selectedTime: string
	setSelectedTime: (time: string) => void
	isLoading?: boolean
	disabled?: boolean
}

export function TimeSelection({
	timeSlots,
	selectedTime,
	setSelectedTime,
	isLoading = false,
	disabled = false,
}: TimeSelectionProps) {
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

	return (
		<>
			<div
				className={cn(
					"grid gap-3 sm:gap-4 w-full",
					timeSlots.length > 8
						? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
						: "grid-cols-1 xs:grid-cols-2",
					"auto-rows-fr" // Make all rows the same height
				)}
			>
				{isLoading ? (
					[...Array(6)].map((_, index) => (
						<div
							key={index}
							className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card animate-pulse h-14 sm:h-16 border border-border"
						>
							<div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/20" />
							<div className="h-3 w-16 sm:w-20 rounded bg-muted" />
						</div>
					))
				) : timeSlots.length === 0 ? (
					<div className="col-span-full text-center text-muted-foreground py-6 sm:py-8 text-base sm:text-lg">
						No times available for this day.
					</div>
				) : (
					timeSlots.map((slot, index) => {
						const isSelected = selectedTime === slot.time && slot.available

						let borderHighlight = ""
						if (!slot.available) {
							borderHighlight = slot.isBooked
								? "border-destructive"
								: "border-muted"
						} else if (isSelected) {
							borderHighlight =
								"border-2 border-primary shadow-primary/10 shadow-md text-primary"
						} else {
							borderHighlight = "border-border hover:border-primary/80"
						}

						return (
							<button
								key={slot.time}
								type="button"
								onClick={(e) => {
									e.preventDefault()
									if (slot.available && !disabled) setSelectedTime(slot.time)
								}}
								disabled={!slot.available || disabled}
								aria-label={
									!slot.available
										? slot.isBooked
											? `${slot.time} (Booked)`
											: `${slot.time} (Time has passed)`
										: isSelected
											? `${slot.time} (Selected)`
											: `${slot.time} (Available)`
								}
								className={cn(
									"relative flex items-center gap-1.5 sm:gap-2 justify-between py-3 px-3 rounded-xl border transition-all duration-200 text-base sm:text-md font-medium",
									"bg-card",
									borderHighlight,
									"min-h-[3rem] sm:min-h-[3.5rem]",
									slot.available && !isSelected && !disabled && "cursor-pointer",
									(!slot.available || disabled) && "opacity-60 cursor-not-allowed",
									isSelected && "ring-2 ring-primary",
									"w-full",
									"whitespace-nowrap",
									"overflow-hidden"
								)}
								tabIndex={slot.available && !disabled ? 0 : -1}
								onMouseEnter={() => setHoveredIdx(index)}
								onMouseLeave={() => setHoveredIdx(null)}
								data-testid="time-slot"
								style={{
									maxWidth: "100%",
									wordBreak: "break-word"
								}}
							>
								<span
									className={cn(
										"flex-1 text-left font-semibold text-xs sm:text-sm",
										slot.available
											? isSelected
												? "text-primary"
												: "text-foreground"
											: slot.isBooked
												? "text-destructive line-through"
												: "text-muted-foreground line-through"
									)}
									style={{ fontFamily: "var(--font-dm-sans)" }}
								>
									{slot.time}
								</span>
								{slot.available && isSelected && (
									<CheckCircle className="ml-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" aria-label="Selected" />
								)}
								{!slot.available && (
									<XCircle className={cn("ml-1 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0", slot.isBooked ? "text-destructive" : "text-muted-foreground")} />
								)}
								{/* Tooltip description, on hover/focus of unavailable slots */}
								{!slot.available && hoveredIdx === index && (
									<span
										id={`tooltip-${index}`}
										role="tooltip"
										className={cn(
											"absolute z-20 left-1/2 -translate-x-1/2 -top-8 sm:-top-10 whitespace-nowrap px-3 py-1.5 rounded-md shadow-xl text-xs",
											"bg-popover text-popover-foreground border border-border",
											"transition-opacity duration-200 opacity-100"
										)}
									>
										{slot.isBooked ? "Đã được đặt" : "Đã qua giờ"}
									</span>
								)}
							</button>
						)
					})
				)}
			</div>
		</>
	)
}
