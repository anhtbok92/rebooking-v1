"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useServices, type Service } from "@/lib/swr"
import { Plus, Trash2, Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import { useTranslations } from "next-intl"

export function ServicesManagement() {
  const tCommon = useTranslations("Common")
  const tAdmin = useTranslations("Admin.users")
  const t = useTranslations("Admin.services")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc">("name-asc")
  const { data: response, mutate } = useServices({
    page,
    limit: 12,
    sort: sortBy,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newServiceName, setNewServiceName] = useState("")
  const [newServicePrice, setNewServicePrice] = useState("")
  const [newServiceImageUrl, setNewServiceImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editImageUrl, setEditImageUrl] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  // Helper functions for price formatting
  const parsePrice = (formattedValue: string): number => {
    return parseInt(formattedValue.replace(/\./g, "").replace(/,/g, "") || "0")
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    if (rawValue === "") {
      setter("")
      return
    }
    const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(rawValue))
    setter(formatted)
  }

  const services = response?.services || []
  const pagination = response?.pagination

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/v1/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newServiceName,
          price: parsePrice(newServicePrice),
          imageUrl: newServiceImageUrl || null,
        }),
      })

      if (response.ok) {
        mutate()
        setIsOpen(false)
        setNewServiceName("")
        setNewServicePrice("")
        setNewServiceImageUrl("")
        toast.success(t("addSuccess"))
      } else {
        const error = await response.json()
        toast.error(t("addError"), {
          description: error.error || "An error occurred",
        })
      }
    } catch (error) {
      toast.error(t("addError"), {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/v1/services/${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          price: parsePrice(editPrice),
          imageUrl: editImageUrl || null,
        }),
      })

      if (response.ok) {
        mutate()
        setIsEditOpen(false)
        setEditingService(null)
        setEditName("")
        setEditPrice("")
        setEditImageUrl("")
        toast.success(t("updateSuccess"))
      } else {
        const error = await response.json()
        toast.error(t("updateError"), {
          description: error.error || "An error occurred",
        })
      }
    } catch (error) {
      toast.error(t("updateError"), {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setEditName(service.name)
    setEditPrice(new Intl.NumberFormat("vi-VN").format(service.price))
    setEditImageUrl(service.imageUrl || "")
    setIsEditOpen(true)
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return

    try {
      const response = await fetch(`/api/v1/services/${serviceToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutate()
        setDeleteDialogOpen(false)
        setServiceToDelete(null)
        toast.success(t("deleteSuccess"))
      } else {
        const error = await response.json()
        toast.error(t("deleteError"), {
          description: error.error || "An error occurred",
        })
      }
    } catch (error) {
      toast.error(t("deleteError"), {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }

  const openDeleteDialog = (serviceId: string) => {
    setServiceToDelete(serviceId)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {t("title")}
        </h2>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">{t("sortNameAsc")}</SelectItem>
              <SelectItem value="name-desc">{t("sortNameDesc")}</SelectItem>
              <SelectItem value="price-asc">{t("sortPriceAsc")}</SelectItem>
              <SelectItem value="price-desc">{t("sortPriceDesc")}</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("addService")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addNewService")}</DialogTitle>
                <DialogDescription>{t("createDescription")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">{t("serviceName")}</Label>
                  <Input
                    id="serviceName"
                    placeholder="e.g., Classic Manicure"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servicePrice">{t("price")}</Label>
                  <Input
                    id="servicePrice"
                    type="text"
                    placeholder="e.g., 50.000"
                    value={newServicePrice}
                    onChange={(e) => handlePriceChange(e, setNewServicePrice)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceImageUrl">Ảnh Banner (URL)</Label>
                  <Input
                    id="serviceImageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newServiceImageUrl}
                    onChange={(e) => setNewServiceImageUrl(e.target.value)}
                  />
                  {newServiceImageUrl && (
                    <div className="mt-2">
                      <img 
                        src={newServiceImageUrl} 
                        alt="Preview" 
                        className="w-full max-w-xs h-auto rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("adding") : t("addService")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editService")}</DialogTitle>
            <DialogDescription>{t("updateDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditService} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editServiceName">{t("serviceName")}</Label>
              <Input
                id="editServiceName"
                placeholder="e.g., Classic Manicure"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editServicePrice">{t("price")}</Label>
              <Input
                id="editServicePrice"
                type="text"
                placeholder="e.g., 50.000"
                value={editPrice}
                onChange={(e) => handlePriceChange(e, setEditPrice)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editServiceImageUrl">Ảnh Banner (URL)</Label>
              <Input
                id="editServiceImageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
              />
              {editImageUrl && (
                <div className="mt-2">
                  <img 
                    src={editImageUrl} 
                    alt="Preview" 
                    className="w-full max-w-xs h-auto rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveChanges")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1 text-lg font-semibold text-foreground mt-2">
                  <span>{service.price.toLocaleString("vi-VN")}</span>
                  <span className="text-sm text-muted-foreground">đ</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => openEditDialog(service)}
                >
                  <Edit2 className="w-4 h-4" />
                  {t("edit")}
                </Button>
                <AlertDialog open={deleteDialogOpen && serviceToDelete === service.id} onOpenChange={(open) => {
                  if (!open) {
                    setDeleteDialogOpen(false)
                    setServiceToDelete(null)
                  } else {
                    openDeleteDialog(service.id)
                  }
                }}>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => openDeleteDialog(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("delete")}
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("deleteConfirmDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteService}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t("delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {tAdmin("pagination", {
              page: pagination.page,
              pages: pagination.pages,
              total: pagination.total,
            })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              {tAdmin("prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
            >
              {tAdmin("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
