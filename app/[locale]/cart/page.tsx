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
		<div className="min-h-screen bg-background py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-3 sm:mb-4 transition-colors text-sm">
						<ArrowLeft className="w-4 h-4" />
						<span style={{ fontFamily: "var(--font-dm-sans)" }}>Back to Booking</span>
					</Link>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div>
							<h1 className="text-2xl sm:text-4xl font-bold text-card-foreground mb-1 sm:mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
								Your Cart
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
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
								className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								Clear All
							</Button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					{/* LEFT: Cart Items */}
					<div className="lg:col-span-2 space-y-3 sm:space-y-4">
						<Card>
							<CardHeader className="pb-3 sm:pb-6">
								<CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
									<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
									Booking Items
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
								{cart.map((item, index) => {
									const ServiceIcon = getServiceIcon(item.serviceName)
									return (
										<div key={item.id}>
											{/* Mobile: Vertical Layout */}
											<div className="bg-muted/30 rounded-xl sm:rounded-lg overflow-hidden hover:bg-muted/50 transition-colors">
												<div className="p-3 sm:p-4">
													{/* Service Info */}
													<div className="flex items-start gap-3 mb-3">
														<div className="flex-shrink-0 p-2 sm:p-2.5 rounded-lg bg-primary/10 text-primary">
															<ServiceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-semibold text-card-foreground text-sm sm:text-lg line-clamp-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
																{item.serviceName}
															</p>
															<p className="text-xs sm:text-sm text-muted-foreground mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
																{formatBookingDateTime(item.date, item.time)}
															</p>
															{item.photos && item.photos.length > 0 && (
																<div className="flex items-center gap-1 mt-2">
																	<span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
																		{item.photos.length} {item.photos.length === 1 ? "photo" : "photos"} attached
																	</span>
																</div>
															)}
														</div>
													</div>
													
													{/* Price and Actions */}
													<div className="flex items-center justify-between pt-3 border-t border-border/50">
														<p className="font-bold text-primary text-base sm:text-xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
															${item.price.toLocaleString()}
														</p>
														<div className="flex items-center gap-1">
															<EditCartItemDialog item={item} onUpdate={updateCartItem} />
															<button
																onClick={() => handleRemoveItem(item.id, item.serviceName)}
																className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
																title="Remove item"
																aria-label={`Remove ${item.serviceName} from cart`}
															>
																<Trash2 className="w-4 h-4 text-destructive" />
															</button>
														</div>
													</div>
												</div>
											</div>
											{index < cart.length - 1 && <Separator className="my-3 sm:my-4" />}
										</div>
									)
								})}
							</CardContent>
						</Card>
					</div>

					{/* RIGHT: Order Summary */}
					<div className="lg:col-span-1">
						<Card className="lg:sticky lg:top-4">
							<CardHeader className="pb-3 sm:pb-6">
								<CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
									<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 p-3 sm:p-6">
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
														<p className="font-medium text-card-foreground line-clamp-1 text-xs sm:text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
															{item.serviceName}
														</p>
														<p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>
															{formatBookingDateTime(item.date, item.time)}
														</p>
													</div>
												</div>
												<p className="font-semibold whitespace-nowrap flex-shrink-0 text-xs sm:text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
													${item.price.toLocaleString()}
												</p>
											</div>
										)
									})}
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
											Subtotal
										</span>
										<span style={{ fontFamily: "var(--font-dm-sans)" }}>${cartTotal.toLocaleString()}</span>
									</div>
									<Separator />
									<div className="flex justify-between text-base sm:text-lg font-bold pt-2">
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
