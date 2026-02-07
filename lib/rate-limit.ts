import { NextRequest, NextResponse } from "next/server"

interface RateLimitStore {
	[key: string]: {
		count: number
		resetTime: number
	}
}

// In-memory store (for production, use Redis or similar)
const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
	const now = Date.now()
	Object.keys(store).forEach((key) => {
		if (store[key].resetTime < now) {
			delete store[key]
		}
	})
}, 5 * 60 * 1000)

export interface RateLimitOptions {
	windowMs: number // Time window in milliseconds
	maxRequests: number // Maximum requests per window
	message?: string
	skipSuccessfulRequests?: boolean
	skipFailedRequests?: boolean
}

export function rateLimit(options: RateLimitOptions) {
	const { windowMs, maxRequests, message = "Too many requests, please try again later", skipSuccessfulRequests = false, skipFailedRequests = false } = options

	return async (req: NextRequest): Promise<NextResponse | null> => {
		// Get identifier (IP address or user ID)
		const identifier = getIdentifier(req)

		const now = Date.now()
		const record = store[identifier]

		// Initialize or reset if window expired
		if (!record || record.resetTime < now) {
			store[identifier] = {
				count: 1,
				resetTime: now + windowMs,
			}
			return null // No rate limit exceeded
		}

		// Increment count
		record.count++

		// Check if limit exceeded
		if (record.count > maxRequests) {
			const retryAfter = Math.ceil((record.resetTime - now) / 1000)
			return NextResponse.json(
				{
					error: message,
					retryAfter,
				},
				{
					status: 429,
					headers: {
						"Retry-After": retryAfter.toString(),
						"X-RateLimit-Limit": maxRequests.toString(),
						"X-RateLimit-Remaining": "0",
						"X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
					},
				}
			)
		}

		return null // No rate limit exceeded
	}
}

function getIdentifier(req: NextRequest): string {
	// Try to get user ID from session/token first
	// For now, use IP address
	const forwarded = req.headers.get("x-forwarded-for")
	const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown"
	return ip
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 100, // 100 requests per 15 minutes
})

export const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5, // 5 login attempts per 15 minutes
	message: "Too many authentication attempts, please try again later",
})

export const checkoutRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	maxRequests: 10, // 10 checkout attempts per hour
	message: "Too many checkout attempts, please try again later",
})

export const bookingRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 20, // 20 booking attempts per 15 minutes
	message: "Too many booking attempts, please try again later",
})

export const ratingRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	maxRequests: 10, // 10 rating submissions per hour
	message: "Too many rating submissions, please try again later",
})

