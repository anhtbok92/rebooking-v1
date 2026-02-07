"use client"

import useSWR from "swr"
import { fetcher } from "../fetcher"

export interface ClinicAddress {
	address: string
	latitude: number | null
	longitude: number | null
	phone: string
	email: string
}

/**
 * Hook to fetch clinic address settings (public)
 */
export function useClinicAddress() {
	return useSWR<ClinicAddress>("/api/v1/settings/clinic-address", fetcher)
}

/**
 * Update clinic address settings (admin only)
 */
export async function updateClinicAddress(data: ClinicAddress) {
	const response = await fetch("/api/v1/settings/clinic-address", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || "Failed to update clinic address")
	}

	return response.json()
}
