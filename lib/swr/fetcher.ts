/**
 * Centralized SWR fetcher function
 * Handles all API requests with consistent error handling
 */
export const fetcher = async (url: string) => {
	const response = await fetch(url)
	
	if (!response.ok) {
		const error = new Error("An error occurred while fetching the data.")
		// Attach extra info to the error object
		;(error as any).status = response.status
		;(error as any).info = await response.json().catch(() => ({}))
		throw error
	}
	
	return response.json()
}

