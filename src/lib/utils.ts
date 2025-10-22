import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanNotificationMessage(
  message: string | null | undefined
): string {
  if (!message) return "";
  return message.replace(/\s*\[[\w-]+\]\s*$/, "").trim();
}

export function formatCurrency(
  amount: number,
  currency: "PEN" | "USD"
): string {
  const locale = currency === "PEN" ? "es-PE" : "en-US";
  const currencyCode = currency === "PEN" ? "PEN" : "USD";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
