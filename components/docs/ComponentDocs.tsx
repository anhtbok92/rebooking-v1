import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, Package, FileText } from "lucide-react"

export function ComponentDocs() {
	return (
		<section id="component-documentation" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Component Documentation</CardTitle>
					<CardDescription className="text-base">
						Complete reference for all components, their props, imports, and usage
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="booking" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="booking">Booking</TabsTrigger>
							<TabsTrigger value="rating">Ratings</TabsTrigger>
							<TabsTrigger value="calendar">Calendar</TabsTrigger>
							<TabsTrigger value="admin">Admin</TabsTrigger>
							<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
						</TabsList>

						<TabsContent value="booking" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Code2 className="w-5 h-5" />
										SimpleBookingForm
									</CardTitle>
									<CardDescription>components/SimpleBookingForm/index.tsx</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Description:</p>
										<p className="text-sm text-muted-foreground">Main booking form component that combines all booking steps</p>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Imports:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>useCart from @/hooks/use-redux-cart</li>
											<li>CalendarCard, CartSummary, PhotoUpload, ServiceSelection, TimeSelection</li>
											<li>useBookingForm from ./useBookingForm</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Features:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>Service selection</li>
											<li>Date picker</li>
											<li>Time selection</li>
											<li>Photo upload</li>
											<li>Cart management</li>
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">ServiceSelection</CardTitle>
									<CardDescription>components/SimpleBookingForm/ServiceSelection.tsx</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Props:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>services: Service[]</li>
											<li>selectedService: string</li>
											<li>setSelectedService: (id: string) =&gt; void</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Features:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>Service cards with icons</li>
											<li>Rating display (blurred if no rating)</li>
											<li>Favorite button</li>
											<li>Click to view rating details</li>
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">CalendarCard</CardTitle>
									<CardDescription>components/SimpleBookingForm/CalendarCard.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Calendar component for date selection with booking indicators</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">TimeSelection</CardTitle>
									<CardDescription>components/SimpleBookingForm/TimeSelection.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Time slot selector with 6 daily slots (8:30 AM, 10:00 AM, 11:30 AM, 1:30 PM, 3:00 PM, 4:30 PM)</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="rating" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">RatingDisplay</CardTitle>
									<CardDescription>components/ratings/RatingDisplay.tsx</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Props:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>rating: number (0-5)</li>
											<li>ratingsCount?: number</li>
											<li>size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;</li>
											<li>clickable?: boolean</li>
											<li>onClick?: (e?: React.MouseEvent) =&gt; void</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Features:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>5-star display</li>
											<li>Blurred stars for no rating</li>
											<li>Review count in brackets</li>
											<li>Clickable to view details</li>
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">RatingDialog</CardTitle>
									<CardDescription>components/ratings/RatingDialog.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Dialog for submitting ratings and reviews with star selector and comment field</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">RatingDetailsDialog</CardTitle>
									<CardDescription>components/ratings/RatingDetailsDialog.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Shows all approved reviews for a service with user names, ratings, and comments</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="calendar" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">BookingCalendar</CardTitle>
									<CardDescription>components/bookings/BookingCalendar.tsx</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-semibold mb-1">Props:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>userId?: string | null</li>
										</ul>
									</div>
									<div>
										<p className="text-sm font-semibold mb-1">Features:</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											<li>Monthly calendar view</li>
											<li>6 time slots per day</li>
											<li>Color-coded by status</li>
											<li>Empty slots show "Available"</li>
											<li>Click booking to see details</li>
											<li>Filter by today, tomorrow, or all</li>
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">BookingDetailsDialog</CardTitle>
									<CardDescription>components/bookings/BookingDetailsDialog.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Detailed booking information dialog with service details, customer info, photos, and receipt download</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="admin" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">AdminDashboard</CardTitle>
									<CardDescription>components/admin/AdminDashboard.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Main admin dashboard with tab navigation for Overview, Analytics, Bookings, Calendar, Services, Discounts, Ratings, Referrals</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">BookingsManagement</CardTitle>
									<CardDescription>components/admin/BookingsManagement.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Complete booking management interface with filters, sorting, pagination, and status updates</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">RatingsManagement</CardTitle>
									<CardDescription>components/admin/RatingsManagement.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Admin interface for managing ratings: approve, reject, delete, and filter by status</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="dashboard" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">ClientDashboard</CardTitle>
									<CardDescription>components/dashboard/ClientDashboard.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Customer dashboard with upcoming appointments, past bookings, rating services, calendar view, favorites, analytics, and referral code</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">StaffDashboard</CardTitle>
									<CardDescription>components/staff/StaffDashboard.tsx</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">Staff dashboard for viewing and managing bookings with today's bookings, all bookings, calendar view, and analytics</p>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

