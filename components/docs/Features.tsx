import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Calendar,
	ShoppingCart,
	Camera,
	CreditCard,
	MessageSquare,
	Star,
	BarChart3,
	Users,
	Settings,
	Receipt,
	Shield,
	CheckCircle2,
	Ticket,
	TrendingUp,
	Gift,
	UserPlus,
	Link2,
	Sparkles,
	Search,
	Lock,
	CheckCircle,
	RefreshCw,
} from "lucide-react"

export function Features() {
	const customerFeatures = [
		{ icon: Calendar, title: "Easy Booking", desc: "Intuitive calendar-based booking system" },
		{ icon: ShoppingCart, title: "Shopping Cart", desc: "Add multiple services to cart before checkout" },
		{ icon: Camera, title: "Inspiration Photos", desc: "Upload reference photos with bookings" },
		{ icon: CreditCard, title: "Stripe Payment Integration", desc: "Secure card payments with Stripe Checkout, automatic booking confirmation, and webhook support" },
		{ icon: Lock, title: "Secure Payment Processing", desc: "PCI-compliant payment processing with encrypted transactions and automatic receipts" },
		{ icon: CheckCircle, title: "Automatic Booking Confirmation", desc: "Bookings automatically confirmed after successful Stripe payment via webhook" },
		{ icon: RefreshCw, title: "Payment Status Tracking", desc: "Real-time payment status updates and automatic booking status synchronization" },
		{ icon: Receipt, title: "Digital Receipts", desc: "Automatic receipt generation and email delivery after successful payment" },
		{ icon: Ticket, title: "Discount Codes", desc: "Apply promo codes at checkout to save money (works with both cash and Stripe payments)" },
		{ icon: Gift, title: "Referral Program", desc: "Share your unique referral code and earn points when friends sign up and pay (Stripe payments supported)" },
		{ icon: UserPlus, title: "Loyalty Rewards", desc: "Earn points with every booking and unlock tiered rewards" },
		{ icon: Link2, title: "Social Sharing", desc: "Share referral links on Twitter, Facebook, WhatsApp, and LinkedIn" },
		{ icon: Search, title: "Global Search", desc: "Search across bookings, services, users, discount codes, and more with ⌘K shortcut" },
		{ icon: MessageSquare, title: "WhatsApp Notifications", desc: "Receive booking confirmations via WhatsApp" },
		{ icon: Star, title: "Favorites", desc: "Save favorite services for quick booking" },
		{ icon: BarChart3, title: "Dashboard", desc: "View booking history and upcoming appointments" },
	]

	const adminFeatures = [
		{ icon: Users, title: "User Management", desc: "Manage customers, staff, and admins" },
		{ icon: Calendar, title: "Booking Management", desc: "View, update, and manage all bookings" },
		{ icon: Settings, title: "Service Management", desc: "Add, edit, and delete services" },
		{ icon: CreditCard, title: "Stripe Payment Management", desc: "Monitor Stripe payments, view payment history, and track transaction status" },
		{ icon: Lock, title: "Payment Security", desc: "PCI-compliant payment processing with secure webhook handling and automatic booking confirmation" },
		{ icon: CheckCircle, title: "Payment Webhooks", desc: "Automatic booking confirmation via Stripe webhooks when payment succeeds" },
		{ icon: Receipt, title: "Payment Receipts", desc: "Automatic receipt generation for Stripe payments with email delivery" },
		{ icon: Ticket, title: "Discount Code Management", desc: "Create and manage discount codes with detailed analytics (works with Stripe payments)" },
		{ icon: TrendingUp, title: "Usage Analytics", desc: "Track which users used promo codes and usage statistics" },
		{ icon: Gift, title: "Referral Management", desc: "View all referral codes, track referrals, and manage points per referral (Stripe payments supported)" },
		{ icon: UserPlus, title: "Affiliate Tracking", desc: "Monitor referral performance, total points awarded, and unique referrals" },
		{ icon: Sparkles, title: "Bulk Code Generation", desc: "Generate referral codes for all existing users with one click" },
		{ icon: Search, title: "Advanced Search", desc: "Role-based global search with keyboard shortcuts, filtering, and quick navigation" },
		{ icon: BarChart3, title: "Analytics Dashboard", desc: "Revenue charts, booking statistics, and insights including Stripe payment analytics" },
		{ icon: Receipt, title: "Receipt Generation", desc: "Automatic receipt generation for bookings (both cash and Stripe payments)" },
		{ icon: Shield, title: "Role Management", desc: "Assign and manage user roles" },
	]

	const staffFeatures = [
		{ icon: Calendar, title: "Booking View", desc: "View assigned bookings" },
		{ icon: CheckCircle2, title: "Status Updates", desc: "Update booking status" },
		{ icon: BarChart3, title: "Service Overview", desc: "View available services" },
	]

	return (
		<section id="features" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Features</CardTitle>
					<CardDescription>Comprehensive features for customers, admins, and staff</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div>
						<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<Users className="w-5 h-5" />
							Customer Features
						</h3>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{customerFeatures.map((feature, idx) => (
								<div key={idx} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
									<feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
									<div>
										<h4 className="font-semibold mb-1">{feature.title}</h4>
										<p className="text-sm text-muted-foreground">{feature.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<Shield className="w-5 h-5" />
							Admin Features
						</h3>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{adminFeatures.map((feature, idx) => (
								<div key={idx} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
									<feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
									<div>
										<h4 className="font-semibold mb-1">{feature.title}</h4>
										<p className="text-sm text-muted-foreground">{feature.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<CheckCircle2 className="w-5 h-5" />
							Staff Features
						</h3>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{staffFeatures.map((feature, idx) => (
								<div key={idx} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
									<feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
									<div>
										<h4 className="font-semibold mb-1">{feature.title}</h4>
										<p className="text-sm text-muted-foreground">{feature.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<CreditCard className="w-5 h-5" />
							Stripe Payment Features
						</h3>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Secure Checkout</h4>
									<p className="text-sm text-muted-foreground">
										Stripe Checkout Sessions provide a secure, PCI-compliant payment experience with support for all major credit and debit cards
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Automatic Confirmation</h4>
									<p className="text-sm text-muted-foreground">
										Bookings are automatically confirmed via Stripe webhooks when payment succeeds, ensuring instant booking activation
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<RefreshCw className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Webhook Integration</h4>
									<p className="text-sm text-muted-foreground">
										Real-time payment status updates via Stripe webhooks, handling payment success, failures, and refunds automatically
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Receipt className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Digital Receipts</h4>
									<p className="text-sm text-muted-foreground">
										Automatic receipt generation and email delivery after successful Stripe payment, with PDF download option
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Ticket className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Discount Integration</h4>
									<p className="text-sm text-muted-foreground">
										Discount codes work seamlessly with Stripe payments, automatically applied before payment processing
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Gift className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Referral Rewards</h4>
									<p className="text-sm text-muted-foreground">
										Referral points are automatically awarded when referrals complete Stripe payments, tracked via webhook events
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Payment Security</h4>
									<p className="text-sm text-muted-foreground">
										All payment data is handled securely by Stripe. No sensitive card information is stored on our servers
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<BarChart3 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Payment Analytics</h4>
									<p className="text-sm text-muted-foreground">
										Track Stripe payment revenue, transaction counts, and payment method preferences in admin analytics dashboard
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<CreditCard className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Multiple Payment Methods</h4>
									<p className="text-sm text-muted-foreground">
										Customers can choose between cash payment (pay at spa) or Stripe card payment during checkout
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

