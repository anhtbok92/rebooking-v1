"use client"

import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export function useFavorites() {
	const [favorites, setFavorites] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { data: session } = useSession()

	useEffect(() => {
		const loadFavorites = async () => {
			if (session?.user?.email) {
				try {
					const response = await fetch("/api/v1/favorites")
					if (response.ok) {
						const data = await response.json()
						setFavorites(data.map((fav: any) => fav.serviceId))
					}
				} catch (error) {
					// Silently fail for loading favorites - not critical
				}
			}
			setIsLoading(false)
		}

		loadFavorites()
	}, [session?.user?.email])

		const addFavorite = useCallback(
		async (serviceId: string) => {
			if (!session?.user?.email) {
				toast.error("Please log in to add favorites")
				return
			}

			try {
				const response = await fetch("/api/v1/favorites", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ serviceId }),
				})
				if (response.ok) {
					setFavorites((prev) => [...new Set([...prev, serviceId])])
					toast.success("Added to favorites")
				} else {
					toast.error("Failed to add to favorites")
				}
			} catch (error) {
				toast.error("Failed to add to favorites")
			}
		},
		[session?.user?.email],
	)

	const removeFavorite = useCallback(
		async (serviceId: string) => {
			if (!session?.user?.email) {
				toast.error("Please log in to remove favorites")
				return
			}

			try {
				const response = await fetch(`/api/v1/favorites?serviceId=${serviceId}`, { method: "DELETE" })
				if (response.ok) {
					setFavorites((prev) => prev.filter((id) => id !== serviceId))
					toast.success("Removed from favorites")
				} else {
					toast.error("Failed to remove from favorites")
				}
			} catch (error) {
				toast.error("Failed to remove from favorites")
			}
		},
		[session?.user?.email],
	)

	const isFavorite = useCallback((serviceId: string) => favorites.includes(serviceId), [favorites])

	return { favorites, addFavorite, removeFavorite, isFavorite, isLoading }
}
