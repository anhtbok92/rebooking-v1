import { z } from "zod"

// Common validation helpers
const phoneRegex = /^\+?[0-9]{7,15}$/
const dateRegex = /^\d{4}-\d{2}-\d{2}$/

// Booking schemas
export const createBookingSchema = z.object({
	serviceIds: z.array(z.string().min(1, "Service ID cannot be empty")).min(1, "At least one service is required"),
	date: z.string().refine(
		(val) => dateRegex.test(val) || !isNaN(Date.parse(val)),
		{ message: "Date must be in YYYY-MM-DD format or a valid ISO date string" }
	),
	time: z.string().min(1, "Time is required"),
	paymentMethod: z.enum(["cash", "stripe", "mobile"], {
		errorMap: () => ({ message: "Invalid payment method" }),
	}),
	mobileProvider: z.string().optional(),
	photoUrls: z.array(z.string().url("Invalid photo URL")).optional(),
	userName: z.string().min(1, "Name is required").max(255, "Name is too long"),
	phone: z.string().regex(phoneRegex, "Invalid phone number format").max(20, "Phone number is too long"),
	email: z.string().email("Invalid email format").optional(),
})

export const getBookingsQuerySchema = z.object({
	date: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	userId: z.string().optional(),
	serviceId: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(1000).default(10),
	sort: z.enum(["date-desc", "date-asc", "price-desc", "price-asc"]).default("date-desc"),
	status: z.enum(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("ALL"),
})

// Checkout schemas
export const cartItemSchema = z.object({
	serviceId: z.string().uuid(),
	serviceName: z.string().min(1),
	date: z.string(),
	time: z.string().min(1),
	price: z.number().positive(),
	photos: z.array(z.string().url()).optional(),
})

export const checkoutSchema = z.object({
	cartItems: z.array(cartItemSchema).min(1, "Cart is empty"),
	totalPrice: z.number().positive("Total price must be positive"),
	userName: z.string().min(1).max(255),
	phone: z.string().min(1).max(20),
	email: z.string().email().optional(),
	bookingFor: z.enum(["self", "other"]).optional(),
	discountCode: z.string().optional(),
	discountAmount: z.number().nonnegative().optional(),
	finalPrice: z.number().positive().optional(),
	referralCode: z.string().optional(),
})

// Rating schemas
export const createRatingSchema = z.object({
	serviceId: z.string().uuid("Invalid service ID"),
	rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
	comment: z.string().max(1000).optional(),
})

export const getRatingsQuerySchema = z.object({
	serviceId: z.string().uuid().optional(),
	userId: z.string().uuid().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
})

// Service schemas
export const createServiceSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	price: z.number().positive("Price must be positive"),
	description: z.string().max(5000).optional(),
	duration: z.number().int().positive().optional(),
})

export const updateServiceSchema = createServiceSchema.partial()

