import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Table, Key, Link2 } from "lucide-react"

export function DatabaseSchema() {
	const tables = [
		{
			name: "User",
			description: "User accounts with authentication and roles",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "email", type: "String (unique)", description: "User email" },
				{ name: "name", type: "String?", description: "User name" },
				{ name: "password", type: "String?", description: "Hashed password" },
				{ name: "role", type: "String", description: "SUPER_ADMIN, ADMIN, STAFF, or CLIENT" },
				{ name: "phone", type: "String?", description: "Phone number" },
				{ name: "referralCode", type: "String? (unique)", description: "Unique referral code" },
				{ name: "referralPoints", type: "Int", description: "Points earned from referrals" },
			],
		},
		{
			name: "Service",
			description: "Spa/salon services offered",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "name", type: "String", description: "Service name" },
				{ name: "price", type: "Int", description: "Price in cents" },
				{ name: "stripePriceId", type: "String?", description: "Stripe price ID (optional)" },
			],
		},
		{
			name: "Booking",
			description: "Customer bookings/appointments",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "serviceId", type: "String", description: "Reference to Service" },
				{ name: "userId", type: "String?", description: "Reference to User (optional for guests)" },
				{ name: "date", type: "DateTime", description: "Booking date" },
				{ name: "time", type: "String", description: "Time slot" },
				{ name: "status", type: "String", description: "PENDING, CONFIRMED, COMPLETED, CANCELLED" },
				{ name: "paymentMethod", type: "String", description: "cash or stripe" },
				{ name: "userName", type: "String", description: "Customer name" },
				{ name: "phone", type: "String", description: "Customer phone" },
				{ name: "email", type: "String?", description: "Customer email" },
			],
		},
		{
			name: "Rating",
			description: "Service ratings and reviews",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "userId", type: "String", description: "Reference to User" },
				{ name: "serviceId", type: "String", description: "Reference to Service" },
				{ name: "rating", type: "Int", description: "1-5 stars" },
				{ name: "comment", type: "String?", description: "Review text (optional)" },
				{ name: "status", type: "String", description: "PENDING, APPROVED, REJECTED" },
				{ name: "createdAt", type: "DateTime", description: "When rating was created" },
			],
		},
		{
			name: "Favorite",
			description: "User's favorite services",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "userId", type: "String", description: "Reference to User" },
				{ name: "serviceId", type: "String", description: "Reference to Service" },
			],
		},
		{
			name: "DiscountCode",
			description: "Promotional discount codes",
			fields: [
				{ name: "id", type: "String (UUID)", description: "Unique identifier" },
				{ name: "code", type: "String (unique)", description: "Promo code" },
				{ name: "type", type: "String", description: "PERCENT or FIXED" },
				{ name: "value", type: "Int", description: "Discount amount" },
				{ name: "minAmount", type: "Int?", description: "Minimum purchase" },
				{ name: "maxUses", type: "Int?", description: "Maximum redemptions" },
				{ name: "usedCount", type: "Int", description: "Times used" },
				{ name: "expiresAt", type: "DateTime?", description: "Expiration date" },
				{ name: "active", type: "Boolean", description: "Is code active" },
			],
		},
	]

	return (
		<section id="database-schema" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl flex items-center gap-2">
						<Database className="w-8 h-8" />
						Database Schema
					</CardTitle>
					<CardDescription className="text-base">
						Complete database structure with all tables, fields, and relationships
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4">
						{tables.map((table) => (
							<Card key={table.name}>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Table className="w-5 h-5" />
										{table.name}
									</CardTitle>
									<CardDescription>{table.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{table.fields.map((field) => (
											<div key={field.name} className="flex items-start gap-3 p-2 rounded border bg-card">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<code className="text-sm font-semibold text-primary">{field.name}</code>
														<Badge variant="outline" className="text-xs">
															{field.type}
														</Badge>
													</div>
													<p className="text-xs text-muted-foreground">{field.description}</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Link2 className="w-5 h-5" />
								Key Relationships
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
								<li>User has many Bookings, Favorites, and Ratings</li>
								<li>Service has many Bookings, Favorites, and Ratings</li>
								<li>Booking belongs to one Service and optionally one User</li>
								<li>Rating belongs to one User and one Service (unique per user-service pair)</li>
								<li>Favorite belongs to one User and one Service (unique per user-service pair)</li>
								<li>DiscountCode has many DiscountUsage records</li>
							</ul>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</section>
	)
}

