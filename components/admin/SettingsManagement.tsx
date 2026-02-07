"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Settings as SettingsIcon, Save, MapPin } from "lucide-react"
import { useClinicAddress, updateClinicAddress } from "@/lib/swr"

export function SettingsManagement() {
    const t = useTranslations("Admin.settings")
    const [currency, setCurrency] = useState("VND")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    
    // Clinic address state
    const { data: clinicAddress, mutate } = useClinicAddress()
    const [address, setAddress] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])
    
    useEffect(() => {
        if (clinicAddress) {
            setAddress(clinicAddress.address || "")
            setLatitude(clinicAddress.latitude?.toString() || "")
            setLongitude(clinicAddress.longitude?.toString() || "")
            setPhone(clinicAddress.phone || "")
            setEmail(clinicAddress.email || "")
        }
    }, [clinicAddress])

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
    
    const handleSaveAddress = async () => {
        if (!address.trim()) {
            toast.error("Vui lòng nhập địa chỉ")
            return
        }
        
        setIsSavingAddress(true)
        try {
            await updateClinicAddress({
                address: address.trim(),
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                phone: phone.trim(),
                email: email.trim(),
            })
            
            toast.success("Đã lưu địa chỉ phòng khám")
            mutate() // Refresh data
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Không thể lưu địa chỉ")
        } finally {
            setIsSavingAddress(false)
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
            
            {/* Clinic Address Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Địa Chỉ Phòng Khám
                    </CardTitle>
                    <CardDescription>
                        Cấu hình địa chỉ và thông tin liên hệ của phòng khám
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ *</Label>
                        <Input
                            id="address"
                            placeholder="Nhập địa chỉ phòng khám"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Địa chỉ đầy đủ của phòng khám
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                placeholder="VD: 10.762622"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                placeholder="VD: 106.660172"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                        Tọa độ GPS để hiển thị chính xác trên bản đồ. 
                        Bạn có thể lấy tọa độ từ Google Maps.
                    </p>
                    
                    <div className="space-y-2">
                        <Label htmlFor="clinic-phone">Số điện thoại</Label>
                        <Input
                            id="clinic-phone"
                            type="tel"
                            placeholder="VD: 0123456789"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="clinic-email">Email</Label>
                        <Input
                            id="clinic-email"
                            type="email"
                            placeholder="VD: contact@clinic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleSaveAddress} disabled={isSavingAddress} className="gap-2">
                        <Save className="w-4 h-4" />
                        {isSavingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
