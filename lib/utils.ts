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

/**
 * Get the currency symbol based on the currency code
 * @param currencyCode Currency code (e.g., 'VND', 'USD')
 * @returns Currency symbol (e.g., 'đ', '$')
 */
export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode.toUpperCase()) {
    case 'VND':
      return 'đ';
    case 'USD':
      return '$';
    default:
      return '$'; // Default to USD symbol
  }
}

/**
 * Format currency amount with proper symbol placement based on locale
 * @param amount The numeric amount to format
 * @param currencyCode Currency code (e.g., 'VND', 'USD')
 * @returns Formatted currency string with symbol in correct position
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currencySymbol = getCurrencySymbol(currencyCode);
  
  // For Vietnamese Dong (VND), the symbol comes after the amount
  if (currencyCode.toUpperCase() === 'VND') {
    return `${amount.toLocaleString()}${currencySymbol}`;
  }
  
  // For other currencies (like USD), the symbol comes before the amount
  return `${currencySymbol}${amount.toLocaleString()}`;
}
