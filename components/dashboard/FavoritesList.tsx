"use client"

import { useFavorites } from "@/hooks/use-favorites"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useCart } from "@/hooks/use-redux-cart"
import { useState } from "react"

export function FavoritesList() {
  const { favorites, removeFavorite, isLoading } = useFavorites()
  const { addToCart } = useCart()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")

  if (isLoading) {
    return <div>Loading favorites...</div>
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No favorites yet. Add services to your favorites list!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorites ({favorites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {favorites.map((serviceId) => (
            <div key={serviceId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                <span className="font-medium">{serviceId}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFavorite(serviceId)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
