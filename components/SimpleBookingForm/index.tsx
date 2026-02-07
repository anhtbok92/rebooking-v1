"use client"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-redux-cart"
import { ShoppingCart, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { CalendarCard } from "./CalendarCard"
import { CartSummary } from "./CartSummary"
import { PhotoUpload } from "./PhotoUpload"
import { ServiceSelection } from "./ServiceSelection"
import { TimeSelection } from "./TimeSelection"
import { useBookingForm } from "./useBookingForm"

const LabelStep = ({ step, children }: { step: number; children: React.ReactNode }) => (
	<div className="flex items-center gap-2 mb-2">
		<div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{step}</div>
		<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)" }}>{children}</h3>
	</div>
)

function SimpleBookingFormContent() {
	const t = useTranslations("Booking")
	const searchParams = useSearchParams()
	const serviceIdFromUrl = searchParams.get("serviceId") || undefined

	const form = useBookingForm(serviceIdFromUrl)
	const {
		services, selectedService, setSelectedService, selectedDate, setSelectedDate,
		selectedTime, setSelectedTime, photos, setPhotos, currentMonth, currentYear,
		handlePreviousMonth, handleNextMonth, calendarDays, weekDays, timeSlots,
		bookingCounts, totalPrice, selectedServiceData, isLoadingTimeSlots, isLoadingServices
	} = form

	const { addToCart, cartCount } = useCart()
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [prevCartCount, setPrevCartCount] = useState<number | null>(null)
	const [isInit, setIsInit] = useState(true)

	// Always keep cart closed on mount/refresh and on empty
	useEffect(() => { setIsCartOpen(false) }, [])
	useEffect(() => {
		if (isInit) { setPrevCartCount(cartCount); setIsCartOpen(false); setIsInit(false) }
	}, [cartCount, isInit])
	useEffect(() => { if (cartCount === 0) setIsCartOpen(false) }, [cartCount])

	// Open cart only if new item is added (not initial load)
	useEffect(() => {
		if (!isInit && prevCartCount !== null && cartCount > prevCartCount && cartCount > 0) setIsCartOpen(true)
		setPrevCartCount(cartCount)
	}, [cartCount]) // purposely do NOT depend on prevCartCount or isInit

	// Scroll into view if service preselected
	useEffect(() => {
		if (serviceIdFromUrl && selectedService === serviceIdFromUrl)
			setTimeout(() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }), 100)
	}, [serviceIdFromUrl, selectedService])

	// Booked-out day
	const allSlotsBooked = !!selectedDate && !!selectedService && timeSlots.every(t => !t.available)

	// Handle add-to-cart (by form state changing)
	useEffect(() => {
		if (selectedService && selectedDate && selectedTime) {
			addToCart({
				id: `${selectedService}-${selectedDate}-${selectedTime}-${Date.now()}`,
				serviceId: selectedService,
				serviceName: selectedServiceData?.name || "",
				price: totalPrice,
				date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
				time: selectedTime,
				photos,
			})
			toast.success(t("addedToCart"), {
				description: t("addedDescription", { service: selectedServiceData?.name || "" })
			})
			setSelectedService("")
			setSelectedDate(null)
			setSelectedTime("")
			setPhotos([])
		}
		// eslint-disable-next-line
	}, [selectedService, selectedDate, selectedTime])

	return (
		<div id="booking" className="relative py-8 px-4 sm:px-6 lg:px-8 scroll-mt-20">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-dm-sans)" }}>
						{t("description")}
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex flex-col space-y-4">
						<LabelStep step={1}>{t("step1")}</LabelStep>
						<ServiceSelection services={services} selectedService={selectedService} setSelectedService={setSelectedService} isLoading={isLoadingServices} />
					</div>
					<div className="flex flex-col space-y-4">
						<LabelStep step={2}>{t("step2")}</LabelStep>
						<CalendarCard
							currentMonth={currentMonth}
							currentYear={currentYear}
							handlePreviousMonth={handlePreviousMonth}
							handleNextMonth={handleNextMonth}
							calendarDays={calendarDays}
							weekDays={weekDays}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
							bookingCounts={bookingCounts}
							selectedService={selectedService}
							disabledDates={selectedService
								? Object.keys(bookingCounts).filter(day => bookingCounts[+day] >= 6).map(Number)
								: []
							}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<LabelStep step={3}>{t("step3")}</LabelStep>
						<TimeSelection
							timeSlots={timeSlots}
							selectedTime={selectedTime}
							setSelectedTime={setSelectedTime}
							isLoading={isLoadingTimeSlots}
							disabled={!selectedService || !selectedDate}
						/>
						{allSlotsBooked && (
							<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4">
								<p className="text-destructive text-sm font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
									{t("allBooked")}
								</p>
							</div>
						)}
					</div>
				</div>
				{selectedService && selectedDate && !allSlotsBooked &&
					<div className="mt-8">
						<LabelStep step={4}>
							{t("step4")} <span className="normal-case text-xs text-muted-foreground/70">{t("optional")}</span>
						</LabelStep>
						<PhotoUpload photos={photos} setPhotos={setPhotos} />
					</div>
				}
			</div>
			<Button
				onClick={() => setIsCartOpen(true)}
				className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
				size="icon"
				aria-label="Open cart"
			>
				<ShoppingCart className="w-6 h-6" />
				{cartCount > 0 &&
					<span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
						{cartCount}
					</span>}
			</Button>

			{isCartOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/50 z-40"
						onClick={() => setIsCartOpen(false)}
						aria-hidden="true"
					/>
					<div
						className={`fixed top-0 right-0 h-full w-full md:w-96 lg:w-[420px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
						onClick={e => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
							<div className="flex items-center gap-2">
								<ShoppingCart className="w-5 h-5 text-primary" />
								<h2 className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
									{t("cart.title")} {cartCount > 0 && `(${cartCount})`}
								</h2>
							</div>
							<Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="h-8 w-8" aria-label="Close cart">
								<X className="w-5 h-5" />
							</Button>
						</div>
						<div className="h-[calc(100vh-80px)] overflow-y-auto p-4 md:p-6">
							<CartSummary onClose={() => setIsCartOpen(false)} />
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export function SimpleBookingForm() {
	const t = useTranslations("Booking")
	return (
		<Suspense fallback={
			<div className="relative py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
							{t("title")}
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-dm-sans)" }}>
							{t("description")}
						</p>
					</div>
				</div>
			</div>
		}>
			<SimpleBookingFormContent />
		</Suspense>
	)
}
