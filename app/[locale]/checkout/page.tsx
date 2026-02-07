"use client"

import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary"
import { DiscountCodeInput } from "@/components/checkout/DiscountCodeInput"
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector"
import { ReferralCodeInput } from "@/components/checkout/ReferralCodeInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-redux-cart"
import { ArrowLeft, LogIn, ShoppingCart, User, UserCircle } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function CheckoutPage() {
	const { cart, clearCart, cartTotal } = useCart()
	const router = useRouter()
	const { data: session } = useSession()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash")
	const [bookingFor, setBookingFor] = useState<"self" | "other">("self")

	// Guest user option: "signin" or "guest"
	const [guestOption, setGuestOption] = useState<"signin" | "guest">("signin")

	// Sign-in form fields
	const [signInEmail, setSignInEmail] = useState("")
	const [signInPassword, setSignInPassword] = useState("")
	const [isSigningIn, setIsSigningIn] = useState(false)

	// Form fields
	const [userName, setUserName] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")
	const [referralCode, setReferralCode] = useState("")

	// Discount
	const [couponCode, setCouponCode] = useState("")
	const [appliedDiscount, setAppliedDiscount] = useState<{
		code: string
		amount: number
		finalTotal: number
	} | null>(null)
	const [isApplying, setIsApplying] = useState(false)

	// Auto-fill for logged-in user
	useEffect(() => {
		if (session?.user && bookingFor === "self") {
			setUserName(session.user.name ?? "")
			setEmail(session.user.email ?? "")
			setPhone(session.user.phone ?? "")
		}
	}, [session, bookingFor])

	useEffect(() => {
		if (bookingFor === "other") {
			setUserName("")
			setEmail("")
			setPhone("")
		}
	}, [bookingFor])

	// Handle sign-in
	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!signInEmail.trim() || !signInPassword.trim()) {
			toast.error("Please enter email and password")
			return
		}

		setIsSigningIn(true)
		try {
			const result = await signIn("credentials", {
				email: signInEmail,
				password: signInPassword,
				redirect: false,
			})

			if (result?.error) {
				toast.error("Invalid email or password")
				return
			}

			toast.success("Signed in successfully!")
			// Refresh to update session
			setTimeout(() => {
				window.location.reload()
			}, 500)
		} catch (error) {
			toast.error("Something went wrong")
		} finally {
			setIsSigningIn(false)
		}
	}

	// Empty cart check
	if (cart.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center px-4">
				<div className="text-center">
					<ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
					<h1 className="text-2xl font-bold text-card-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						Your cart is empty
					</h1>
					<p className="text-muted-foreground mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
						Add services to your cart before checking out
					</p>
					<Link href="/">
						<Button>Back to Booking</Button>
					</Link>
				</div>
			</div>
		)
	}

	// Form validation
	const isFormValid = () => {
		if (!userName.trim() || !phone.trim()) return false
		if (!session?.user || bookingFor === "other") {
			if (!email.trim()) return false
		}
		return true
	}

	// Apply discount code
	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) return

		setIsApplying(true)
		try {
			const res = await fetch("/api/v1/discount/apply", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: couponCode.trim(), cartTotal }),
			})

			const data = await res.json()

			if (!res.ok) {
				toast.error("Invalid Coupon", { description: data.error })
				return
			}

			setAppliedDiscount({
				code: data.code,
				amount: data.discountAmount,
				finalTotal: data.finalTotal,
			})

			toast.success("Coupon Applied!", {
				description: `Saved $${data.discountAmount}`,
			})

			setCouponCode("")
		} catch (err) {
			toast.error("Error", { description: "Failed to apply coupon" })
		} finally {
			setIsApplying(false)
		}
	}

	// Handle checkout
	const handleCheckout = async () => {
		if (!isFormValid()) {
			toast.error("Missing Information", {
				description: "Please fill in all required fields",
			})
			return
		}

		if (paymentMethod === "stripe" && !session?.user) {
			toast.error("Login Required", {
				description: "Please log in to proceed with Stripe payment",
			})
			router.push("/signin")
			return
		}

		setIsSubmitting(true)

		const finalTotal = appliedDiscount ? appliedDiscount.finalTotal : cartTotal

		try {
			if (paymentMethod === "stripe") {
				const res = await fetch("/api/v1/checkout", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						cartItems: cart,
						totalPrice: cartTotal,
						finalPrice: finalTotal,
						discountCode: appliedDiscount?.code,
						discountAmount: appliedDiscount?.amount,
						userName,
						phone,
						email: email || session?.user?.email,
						bookingFor,
						referralCode: referralCode.trim() || undefined,
					}),
				})

				if (!res.ok) {
					const { error } = await res.json()
					throw new Error(error ?? "Failed to create checkout session")
				}

				const { url } = await res.json()
				if (url) window.location.href = url
			} else {
				const res = await fetch("/api/v1/bookings/bulk", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						cartItems: cart,
						totalPrice: cartTotal,
						finalPrice: finalTotal,
						discountCode: appliedDiscount?.code,
						discountAmount: appliedDiscount?.amount,
						userName,
						phone,
						email: email || session?.user?.email,
						paymentMethod: "cash",
						userId: session?.user?.id ?? null,
						bookingFor,
						referralCode: referralCode.trim() || undefined,
					}),
				})

				if (!res.ok) {
					const { error } = await res.json()
					throw new Error(error ?? "Failed to create bookings")
				}

				toast.success("Bookings Confirmed!", {
					description: "All bookings confirmed! Check your WhatsApp for details.",
				})

				await clearCart()
				router.push("/")
			}
		} catch (err) {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "An error occurred",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
						<ArrowLeft className="w-4 h-4" />
						<span style={{ fontFamily: "var(--font-dm-sans)" }}>Back to Booking</span>
					</Link>
					<h1 className="text-3xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						Checkout
					</h1>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* LEFT: Forms */}
					<div className="lg:col-span-2 space-y-6">
						{/* For Non-Logged-In Users: Show Tabs */}
						{!session?.user && (
							<Tabs value={guestOption} onValueChange={(value) => setGuestOption(value as "signin" | "guest")} className="w-full">
								<TabsList className="grid w-full grid-cols-2 mb-3">
									<TabsTrigger value="signin" className="flex items-center gap-2">
										<LogIn className="w-4 h-4" />
										Sign In
									</TabsTrigger>
									<TabsTrigger value="guest" className="flex items-center gap-2">
										<UserCircle className="w-4 h-4" />
										Guest Checkout
									</TabsTrigger>
								</TabsList>

								{/* Sign In Tab */}
								<TabsContent value="signin" className="mt-2">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
												<User className="w-5 h-5 text-primary" />
												Sign In to Your Account
											</CardTitle>
											<CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
												Sign in to access your account and benefits
											</CardDescription>
										</CardHeader>
										<CardContent>
											<form onSubmit={handleSignIn} className="space-y-4">
												<div>
													<Label htmlFor="checkout-email">Email</Label>
													<Input
														id="checkout-email"
														type="email"
														placeholder="you@example.com"
														value={signInEmail}
														onChange={(e) => setSignInEmail(e.target.value)}
														required
													/>
												</div>
												<div>
													<Label htmlFor="checkout-password">Password</Label>
													<Input
														id="checkout-password"
														type="password"
														placeholder="••••••••"
														value={signInPassword}
														onChange={(e) => setSignInPassword(e.target.value)}
														required
													/>
												</div>
												<div className="flex items-center justify-between">
													<Link href="/auth/forgot-password" className="text-sm text-primary hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
														Forgot password?
													</Link>
												</div>
												<Button type="submit" className="w-full" disabled={isSigningIn} style={{ fontFamily: "var(--font-space-grotesk)" }}>
													{isSigningIn ? "Signing in..." : "Sign In"}
												</Button>
											</form>
											<div className="mt-4 pt-4 border-t border-border">
												<p className="text-xs text-muted-foreground text-center" style={{ fontFamily: "var(--font-dm-sans)" }}>
													Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up here</Link>
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						)}

						{/* Checkout Form - Always shown for logged-in users or when guest tab is selected */}
						{(session?.user || guestOption === "guest") && (
							<CheckoutForm
								bookingFor={bookingFor}
								userName={userName}
								email={email}
								phone={phone}
								onBookingForChange={setBookingFor}
								onUserNameChange={setUserName}
								onEmailChange={setEmail}
								onPhoneChange={setPhone}
								isLoggedIn={!!session?.user}
							/>
						)}

						{/* Payment Method - Always shown for logged-in users or when guest tab is selected */}
						{(session?.user || guestOption === "guest") && (
							<PaymentMethodSelector paymentMethod={paymentMethod} onChange={setPaymentMethod} />
						)}

						{/* Referral Code - Always shown for logged-in users or when guest tab is selected */}
						{(session?.user || guestOption === "guest") && (
							<>
								{(session?.user && bookingFor === "self") || (!session?.user || bookingFor === "other") ? (
									<ReferralCodeInput referralCode={referralCode} onChange={setReferralCode} />
								) : null}
							</>
						)}
					</div>

					{/* RIGHT: Summary */}
					<div className="lg:col-span-1">
						<div className="sticky space-y-6 top-4">
							<CheckoutSummary
								appliedDiscount={appliedDiscount}
								paymentMethod={paymentMethod}
								isSubmitting={isSubmitting}
								onSubmit={handleCheckout}
							/>

							<DiscountCodeInput
								couponCode={couponCode}
								appliedDiscount={appliedDiscount}
								isApplying={isApplying}
								onCodeChange={setCouponCode}
								onApply={handleApplyCoupon}
								onRemove={() => {
									setAppliedDiscount(null)
									setCouponCode("")
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
