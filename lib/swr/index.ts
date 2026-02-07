/**
 * SWR Hooks Library
 * Centralized data fetching hooks for the application
 */

// Export fetcher
export { fetcher } from "./fetcher"

// Export booking hooks
export {
	useBookings,
	useUserBookings,
	useBookingStats,
	type Booking,
	type BookingsResponse,
	type BookingStats,
} from "./hooks/bookings"

// Export service hooks
export {
	useServices,
	type Service,
	type ServicesResponse,
} from "./hooks/services"

// Export user hooks
export {
	useUsers,
	useStaff,
	type User,
	type UsersResponse,
} from "./hooks/users"

