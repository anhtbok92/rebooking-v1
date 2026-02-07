"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getRoleLabel } from "@/lib/rbac"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Copy, Gift, Link2, Users, TrendingUp, CheckCircle2 } from "lucide-react"
import ImageUpload from "./ImageUpload"
import { useTranslations } from "next-intl"

interface UserProfile {
	id: string
	name: string | null
	email: string
	phone: string | null
	image: string | null
	role: string
	createdAt: string
}

interface ReferralData {
	code: string
	link: string
	points: number
	pointsPerReferral: number
	totalReferrals: number
	totalPointsAwarded: number
}

export function ProfileForm() {
	const t = useTranslations("Profile")
	const tr = useTranslations("Common.roles")
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [referralData, setReferralData] = useState<ReferralData | null>(null)
	const [loadingReferral, setLoadingReferral] = useState(false)
	const [copied, setCopied] = useState<"code" | "link" | null>(null)
	const { data: session } = useSession()

	useEffect(() => {
		fetchProfile()
		fetchReferralData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const fetchProfile = async () => {
		try {
			const res = await fetch("/api/v1/user/profile")
			if (!res.ok) throw new Error("Failed to fetch profile")
			const data = await res.json()
			// Fallback to session role if role is not in response
			if (!data.role && session?.user) {
				data.role = (session.user as any).role || "CLIENT"
			}
			setProfile(data)
		} catch (error) {
			toast.error(t("messages.loadError"))
		} finally {
			setLoading(false)
		}
	}

	const fetchReferralData = async () => {
		setLoadingReferral(true)
		try {
			const res = await fetch("/api/v1/user/referral")
			if (!res.ok) throw new Error("Failed to fetch referral data")
			const data = await res.json()
			setReferralData(data)
		} catch (error) {
			// Silently fail - referral is optional
		} finally {
			setLoadingReferral(false)
		}
	}

	const copyToClipboard = async (text: string, type: "code" | "link") => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(type)
			toast.success(t("messages.copySuccess", { type: type === "code" ? "Code" : "Link" }))
			setTimeout(() => setCopied(null), 2000)
		} catch (error) {
			toast.error(t("messages.copyError"))
		}
	}

	const handleImageUpload = async (imageUrl: string) => {
		if (!profile) return
		setSaving(true)
		try {
			const res = await fetch("/api/v1/user/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: profile.name,
					phone: profile.phone,
					image: imageUrl,
				}),
			})
			if (!res.ok) throw new Error("Failed to update profile")
			setProfile({ ...profile, image: imageUrl })
			toast.success(t("messages.imgSuccess"))
		} catch (error) {
			toast.error(t("messages.imgError"))
		} finally {
			setSaving(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!profile) return

		setSaving(true)
		try {
			const res = await fetch("/api/v1/user/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: profile.name,
					phone: profile.phone,
				}),
			})
			if (!res.ok) throw new Error("Failed to update profile")
			toast.success(t("messages.updateSuccess"))
		} catch (error) {
			toast.error(t("messages.updateError"))
		} finally {
			setSaving(false)
		}
	}

	if (loading) return <div className="text-center py-8">Loading...</div>
	if (!profile) return <div className="text-center py-8">{t("messages.loadError")}</div>

	return (
		<div className="space-y-6">
			{/* Profile Picture */}
			<Card>
				<CardHeader>
					<CardTitle>{t("picture.title")}</CardTitle>
					<CardDescription>{t("picture.desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<ImageUpload
						value={profile.image || ""}
						onChange={handleImageUpload}
						showReuse={true}
						imgHeight={150}
						imgWidth={150}
					/>
				</CardContent>
			</Card>

			{/* Personal Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("personal.title")}</CardTitle>
					<CardDescription>{t("personal.desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label htmlFor="email">{t("fields.email")}</Label>
								<Input id="email" type="email" value={profile.email} disabled className="mt-2 bg-muted" />
								<p className="text-xs text-muted-foreground mt-1">{t("fields.emailHint")}</p>
							</div>
							<div>
								<Label htmlFor="role">{t("fields.role")}</Label>
								<Input
									id="role"
									type="text"
									value={(() => {
										const role = profile?.role || (session?.user as any)?.role
										return role ? tr(role as any) : ""
									})()}
									disabled
									className="mt-2 bg-muted"
									placeholder="Loading..."
								/>
								<p className="text-xs text-muted-foreground mt-1">{t("fields.roleHint")}</p>
							</div>
						</div>

						<div>
							<Label htmlFor="name">{t("fields.name")}</Label>
							<Input
								id="name"
								type="text"
								value={profile.name || ""}
								onChange={(e) => setProfile({ ...profile, name: e.target.value })}
								className="mt-2"
								placeholder={t("fields.namePlaceholder")}
							/>
						</div>

						<div>
							<Label htmlFor="phone">{t("fields.phone")}</Label>
							<Input
								id="phone"
								type="tel"
								value={profile.phone || ""}
								onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
								className="mt-2"
								placeholder={t("fields.phonePlaceholder")}
							/>
						</div>

						<Button type="submit" disabled={saving} className="w-full">
							{saving ? t("saving") : t("save")}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Account Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("account.title")}</CardTitle>
					<CardDescription>{t("account.desc")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center py-2 border-b">
						<span className="text-sm text-muted-foreground">{t("account.memberSince")}</span>
						<span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
					</div>
					<div className="flex justify-between items-center py-2">
						<span className="text-sm text-muted-foreground">{t("account.status")}</span>
						<span className="font-medium text-green-600">{t("account.active")}</span>
					</div>
				</CardContent>
			</Card>

			{/* Referral Program */}
			<Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Gift className="w-5 h-5 text-primary" />
						{t("referral.title")}
					</CardTitle>
					<CardDescription>{t("referral.desc")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{loadingReferral ? (
						<div className="text-center py-4 text-muted-foreground">Loading...</div>
					) : (
						<>
							{/* Statistics */}
							{referralData && (
								<div className="grid grid-cols-3 gap-4">
									<div className="text-center p-4 bg-background rounded-lg border">
										<div className="flex items-center justify-center gap-2 mb-2">
											<Gift className="w-4 h-4 text-primary" />
										</div>
										<div className="text-2xl font-bold">{referralData.points || 0}</div>
										<div className="text-xs text-muted-foreground">{t("referral.points")}</div>
									</div>
									<div className="text-center p-4 bg-background rounded-lg border">
										<div className="flex items-center justify-center gap-2 mb-2">
											<Users className="w-4 h-4 text-primary" />
										</div>
										<div className="text-2xl font-bold">{referralData.totalReferrals || 0}</div>
										<div className="text-xs text-muted-foreground">{t("referral.referrals")}</div>
									</div>
									<div className="text-center p-4 bg-background rounded-lg border">
										<div className="flex items-center justify-center gap-2 mb-2">
											<TrendingUp className="w-4 h-4 text-primary" />
										</div>
										<div className="text-2xl font-bold">{referralData.pointsPerReferral || 100}</div>
										<div className="text-xs text-muted-foreground">{t("referral.ptsPerRef")}</div>
									</div>
								</div>
							)}

							{/* Referral Code */}
							<div>
								<Label>{t("referral.codeLabel")}</Label>
								<div className="flex gap-2 mt-2">
									<Input
										value={referralData?.code || "Loading..."}
										readOnly
										className="font-mono text-lg font-bold bg-background"
										disabled={!referralData}
									/>
									<Button
										variant="outline"
										size="icon"
										onClick={() => referralData && copyToClipboard(referralData.code, "code")}
										className="shrink-0"
										disabled={!referralData}
									>
										{copied === "code" ? (
											<CheckCircle2 className="w-4 h-4 text-green-600" />
										) : (
											<Copy className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>

							{/* Referral Link */}
							<div>
								<Label>{t("referral.linkLabel")}</Label>
								<div className="flex gap-2 mt-2">
									<Input
										value={referralData?.link || "Loading..."}
										readOnly
										className="font-mono text-sm bg-background"
										disabled={!referralData}
									/>
									<Button
										variant="outline"
										size="icon"
										onClick={() => referralData && copyToClipboard(referralData.link, "link")}
										className="shrink-0"
										disabled={!referralData}
									>
										{copied === "link" ? (
											<CheckCircle2 className="w-4 h-4 text-green-600" />
										) : (
											<Copy className="w-4 h-4" />
										)}
									</Button>
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									{t("referral.shareHint", { points: referralData?.pointsPerReferral || 100 })}
								</p>
							</div>

							{/* Social Media Sharing */}
							{referralData && (
								<div>
									<Label>{t("referral.social")}</Label>
									<div className="flex gap-2 mt-2 flex-wrap">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												const text = `Join me on Reebooking! Use my referral code ${referralData.code} and get amazing spa services. ${referralData.link}`
												window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
											}}
											className="gap-2"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
											</svg>
											Twitter
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												const text = `Join me on Reebooking! Use my referral code ${referralData.code} and get amazing spa services.`
												window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.link)}&quote=${encodeURIComponent(text)}`, "_blank")
											}}
											className="gap-2"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
											</svg>
											Facebook
										</Button>
									</div>
								</div>
							)}

							{/* How it works */}
							<div className="bg-muted/50 p-4 rounded-lg border">
								<h4 className="font-semibold mb-2 flex items-center gap-2">
									<Link2 className="w-4 h-4" />
									{t("referral.howItWorks")}
								</h4>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>{t("referral.step1")}</li>
									<li>{t("referral.step2", { points: referralData?.pointsPerReferral || 100 })}</li>
									<li>{t("referral.step3")}</li>
									<li>{t("referral.step4")}</li>
								</ul>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