export const getServicesQuerySchema = z.object({
	search: z.string().optional(),
	sort: z.string().optional(), // Support old "name-asc" format
	sortBy: z.enum(["name", "price", "createdAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(1000).default(10),
}).transform((data): {
	sortBy: "name" | "price" | "createdAt"
	sortOrder: "asc" | "desc"
	page: number
	limit: number
	search?: string
	sort?: string
} => {
	// Handle legacy "sort" parameter (e.g., "name-asc", "price-desc")
	if (data.sort && !data.sortBy) {
		const [sortBy, sortOrder] = data.sort.split("-")
		return {
			...data,
			sortBy: (sortBy === "name" || sortBy === "price" || sortBy === "createdAt") ? sortBy as "name" | "price" | "createdAt" : "name",
			sortOrder: (sortOrder === "asc" || sortOrder === "desc") ? sortOrder as "asc" | "desc" : "asc",
		}
	}
	return {
		sortBy: (data.sortBy || "name") as "name" | "price" | "createdAt",
		sortOrder: (data.sortOrder || "asc") as "asc" | "desc",
		search: data.search,
		page: data.page,
		limit: data.limit,
		sort: data.sort,
	}
})

// Discount schemas
export const applyDiscountSchema = z.object({
	code: z.string().min(1, "Code is required"),
	cartTotal: z.number().positive("Cart total must be positive"),
})

export const createDiscountSchema = z.object({
	code: z.string().min(1).max(50),
	type: z.enum(["PERCENT", "FIXED"]),
	value: z.number().positive(),
	minAmount: z.number().nonnegative().optional(),
	maxUses: z.number().int().positive().optional(),
	expiresAt: z.string().datetime().optional(),
	active: z.boolean().default(true),
})

export const updateDiscountSchema = createDiscountSchema.partial()

// User schemas
export const getUserQuerySchema = z.object({
	search: z.string().optional(),
	role: z.enum(["CLIENT", "STAFF", "ADMIN", "SUPER_ADMIN"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
	sortBy: z.enum(["name", "email", "createdAt", "role"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// Search schema
export const searchQuerySchema = z.object({
	q: z.string().min(1, "Search query is required"),
	type: z.enum(["all", "bookings", "users", "services", "discounts", "referrals"]).default("all"),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
})

// Cart schemas
export const addToCartSchema = z.object({
	serviceId: z.string().uuid(),
	date: z.string(),
	time: z.string().min(1),
	photos: z.array(z.string().url()).optional(),
})

export const updateCartItemSchema = z.object({
	date: z.string().optional(),
	time: z.string().min(1).optional(),
	photos: z.array(z.string().url()).optional(),
})

// Bulk booking schema (for cash/mobile payments)
export const bulkBookingSchema = z.object({
	cartItems: z.array(cartItemSchema).min(1, "Cart is empty"),
	userName: z.string().min(1, "Name is required").max(255, "Name is too long"),
	phone: z.string().regex(phoneRegex, "Invalid phone number format").max(20, "Phone number is too long"),
	paymentMethod: z.enum(["cash", "mobile"], {
		errorMap: () => ({ message: "Invalid payment method" }),
	}),
	userId: z.string().uuid().optional(),
	email: z.string().email("Invalid email format").optional(),
	bookingFor: z.enum(["self", "other"]).optional(),
	discountCode: z.string().optional(),
	discountAmount: z.number().nonnegative().optional(),
	totalPrice: z.number().positive("Total price must be positive").optional(),
	finalPrice: z.number().positive("Final price must be positive").optional(),
	referralCode: z.string().optional(),
})

// User registration schema
export const registerUserSchema = z.object({
	email: z.string().email("Invalid email format").min(1, "Email is required"),
	password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
	name: z.string().min(1, "Name is required").max(255, "Name is too long"),
	phone: z.string().regex(phoneRegex, "Invalid phone number format").max(20, "Phone number is too long").optional(),
	role: z.enum(["CLIENT", "STAFF", "ADMIN", "SUPER_ADMIN"]).default("CLIENT"),
	referralCode: z.string().optional(),
})

// User update schema
export const updateUserSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	phone: z.string().regex(phoneRegex).max(20).optional(),
	email: z.string().email().optional(),
	role: z.enum(["CLIENT", "STAFF", "ADMIN", "SUPER_ADMIN"]).optional(),
})

// Password reset schemas
export const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email format").min(1, "Email is required"),
})

export const resetPasswordSchema = z.object({
	email: z.string().email("Invalid email format").min(1, "Email is required"),
	token: z.string().min(1, "Token is required"),
	password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
})

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(6, "New password must be at least 6 characters").max(100, "Password is too long"),
})

// WhatsApp schema
export const sendWhatsAppSchema = z.object({
	userName: z.string().min(1, "Name is required").max(255),
	phone: z.string().regex(phoneRegex, "Invalid phone number format").max(20),
	serviceName: z.string().min(1, "Service name is required"),
	date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
	time: z.string().min(1, "Time is required"),
	totalPrice: z.number().positive("Price must be positive"),
})

// Guest signup schema
export const guestSignupSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	email: z.string().email("Invalid email format").min(1, "Email is required"),
	phone: z.string().regex(phoneRegex, "Invalid phone number format").max(20).optional(),
})

