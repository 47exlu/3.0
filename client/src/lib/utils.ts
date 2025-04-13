import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and applies Tailwind-specific merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a number as currency
 */
export function formatMoney(num: number | undefined | null): string {
  if (num === undefined || num === null) return '$0';
  return "$" + formatNumber(Math.floor(num));
}

/**
 * Format a number as currency (alias for formatMoney)
 */
export function formatCurrency(num: number | undefined | null): string {
  return formatMoney(num);
}

/**
 * Format a date number or string into a human-readable date
 */
export function formatDate(date: number | string | undefined): string {
  if (!date) return 'Unknown date';
  
  const dateObj = typeof date === 'number' 
    ? new Date(date) 
    : new Date(date);
    
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get an item from localStorage with type safety
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Set an item in localStorage with error handling
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

/**
 * Format a large number with appropriate suffix (K, M, B)
 */
export function formatLargeNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
}