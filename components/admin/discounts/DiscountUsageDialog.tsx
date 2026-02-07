"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { DollarSign, RefreshCw, TrendingUp, Users } from "lucide-react"

interface UsageStats {
	totalUsages: number
	uniqueUsers: number
	totalDiscountAmount: number
	totalFinalRevenue: number
}

interface UsageByUser {
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

interface DiscountUsageDialogProps {
	isOpen: boolean
	onClose: () => void
	loading: boolean
	statistics?: UsageStats
	usageByUser?: UsageByUser[]
	recentUsages?: RecentUsage[]
}

import { useTranslations } from "next-intl"

export function DiscountUsageDialog({
	isOpen,
	onClose,
	loading,
	statistics,
	usageByUser,
	recentUsages,
}: DiscountUsageDialogProps) {
	const t = useTranslations("Admin.discounts.usage")

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("desc")}</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
					</div>
				) : statistics ? (
					<div className="space-y-6">
						{/* Statistics Cards */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center gap-2 mb-2">
										<TrendingUp className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{t("totalUses")}</span>
									</div>
									<div className="text-2xl font-bold">{statistics.totalUsages}</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center gap-2 mb-2">
										<Users className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{t("uniqueUsers")}</span>
									</div>
									<div className="text-2xl font-bold">{statistics.uniqueUsers}</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center gap-2 mb-2">
										<DollarSign className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{t("totalDiscount")}</span>
									</div>
									<div className="text-2xl font-bold">${statistics.totalDiscountAmount.toLocaleString()}</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center gap-2 mb-2">
										<DollarSign className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{t("revenue")}</span>
									</div>
									<div className="text-2xl font-bold">${statistics.totalFinalRevenue.toLocaleString()}</div>
								</CardContent>
							</Card>
						</div>

						{/* Usage by User */}
						{usageByUser && usageByUser.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>{t("byUser")}</CardTitle>
									<CardDescription>{t("byUserDesc")}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{usageByUser.map((user, idx) => (
											<div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
												<div className="flex-1">
													<div className="font-semibold">{user.userName || t("guest")}</div>
													<div className="text-sm text-muted-foreground">
														{user.email && <span>{user.email}</span>}
														{user.phone && <span className="ml-2">{user.phone}</span>}
													</div>
												</div>
												<div className="text-right">
													<div className="font-semibold">
														{t("usedCount", { count: user.count })}
													</div>
													<div className="text-sm text-muted-foreground">
														{t("saved", { amount: user.totalDiscount.toLocaleString() })} • {t("spent", { amount: user.totalSpent.toLocaleString() })}
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														{t("last", { date: new Date(user.lastUsed).toLocaleDateString() })}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Recent Usage History */}
						{recentUsages && recentUsages.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>{t("history")}</CardTitle>
									<CardDescription>{t("historyDesc")}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{recentUsages.map((usage, idx) => (
											<div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex-1">
													<div className="font-semibold">{usage.userName || t("guest")}</div>
													<div className="text-sm text-muted-foreground">
														{usage.email && <span>{usage.email}</span>}
														{usage.phone && <span className="ml-2">{usage.phone}</span>}
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														{new Date(usage.usedAt).toLocaleString()}
													</div>
												</div>
												<div className="text-right">
													<div className="font-semibold text-green-600">-${usage.discountAmount.toLocaleString()}</div>
													<div className="text-sm text-muted-foreground">Total: ${usage.finalTotal.toLocaleString()}</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	)
}

