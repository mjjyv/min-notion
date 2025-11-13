import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// Tiện ích này giúp merge các class của Tailwind mà không bị xung đột
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}