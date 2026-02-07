"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Repeat, DollarSign } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  service: {
    id: string
    name: string
    price: number
  }
}

interface QuickRebookProps {
  bookings: Booking[]
}

export function QuickRebook({ bookings }: QuickRebookProps) {
  // Get most frequently booked services
  const serviceFrequency = bookings.reduce(
    (acc, booking) => {
      const serviceId = booking.service.id
      if (!acc[serviceId]) {
        acc[serviceId] = {
          id: serviceId,
          name: booking.service.name,
          price: booking.service.price,
          count: 0,
        }
      }
      acc[serviceId].count += 1
      return acc
    },
    {} as Record<string, { id: string; name: string; price: number; count: number }>,
  )

  const favoriteServices = Object.values(serviceFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="w-5 h-5" />
          Quick Rebook
        </CardTitle>
        <CardDescription>Book your favorite services again</CardDescription>
      </CardHeader>
      <CardContent>
        {favoriteServices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">No booking history yet</p>
            <Link href="/">
              <Button>Book Your First Appointment</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{service.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {service.count}x booked
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    {service.price.toLocaleString()}
                  </div>
                </div>
                <Link href={`/?serviceId=${service.id}`}>
                  <Button size="sm">Book Again</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
