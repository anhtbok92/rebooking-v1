"use client"

import { clearGuestCart, getGuestCart, hasValidGuestCart, saveGuestCart } from "@/lib/local-storage-cart"
import type { CartItem } from "@/store/cartSlice"
import {
	addToCart as addToCartAction,
	clearCart as clearCartAction,
	initializeCart,
	removeFromCart as removeFromCartAction,
	updateCartItem as updateCartItemAction,
	selectCart,
	selectCartCount,
	selectCartTotal,
	selectIsLoading,
} from "@/store/cartSlice"
import type { AppDispatch } from "@/store/store"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

export function useCart() {
	const dispatch = useDispatch<AppDispatch>()
	const { data: session, status } = useSession()
	const cart = useSelector(selectCart)
	const cartTotal = useSelector(selectCartTotal)
	const cartCount = useSelector(selectCartCount)
	const isLoading = useSelector(selectIsLoading)
	const hasSyncedRef = useRef(false)
	const isSyncingRef = useRef(false)
	const hasLoadedRef = useRef(false) // Track if we've loaded cart for unauthenticated users

	// Normalize date format for comparison (same as backend)
	const normalizeDate = (date: Date | string): string => {
		const dateObj = typeof date === "string" ? new Date(date) : date
		return dateObj.toISOString().split("T")[0] // Get YYYY-MM-DD format
	}

	useEffect(() => {
		const loadCart = async () => {
			if (session?.user?.email && status === "authenticated") {
				// User is logged in - first sync guest cart if exists, then load from database
				try {
					// Check if there's a guest cart to sync (only once, and not already syncing)
					if (!hasSyncedRef.current && !isSyncingRef.current && hasValidGuestCart()) {
						const guestCart = getGuestCart()

						if (guestCart.length > 0) {
							// Mark as syncing immediately to prevent multiple syncs
							isSyncingRef.current = true

							// Deduplicate items within guest cart first (normalize dates)
							const uniqueGuestItems = new Map<string, typeof guestCart[0]>()
							guestCart.forEach((item) => {
								const key = `${item.serviceId}-${normalizeDate(item.date)}-${item.time}`
								if (!uniqueGuestItems.has(key)) {
									uniqueGuestItems.set(key, item)
								}
							})

							// Convert guest cart items to sync format
							const itemsToSync = Array.from(uniqueGuestItems.values()).map((item) => ({
								serviceId: item.serviceId,
								date: item.date,
								time: item.time,
							}))

							const syncResponse = await fetch("/api/v1/cart/sync", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ guestCartItems: itemsToSync }),
							})

							if (syncResponse.ok) {
								const result = await syncResponse.json()
								clearGuestCart()
								hasSyncedRef.current = true
							} else {
								// Silently fail - cart sync is not critical
							}
							isSyncingRef.current = false
						} else {
							hasSyncedRef.current = true
						}
					}

					// Load cart from database (includes synced items, already deduplicated by backend)
					const response = await fetch("/api/v1/cart")
					if (response.ok) {
						const dbCart = await response.json()
						const formattedCart = dbCart.map((item: any) => ({
							id: item.id,
							serviceId: item.serviceId,
							serviceName: item.service.name,
							price: item.service.price,
							date: item.date,
							time: item.time,
							photos: [],
							doctorId: item.doctorId,
						}))
						dispatch(initializeCart(formattedCart))
					} else {
						dispatch(initializeCart([]))
					}
				} catch (error) {
					// Silently fail - cart loading errors are not critical
					isSyncingRef.current = false
					dispatch(initializeCart([]))
				}
			} else if (status === "unauthenticated") {
				// User is not logged in - load from local storage
				hasSyncedRef.current = false // Reset sync flag when logged out
				isSyncingRef.current = false
				
				// Only load once to avoid conflicts with Redux persist
				if (!hasLoadedRef.current) {
					hasLoadedRef.current = true
					
					// Wait a bit for Redux persist to rehydrate, then check current state
					setTimeout(() => {
						// Get current cart state (may have been rehydrated by Redux persist)
						const currentCart = cart
						const guestCart = getGuestCart()
						
						// If Redux state is empty (not yet rehydrated or no persisted data)
						// and we have items in localStorage, load them
						if (currentCart.length === 0 && guestCart.length > 0) {
							dispatch(initializeCart(guestCart))
						} else if (currentCart.length > 0) {
							// Redux persist has restored state, sync localStorage with it
							saveGuestCart(currentCart)
						} else {
							// Both are empty, ensure state is initialized
							dispatch(initializeCart([]))
						}
					}, 150) // Small delay to allow Redux persist to rehydrate
				}
			} else {
				// Reset load flag when status changes
				hasLoadedRef.current = false
			}
		}

		loadCart()
	}, [session?.user?.email, status, dispatch])

	useEffect(() => {
		// Save cart to local storage when user is not logged in
		// Only save if status is confirmed unauthenticated to avoid race conditions
		if (status === "unauthenticated") {
			// Always save, even if cart is empty (to clear localStorage if needed)
			// This ensures localStorage stays in sync with Redux state
			// Redux persist handles persistence, but we also save to guest_cart for compatibility
			saveGuestCart(cart)
		}
	}, [cart, status])

	const addToCart = useCallback(
		async (item: CartItem) => {
			if (session?.user?.email) {
				try {
					const response = await fetch("/api/v1/cart", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							serviceId: item.serviceId,
							date: item.date,
							time: item.time,
							doctorId: item.doctorId,
						}),
					})
					if (response.ok) {
						const newItem = await response.json()
						dispatch(
							addToCartAction({
								id: newItem.id,
								serviceId: newItem.serviceId,
								serviceName: newItem.service.name,
								price: newItem.service.price,
								date: newItem.date,
								time: newItem.time,
								photos: [],
								doctorId: newItem.doctorId,
							}),
						)
					} else if (response.status === 409) {
						// Item already in cart - reload cart from database to get the latest state
						const cartResponse = await fetch("/api/v1/cart")
						if (cartResponse.ok) {
							const dbCart = await cartResponse.json()
							const formattedCart = dbCart.map((item: any) => ({
								id: item.id,
								serviceId: item.serviceId,
								serviceName: item.service.name,
								price: item.service.price,
								date: item.date,
								time: item.time,
								photos: [],
								doctorId: item.doctorId,
							}))
							dispatch(initializeCart(formattedCart))
						}
					}
				} catch (error) {
					// Fallback to local cart if API fails
					dispatch(addToCartAction(item))
				}
			} else {
				// For guest users, check for duplicates in local cart before adding
				const existingItem = cart.find(
					(cartItem) =>
						cartItem.serviceId === item.serviceId &&
						normalizeDate(cartItem.date) === normalizeDate(item.date) &&
						cartItem.time === item.time,
				)
				if (!existingItem) {
					// Calculate the new cart state before dispatching
					const updatedCart = [...cart, item]
					dispatch(addToCartAction(item))
					// Explicitly save to localStorage immediately for guest users
					// This ensures persistence even if Redux persist has issues
					saveGuestCart(updatedCart)
				}
			}
		},
		[session?.user?.email, dispatch, cart],
	)

	const removeFromCart = useCallback(
		async (id: string) => {
			if (session?.user?.email) {
				try {
					await fetch(`/api/v1/cart?id=${id}`, { method: "DELETE" })
				} catch (error) {
					// Silently fail - removal will still work locally
				}
			} else {
				// For guest users, calculate updated cart and save to localStorage immediately
				const updatedCart = cart.filter((item) => item.id !== id)
				// Save to localStorage immediately for guest users
				// This ensures persistence even if Redux persist has issues
				saveGuestCart(updatedCart)
			}
			dispatch(removeFromCartAction(id))
		},
		[session?.user?.email, dispatch, cart],
	)

	const clearCart = useCallback(async () => {
		if (session?.user?.email) {
			try {
				await fetch("/api/v1/cart/clear", { method: "POST" })
			} catch (error) {
				// Silently fail - clearing will still work locally
			}
		} else {
			clearGuestCart()
		}
		dispatch(clearCartAction())
	}, [session?.user?.email, dispatch])

	const updateCartItem = useCallback(
		async (id: string, updates: Partial<CartItem>) => {
			if (session?.user?.email) {
				try {
					// Only send fields that the API expects (serviceId, date, time, doctorId)
					const apiUpdates: { serviceId?: string; date?: string; time?: string; doctorId?: string } = {}
					if (updates.serviceId) apiUpdates.serviceId = updates.serviceId
					if (updates.date) apiUpdates.date = updates.date
					if (updates.time) apiUpdates.time = updates.time
					if (updates.doctorId !== undefined) apiUpdates.doctorId = updates.doctorId

					const response = await fetch(`/api/v1/cart?id=${id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(apiUpdates),
					})
					if (response.ok) {
						const updatedItem = await response.json()
						// Format date to YYYY-MM-DD string
						const formattedDate = typeof updatedItem.date === "string" 
							? updatedItem.date.split("T")[0] 
							: new Date(updatedItem.date).toISOString().split("T")[0]
						
						dispatch(
							updateCartItemAction({
								id,
								updates: {
									serviceId: updatedItem.serviceId,
									serviceName: updatedItem.service.name,
									price: updatedItem.service.price,
									date: formattedDate,
									time: updatedItem.time,
									photos: updates.photos || [],
									doctorId: updatedItem.doctorId,
								},
							}),
						)
					} else {
						// If API fails, still update locally
						dispatch(updateCartItemAction({ id, updates }))
					}
				} catch (error) {
					// Fallback to local update if API fails
					dispatch(updateCartItemAction({ id, updates }))
				}
			} else {
				// For guest users, update locally
				dispatch(updateCartItemAction({ id, updates }))
			}
		},
		[session?.user?.email, dispatch],
	)

	return {
		cart,
		addToCart,
		removeFromCart,
		clearCart,
		updateCartItem,
		cartTotal,
		cartCount,
		isLoading,
	}
}
