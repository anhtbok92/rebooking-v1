"use client"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useServices } from "@/lib/swr/hooks/services"
import { useBookings } from "@/lib/swr/hooks/bookings"

type Service = { id: string; name: string; price: number; stripePriceId?: string; rating?: number; ratingsCount?: number }
type TimeSlot = { time: string; available: boolean; isBooked?: boolean }
type BookingCount = { [key: number]: number }

const defaultTimeSlots: TimeSlot[] = [
	{ time: "8:30 AM", available: true }, { time: "10:00 AM", available: true },
	{ time: "11:30 AM", available: true }, { time: "1:30 PM", available: true },
	{ time: "3:00 PM", available: true }, { time: "4:30 PM", available: true }
]

const generateCalendarDays = (month: number, year: number) => {
	const days: (number | null)[] = []
	const first = new Date(year, month - 1, 1).getDay(), total = new Date(year, month, 0).getDate()
	for (let i = 0; i < first; i++) days.push(null)
	for (let d = 1; d <= total; d++) days.push(d)
	return days
}

const parseTimeToDate = (time: string, date: Date) => {
	const [t, p] = time.split(" "), [h, m] = t.split(":").map(Number)
	const hrs = p === "PM" && h !== 12 ? h + 12 : p === "AM" && h === 12 ? 0 : h
	const d = new Date(date); d.setHours(hrs, m, 0, 0)
	return d
}

export const useBookingForm = (initialServiceId?: string) => {
	const { data: session } = useSession(), today = new Date()
	const [selectedService, setSelectedService] = useState(initialServiceId || "")
	const [selectedDate, setSelectedDate] = useState<number | null>(null)
	const [selectedTime, setSelectedTime] = useState("")
	const [photos, setPhotos] = useState<string[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [timeSlots, setTimeSlots] = useState(defaultTimeSlots)
	const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
	const [currentYear, setCurrentYear] = useState(today.getFullYear())
	const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

	const { data: servicesData, error: servicesError, isLoading: isLoadingServices } = useServices({ limit: 1000 })
	const services = servicesData?.services || []

	const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`
	const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
	const endDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${daysInMonth}`

	const { data: bookingsData } = useBookings({ startDate, endDate, limit: 1000 })
	const bookingCounts = (bookingsData?.bookings || []).reduce((acc: BookingCount, b) => {
		const d = new Date(b.date).getDate()
		acc[d] = (acc[d] || 0) + 1
		return acc
	}, {})

	const selectedDateString = selectedDate && selectedService
		? `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
		: null

	const { data: dateBookingsData, isLoading: isLoadingDateBookings } = useBookings({
		date: selectedDateString || undefined, serviceId: selectedService || undefined, limit: 1000
	})

	const todayYear = today.getFullYear(), todayMonth = today.getMonth() + 1, todayDay = today.getDate()
	const calendarDays = generateCalendarDays(currentMonth, currentYear)
	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

	useEffect(() => { if (servicesError) toast.error("Failed to load services") }, [servicesError])

	useEffect(() => {
		if (initialServiceId && services.length && !selectedService) {
			const service = services.find(s => s.id === initialServiceId)
			if (service) setSelectedService(initialServiceId)
		}
	}, [initialServiceId, services, selectedService])

	useEffect(() => {
		if (currentMonth === todayMonth && currentYear === todayYear) setSelectedDate(todayDay)
	}, [currentMonth, currentYear, todayDay, todayMonth, todayYear])

	useEffect(() => {
		if (!selectedDate || !selectedService) {
			setTimeSlots(defaultTimeSlots.map(ts => ({ ...ts, isBooked: false })))
			setIsLoadingTimeSlots(false)
			return
		}
		setIsLoadingTimeSlots(isLoadingDateBookings)
		if (dateBookingsData?.bookings) {
			const booked = dateBookingsData.bookings.map(b => b.time)
			const isToday = selectedDate === todayDay && currentMonth === todayMonth && currentYear === todayYear
			const selectedDateTime = new Date(currentYear, currentMonth - 1, selectedDate)
			const now = new Date()
			const slots = defaultTimeSlots.map(slot => {
				const isBooked = booked.includes(slot.time)
				const slotTime = parseTimeToDate(slot.time, selectedDateTime)
				if (isBooked) return { ...slot, available: false, isBooked: true }
				if (isToday && slotTime <= now) return { ...slot, available: false, isBooked: false }
				return { ...slot, available: true, isBooked: false }
			})
			setTimeSlots(slots)
			if (
				booked.includes(selectedTime)
				|| (isToday && selectedTime && parseTimeToDate(selectedTime, selectedDateTime) <= now)
			) setSelectedTime("")
		}
	}, [dateBookingsData, selectedDate, selectedService, currentMonth, currentYear, selectedTime, todayDay, todayMonth, todayYear, isLoadingDateBookings])

	const selectedServiceData = selectedService ? services.find(s => s.id === selectedService) : undefined
	const totalPrice = selectedServiceData?.price || 0

	const setMonth = (next = true) => {
		setSelectedTime("")
		let newMonth = next ? (currentMonth === 12 ? 1 : currentMonth + 1) : (currentMonth === 1 ? 12 : currentMonth - 1)
		let newYear = next
			? (currentMonth === 12 ? currentYear + 1 : currentYear)
			: (currentMonth === 1 ? currentYear - 1 : currentYear)
		setCurrentMonth(newMonth)
		setCurrentYear(newYear)
		setSelectedDate((newMonth === todayMonth && newYear === todayYear) ? todayDay : null)
	}
	const handlePreviousMonth = () => setMonth(false)
	const handleNextMonth = () => setMonth(true)

	const removePhoto = useCallback(
		(idx: number) => setPhotos(photos => photos.filter((_, i) => i !== idx)), []
	)

	const sendWhatsAppConfirmation = async (payload: {
		userName: string, phone: string, serviceName: string, date: string, time: string, totalPrice: number
	}) => {
		try {
			const res = await fetch("/api/v1/send-whatsapp", {
				method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
			})
			if (!res.ok) throw new Error((await res.json()).error || "Failed to send WhatsApp confirmation")
		} catch (err: any) {
			toast.error(err?.message || "Failed to send WhatsApp confirmation")
		}
	}

	const handleSubmit = async () => {
		if (!selectedService || !selectedDate || !selectedTime)
			return toast.error("Please complete all required fields")
		setIsSubmitting(true)
		setError(null)
		try {
			const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
			const bookingData = { serviceIds: [selectedService], date: dateStr, time: selectedTime, photoUrls: photos }
			const res = await fetch("/api/v1/bookings", {
				method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingData)
			})
			if (!res.ok) throw new Error((await res.json()).error || "Failed to create booking")
			await sendWhatsAppConfirmation({
				userName: "", phone: "", serviceName: selectedServiceData?.name || "",
				date: dateStr, time: selectedTime, totalPrice
			})
			toast.success("Booking confirmed! Check your WhatsApp for details.")
			setSelectedService(""); setSelectedDate(null); setSelectedTime(""); setPhotos([]); setError(null)
		} catch (err: any) {
			const msg = err?.message || "An error occurred"
			setError(msg)
			toast.error(msg)
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		services, selectedService, setSelectedService, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
		photos, setPhotos, currentMonth, currentYear, handlePreviousMonth, handleNextMonth,
		calendarDays, weekDays, timeSlots, bookingCounts, error, isSubmitting,
		handleSubmit, totalPrice, selectedServiceData, removePhoto, isLoadingTimeSlots, isLoadingServices,
	}
}
