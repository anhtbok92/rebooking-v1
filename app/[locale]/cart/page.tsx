"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-redux-cart"
import { formatBookingDateTime } from "@/lib/utils"
import { ArrowLeft, Brush, Droplet, Footprints, Hand, Palette, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { EditCartItemDialog } from "@/components/cart/EditCartItemDialog"
import Link from "next/link"
import { toast } from "sonner"

// Helper function to get service icon based on service name
function getServiceIcon(serviceName: string) {
	const serviceNameLower = serviceName.toLowerCase()
	if (serviceNameLower.includes("manicure")) return Hand
	if (serviceNameLower.includes("pedicure")) return Footprints
	if (serviceNameLower.includes("refill")) return Brush
	if (serviceNameLower.includes("nail art") || serviceNameLower.includes("nail-art")) return Palette
	return Droplet
}

export default function CartPage() {
	const { cart, clearCart, cartTotal, removeFromCart, updateCartItem } = useCart()

	// If cart is empty, show empty state
	if (cart.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
					<h1 className="text-3xl font-bold text-card-foreground mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						Your cart is empty
					</h1>
					<p className="text-muted-foreground mb-8 text-lg" style={{ fontFamily: "var(--font-dm-sans)" }}>
						Add services to your cart to get started
					</p>
					<Link href="/">
						<Button size="lg" className="gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to Booking
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	const handleRemoveItem = (itemId: string, serviceName: string) => {
		removeFromCart(itemId)
		toast.success(`${serviceName} has been removed from cart`)
	}

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span style={{ fontFamily: "var(--font-dm-sans)" }}>Back to Booking</span>
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-card-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
								Your Cart
							</h1>
							<p className="text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
								{cart.length} {cart.length === 1 ? "item" : "items"} in your cart
							</p>
						</div>
						{cart.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={async () => {
									toast("Clear Cart", {
										description: "Are you sure you want to clear all items from your cart?",
										action: {
											label: "Clear",
											onClick: async () => {
												await clearCart()
												toast.success("Cart cleared successfully")
											},
										},
										cancel: {
											label: "Cancel",
											onClick: () => {},
										},
									})
								}}
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								Clear All
							</Button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* LEFT: Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
									<ShoppingCart className="w-5 h-5" />
									Booking Items
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{cart.map((item, index) => {
									const ServiceIcon = getServiceIcon(item.serviceName)
									return (
										<div key={item.id}>
											<div className="flex justify-between items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
												<div className="flex items-start gap-3 flex-1 min-w-0">
													<div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary">
														<ServiceIcon className="w-6 h-6" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between gap-2 mb-2">
															<div className="flex-1 min-w-0">
																<p className="font-semibold text-card-foreground text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
																	{item.serviceName}
																</p>
																<p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
																	{formatBookingDateTime(item.date, item.time)}
																</p>
															</div>
															<p className="font-bold text-primary text-xl whitespace-nowrap ml-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
																${item.price.toLocaleString()}
															</p>
														</div>
														{item.photos && item.photos.length > 0 && (
															<div className="flex items-center gap-1 mt-2">
																<span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
																	{item.photos.length} {item.photos.length === 1 ? "photo" : "photos"} attached
																</span>
															</div>
														)}
													</div>
												</div>
												<div className="flex items-center gap-2 flex-shrink-0">
													<EditCartItemDialog item={item} onUpdate={updateCartItem} />
													<button
														onClick={() => handleRemoveItem(item.id, item.serviceName)}
														className="p-2 hover:bg-destructive/10 rounded transition-colors opacity-70 hover:opacity-100"
														title="Remove item"
														aria-label={`Remove ${item.serviceName} from cart`}
													>
														<Trash2 className="w-4 h-4 text-destructive" />
													</button>
												</div>
											</div>
											{index < cart.length - 1 && <Separator className="mt-4" />}
										</div>
									)
								})}
							</CardContent>
						</Card>
					</div>

					{/* RIGHT: Order Summary */}
					<div className="lg:col-span-1">
						<Card className="sticky top-4">
							<CardHeader>
								<CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
									<ShoppingCart className="w-5 h-5" />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									{cart.map((item) => {
										const ServiceIcon = getServiceIcon(item.serviceName)
										return (
											<div key={item.id} className="flex justify-between items-start text-sm gap-2">
												<div className="flex items-center gap-2 flex-1 pr-2 min-w-0">
													<div className="flex-shrink-0 p-1.5 rounded bg-primary/10 text-primary">
														<ServiceIcon className="w-4 h-4" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="font-medium text-card-foreground truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>
															{item.serviceName}
														</p>
														<p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>
															{formatBookingDateTime(item.date, item.time)}
														</p>
													</div>
												</div>
												<p className="font-semibold whitespace-nowrap flex-shrink-0" style={{ fontFamily: "var(--font-dm-sans)" }}>
													${item.price.toLocaleString()}
												</p>
											</div>
										)
									})}
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
											Subtotal
										</span>
										<span style={{ fontFamily: "var(--font-dm-sans)" }}>${cartTotal.toLocaleString()}</span>
									</div>
									<Separator />
									<div className="flex justify-between text-lg font-bold pt-2">
										<span style={{ fontFamily: "var(--font-space-grotesk)" }}>Total</span>
										<span className="text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
											${cartTotal.toLocaleString()}
										</span>
									</div>
								</div>

								<Link href="/checkout" className="block">
									<Button className="w-full" size="lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
										Proceed to Checkout
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>

								<Link href="/">
									<Button variant="outline" className="w-full" style={{ fontFamily: "var(--font-dm-sans)" }}>
										Continue Shopping
									</Button>
								</Link>

								<p className="text-xs text-muted-foreground text-center mt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
									You&apos;ll provide your information at checkout
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
