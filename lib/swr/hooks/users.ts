"use client"

import useSWR from "swr"
import { fetcher } from "../fetcher"

export interface User {
	id: string
	name: string
	email: string
	role: string
	phone: string
	createdAt: string
}

export interface UsersResponse {
	users: User[]
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

/**
 * Hook to fetch users with filters (admin only)
 */
export function useUsers(params?: {
	page?: number
	limit?: number
	sort?: string
	role?: string
	search?: string
}) {
	const queryParams = new URLSearchParams()
	
	if (params?.page) queryParams.append("page", params.page.toString())
	if (params?.limit) queryParams.append("limit", params.limit.toString())
	if (params?.sort) queryParams.append("sort", params.sort)
	if (params?.role) queryParams.append("role", params.role)
	if (params?.search) queryParams.append("search", params.search)
	
	const url = `/api/v1/admin/users?${queryParams.toString()}`
	
	return useSWR<UsersResponse>(url, fetcher)
}

/**
 * Hook to fetch staff members
 */
export function useStaff(params?: {
	page?: number
	limit?: number
}) {
	const queryParams = new URLSearchParams()
	queryParams.append("role", "STAFF")
	
	if (params?.page) queryParams.append("page", params.page.toString())
	if (params?.limit) queryParams.append("limit", params.limit.toString())
	
	const url = `/api/v1/admin/users?${queryParams.toString()}`
	
	return useSWR<UsersResponse>(url, fetcher)
}

