export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "DOCTOR" | "CLIENT"

export const ROLE_HIERARCHY: Record<UserRole, number> = {
	SUPER_ADMIN: 5,
	ADMIN: 4,
	STAFF: 3,
	DOCTOR: 3, // Same level as STAFF
	CLIENT: 1,
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
	SUPER_ADMIN: [
		"manage_users",
		"manage_roles",
		"manage_services",
		"manage_bookings",
		"view_analytics",
		"manage_staff",
		"view_reports",
		"system_settings",
	],
	ADMIN: ["manage_services", "manage_bookings", "view_analytics", "manage_staff", "view_reports"],
	STAFF: ["view_bookings", "update_booking_status", "view_services"],
	DOCTOR: ["view_bookings", "update_booking_status", "view_services", "view_patients"], // Same as STAFF + view patients
	CLIENT: ["book_services", "view_own_bookings", "cancel_own_bookings"],
}

export function hasPermission(role: UserRole, permission: string): boolean {
	return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canAccessResource(userRole: UserRole, requiredRole: UserRole): boolean {
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function getRoleLabel(role: UserRole): string {
	const labels: Record<UserRole, string> = {
		SUPER_ADMIN: "Super Admin",
		ADMIN: "Admin",
		STAFF: "Staff",
		DOCTOR: "Bác sĩ",
		CLIENT: "Client",
	}
	return labels[role] || role
}


export const isValidUserRole = (role: any): role is UserRole => {
  return ["SUPER_ADMIN", "ADMIN", "STAFF", "DOCTOR", "CLIENT"].includes(role)
}

export const normalizeRole = (role: any): UserRole => {
  if (isValidUserRole(role)) return role
  return "CLIENT" // fallback role
}
