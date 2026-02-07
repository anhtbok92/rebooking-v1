"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function SettingsForm() {
	const t = useTranslations("Settings")
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [emailNotifications, setEmailNotifications] = useState(true)
	const [smsNotifications, setSmsNotifications] = useState(false)
	const [bookingReminders, setBookingReminders] = useState(true)
	const [promotionalEmails, setPromotionalEmails] = useState(false)

	const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			toast.error(t("messages.matchError"))
			return
		}

		if (newPassword.length < 8) {
			toast.error(t("messages.lengthError"))
			return
		}

		setLoading(true)
		try {
			const res = await fetch("/api/v1/user/password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || t("messages.updateError"))
			}

			toast.success(t("messages.updateSuccess"))
			setCurrentPassword("")
			setNewPassword("")
			setConfirmPassword("")
		} catch (error) {
			toast.error(error instanceof Error ? error.message : t("messages.updateError"))
		} finally {
			setLoading(false)
		}
	}

	const handlePreferencesSave = async () => {
		try {
			const res = await fetch("/api/v1/user/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					emailNotifications,
					smsNotifications,
					bookingReminders,
					promotionalEmails,
				}),
			})

			if (!res.ok) throw new Error(t("messages.prefsError"))
			toast.success(t("messages.prefsSuccess"))
		} catch (error) {
			toast.error(t("messages.prefsError"))
		}
	}

	return (
		<Tabs defaultValue="password" className="w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="password">{t("tabs.password")}</TabsTrigger>
				<TabsTrigger value="preferences">{t("tabs.preferences")}</TabsTrigger>
			</TabsList>

			<TabsContent value="password">
				<Card className="p-6">
					<form onSubmit={handlePasswordChange} className="space-y-6">
						<div>
							<Label htmlFor="current-password">{t("password.current")}</Label>
							<Input
								id="current-password"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className="mt-2"
								placeholder={t("password.currentPlaceholder")}
								required
							/>
						</div>

						<div>
							<Label htmlFor="new-password">{t("password.new")}</Label>
							<Input
								id="new-password"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="mt-2"
								placeholder={t("password.newPlaceholder")}
								required
							/>
						</div>

						<div>
							<Label htmlFor="confirm-password">{t("password.confirm")}</Label>
							<Input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="mt-2"
								placeholder={t("password.confirmPlaceholder")}
								required
							/>
						</div>

						<Button type="submit" disabled={loading} className="w-full">
							{loading ? t("password.updating") : t("password.button")}
						</Button>
					</form>
				</Card>
			</TabsContent>

			<TabsContent value="preferences">
				<Card>
					<CardHeader>
						<CardTitle>{t("preferences.title")}</CardTitle>
						<CardDescription>{t("preferences.desc")}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="email-notifications">{t("preferences.email")}</Label>
								<p className="text-sm text-muted-foreground">{t("preferences.emailDesc")}</p>
							</div>
							<Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="sms-notifications">{t("preferences.sms")}</Label>
								<p className="text-sm text-muted-foreground">{t("preferences.smsDesc")}</p>
							</div>
							<Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="booking-reminders">{t("preferences.reminders")}</Label>
								<p className="text-sm text-muted-foreground">{t("preferences.remindersDesc")}</p>
							</div>
							<Switch id="booking-reminders" checked={bookingReminders} onCheckedChange={setBookingReminders} />
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="promotional-emails">{t("preferences.promotional")}</Label>
								<p className="text-sm text-muted-foreground">{t("preferences.promotionalDesc")}</p>
							</div>
							<Switch id="promotional-emails" checked={promotionalEmails} onCheckedChange={setPromotionalEmails} />
						</div>

						<Button onClick={handlePreferencesSave} className="w-full">
							{t("preferences.save")}
						</Button>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
