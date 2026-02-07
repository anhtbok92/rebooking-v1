"use client"

import { ChevronLeft, ChevronRight, Circle } from "lucide-react"

interface CalendarCardProps {
  currentMonth: number
  currentYear: number
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  calendarDays: (number | null)[]
  weekDays: string[]
  selectedDate: number | null
  setSelectedDate: (day: number | null) => void
  bookingCounts: { [key: number]: number }
  selectedService?: string
  disabledDates?: number[]
}

export function CalendarCard({
  currentMonth,
  currentYear,
  handlePreviousMonth,
  handleNextMonth,
  calendarDays,
  weekDays,
  selectedDate,
  setSelectedDate,
  bookingCounts,
  selectedService,
  disabledDates = [],
}: CalendarCardProps) {
  const currentDate = new Date()
  const todayYear = currentDate.getFullYear()
  const todayMonth = currentDate.getMonth() + 1
  const todayDay = currentDate.getDate()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const hasAllTimePassed = (day: number) => {
    const timeSlots = ["8:30 AM", "10:00 AM", "11:30 AM", "1:30 PM", "3:00 PM", "4:30 PM"]

    if (day !== todayDay || currentMonth !== todayMonth || currentYear !== todayYear) {
      return false // Only check for today
    }

    const parseTimeToDate = (time: string) => {
      const [timePart, period] = time.split(" ")
      const [hours, minutes] = timePart.split(":").map(Number)
      const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours
      const timeDate = new Date()
      timeDate.setHours(adjustedHours, minutes, 0, 0)
      return timeDate
    }

    return timeSlots.every((slot) => parseTimeToDate(slot) <= currentDate)
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {monthNames[currentMonth - 1]} {currentYear}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handlePreviousMonth}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />
            }
            const isSelected = selectedDate === day
            const isToday = day === todayDay && currentMonth === todayMonth && currentYear === todayYear
            const isPast = new Date(currentYear, currentMonth - 1, day) < new Date(todayYear, todayMonth - 1, todayDay)
            const bookingCount = bookingCounts[day] || 0
            const isFullyBooked = bookingCount >= 6
            const allTimePassed = hasAllTimePassed(day)
            const isDisabledByService = selectedService && disabledDates.includes(day)
            const isDisabled = isPast || isFullyBooked || allTimePassed || isDisabledByService

            return (
              <button
                key={day}
                onClick={() => !isDisabled && setSelectedDate(day)}
                disabled={Boolean(isDisabled)}
                className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-lg font-medium transition-all ${
                  isDisabled
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                        ? "border-2 border-primary text-card-foreground hover:bg-primary/10"
                        : "text-card-foreground hover:bg-muted"
                }`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
                title={
                  isFullyBooked
                    ? "All slots booked for this service"
                    : allTimePassed
                      ? "All time slots have passed"
                      : isPast
                        ? "Date has passed"
                        : ""
                }
              >
                <span>{day}</span>
                {bookingCount > 0 && (
                  <div className="absolute bottom-1 flex justify-center gap-0.5">
                    {Array.from({ length: Math.min(bookingCount, 6) }).map((_, i) => (
                      <Circle
                        key={i}
                        className={`w-1 h-1 ${
                          isFullyBooked ? "text-destructive fill-destructive" : "text-primary fill-primary"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
