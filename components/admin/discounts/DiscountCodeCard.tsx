"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Edit2, Eye, Trash2, XCircle } from "lucide-react"

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

interface DiscountCodeCardProps {
	code: DiscountCode
	onViewDetails: (id: string) => void
	onEdit: (code: DiscountCode) => void
	onToggleActive: (id: string, active: boolean) => void
	onDelete: (id: string, code: string) => void
}

import { useTranslations } from "next-intl"

export function DiscountCodeCard({
	code,
	onViewDetails,
	onEdit,
	onToggleActive,
	onDelete,
}: DiscountCodeCardProps) {
	const t = useTranslations("Admin.discounts.card")

	const isExpired = (expiresAt: string | null | undefined) => {
		if (!expiresAt) return false
		return new Date(expiresAt) < new Date()
	}

	const isFullyUsed = (code: DiscountCode) => {
		return code.maxUses ? code.usedCount >= code.maxUses : false
	}

	const expired = isExpired(code.expiresAt)
	const fullyUsed = isFullyUsed(code)
	const isInvalid = expired || fullyUsed || !code.active

	return (
		<div
			className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${isInvalid ? "bg-muted/30 opacity-75" : "bg-card"
				}`}
		>
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-2">
					<code className="font-mono font-bold text-lg">{code.code}</code>
					<Badge variant={code.active ? "default" : "secondary"}>
						{code.active ? t("active") : t("inactive")}
					</Badge>
					{expired && <Badge variant="destructive">{t("expired")}</Badge>}
					{fullyUsed && <Badge variant="destructive">{t("fullyUsed")}</Badge>}
				</div>
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
					<span className="font-semibold text-card-foreground">
						{t("off", { value: code.value, type: code.type === "PERCENT" ? "%" : "$" })}
					</span>
					{code.minAmount && <span>{t("min", { amount: code.minAmount.toLocaleString() })}</span>}
					{code.maxUses && (
						<span>
							{t("used", { used: code.usedCount, max: code.maxUses })}
						</span>
					)}
					{code.expiresAt && <span>{t("expires", { date: new Date(code.expiresAt).toLocaleDateString() })}</span>}
					<span className="text-xs">{t("created", { date: new Date(code.createdAt).toLocaleDateString() })}</span>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={() => onViewDetails(code.id)}>
					<Eye className="w-4 h-4 mr-2" />
					{t("viewDetails")}
				</Button>
				<Button variant="outline" size="sm" onClick={() => onEdit(code)}>
					<Edit2 className="w-4 h-4 mr-2" />
					{t("edit")}
				</Button>
				<Button variant="outline" size="sm" onClick={() => onToggleActive(code.id, code.active)}>
					{code.active ? (
						<>
							<CheckCircle2 className="w-4 h-4 mr-2" />
							{t("active")}
						</>
					) : (
						<>
							<XCircle className="w-4 h-4 mr-2" />
							{t("inactive")}
						</>
					)}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onDelete(code.id, code.code)}
					className="text-destructive hover:text-destructive"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
		</div>
	)
}

