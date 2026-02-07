"use client"
import type React from "react"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useStaff } from "@/lib/swr"
import { Plus, Trash2, Users } from "lucide-react"
import { useState } from "react"

interface StaffManagementProps {
	onStaffAdded?: () => void
}

import { useTranslations } from "next-intl"

export function StaffManagement({ onStaffAdded }: StaffManagementProps) {
	const tCommon = useTranslations("Common")
	const t = useTranslations("Admin.staff")
	const [isOpen, setIsOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [page, setPage] = useState(1)
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	})

	const { data: response, mutate } = useStaff({
		page,
		limit: 10,
	})

	const staff = response?.users || []
	const pagination = response?.pagination

	const handleAddStaff = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const response = await fetch("/api/v1/admin/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				toast.success(t("addSuccess"))
				setIsOpen(false)
				setFormData({ name: "", email: "", phone: "", password: "" })
				mutate()
				onStaffAdded?.()
			} else {
				const error = await response.json()
				toast.error(error.error || t("addError"))
			}
		} catch (error) {
			toast.error(t("addError"))
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleRemoveStaff(userId: string) {
		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
			})

			if (response.ok) {
				toast.success(t("removeSuccess"))
				mutate()
			}
		} catch (error) {
			toast.error(t("removeError"))
		}
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5" />
							{t("title")}
						</CardTitle>
						<CardDescription>{t("description")}</CardDescription>
					</div>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button size="sm" className="gap-2">
								<Plus className="w-4 h-4" />
								{t("addStaff")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("addNewStaff")}</DialogTitle>
								<DialogDescription>{t("createDescription")}</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleAddStaff} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">{t("fullName")}</Label>
									<Input
										id="name"
										placeholder="John Doe"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">{t("email")}</Label>
									<Input
										id="email"
										type="email"
										placeholder="john@example.com"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">{t("phone")}</Label>
									<Input
										id="phone"
										placeholder="+1 (555) 000-0000"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">{t("password")}</Label>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isSubmitting}>
									{isSubmitting ? t("adding") : t("addStaff")}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardHeader>
			<CardContent>
				{!response ? (
					<div className="text-center py-8">{tCommon("loading")}</div>
				) : staff.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">{t("noStaff")}</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
							{staff.map((member) => (
								<div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<p className="font-semibold">{member.name}</p>
										<p className="text-sm text-muted-foreground">{member.email}</p>
										<p className="text-sm text-muted-foreground">{member.phone}</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge>{tCommon(`roles.${member.role}` as any)}</Badge>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
													<Trash2 className="w-4 h-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
												<AlertDialogDescription>
													{t("deleteConfirm", { name: member.name })}
												</AlertDialogDescription>
												<div className="flex gap-2 justify-end">
													<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleRemoveStaff(member.id)}
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													>
														{t("delete")}
													</AlertDialogAction>
												</div>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							))}
						</div>
						{pagination && pagination.pages > 1 && (
							<div className="flex items-center justify-between mt-6 pt-4 border-t">
								<p className="text-sm text-muted-foreground">
									{t("pagination", { page: pagination.page, pages: pagination.pages, total: pagination.total })}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(Math.max(1, page - 1))}
										disabled={page === 1}
									>
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
					</>
				)}
			</CardContent>
		</Card>
	)
}
