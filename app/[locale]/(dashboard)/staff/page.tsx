import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Staff Dashboard",
}

export default async function Page() {
	// Fetch current user from server
	const currentUser = await currentUserServer()
	const { isStaff, isDoctor, isSuperAdmin, isAdmin } = currentUser || {}

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect based on role
	if (isSuperAdmin) redirect("/admin/super")
	if (isAdmin) redirect("/admin")
	
	// STAFF or DOCTOR - redirect to main dashboard
	if (isStaff || isDoctor) redirect("/dashboard")

	// Not staff/doctor - redirect to main dashboard
	redirect("/dashboard")
}
