import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple Tailwind CSS classes and handles conflicts using tailwind-merge.
 * This is a standard utility common in projects using Tailwind CSS and Radix UI.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
