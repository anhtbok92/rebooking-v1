"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Mail, Calendar, User } from "lucide-react"
import { useBookings } from "@/lib/swr"
import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"

export function CustomersManagement() {
	const t = useTranslations("Admin.customers")
	const { data: response, isLoading } = useBookings({ limit: 1000 })
	const [searchTerm, setSearchTerm] = useState("")
	
	const bookings = response?.bookings || []
	
	// Extract unique customers from bookings
	const customers = useMemo(() => {
		const customerMap = new Map()
		
		bookings.forEach(booking => {
			const key = booking.user?.email || booking.email || `${booking.userName}-${booking.phone}`
			
			if (!customerMap.has(key)) {
				customerMap.set(key, {
					id: key,
					name: booking.userName,
					email: booking.user?.email || booking.email,
					phone: booking.user?.phone || booking.phone,
					bookings: [],
					totalSpent: 0,
					lastBooking: null,
					firstBooking: null
				})
			}
			
			const customer = customerMap.get(key)
			customer.bookings.push(booking)
			customer.totalSpent += booking.service.price
			
			const bookingDate = new Date(booking.date)
			if (!customer.lastBooking || bookingDate > customer.lastBooking) {
				customer.lastBooking = bookingDate
			}
			if (!customer.firstBooking || bookingDate < customer.firstBooking) {
				customer.firstBooking = bookingDate
			}
		})
		
		return Array.from(customerMap.values())
			.sort((a, b) => (b.lastBooking?.getTime() || 0) - (a.lastBooking?.getTime() || 0))
	}, [bookings])
	
	const filteredCustomers = useMemo(() => {
		if (!searchTerm) return customers
		
		const term = searchTerm.toLowerCase()
		return customers.filter(customer => 
			customer.name?.toLowerCase().includes(term) ||
			customer.email?.toLowerCase().includes(term) ||
			customer.phone?.includes(term)
		)
	}, [customers, searchTerm])
	
	const getStatusColor = (bookingCount: number) => {
		if (bookingCount >= 5) return "bg-green-500"
		if (bookingCount >= 2) return "bg-yellow-500"
		return "bg-gray-500"
	}
	
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
				<p className="text-muted-foreground">{t("description")}</p>
			</div>
			
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="w-5 h-5" />
						{t("customerList")}
					</CardTitle>
					<CardDescription>
						{t("totalCustomers", { count: filteredCustomers.length })} • {t("totalBookings", { count: bookings.length })}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder={t("searchPlaceholder")}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
					
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						</div>
					) : filteredCustomers.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<User className="mx-auto h-12 w-12 opacity-50" />
							<p className="mt-2">{t("noCustomers")}</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("name")}</TableHead>
										<TableHead>{t("contact")}</TableHead>
										<TableHead>{t("bookings")}</TableHead>
										<TableHead>{t("totalSpent")}</TableHead>
										<TableHead>{t("lastBooking")}</TableHead>
										<TableHead>{t("status")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCustomers.map((customer) => (
										<TableRow key={customer.id}>
											<TableCell className="font-medium">{customer.name}</TableCell>
											<TableCell>
												<div className="space-y-1">
													{customer.email && (
														<div className="flex items-center gap-1 text-sm">
															<Mail className="w-3 h-3 text-muted-foreground" />
															{customer.email}
														</div>
													)}
													{customer.phone && (
														<div className="flex items-center gap-1 text-sm">
															<Phone className="w-3 h-3 text-muted-foreground" />
															{customer.phone}
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary">
													{customer.bookings.length} {t("bookingsCount")}
												</Badge>
											</TableCell>
											<TableCell className="font-medium">
												{new Intl.NumberFormat('vi-VN', {
													style: 'currency',
													currency: 'VND'
												}).format(customer.totalSpent)}
											</TableCell>
											<TableCell>
												{customer.lastBooking ? (
													<div className="flex items-center gap-1 text-sm">
														<Calendar className="w-3 h-3 text-muted-foreground" />
														{customer.lastBooking.toLocaleDateString('vi-VN')}
													</div>
												) : (
													<span className="text-muted-foreground text-sm">-</span>
												)}
											</TableCell>
											<TableCell>
												<Badge className={getStatusColor(customer.bookings.length)}>
													{customer.bookings.length >= 5 
														? t("loyal") 
														: customer.bookings.length >= 2 
															? t("returning") 
															: t("new")}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}