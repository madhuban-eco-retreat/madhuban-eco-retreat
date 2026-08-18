import { BUSINESS } from '@/lib/content/business';

/**
 * Centralized admin email. Reads from process.env.ADMIN_EMAIL with a hardcoded fallback.
 * Legacy: process.env.CONTACT_FORM_TO was used in older code paths and has been retired —
 * remove it from Vercel env vars during cleanup.
 *
 * This is an IDENTITY, not a mailing list: it is the bootstrap admin account in
 * lib/admin/auth.js and the recipient_email stamped on in-app notification rows.
 * Repointing it would lock that account out and orphan every existing
 * notification. Outbound staff mail goes to BOOKING_NOTIFICATION_EMAILS below.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'madhubanecoretreat@gmail.com';

/**
 * Who gets told when a booking is confirmed or cancelled.
 *
 * The property's own inbox is always included, from the single source of truth
 * in lib/content/business.js, because the alternative is what actually
 * happened: ADMIN_EMAIL was pointed at a personal gmail address, so
 * madhubanresort@somaiya.com received no booking notifications at all and
 * nobody could tell from the code that it was supposed to. An env var can add
 * recipients — comma-separated — but it can no longer silently remove the one
 * address the business runs on.
 */
export const BOOKING_NOTIFICATION_EMAILS = Array.from(new Set([
    BUSINESS.email,
    ...(process.env.ADMIN_EMAIL ?? '')
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean),
].map((address) => address.toLowerCase())));

/**
 * Coupon code length bounds.
 *
 * The floor was two characters, which left a keyspace small enough to walk from
 * the public pricing endpoint — that endpoint will happily confirm a hit. Eight
 * characters puts brute force out of reach of the five-failures-an-hour ceiling
 * the booking API enforces. Shared by the create route, the edit route and the
 * admin form so a code cannot be created long and later renamed short.
 */
export const MIN_COUPON_CODE_LENGTH = 8;
export const MAX_COUPON_CODE_LENGTH = 30;
