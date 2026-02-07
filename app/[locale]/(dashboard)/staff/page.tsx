import { StaffDashboard } from "@/components/staff/StaffDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"

export default async function StaffPage() {
	// Fetch current user from server
	const currentUser = await currentUserServer()
	const { isStaff, isSuperAdmin, isAdmin } = currentUser || {}

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect based on role
	if (isSuperAdmin) redirect("/admin/super")
	if (isAdmin) redirect("/admin")
	if (!isStaff) redirect("/dashboard") // Not staff

	// STAFF role - show staff dashboard
	return <StaffDashboard />
}
