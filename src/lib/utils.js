import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Formats a number as Indian locale currency digits, e.g. 5000 -> "5,000". */
export function formatPrice(amount) {
  return amount.toLocaleString("en-IN");
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
