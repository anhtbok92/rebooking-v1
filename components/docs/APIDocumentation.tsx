import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, Key, Database } from "lucide-react"

export function APIDocumentation() {
	return (
		<section id="api-documentation" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">API Documentation</CardTitle>
					<CardDescription className="text-base">
						Complete API reference with endpoints, parameters, and examples
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 space-y-3">
						<div className="flex items-center gap-2">
							<Key className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Authentication</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							All API routes require authentication except public service listings and approved rating displays.
						</p>
						<div className="flex items-center gap-2">
							<Code2 className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Base URL</h3>
						</div>
						<div className="space-y-1 text-sm">
							<p className="text-muted-foreground">Development: <code className="bg-muted px-2 py-1 rounded">http://localhost:3000/api/v1</code></p>
							<p className="text-muted-foreground">Production: <code className="bg-muted px-2 py-1 rounded">https://yourdomain.com/api/v1</code></p>
						</div>
					</div>

					<Tabs defaultValue="bookings" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="bookings">Bookings</TabsTrigger>
							<TabsTrigger value="ratings">Ratings</TabsTrigger>
							<TabsTrigger value="services">Services</TabsTrigger>
							<TabsTrigger value="favorites">Favorites</TabsTrigger>
							<TabsTrigger value="discounts">Discounts</TabsTrigger>
						</TabsList>

						<TabsContent value="bookings" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">GET /api/v1/bookings</CardTitle>
									<CardDescription>Get bookings with filters</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Query Parameters:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li><code>date</code> (optional): Filter by specific date</li>
											<li><code>startDate</code> (optional): Start of date range</li>
											<li><code>endDate</code> (optional): End of date range</li>
											<li><code>userId</code> (optional): Filter by user ID</li>
											<li><code>serviceId</code> (optional): Filter by service ID</li>
											<li><code>status</code> (optional): PENDING, CONFIRMED, COMPLETED, CANCELLED, ALL</li>
											<li><code>page</code> (optional): Page number (default: 1)</li>
											<li><code>limit</code> (optional): Items per page (default: 10)</li>
											<li><code>sort</code> (optional): date-desc, date-asc, price-desc, price-asc</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Example:</p>
										<code className="text-xs bg-muted p-2 rounded block">
											GET /api/v1/bookings?status=CONFIRMED&page=1&limit=10
										</code>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/bookings</CardTitle>
									<CardDescription>Create a new booking</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Body:</p>
										<code className="text-xs bg-muted p-2 rounded block">
											{`{
  "serviceId": "uuid",
  "date": "2024-01-15",
  "time": "10:00 AM",
  "userName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "paymentMethod": "cash",
  "photos": ["url1", "url2"]
}`}
										</code>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">PATCH /api/v1/bookings/[id]</CardTitle>
									<CardDescription>Update a booking</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Update booking status, date, time, etc.</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">DELETE /api/v1/bookings/[id]</CardTitle>
									<CardDescription>Delete a booking</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Permanently delete a booking</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="ratings" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">GET /api/v1/ratings?serviceId=[serviceId]</CardTitle>
									<CardDescription>Get ratings for a service</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Query Parameters:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li><code>serviceId</code> (required): Service ID to get ratings for</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Note:</p>
										<p className="text-sm text-muted-foreground">Non-admins only see APPROVED ratings. Admins see all ratings.</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/ratings</CardTitle>
									<CardDescription>Create a new rating</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Body:</p>
										<code className="text-xs bg-muted p-2 rounded block">
											{`{
  "serviceId": "uuid",
  "rating": 5,
  "comment": "Excellent service!"
}`}
										</code>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Requirements:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>User must have a COMPLETED booking for this service</li>
											<li>Rating must be between 1 and 5</li>
											<li>One rating per service per user</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="services" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">GET /api/v1/services</CardTitle>
									<CardDescription>Get all services</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Query Parameters:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li><code>limit</code> (optional): Maximum number of services (default: 10)</li>
											<li><code>search</code> (optional): Search by service name</li>
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/services</CardTitle>
									<CardDescription>Create a new service (Admin only)</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Requires admin role</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="favorites" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">GET /api/v1/favorites</CardTitle>
									<CardDescription>Get user's favorites (Requires authentication)</CardDescription>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/favorites</CardTitle>
									<CardDescription>Add a service to favorites</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="text-xs bg-muted p-2 rounded block">
										{`Body: { "serviceId": "uuid" }`}
									</code>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">DELETE /api/v1/favorites?serviceId=[serviceId]</CardTitle>
									<CardDescription>Remove a service from favorites</CardDescription>
								</CardHeader>
							</Card>
						</TabsContent>

						<TabsContent value="discounts" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">GET /api/v1/admin/discounts</CardTitle>
									<CardDescription>Get all discount codes (Admin only)</CardDescription>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/admin/discounts</CardTitle>
									<CardDescription>Create a discount code (Admin only)</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="text-xs bg-muted p-2 rounded block">
										{`Body: {
  "code": "SUMMER20",
  "type": "PERCENT",
  "value": 20,
  "minAmount": 10000,
  "maxUses": 100,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "active": true
}`}
									</code>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">POST /api/v1/discount/apply</CardTitle>
									<CardDescription>Apply a discount code</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="text-xs bg-muted p-2 rounded block">
										{`Body: {
  "code": "SUMMER20",
  "cartTotal": 50000
}`}
									</code>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

