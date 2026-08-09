import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Indian locale currency digits, e.g. 5000 -> "5,000".
 *
 * Fractional amounts are padded to two decimals: the 2.5% CGST on a ₹7,500
 * tariff is ₹187.50, and the bare toLocaleString rendered that as "187.5",
 * which reads as a typo on a tax line. Whole rupees stay undecorated so the
 * common case is still "12,000" rather than "12,000.00".
 */
export function formatPrice(amount) {
  return Number.isInteger(amount)
    ? amount.toLocaleString("en-IN")
    : amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

/** Returns up to 2 uppercased initials from a full name, e.g. "Vidya Balan" -> "VB". */
export function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
