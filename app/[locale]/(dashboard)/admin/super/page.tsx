import { SuperAdminDashboard } from "@/components/admin/SuperAdminDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Super Admin Dashboard",
}

export default async function Page() {
	// Fetch current user from server
	const currentUser = await currentUserServer()
	const { isSuperAdmin } = currentUser || {}

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect if not SUPER_ADMIN
	if (!isSuperAdmin) redirect("/dashboard")

	return <SuperAdminDashboard />
}
