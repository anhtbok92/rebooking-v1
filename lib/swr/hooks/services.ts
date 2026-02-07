"use client"

import useSWR from "swr"
import { fetcher } from "../fetcher"

export interface Service {
	id: string
	name: string
	price: number
	rating?: number
	ratingsCount?: number
}

export interface ServicesResponse {
	services: Service[]
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

/**
 * Hook to fetch services with filters
 */
export function useServices(params?: {
	page?: number
	limit?: number
	sort?: string
}) {
	const queryParams = new URLSearchParams()
	
	if (params?.page) queryParams.append("page", params.page.toString())
	if (params?.limit) queryParams.append("limit", params.limit.toString())
	if (params?.sort) queryParams.append("sort", params.sort)
	
	const url = `/api/v1/services?${queryParams.toString()}`
	
	return useSWR<ServicesResponse>(
		url,
		fetcher,
		{
			revalidateOnFocus: false, // Don't refetch on window focus
			revalidateOnReconnect: true, // Refetch when network reconnects
			dedupingInterval: 60000, // Dedupe requests within 60 seconds
			keepPreviousData: true, // Keep previous data while fetching new data
			refreshInterval: 0, // Don't auto-refresh (manual refresh only)
		}
	)
}

