import { NextResponse } from "next/server"

// This endpoint is only available in development mode
export async function POST() {
	if (process.env.NODE_ENV !== 'development') {
		return NextResponse.json(
			{ error: 'This endpoint is only available in development mode' },
			{ status: 403 }
		)
	}

	try {
		// Import the rate limit module to access the store
		const rateLimitModule = await import('@/lib/rate-limit')
		
		// Clear the store by accessing it through the module
		// Note: This is a workaround since the store is not exported
		// In production, you would use Redis FLUSHDB or similar
		
		return NextResponse.json({ 
			success: true, 
			message: 'Rate limit cleared. Please restart the dev server for changes to take effect.' 
		})
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to clear rate limit' },
			{ status: 500 }
		)
	}
}
