"use server"

import LayoutAdmin from "@/components/layout/admin"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import currentUserServer from "@/lib/currentUserServer"
import { Edit, Eye, Lock, Shield } from "lucide-react"
import { redirect } from "next/navigation"

// Role data
const rolesData = [
	{
		name: "Super Admin",
		value: "SUPER_ADMIN",
		description: "Full system access and user management",
		permissions: [
			"Manage all users",
			"Manage roles and permissions",
			"View all analytics",
			"System settings",
			"Manage staff",
		],
		icon: Shield,
	},
	{
		name: "Admin",
		value: "ADMIN",
		description: "Manage services, bookings, and staff",
		permissions: ["Manage services", "Manage bookings", "View analytics", "Manage staff", "View reports"],
		icon: Lock,
	},
	{
		name: "Staff",
		value: "STAFF",
		description: "View and update booking status",
		permissions: ["View bookings", "Update booking status", "View services"],
		icon: Eye,
	},
	{
		name: "Client",
		value: "CLIENT",
		description: "Book services and manage own bookings",
		permissions: ["Book services", "View own bookings", "Cancel own bookings"],
		icon: Edit,
	},
]

export default async function RolesPage() {
	const currentUser = await currentUserServer()

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	// Redirect if not SUPER_ADMIN
	if (!currentUser.isSuperAdmin) redirect("/admin")

	return (
		<LayoutAdmin>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">Role Management</h1>
					<p className="text-muted-foreground">Manage user roles and permissions</p>
				</header>

				{/* Role cards */}
				<div className="grid gap-6 md:grid-cols-2">
					{rolesData.map((role) => (
						<RoleCard key={role.value} role={role} />
					))}
				</div>
			</div>
		</LayoutAdmin>
	)
}

// Component for each role card
function RoleCard({ role }: { role: typeof rolesData[number] }) {
	const Icon = role.icon
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Icon className="w-6 h-6 text-primary" />
						<div>
							<CardTitle>{role.name}</CardTitle>
							<CardDescription>{role.description}</CardDescription>
						</div>
					</div>
					<Badge variant="outline">{role.value}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<PermissionsList permissions={role.permissions} />
			</CardContent>
		</Card>
	)
}

// Component for permissions list
function PermissionsList({ permissions }: { permissions: string[] }) {
	return (
		<div className="space-y-2">
			<p className="text-sm font-semibold text-muted-foreground">Permissions:</p>
			<ul className="space-y-1">
				{permissions.map((permission, idx) => (
					<li key={idx} className="text-sm flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-primary" />
						{permission}
					</li>
				))}
			</ul>
		</div>
	)
}
