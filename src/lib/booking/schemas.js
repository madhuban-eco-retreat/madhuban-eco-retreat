import { z } from "zod";
import { isValidPhone, PHONE_ERROR } from "@/lib/validation/phone";
import { MAX_ADULTS_ANY_ROOM, MAX_CHILDREN, MAX_INFANTS } from "@/lib/booking/occupancy";
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");
// Occupancy caps are enforced server-side as well as in the form: the counts
// drive extra-guest charges, so a hand-crafted request must not be able to book
// five adults at the double-occupancy rate.
//
// This bound is the largest party ANY room takes, because the schema has no
// room in hand to ask. calculatePricing applies the real per-room cap once the
// slug is resolved — this only keeps absurd numbers out of the query.
const adults = z.number().int().min(1).max(MAX_ADULTS_ANY_ROOM);
const children = z.number().int().min(0).max(MAX_CHILDREN);
const infants = z.number().int().min(0).max(MAX_INFANTS).optional().default(0);
export const checkAvailabilitySchema = z.object({
    roomId: z.string().uuid(),
    checkIn: dateStr,
    checkOut: dateStr,
    // Multi-unit room types can be asked for more than one tent at a time. The
    // ceiling is deliberately loose — the real cap is the room's own inventory,
    // which only the server-side check knows.
    units: z.number().int().min(1).max(20).optional().default(1),
}).refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
});
export const calculatePriceSchema = z.object({
    roomSlug: z.string().min(1),
    checkIn: dateStr,
    checkOut: dateStr,
    adults,
    children,
    infants,
    couponCode: z.string().max(30).optional(),
}).refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
});
export const createBookingSchema = z.object({
    roomSlug: z.string().min(1),
    checkIn: dateStr,
    checkOut: dateStr,
    adults,
    children,
    infants,
    guestName: z.string().min(1).max(100),
    guestEmail: z.string().email(),
    guestPhone: z.string().refine(isValidPhone, PHONE_ERROR),
    specialRequests: z.string().max(2000).optional(),
    couponCode: z.string().max(30).optional(),
}).refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
});
