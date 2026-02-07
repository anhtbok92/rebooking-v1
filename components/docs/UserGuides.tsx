import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Star, Heart, ShoppingCart, CreditCard, Gift } from "lucide-react"

export function UserGuides() {
	return (
		<section id="user-guides" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">User Guides</CardTitle>
					<CardDescription className="text-base">
						Step-by-step guides for customers and users
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="booking" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="booking">Booking</TabsTrigger>
							<TabsTrigger value="rating">Ratings</TabsTrigger>
							<TabsTrigger value="calendar">Calendar</TabsTrigger>
							<TabsTrigger value="other">Other Features</TabsTrigger>
						</TabsList>

						<TabsContent value="booking" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										How to Book a Service
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Homepage</strong> - Open your browser and go to your website URL
										</li>
										<li>
											<strong>Select Service</strong> - Scroll to booking form and click on a service (e.g., "Manicure", "Pedicure")
										</li>
										<li>
											<strong>Choose Date</strong> - Click on calendar and select an available date (green dates are available)
										</li>
										<li>
											<strong>Select Time</strong> - Choose from available time slots:
											<ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
												<li>8:30 AM</li>
												<li>10:00 AM</li>
												<li>11:30 AM</li>
												<li>1:30 PM</li>
												<li>3:00 PM</li>
												<li>4:30 PM</li>
											</ul>
										</li>
										<li>
											<strong>Add Photos (Optional)</strong> - Click "Upload Photos" to add inspiration images
										</li>
										<li>
											<strong>Add to Cart or Book Now</strong> - Click "Add to Cart" to add more services or "Book Now" to proceed
										</li>
										<li>
											<strong>Checkout</strong> - Review booking, enter information, choose payment method, and complete booking
										</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="rating" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Star className="w-5 h-5" />
										How to Rate a Service
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Complete a Booking</strong> - You can only rate services you've completed
										</li>
										<li>
											<strong>Go to Dashboard</strong> - Sign in to your account and go to /dashboard
										</li>
										<li>
											<strong>Find Past Bookings</strong> - Scroll to "Past Bookings" section and find a completed booking
										</li>
										<li>
											<strong>Rate the Service</strong> - Click "Rate Service" button, select 1-5 stars, write a comment (optional), and click "Submit"
										</li>
										<li>
											<strong>Wait for Approval</strong> - Your rating is submitted as "Pending". Admin must approve it before it shows publicly
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
										How to View Booking Calendar
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Go to Dashboard</strong> - Sign in and go to /dashboard
										</li>
										<li>
											<strong>Click Calendar Tab</strong> - You'll see a monthly calendar with your bookings
										</li>
										<li>
											<strong>View Booking Details</strong> - Click on any booking in the calendar to see full information
										</li>
										<li>
											<strong>Filter Bookings</strong> - Use dropdown to filter by:
											<ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
												<li>All Bookings</li>
												<li>Today</li>
												<li>Tomorrow</li>
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
										<Heart className="w-5 h-5" />
										How to Use Favorites
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Add to Favorites</strong> - When selecting services, click the heart icon. Heart turns red when favorited
										</li>
										<li>
											<strong>View Favorites</strong> - Go to Dashboard and see "Favorite Services" section. Click to book quickly
										</li>
										<li>
											<strong>Remove from Favorites</strong> - Click heart icon again to unfavorite
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<ShoppingCart className="w-5 h-5" />
										How to Use Shopping Cart
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Add Services</strong> - Select service, date, and time, then click "Add to Cart"
										</li>
										<li>
											<strong>Edit Items</strong> - Click edit icon on any cart item to change service, date, time, or photos
										</li>
										<li>
											<strong>Remove Items</strong> - Click trash icon to remove items from cart
										</li>
										<li>
											<strong>Checkout</strong> - Click "Go to Checkout" to complete all bookings
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="w-5 h-5" />
										Payment Methods
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 text-sm">
										<div>
											<strong>Cash Payment:</strong>
											<p className="text-muted-foreground">Pay at the salon when you arrive</p>
										</div>
										<div>
											<strong>Stripe Payment:</strong>
											<p className="text-muted-foreground">Pay online with credit card securely</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Gift className="w-5 h-5" />
										Referral Program
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 text-sm">
										<li>
											<strong>Get Your Code</strong> - Go to Dashboard and find your unique referral code
										</li>
										<li>
											<strong>Share with Friends</strong> - Share your referral code or link
										</li>
										<li>
											<strong>Earn Points</strong> - Earn points when friends sign up and make their first payment
										</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

