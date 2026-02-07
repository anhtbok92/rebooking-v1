"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Gift, Star, Crown, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface Booking {
  id: string
  status: string
}

interface LoyaltyWidgetProps {
  bookings: Booking[]
}

interface UserPoints {
  referralPoints: number
  bookingPoints: number
  totalPoints: number
}

export function LoyaltyWidget({ bookings }: LoyaltyWidgetProps) {
  const { data: session } = useSession()
  const [userPoints, setUserPoints] = useState<UserPoints>({
    referralPoints: 0,
    bookingPoints: 0,
    totalPoints: 0,
  })

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!session?.user?.email) return
      try {
        const res = await fetch("/api/v1/user/points")
        if (res.ok) {
          const data = await res.json()
          setUserPoints(data)
        }
      } catch (err) {
        // Silently fail
      }
    }
    fetchUserPoints()
  }, [session])

  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length
  const bookingPoints = completedBookings * 10 // 10 points per completed booking
  const totalPoints = userPoints.referralPoints + bookingPoints

  const getTier = (points: number) => {
    if (points >= 500) {
      return {
        name: "Platinum",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        icon: Crown,
        description: "Exclusive benefits and priority booking",
        minPoints: 500,
      }
    }
    if (points >= 300) {
      return {
        name: "Gold",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: Award,
        description: "Premium rewards and special offers",
        minPoints: 300,
      }
    }
    if (points >= 100) {
      return {
        name: "Silver",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: Star,
        description: "Enhanced benefits and discounts",
        minPoints: 100,
      }
    }
    return {
      name: "Bronze",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: Gift,
      description: "Earn points with every booking",
      minPoints: 0,
    }
  }

  const getNextTierPoints = (points: number) => {
    if (points < 100) return 100
    if (points < 300) return 300
    if (points < 500) return 500
    return 0 // Max tier
  }

  const tier = getTier(totalPoints)
  const TierIcon = tier.icon
  const nextTierPoints = getNextTierPoints(totalPoints)
  
  // Calculate progress to next tier
  const getProgress = () => {
    if (nextTierPoints === 0) return 100 // Max tier reached
    const currentTierMin = tier.minPoints
    const pointsInCurrentTier = totalPoints - currentTierMin
    const pointsNeededForNextTier = nextTierPoints - currentTierMin
    return pointsNeededForNextTier > 0 ? (pointsInCurrentTier / pointsNeededForNextTier) * 100 : 0
  }
  
  const progress = getProgress()
  const pointsToNextTier = nextTierPoints > 0 ? nextTierPoints - totalPoints : 0

  return (
    <Card className={`bg-card`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TierIcon className={`w-5 h-5 ${tier.color}`} />
            Loyalty Rewards
          </CardTitle>
          <Badge variant="secondary" className={`${tier.color}`}>
            {tier.name}
          </Badge>
        </div>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold">{totalPoints}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
          {nextTierPoints > 0 && (
            <>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {pointsToNextTier} points until {getTier(nextTierPoints).name} tier
              </p>
            </>
          )}
          {nextTierPoints === 0 && (
            <p className="text-xs text-muted-foreground mt-2">You've reached the highest tier! 🎉</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{completedBookings}</p>
            <p className="text-xs text-muted-foreground">Visits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{bookingPoints}</p>
            <p className="text-xs text-muted-foreground">Booking Points</p>
          </div>
        </div>

        {userPoints.referralPoints > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Referral Points:</span>
              <span className="font-semibold text-green-600">+{userPoints.referralPoints}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>10 points per completed booking • 100 points per referral</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
