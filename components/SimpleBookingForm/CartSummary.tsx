// components/CartSummary.tsx
"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-redux-cart"
import { formatBookingDateTime } from "@/lib/utils"
import { Brush, Droplet, Footprints, Hand, Palette, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { EditCartItemDialog } from "@/components/cart/EditCartItemDialog"
import { useTranslations } from "next-intl"

// Helper function to get service icon based on service name
function getServiceIcon(serviceName: string) {
	const serviceNameLower = serviceName.toLowerCase()
	if (serviceNameLower.includes("manicure")) return Hand
	if (serviceNameLower.includes("pedicure")) return Footprints
	if (serviceNameLower.includes("refill")) return Brush
	if (serviceNameLower.includes("nail art") || serviceNameLower.includes("nail-art")) return Palette
	return Droplet
}

interface CartSummaryProps {
	onClose?: () => void
}

export function CartSummary({ onClose }: CartSummaryProps) {
	const { cart, removeFromCart, cartTotal, cartCount, updateCartItem } = useCart()
	const t = useTranslations("Booking.cart")

	const handleRemoveFromCart = (itemId: string, serviceName: string) => {
		removeFromCart(itemId)
		toast.success(t("removed", { service: serviceName }))
	}


	if (cartCount === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
				<ShoppingCart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
				<p className="text-muted-foreground text-lg mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
					{t("empty")}
				</p>
				<p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
					{t("emptyDescription")}
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">

			<div className="space-y-3 mb-4 flex-1 overflow-y-auto">
				{cart.map((item) => {
					const ServiceIcon = getServiceIcon(item.serviceName)
					return (
						<div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
									<ServiceIcon className="w-5 h-5" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-card-foreground text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
										{item.serviceName}
									</p>
									<p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
										{formatBookingDateTime(item.date, item.time)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 flex-shrink-0">
								<div className="flex items-center gap-1">
									<span className="font-bold text-primary text-sm">{item.price.toLocaleString("vi-VN")}</span>
									<span className="text-xs text-muted-foreground">đ</span>
								</div>
								<div className="flex items-center gap-1">
									<EditCartItemDialog item={item} onUpdate={updateCartItem} />
									<button
										onClick={() => handleRemoveFromCart(item.id, item.serviceName)}
										className="p-1 hover:bg-destructive/10 rounded transition-colors opacity-70 group-hover:opacity-100"
									>
										<Trash2 className="w-4 h-4 text-destructive" />
									</button>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<div className="border-t border-border pt-4 space-y-3 mt-auto">
				<div className="flex justify-between items-center mb-4">
					<span className="text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						{t("total")}
					</span>
					<div className="flex items-center gap-1">
						<span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
							{cartTotal.toLocaleString("vi-VN")}
						</span>
						<span className="text-sm text-muted-foreground">đ</span>
					</div>
				</div>

				<Link href="/checkout" className="block">
					<Button className="w-full" size="lg">
						{t("checkout")}
					</Button>
				</Link>

				<Button
					variant="outline"
					className="w-full"
					size="sm"
					onClick={() => {
						// Close sidebar when clicking "Add More Services"
						onClose?.()
						// Scroll to top of the form
						window.scrollTo({ top: 0, behavior: "smooth" })
					}}
				>
					<Plus className="w-4 h-4 mr-2" />
					{t("addMore")}
				</Button>
			</div>
		</div>
	)
}