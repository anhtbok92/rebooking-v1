"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Eye, Users, Gift, TrendingUp, Copy, CheckCircle2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

interface ReferralCode {
	id: string
	code: string
	userId: string
	userName: string
	userEmail: string
	userPhone?: string | null
	userPoints: number
	pointsPerReferral: number
	usageCount: number
	totalPointsAwarded: number
	uniqueReferrals: number
	createdAt: string
	updatedAt: string
}

interface ReferralDetails {
	referralCode: {
		id: string
		code: string
		pointsPerReferral: number
		usageCount: number
		createdAt: string
	}
	user: {
		id: string
		name: string
		email: string
		phone?: string | null
		referralPoints: number
	}
	statistics: {
		totalReferrals: number
		totalPointsAwarded: number
		totalRewards: number
	}
	referralsByUser: Array<{
		referredId: string
		referredUser: {
			id: string
			name: string
			email: string
			phone?: string | null
			createdAt: string
		}
		totalPoints: number
		referralCount: number
		firstReferral: string
		lastReferral: string
	}>
	recentRewards: Array<{
		id: string
		referredId: string
		points: number
		bookingId?: string | null
		createdAt: string
		User: {
			id: string
			name: string
			email: string
		} | null
	}>
}

import { useTranslations, useLocale } from "next-intl"

