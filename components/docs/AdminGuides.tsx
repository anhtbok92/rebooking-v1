import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Star, Users, Settings, Ticket, BarChart3 } from "lucide-react"

export function AdminGuides() {
	return (
		<section id="admin-guides" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Admin Guides</CardTitle>
					<CardDescription className="text-base">
						Complete guides for managing the booking system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="bookings" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="bookings">Bookings</TabsTrigger>
							<TabsTrigger value="ratings">Ratings</TabsTrigger>
							<TabsTrigger value="calendar">Calendar</TabsTrigger>
							<TabsTrigger value="other">Other</TabsTrigger>
						</TabsList>

						<TabsContent value="bookings" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										How to Manage Bookings
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Admin Dashboard</strong> - Sign in as admin and go to /admin
										</li>
										<li>
											<strong>View Bookings</strong> - Click "Bookings" in sidebar to see all bookings in list view, or click "Calendar" for visual view
										</li>
										<li>
											<strong>Update Booking Status</strong> - Click on a booking, change status dropdown (PENDING, CONFIRMED, COMPLETED, CANCELLED), and click "Update"
										</li>
										<li>
											<strong>Delete Booking</strong> - Click on booking, click "Delete" button, and confirm deletion
										</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="ratings" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Star className="w-5 h-5" />
										How to Manage Ratings
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Ratings</strong> - Admin Dashboard → Ratings
										</li>
										<li>
											<strong>View Ratings</strong> - See all ratings (pending, approved, rejected). Filter by status using dropdown
										</li>
										<li>
											<strong>Approve Rating</strong> - Click on a pending rating, click "Approve" button. Rating now shows publicly
										</li>
										<li>
											<strong>Reject Rating</strong> - Click on a rating, click "Reject" button. Rating is hidden from public
										</li>
										<li>
											<strong>Delete Rating</strong> - Click on a rating, click "Delete" button. Rating is permanently removed
										</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="calendar" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										How to Use Calendar View
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Calendar</strong> - Admin Dashboard → Calendar
										</li>
										<li>
											<strong>Navigate Calendar</strong> - Use arrow buttons to change months. See all bookings for the month
										</li>
										<li>
											<strong>View Booking Details</strong> - Click on any booking in calendar to see full details in popup. Update status, download receipt, etc.
										</li>
										<li>
											<strong>Filter Bookings</strong> - Use dropdown:
											<ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
												<li>All Bookings: See everything</li>
												<li>Today: Only today's bookings</li>
												<li>Tomorrow: Only tomorrow's bookings</li>
											</ul>
										</li>
										<li>
											<strong>Understand Colors</strong>:
											<ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
												<li>Green: Confirmed or Completed bookings</li>
												<li>Yellow: Pending bookings</li>
												<li>Red: Cancelled bookings</li>
												<li>Gray with "Available": Empty time slot</li>
											</ul>
										</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="other" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Ticket className="w-5 h-5" />
										How to Create Discount Codes
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Discounts</strong> - Admin Dashboard → Discounts
										</li>
										<li>
											<strong>Create New Code</strong> - Click "Create Discount Code", fill in:
											<ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
												<li>Code: The promo code (e.g., "SUMMER20")</li>
												<li>Type: Percentage or Fixed Amount</li>
												<li>Value: Discount amount (10 = 10% or $10)</li>
												<li>Minimum Amount: Minimum purchase to use code</li>
												<li>Max Uses: How many times it can be used</li>
												<li>Expires At: When code expires</li>
											</ul>
										</li>
										<li>
											<strong>View Usage</strong> - Click on a discount code to see "Usage Statistics". View who used the code and when
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Settings className="w-5 h-5" />
										How to Manage Services
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Services</strong> - Admin Dashboard → Services
										</li>
										<li>
											<strong>Create Service</strong> - Click "Add Service", enter name and price, save
										</li>
										<li>
											<strong>Edit Service</strong> - Click on a service, edit details, save
										</li>
										<li>
											<strong>Delete Service</strong> - Click on a service, click "Delete", confirm
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Users className="w-5 h-5" />
										How to Manage Users
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Users</strong> - Admin Dashboard → Users (Super Admin only)
										</li>
										<li>
											<strong>View Users</strong> - See all users (customers, staff, admins)
										</li>
										<li>
											<strong>Change Role</strong> - Click on a user, change role dropdown, save
										</li>
										<li>
											<strong>Delete User</strong> - Click on a user, click "Delete", confirm
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BarChart3 className="w-5 h-5" />
										Analytics Dashboard
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-sm space-y-2">
										<p>
											<strong>Location:</strong> Admin Dashboard → Analytics
										</p>
										<p className="text-muted-foreground">
											View revenue charts, booking statistics, popular services, customer analytics, and recent activity
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

