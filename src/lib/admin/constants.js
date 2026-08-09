/**
 * Centralized admin email. Reads from process.env.ADMIN_EMAIL with a hardcoded fallback.
 * Legacy: process.env.CONTACT_FORM_TO was used in older code paths and has been retired —
 * remove it from Vercel env vars during cleanup.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'madhubanecoretreat@gmail.com';

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
