"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface FavoritesButtonProps {
  serviceId: string
  className?: string
}

export function FavoritesButton({ serviceId, className }: FavoritesButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { data: session } = useSession()

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please log in to add favorites")
      return
    }

    if (isFavorite(serviceId)) {
      await removeFavorite(serviceId)
      toast.success("Removed from favorites")
    } else {
      await addFavorite(serviceId)
      toast.success("Added to favorites")
    }
  }

  const isFav = isFavorite(serviceId)

  return (
    <Button variant="ghost" size="sm" onClick={handleToggleFavorite} className={className}>
      <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
    </Button>
  )
}
