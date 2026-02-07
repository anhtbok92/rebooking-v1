"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Settings as SettingsIcon, Save } from "lucide-react"

export function SettingsManagement() {
    const t = useTranslations("Admin.settings")
    const [currency, setCurrency] = useState("VND")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/v1/admin/settings")
            if (res.ok) {
                const data = await res.json()
                setCurrency(data.currency || "VND")
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/v1/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "currency", value: currency }),
            })

            if (res.ok) {
                toast.success(t("saveSuccess"))
                // Reload page to apply changes
                setTimeout(() => window.location.reload(), 1000)
            } else {
                toast.error(t("saveError"))
            }
        } catch (error) {
            toast.error(t("saveError"))
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">{t("loading")}</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {t("title")}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        {t("general.title")}
                    </CardTitle>
                    <CardDescription>{t("general.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currency">{t("currency.label")}</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger id="currency" className="w-full md:w-[300px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VND">
                                    <div className="flex items-center gap-2">
                                        <span>đ</span>
                                        <span>{t("currency.vnd")}</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="USD">
                                    <div className="flex items-center gap-2">
                                        <span>$</span>
                                        <span>{t("currency.usd")}</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">{t("currency.description")}</p>
                    </div>

                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {isSaving ? t("saving") : t("save")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
