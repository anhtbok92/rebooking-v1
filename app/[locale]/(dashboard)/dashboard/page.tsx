import { ClientDashboard } from "@/components/dashboard/ClientDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
	// Fetch current user from server
	const currentUser = await currentUserServer()
	const { isSuperAdmin, isAdmin, isStaff } = currentUser || {}

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect based on role
	if (isSuperAdmin) redirect("/admin/super")
	if (isAdmin) redirect("/admin")
	if (isStaff) redirect("/staff")

	// CLIENT role or default - show client dashboard
	return <ClientDashboard />
}
