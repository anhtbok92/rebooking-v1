"use client"

import useSWR from "swr"
import { fetcher } from "../fetcher"

export interface Booking {
	id: string
	serviceId: string
	service: {
		id: string
		name: string
		price: number
	}
	userId?: string | null
	userName: string
	phone: string
	email?: string | null
	user?: {
		id: string
		name: string
		email: string
		phone?: string
		role?: string
	} | null
	date: string
	time: string
	status: string
	paymentMethod?: string | null
	photos?: Array<{ id: string; url: string }> | string[]
	createdAt: string
	updatedAt: string
}

export interface BookingsResponse {
	bookings: Booking[]
	pagination?: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

/**
 * Hook to fetch bookings with filters
 */
export function useBookings(params?: {
	startDate?: string
	endDate?: string
	date?: string
	serviceId?: string
	userId?: string
	status?: string
	page?: number
	limit?: number
	sort?: "date-desc" | "date-asc" | "price-desc" | "price-asc"
}) {
	const queryParams = new URLSearchParams()
	
	if (params?.startDate) queryParams.append("startDate", params.startDate)
	if (params?.endDate) queryParams.append("endDate", params.endDate)
	if (params?.date) queryParams.append("date", params.date)
	if (params?.serviceId) queryParams.append("serviceId", params.serviceId)
	if (params?.userId) queryParams.append("userId", params.userId)
	if (params?.status) queryParams.append("status", params.status)
	if (params?.page) queryParams.append("page", params.page.toString())
	if (params?.limit) queryParams.append("limit", params.limit.toString())
	if (params?.sort) queryParams.append("sort", params.sort)
	
	const url = queryParams.toString() 
		? `/api/v1/bookings?${queryParams.toString()}`
		: `/api/v1/bookings`
	
	return useSWR<BookingsResponse>(
		url,
		fetcher,
		{
			revalidateOnFocus: false, // Don't refetch on window focus
			revalidateOnReconnect: true, // Refetch when network reconnects
			dedupingInterval: 10000, // Dedupe requests within 10 seconds
			keepPreviousData: true, // Keep previous data while fetching new data
			refreshInterval: 0, // Don't auto-refresh (manual refresh only)
		}
	)
}

/**
 * Hook to fetch bookings for a specific user
 */
export function useUserBookings(userId: string | null | undefined) {
	return useSWR<BookingsResponse>(
		userId ? `/api/v1/bookings?userId=${userId}&limit=1000` : null,
		fetcher,
		{
			revalidateOnFocus: false, // Don't refetch on window focus
			revalidateOnReconnect: true, // Refetch when network reconnects
			dedupingInterval: 10000, // Dedupe requests within 10 seconds
			keepPreviousData: true, // Keep previous data while fetching new data
			refreshInterval: 0, // Don't auto-refresh (manual refresh only)
		}
	)
}

export interface BookingStats {
	total: number
	today: number
	confirmed: number
	pending: number
	cancelled: number
	completed: number
	new: number
	totalRevenue: number
	todayRevenue: number
	monthlyRevenue?: number
	averageBookingValue?: number
}

/**
 * Hook to fetch booking statistics
 */
export function useBookingStats() {
	return useSWR<BookingStats>(
		"/api/v1/bookings/stats",
		fetcher,
		{
			revalidateOnFocus: false, // Don't refetch on window focus
			revalidateOnReconnect: true, // Refetch when network reconnects
			dedupingInterval: 30000, // Dedupe requests within 30 seconds
			keepPreviousData: true, // Keep previous data while fetching new data
			refreshInterval: 0, // Don't auto-refresh (manual refresh only)
		}
	)
}
