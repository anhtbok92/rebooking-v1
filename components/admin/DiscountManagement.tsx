"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DiscountCodeCard } from "./discounts/DiscountCodeCard"
import { DiscountCreateDialog } from "./discounts/DiscountCreateDialog"
import { DiscountEditDialog } from "./discounts/DiscountEditDialog"
import { DiscountUsageDialog } from "./discounts/DiscountUsageDialog"

interface DiscountCode {
	id: string
	code: string
	type: string
	value: number
	minAmount?: number | null
	maxUses?: number | null
	usedCount: number
	expiresAt?: string | null
	active: boolean
	createdAt: string
}

interface UsageStats {
	totalUsages: number
	uniqueUsers: number
	totalDiscountAmount: number
	totalFinalRevenue: number
}

interface UserUsage {
	userName: string | null
	email: string | null
	phone: string | null
	count: number
	totalDiscount: number
	totalSpent: number
	lastUsed: string
}

interface RecentUsage {
	userName: string | null
	email: string | null
	phone: string | null
	discountAmount: number
	finalTotal: number
	usedAt: string
}

import { useTranslations } from "next-intl"

export function DiscountManagement() {
	const t = useTranslations("Admin.discounts")
	const [codes, setCodes] = useState<DiscountCode[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null)
	const [usageData, setUsageData] = useState<{
		statistics: UsageStats
		usageByUser: UserUsage[]
		recentUsages: RecentUsage[]
	} | null>(null)
	const [loadingUsage, setLoadingUsage] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)

	// Load existing codes
	const loadCodes = async () => {
		setLoading(true)
		try {
			const res = await fetch("/api/v1/admin/discounts")
			if (!res.ok) throw new Error("Failed to load codes")
			const data = await res.json()
			setCodes(data)
		} catch (err) {
			toast.error(t("messages.loadError"))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCodes()
	}, [])

	// Create new code
	const handleCreate = async (formData: {
		code: string
		type: string
		value: string
		minAmount: string
		maxUses: string
		expiresInDays: string
	}) => {
		try {
			const res = await fetch("/api/v1/admin/discounts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					code: formData.code.toUpperCase(),
					type: formData.type,
					value: parseInt(formData.value),
					minAmount: formData.minAmount ? parseInt(formData.minAmount) : null,
					maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
					expiresAt: formData.expiresInDays
						? new Date(Date.now() + parseInt(formData.expiresInDays) * 86400000).toISOString()
						: null,
				}),
			})

			const data = await res.json()
			if (res.ok) {
				toast.success(t("messages.createSuccess"), {
					description: t("messages.createDesc", {
						code: data.code,
						value: data.value,
						type: data.type === "PERCENT" ? "%" : "$"
					}),
				})
				loadCodes()
			} else {
				toast.error(data.error || t("messages.createError"))
			}
		} catch (err) {
			toast.error(t("messages.createError"))
		}
	}

	// Update existing code
	const handleUpdate = async (formData: {
		type: string
		value: string
		minAmount: string
		maxUses: string
		expiresAt: string
		active: boolean
	}) => {
		if (!editingCode || !formData.value) {
			toast.error(t("messages.fillRequired"))
			return
		}

		try {
			const res = await fetch(`/api/v1/admin/discounts/${editingCode.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: formData.type,
					value: parseInt(formData.value),
					minAmount: formData.minAmount ? parseInt(formData.minAmount) : null,
					maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
					expiresAt: formData.expiresAt && formData.expiresAt.trim() ? new Date(formData.expiresAt).toISOString() : null,
					active: formData.active,
				}),
			})

			const data = await res.json()
			if (res.ok) {
				toast.success(t("messages.updateSuccess"))
				setIsEditDialogOpen(false)
				setEditingCode(null)
				loadCodes()
			} else {
				toast.error(data.error || t("messages.updateError"))
			}
		} catch (err) {
			toast.error(t("messages.updateError"))
		}
	}

	// Toggle active status
	const toggleActive = async (id: string, active: boolean) => {
		try {
			const res = await fetch(`/api/v1/admin/discounts/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ active: !active }),
			})

			if (res.ok) {
				toast.success(t(`messages.${!active ? "activated" : "deactivated"}`))
				loadCodes()
			} else {
				toast.error(t("messages.updateError"))
			}
		} catch (err) {
			toast.error(t("messages.updateError"))
		}
	}

	// Delete code
	const handleDelete = async (id: string, code: string) => {
		toast(t("messages.deleteTitle", { code }), {
			description: t("messages.deleteConfirm"),
			action: {
				label: t("messages.delete"),
				onClick: async () => {
					try {
						const res = await fetch(`/api/v1/admin/discounts/${id}`, {
							method: "DELETE",
						})

						if (res.ok) {
							toast.success(t("messages.deleteSuccess"))
							loadCodes()
						} else {
							toast.error(t("messages.deleteError"))
						}
					} catch (err) {
						toast.error(t("messages.deleteError"))
					}
				},
			},
			cancel: {
				label: t("create.cancel"),
				onClick: () => { },
			},
		})
	}

	// Load usage details
	const loadUsageDetails = async (id: string) => {
		setSelectedCodeId(id)
		setLoadingUsage(true)
		try {
			const res = await fetch(`/api/v1/admin/discounts/${id}/usage`)
			if (!res.ok) throw new Error("Failed to load usage data")
			const data = await res.json()
			setUsageData({
				statistics: data.statistics,
				usageByUser: data.usageByUser,
				recentUsages: data.recentUsages,
			})
		} catch (err) {
			toast.error(t("messages.usageLoadError"))
		} finally {
			setLoadingUsage(false)
		}
	}

	// Open edit dialog
	const handleEdit = (code: DiscountCode) => {
		setEditingCode(code)
		setIsEditDialogOpen(true)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						{t("title")}
					</h2>
					<p className="text-muted-foreground mt-1">{t("description")}</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={loadCodes} disabled={loading}>
						<RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
						{t("refresh")}
					</Button>
					<DiscountCreateDialog onSubmit={handleCreate} />
				</div>
			</div>

			{/* Discount Codes List */}
			<Card>
				<CardHeader>
					<CardTitle>{t("listTitle")}</CardTitle>
					<CardDescription>{t("listDesc")}</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
						</div>
					) : codes.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground mb-4">{t("noCodes")}</p>
							<DiscountCreateDialog onSubmit={handleCreate} />
						</div>
					) : (
						<div className="space-y-3">
							{codes.map((code) => (
								<DiscountCodeCard
									key={code.id}
									code={code}
									onViewDetails={loadUsageDetails}
									onEdit={handleEdit}
									onToggleActive={toggleActive}
									onDelete={handleDelete}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Usage Details Dialog */}
			<DiscountUsageDialog
				isOpen={selectedCodeId !== null}
				onClose={() => setSelectedCodeId(null)}
				loading={loadingUsage}
				statistics={usageData?.statistics}
				usageByUser={usageData?.usageByUser}
				recentUsages={usageData?.recentUsages}
			/>

			{/* Edit Dialog */}
			<DiscountEditDialog
				code={editingCode}
				isOpen={isEditDialogOpen}
				onClose={() => {
					setIsEditDialogOpen(false)
					setEditingCode(null)
				}}
				onUpdate={handleUpdate}
			/>
		</div>
	)
}
