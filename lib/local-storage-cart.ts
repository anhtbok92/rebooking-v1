const GUEST_CART_KEY = "guest_cart"
const GUEST_CART_EXPIRY_KEY = "guest_cart_expiry"
const CART_EXPIRY_HOURS = 24

export type LocalStorageCartItem = {
	id: string
	serviceId: string
	serviceName: string
	price: number
	date: string
	time: string
	photos: string[] // Changed from File[] to string[] to match CartItem type
	doctorId?: string // Optional doctor ID
}

/**
 * Get guest cart from local storage
 */
export function getGuestCart(): LocalStorageCartItem[] {
	if (typeof window === "undefined") return []

	try {
		const cart = localStorage.getItem(GUEST_CART_KEY)
		const expiry = localStorage.getItem(GUEST_CART_EXPIRY_KEY)

		// Check if cart has expired
		if (expiry && new Date(expiry) < new Date()) {
			clearGuestCart()
			return []
		}

		return cart ? JSON.parse(cart) : []
	} catch (error) {
		console.error("Failed to get guest cart:", error)
		return []
	}
}

/**
 * Save guest cart to local storage
 */
export function saveGuestCart(cart: LocalStorageCartItem[]): void {
	if (typeof window === "undefined") return

	try {
		localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))

		// Set expiry time (24 hours from now)
		const expiryTime = new Date()
		expiryTime.setHours(expiryTime.getHours() + CART_EXPIRY_HOURS)
		localStorage.setItem(GUEST_CART_EXPIRY_KEY, expiryTime.toISOString())
	} catch (error) {
		console.error("Failed to save guest cart:", error)
	}
}

/**
 * Clear guest cart from local storage
 */
export function clearGuestCart(): void {
	if (typeof window === "undefined") return

	try {
		localStorage.removeItem(GUEST_CART_KEY)
		localStorage.removeItem(GUEST_CART_EXPIRY_KEY)
	} catch (error) {
		console.error("Failed to clear guest cart:", error)
	}
}

/**
 * Check if guest cart exists and is valid
 */
export function hasValidGuestCart(): boolean {
	if (typeof window === "undefined") return false

	try {
		const cart = localStorage.getItem(GUEST_CART_KEY)
		const expiry = localStorage.getItem(GUEST_CART_EXPIRY_KEY)

		if (!cart || !expiry) return false

		if (new Date(expiry) < new Date()) {
			clearGuestCart()
			return false
		}

		return true
	} catch (error) {
		console.error("Failed to check guest cart:", error)
		return false
	}
}
