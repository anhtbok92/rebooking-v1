import { type NextRequest, NextResponse } from "next/server"
import { handleError, withErrorHandling } from "./error-handler"
import { rateLimit, type RateLimitOptions } from "./rate-limit"

type ApiHandler = (req: NextRequest, context?: any) => Promise<NextResponse | Response>

interface ApiWrapperOptions {
	rateLimit?: ReturnType<typeof rateLimit>
	requireAuth?: boolean
	allowedMethods?: string[]
}

/**
 * Wraps an API route handler with error handling and optional rate limiting
 */
export function createApiHandler(
	handler: ApiHandler,
	options: ApiWrapperOptions = {}
): ApiHandler {
	const { rateLimit: rateLimiter, requireAuth = false, allowedMethods } = options

	return async (req: NextRequest, context?: any) => {
		// Check allowed methods
		if (allowedMethods && !allowedMethods.includes(req.method)) {
			return NextResponse.json(
				{ error: `Method ${req.method} not allowed` },
				{ status: 405, headers: { Allow: allowedMethods.join(", ") } }
			)
		}

		// Apply rate limiting
		if (rateLimiter) {
			const rateLimitResponse = await rateLimiter(req)
			if (rateLimitResponse) {
				return rateLimitResponse
			}
		}

		// Execute handler with error handling
		const url = new URL(req.url)
		return withErrorHandling(
			async () => {
				const result = await handler(req, context)
				return result
			},
			{
				path: url.pathname,
				method: req.method,
			}
		)
	}
}

/**
 * Helper to create GET handler
 */
export function createGetHandler(
	handler: ApiHandler,
	options: Omit<ApiWrapperOptions, "allowedMethods"> = {}
) {
	return createApiHandler(handler, { ...options, allowedMethods: ["GET"] })
}

/**
 * Helper to create POST handler
 */
export function createPostHandler(
	handler: ApiHandler,
	options: Omit<ApiWrapperOptions, "allowedMethods"> = {}
) {
	return createApiHandler(handler, { ...options, allowedMethods: ["POST"] })
}

/**
 * Helper to create PUT handler
 */
export function createPutHandler(
	handler: ApiHandler,
	options: Omit<ApiWrapperOptions, "allowedMethods"> = {}
) {
	return createApiHandler(handler, { ...options, allowedMethods: ["PUT"] })
}

/**
 * Helper to create PATCH handler
 */
export function createPatchHandler(
	handler: ApiHandler,
	options: Omit<ApiWrapperOptions, "allowedMethods"> = {}
) {
	return createApiHandler(handler, { ...options, allowedMethods: ["PATCH"] })
}

/**
 * Helper to create DELETE handler
 */
export function createDeleteHandler(
	handler: ApiHandler,
	options: Omit<ApiWrapperOptions, "allowedMethods"> = {}
) {
	return createApiHandler(handler, { ...options, allowedMethods: ["DELETE"] })
}

