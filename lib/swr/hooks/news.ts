"use client"

import useSWR from "swr"
import { fetcher } from "../fetcher"

export interface News {
	id: string
	title: string
	slug: string
	excerpt: string | null
	content: string
	coverImage: string | null
	category: "NEWS" | "PROMOTION" | "EVENT"
	tags: string[]
	published: boolean
	publishedAt: string | null
	authorId: string
	author: {
		id: string
		name: string | null
		email: string
		image: string | null
	}
	viewCount: number
	createdAt: string
	updatedAt: string
}

export interface NewsResponse {
	news: News[]
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

/**
 * Hook to fetch news list
 */
export function useNews(params?: {
	page?: number
	limit?: number
	category?: string
	search?: string
	published?: boolean
}) {
	const queryParams = new URLSearchParams()
	
	if (params?.page) queryParams.append("page", params.page.toString())
	if (params?.limit) queryParams.append("limit", params.limit.toString())
	if (params?.category) queryParams.append("category", params.category)
	if (params?.search) queryParams.append("search", params.search)
	if (params?.published !== undefined) queryParams.append("published", params.published.toString())
	
	const url = `/api/v1/news?${queryParams.toString()}`
	
	return useSWR<NewsResponse>(url, fetcher)
}

/**
 * Hook to fetch single news
 */
export function useNewsItem(id: string | null) {
	const url = id ? `/api/v1/news/${id}` : null
	return useSWR<News>(url, fetcher)
}

/**
 * Create news
 */
export async function createNews(data: Partial<News>) {
	const response = await fetch("/api/v1/news", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || "Failed to create news")
	}

	return response.json()
}

/**
 * Update news
 */
export async function updateNews(id: string, data: Partial<News>) {
	const response = await fetch(`/api/v1/news/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || "Failed to update news")
	}

	return response.json()
}

/**
 * Delete news
 */
export async function deleteNews(id: string) {
	const response = await fetch(`/api/v1/news/${id}`, {
		method: "DELETE",
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || "Failed to delete news")
	}

	return response.json()
}
