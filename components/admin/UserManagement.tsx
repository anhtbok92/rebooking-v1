"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getRoleLabel } from "@/lib/rbac"
import { useUsers } from "@/lib/swr"
import { AlertCircle, Search, Shield } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

import { useTranslations } from "next-intl"

export function UserManagement() {
	const tCommon = useTranslations("Common")
	const t = useTranslations("Admin.users")
	const [page, setPage] = useState(1)
	const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "date-asc" | "date-desc">("date-desc")
	const [roleFilter, setRoleFilter] = useState<string>("ALL")
	const [searchQuery, setSearchQuery] = useState("")

	const { data, mutate } = useUsers({
		page,
		limit: 10,
		sort: sortBy,
		role: roleFilter === "ALL" ? undefined : roleFilter,
		search: searchQuery || undefined,
	})
	const users = data?.users || []
	const pagination = data?.pagination

	const { data: session } = useSession()
	const [updatingId, setUpdatingId] = useState<string | null>(null)

	const currentUserId = (session?.user as any)?.id
	const currentUserRole = (session?.user as any)?.role

	const handleRoleChange = async (userId: string, newRole: string) => {
		if (currentUserRole !== "SUPER_ADMIN") {
			toast.error(t("onlySuperAdmin"))
			return
		}

		if (userId === currentUserId) {
			toast.error(t("cannotChangeOwn"))
			return
		}

		setUpdatingId(userId)
		try {
			const response = await fetch("/api/v1/admin/users", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role: newRole }),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || t("roleUpdateError"))
			}

			toast.success(t("roleUpdateSuccess"))
			mutate()
		} catch (error) {
			toast.error(error instanceof Error ? error.message : t("roleUpdateError"))
		} finally {
			setUpdatingId(null)
		}
	}

	const handleReset = () => {
		setPage(1)
		setSortBy("date-desc")
		setRoleFilter("ALL")
		setSearchQuery("")
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="w-5 h-5" />
					{t("title")}
				</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{currentUserRole !== "SUPER_ADMIN" && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{t("noPermission")}</AlertDescription>
					</Alert>
				)}

				<div className="flex gap-2 flex-wrap">
					<div className="flex-1 min-w-[200px]">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t("searchPlaceholder")}
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value)
									setPage(1)
								}}
								className="pl-8"
							/>
						</div>
					</div>
					<Select
						value={sortBy}
						onValueChange={(value: any) => {
							setSortBy(value)
							setPage(1)
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("sortBy")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name-asc">{t("sortNameAsc")}</SelectItem>
							<SelectItem value="name-desc">{t("sortNameDesc")}</SelectItem>
							<SelectItem value="date-desc">{t("sortDateDesc")}</SelectItem>
							<SelectItem value="date-asc">{t("sortDateAsc")}</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={roleFilter}
						onValueChange={(value) => {
							setRoleFilter(value)
							setPage(1)
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("filterByRole")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">{t("allRoles")}</SelectItem>
							<SelectItem value="CLIENT">{tCommon("roles.CLIENT")}</SelectItem>
							<SelectItem value="STAFF">{tCommon("roles.STAFF")}</SelectItem>
							<SelectItem value="DOCTOR">{tCommon("roles.DOCTOR")}</SelectItem>
							<SelectItem value="ADMIN">{tCommon("roles.ADMIN")}</SelectItem>
							<SelectItem value="SUPER_ADMIN">{tCommon("roles.SUPER_ADMIN")}</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" onClick={handleReset}>
						{t("reset")}
					</Button>
				</div>

				{!data ? (
					<div className="text-center py-8">{tCommon("loading")}</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
						{users.map((user) => (
							<div
								key={user.id}
								className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition col-span-1"
							>
								<div className="flex-1">
									<p className="font-semibold">{user.name}</p>
									<p className="text-sm text-muted-foreground">{user.email}</p>
									{user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
								</div>
								<div className="flex items-center gap-2">
									<Select
										value={user.role}
										onValueChange={(value) => handleRoleChange(user.id, value)}
										disabled={updatingId === user.id || currentUserRole !== "SUPER_ADMIN" || user.id === currentUserId}
									>
										<SelectTrigger className="w-40">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="CLIENT">{tCommon("roles.CLIENT")}</SelectItem>
											<SelectItem value="STAFF">{tCommon("roles.STAFF")}</SelectItem>
											<SelectItem value="DOCTOR">{tCommon("roles.DOCTOR")}</SelectItem>
											<SelectItem value="ADMIN">{tCommon("roles.ADMIN")}</SelectItem>
											<SelectItem value="SUPER_ADMIN">{tCommon("roles.SUPER_ADMIN")}</SelectItem>
										</SelectContent>
									</Select>
									{user.id === currentUserId && <span className="text-xs text-muted-foreground">{t("you")}</span>}
								</div>
							</div>
						))}
					</div>
				)}

				{pagination && pagination.pages > 1 && (
					<div className="flex items-center justify-between pt-4 border-t">
						<p className="text-sm text-muted-foreground">
							{t("pagination", {
								page: pagination.page,
								pages: pagination.pages,
								total: pagination.total,
							})}
						</p>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
								{t("prev")}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.min(pagination.pages, page + 1))}
								disabled={page === pagination.pages}
							>
								{t("next")}
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
