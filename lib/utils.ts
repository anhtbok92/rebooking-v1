import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date and time for consistent display in cart and bookings
 * Handles both string dates (YYYY-MM-DD) and Date objects/ISO strings
 * Returns format: "January 15, 2024 at 2:00 PM"
 */
export function formatBookingDateTime(date: string | Date, time: string): string {
  try {
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return `${date} at ${time}`
    }
    
    // Format date as "January 15, 2024"
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    return `${formattedDate} at ${time}`
  } catch (error) {
    // Fallback to original format if parsing fails
    return `${date} at ${time}`
  }
}

/**
 * Format date only for consistent display
 * Returns format: "January 15, 2024"
 */
export function formatBookingDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return String(date)
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    return String(date)
  }
}
