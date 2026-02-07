"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface TimeSlot {
    id: string
    time: string
    isActive: boolean
    order: number
}

export function TimeSlotManagement() {
    const t = useTranslations("Admin.timeSlots")
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

    // Form states
    const [formData, setFormData] = useState({ time: "", order: 0, isActive: true })

    useEffect(() => {
        fetchSlots()
    }, [])

    const fetchSlots = async () => {
        try {
            const res = await fetch("/api/v1/admin/time-slots")
            if (res.ok) {
                const data = await res.json()
                setSlots(data)
            }
        } catch (error) {
            toast.error(t("error"))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/v1/admin/time-slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success(t("createSuccess"))
                setIsCreateOpen(false)
                setFormData({ time: "", order: 0, isActive: true })
                fetchSlots()
            } else {
                const data = await res.json()
                toast.error(data.error || t("error"))
            }
        } catch (error) {
            toast.error(t("error"))
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSlot) return

        try {
            const res = await fetch(`/api/v1/admin/time-slots/${editingSlot.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success(t("updateSuccess"))
                setEditingSlot(null)
                fetchSlots()
            } else {
                toast.error(t("error"))
            }
        } catch (error) {
            toast.error(t("error"))
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDelete"))) return

        try {
            const res = await fetch(`/api/v1/admin/time-slots/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success(t("deleteSuccess"))
                fetchSlots()
            } else {
                toast.error(t("error"))
            }
        } catch (error) {
            toast.error(t("error"))
        }
    }

    const openEdit = (slot: TimeSlot) => {
        setEditingSlot(slot)
        setFormData({ time: slot.time, order: slot.order, isActive: slot.isActive })
    }

    const toggleActive = async (slot: TimeSlot) => {
        try {
            const res = await fetch(`/api/v1/admin/time-slots/${slot.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...slot, isActive: !slot.isActive }),
            })

            if (res.ok) {
                toast.success(t("updateSuccess"))
                fetchSlots()
            }
        } catch (error) {
            toast.error(t("error"))
        }
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("add")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("add")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="time">{t("time")}</Label>
                                <Input
                                    id="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    placeholder="8:30 AM"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="order">{t("order")}</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order || ""}
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value ? parseInt(e.target.value) : 0 })}
                                    required
                                />
                            </div>
                            <Button type="submit">{t("save")}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("order")}</TableHead>
                                <TableHead>{t("time")}</TableHead>
                                <TableHead>{t("active")}</TableHead>
                                <TableHead className="text-right">{t("actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slots.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        {t("empty")}
                                    </TableCell>
                                </TableRow>
                            )}
                            {slots.map((slot) => (
                                <TableRow key={slot.id}>
                                    <TableCell>{slot.order}</TableCell>
                                    <TableCell className="font-medium">{slot.time}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={slot.isActive}
                                            onCheckedChange={() => toggleActive(slot)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(slot)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleDelete(slot.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Edit Dialog */}
                <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("edit")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-time">{t("time")}</Label>
                                <Input
                                    id="edit-time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    placeholder="8:30 AM"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-order">{t("order")}</Label>
                                <Input
                                    id="edit-order"
                                    type="number"
                                    value={formData.order || ""}
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value ? parseInt(e.target.value) : 0 })}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="edit-active">{t("active")}</Label>
                            </div>
                            <Button type="submit">{t("save")}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
