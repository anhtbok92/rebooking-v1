"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Clock } from "lucide-react"

interface Booking {
  id: string
  date: string
  time: string
  status: string
  service: {
    name: string
  }
}

interface UpcomingRemindersProps {
  bookings: Booking[]
}

export function UpcomingReminders({ bookings }: UpcomingRemindersProps) {
  const now = new Date()
  const upcomingBookings = bookings
    .filter((b) => new Date(b.date) >= now && b.status !== "CANCELLED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const getDaysUntil = (date: string) => {
    const bookingDate = new Date(date)
    const diffTime = bookingDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyBadge = (daysUntil: number) => {
    if (daysUntil === 0) return { text: "Today", variant: "destructive" as const }
    if (daysUntil === 1) return { text: "Tomorrow", variant: "default" as const }
    if (daysUntil <= 3) return { text: `In ${daysUntil} days`, variant: "secondary" as const }
    return { text: `In ${daysUntil} days`, variant: "outline" as const }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Upcoming Reminders
        </CardTitle>
        <CardDescription>Your next appointments</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => {
              const daysUntil = getDaysUntil(booking.date)
              const urgency = getUrgencyBadge(daysUntil)
              return (
                <div
                  key={booking.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{booking.service.name}</p>
                      <Badge variant={urgency.variant} className="text-xs">
                        {urgency.text}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
