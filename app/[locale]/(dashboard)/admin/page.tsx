import { AdminDashboard } from "@/components/admin/AdminDashboard"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"

export default async function AdminPage() {
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
