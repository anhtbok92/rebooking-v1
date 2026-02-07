"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Booking {
  id: string
  date: string
  time: string
  status: string
  service: {
    id: string
    name: string
    price: number
  }
}

interface Recommendation {
  service: string
  reason: string
  frequency: string
}

export function AIRecommendations({ bookings }: { bookings: Booking[] }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        const response = await fetch("/api/v1/ai/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookings }),
        })

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.recommendations || [])
        } else {
          // Silently fail - recommendations are not critical
        }
      } catch (error) {
        // Silently fail - recommendations are not critical
      } finally {
        setLoading(false)
      }
    }

    generateRecommendations()
  }, [bookings])

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Loading AI recommendations...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-card from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>Personalized service suggestions based on your booking history</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-muted-foreground">
            No recommendations available yet. Book more services to get personalized suggestions!
          </p>
        ) : (
          <div className="grid gap-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-background/50 border">
                <div>
                  <p className="font-semibold">{rec.service}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {rec.frequency}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
