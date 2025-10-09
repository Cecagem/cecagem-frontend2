import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda
 * @param amount - El monto a formatear
 * @param currency - La moneda (PEN o USD)
 * @returns String formateado como moneda
 */
export function formatCurrency(amount: number, currency: 'PEN' | 'USD'): string {
  const locale = currency === 'PEN' ? 'es-PE' : 'en-US';
  const currencyCode = currency === 'PEN' ? 'PEN' : 'USD';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
