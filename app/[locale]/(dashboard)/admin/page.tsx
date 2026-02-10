import { AdminDashboard } from "@/components/admin/AdminDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Admin Dashboard",
}

export default async function Page() {
	const currentUser = await currentUserServer()
	const { isSuperAdmin, isAdmin } = currentUser || {}

	if (!currentUser) {
		redirect("/signin")
	}

	if (!isSuperAdmin && !isAdmin) {
		redirect("/dashboard")
	}

	return <AdminDashboard />
}
