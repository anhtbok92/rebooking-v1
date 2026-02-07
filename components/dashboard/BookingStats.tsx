"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react"

interface Booking {
  id: string
  date: string
  status: string
  service: {
    price: number
  }
}

interface BookingStatsProps {
  bookings: Booking[]
}

export function BookingStats({ bookings }: BookingStatsProps) {
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length
  const upcomingBookings = bookings.filter((b) => new Date(b.date) >= new Date() && b.status !== "CANCELLED").length
  const totalSpent = bookings.filter((b) => b.status === "COMPLETED").reduce((sum, b) => sum + b.service.price, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">All time appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedBookings}</div>
          <p className="text-xs text-muted-foreground">Finished appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingBookings}</div>
          <p className="text-xs text-muted-foreground">Scheduled appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Lifetime value</p>
        </CardContent>
      </Card>
    </div>
  )
}