export function ReferralManagement() {
	const t = useTranslations("Admin.referrals")
	const locale = useLocale()
	const [codes, setCodes] = useState<ReferralCode[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null)
	const [details, setDetails] = useState<ReferralDetails | null>(null)
	const [loadingDetails, setLoadingDetails] = useState(false)
	const [editPoints, setEditPoints] = useState("")
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)

	// Load referral codes
	const loadCodes = async () => {
		setLoading(true)
		try {
			const res = await fetch("/api/v1/admin/referrals")
			if (!res.ok) throw new Error("Failed to load codes")
			const data = await res.json()
			setCodes(data)
		} catch (err) {
			toast.error(t("details.loadError"))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCodes()
	}, [])

	// Load details for a referral code
	const loadDetails = async (id: string) => {
		setSelectedCodeId(id)
		setLoadingDetails(true)
		try {
			const res = await fetch(`/api/v1/admin/referrals/${id}`)
			if (!res.ok) throw new Error("Failed to load details")
			const data = await res.json()
			setDetails(data)
			setEditPoints(data.referralCode.pointsPerReferral.toString())
		} catch (err) {
			toast.error(t("details.loadError"))
		} finally {
			setLoadingDetails(false)
		}
	}

	// Update points per referral
	const handleUpdatePoints = async () => {
		if (!selectedCodeId) return

		try {
			const res = await fetch(`/api/v1/admin/referrals/${selectedCodeId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pointsPerReferral: parseInt(editPoints) }),
			})

			if (res.ok) {
				toast.success(t("details.updateSuccess"))
				setIsEditDialogOpen(false)
				loadCodes()
				if (selectedCodeId) loadDetails(selectedCodeId)
			} else {
				toast.error(t("details.updateError"))
			}
		} catch (err) {
			toast.error(t("details.updateError"))
		}
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success(t("actions.copy"))
	}

	// Generate referral codes for all users without one
	const generateAllCodes = async () => {
		setIsGenerating(true)
		try {
			const res = await fetch("/api/v1/admin/referrals/generate-all", {
				method: "POST",
			})
			const data = await res.json()
			if (res.ok) {
				toast.success(t("actions.generateSuccess"))
				loadCodes() // Refresh the list
			} else {
				toast.error(t("actions.generateError"))
			}
		} catch (err) {
			toast.error(t("actions.generateError"))
		} finally {
			setIsGenerating(false)
		}
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
					<Button variant="outline" size="sm" onClick={generateAllCodes} disabled={isGenerating || loading}>
						<Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
						{isGenerating ? t("actions.generating") : t("actions.generateAll")}
					</Button>
					<Button variant="outline" size="sm" onClick={loadCodes} disabled={loading}>
						<RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
						{t("actions.refresh")}
					</Button>
				</div>
			</div>

			{/* Statistics Overview */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<Users className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">{t("stats.totalCodes")}</span>
						</div>
						<div className="text-2xl font-bold">{codes.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">{t("stats.totalReferrals")}</span>
						</div>
						<div className="text-2xl font-bold">
							{codes.reduce((sum, c) => sum + c.uniqueReferrals, 0)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<Gift className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">{t("stats.totalPoints")}</span>
						</div>
						<div className="text-2xl font-bold">
							{codes.reduce((sum, c) => sum + c.totalPointsAwarded, 0)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<Users className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">{t("stats.activeAffiliates")}</span>
						</div>
						<div className="text-2xl font-bold">
							{codes.filter((c) => c.uniqueReferrals > 0).length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Referral Codes List */}
			<Card>
				<CardHeader>
					<CardTitle>{t("list.title")}</CardTitle>
					<CardDescription>{t("list.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					{codes.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">{t("list.noCodes")}</p>
						</div>
					) : (
						<div className="space-y-3">
							{codes.map((code) => (
								<div
									key={code.id}
									className="flex items-center justify-between p-4 rounded-lg border bg-card"
								>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<code className="font-mono font-bold text-lg">{code.code}</code>
											<Badge variant="secondary">{t("list.referralsCount", { count: code.uniqueReferrals })}</Badge>
										</div>
										<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
											<span>
												<strong className="text-card-foreground">{code.userName}</strong> ({code.userEmail})
											</span>
											<span>{t("list.ptsPerReferral", { count: code.pointsPerReferral })}</span>
											<span>{t("list.totalPts", { count: code.totalPointsAwarded })}</span>
											<span>{t("list.userPts", { count: code.userPoints })}</span>
											<span className="text-xs">{t("list.created", { date: new Date(code.createdAt).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US") })}</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm" onClick={() => loadDetails(code.id)}>
											<Eye className="w-4 h-4 mr-2" />
											{t("actions.viewDetails")}
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Details Dialog */}
			<Dialog open={selectedCodeId !== null} onOpenChange={(open) => !open && setSelectedCodeId(null)}>
				<DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{t("details.title")}</DialogTitle>
						<DialogDescription>{t("details.description")}</DialogDescription>
					</DialogHeader>

					{loadingDetails ? (
						<div className="flex items-center justify-center py-12">
							<RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
						</div>
					) : details ? (
						<div className="space-y-6">
							{/* Statistics Cards */}
							<div className="grid grid-cols-3 gap-4">
								<Card>
									<CardContent className="pt-6">
										<div className="flex items-center gap-2 mb-2">
											<Users className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{t("stats.totalReferrals")}</span>
										</div>
										<div className="text-2xl font-bold">{details.statistics.totalReferrals}</div>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="pt-6">
										<div className="flex items-center gap-2 mb-2">
											<Gift className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{t("details.pointsAwarded")}</span>
										</div>
										<div className="text-2xl font-bold">{details.statistics.totalPointsAwarded}</div>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="pt-6">
										<div className="flex items-center gap-2 mb-2">
											<TrendingUp className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{t("details.totalRewards")}</span>
										</div>
										<div className="text-2xl font-bold">{details.statistics.totalRewards}</div>
									</CardContent>
								</Card>
							</div>

							{/* Code Info */}
							<Card>
								<CardHeader>
									<CardTitle>{t("details.codeInfo")}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<Label>{t("details.referralCode")}</Label>
											<div className="flex items-center gap-2 mt-1">
												<code className="font-mono text-lg font-bold">{details.referralCode.code}</code>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(details.referralCode.code)}
												>
													<Copy className="w-4 h-4" />
												</Button>
											</div>
										</div>
										<div>
											<Label>{t("details.pointsPerReferral")}</Label>
											<div className="flex items-center gap-2 mt-1">
												<span className="text-lg font-semibold">{details.referralCode.pointsPerReferral}</span>
												<Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
													{t("details.edit")}
												</Button>
											</div>
										</div>
									</div>
									<div>
										<Label>{t("details.codeOwner")}</Label>
										<p className="mt-1">
											{t("details.ownerInfo", { name: details.user.name, email: details.user.email, points: details.user.referralPoints })}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Referrals by User */}
							{details.referralsByUser.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>{t("details.referralsByUser")}</CardTitle>
										<CardDescription>{t("details.referralsByUserDesc")}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{details.referralsByUser.map((ref, idx) => (
												<div
													key={idx}
													className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
												>
													<div className="flex-1">
														<div className="font-semibold">
															{ref.referredUser?.name || "Unknown"} ({ref.referredUser?.email || "N/A"})
														</div>
														<div className="text-sm text-muted-foreground">
															{t("details.referredCount", { count: ref.referralCount })} •{" "}
															{t("details.referredPoints", { count: ref.totalPoints })}
														</div>
														<div className="text-xs text-muted-foreground mt-1">
															{t("details.firstLast", {
																first: new Date(ref.firstReferral).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US"),
																last: new Date(ref.lastReferral).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")
															})}
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Recent Rewards */}
							{details.recentRewards.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>{t("details.recentRewards")}</CardTitle>
										<CardDescription>{t("details.recentRewardsDesc")}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{details.recentRewards.map((reward) => (
												<div
													key={reward.id}
													className="flex items-center justify-between p-3 border rounded-lg text-sm"
												>
													<div>
														<div className="font-medium">
															{reward.User?.name || "Unknown"} ({reward.User?.email || "N/A"})
														</div>
														<div className="text-muted-foreground text-xs">
															{new Date(reward.createdAt).toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
														</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-green-600">+{reward.points} points</div>
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

			{/* Edit Points Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("details.editTitle")}</DialogTitle>
						<DialogDescription>{t("details.editDesc")}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="points">{t("details.pointsPerReferral")}</Label>
							<Input
								id="points"
								type="number"
								value={editPoints}
								onChange={(e) => setEditPoints(e.target.value)}
								min="0"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
							{t("details.cancel")}
						</Button>
						<Button onClick={handleUpdatePoints}>{t("details.update")}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

