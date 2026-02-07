"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface DiscountCode {
	id: string
	code: string
	type: string
	value: number
	minAmount?: number | null
	maxUses?: number | null
	expiresAt?: string | null
	active: boolean
}

interface DiscountEditDialogProps {
	code: DiscountCode | null
	isOpen: boolean
	onClose: () => void
	onUpdate: (data: {
		type: string
		value: string
		minAmount: string
		maxUses: string
		expiresAt: string
		active: boolean
	}) => void
}

import { useTranslations } from "next-intl"

export function DiscountEditDialog({ code, isOpen, onClose, onUpdate }: DiscountEditDialogProps) {
	const t = useTranslations("Admin.discounts.edit")
	const [form, setForm] = useState({
		type: code?.type || "PERCENT",
		value: code?.value.toString() || "",
		minAmount: code?.minAmount?.toString() || "",
		maxUses: code?.maxUses?.toString() || "",
		expiresAt: code?.expiresAt ? new Date(code.expiresAt).toISOString().split("T")[0] : "",
		active: code?.active ?? true,
	})

	// Update form when code changes
	useEffect(() => {
		if (code) {
			setForm({
				type: code.type,
				value: code.value.toString(),
				minAmount: code.minAmount?.toString() || "",
				maxUses: code.maxUses?.toString() || "",
				expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split("T")[0] : "",
				active: code.active,
			})
		}
	}, [code])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onUpdate(form)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>
						{t("desc", { code: code?.code || "" })}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="edit-type">{useTranslations("Admin.discounts.create")("type")}</Label>
						<Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
							<SelectTrigger id="edit-type">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PERCENT">{useTranslations("Admin.discounts.create")("percentage")}</SelectItem>
								<SelectItem value="FIXED">{useTranslations("Admin.discounts.create")("fixed")}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="edit-value">{useTranslations("Admin.discounts.create")("value")}</Label>
						<Input
							id="edit-value"
							type="number"
							placeholder={form.type === "PERCENT" ? "10" : "50"}
							value={form.value}
							onChange={(e) => setForm({ ...form, value: e.target.value })}
							required
						/>
						<p className="text-xs text-muted-foreground mt-1">
							{form.type === "PERCENT"
								? useTranslations("Admin.discounts.create")("valueHintPercent")
								: useTranslations("Admin.discounts.create")("valueHintFixed")}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="edit-minAmount">{useTranslations("Admin.discounts.create")("minAmount")}</Label>
							<Input
								id="edit-minAmount"
								type="number"
								placeholder="500"
								value={form.minAmount}
								onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
							/>
						</div>
						<div>
							<Label htmlFor="edit-maxUses">{useTranslations("Admin.discounts.create")("maxUses")}</Label>
							<Input
								id="edit-maxUses"
								type="number"
								placeholder="100"
								value={form.maxUses}
								onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="edit-expiresAt">{t("expiresAt")}</Label>
						<div className="flex gap-2">
							<Input
								id="edit-expiresAt"
								type="date"
								value={form.expiresAt}
								onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
								min={new Date().toISOString().split("T")[0]}
								className="flex-1"
							/>
							{form.expiresAt && (
								<Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, expiresAt: "" })}>
									{t("clear")}
								</Button>
							)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">{useTranslations("Admin.discounts.create")("expirationHint")}</p>
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="edit-active"
							checked={form.active}
							onChange={(e) => setForm({ ...form, active: e.target.checked })}
							className="h-4 w-4 rounded border-gray-300"
						/>
						<Label htmlFor="edit-active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							{t("active")}
						</Label>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("cancel")}
						</Button>
						<Button type="submit">{t("update")}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

