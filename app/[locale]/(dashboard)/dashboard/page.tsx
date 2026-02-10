import { ClientDashboard } from "@/components/dashboard/ClientDashboard"
import { StaffDashboard } from "@/components/staff/StaffDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Dashboard",
}

export default async function Page() {
	// Fetch current user from server
	const currentUser = await currentUserServer()
	const { isSuperAdmin, isAdmin, isStaff, isDoctor } = currentUser || {}

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect based on role
	if (isSuperAdmin) redirect("/admin/super")
	if (isAdmin) redirect("/admin")

	// STAFF or DOCTOR role - show staff dashboard
	if (isStaff || isDoctor) return <StaffDashboard />

	// CLIENT role or default - show client dashboard
	return <ClientDashboard />
}
