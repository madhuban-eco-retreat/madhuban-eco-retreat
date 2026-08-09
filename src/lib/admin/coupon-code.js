import { z } from "zod";
import { MIN_COUPON_CODE_LENGTH, MAX_COUPON_CODE_LENGTH } from "@/lib/admin/constants";

/**
 * Validator for a coupon code, shared by the create and edit routes.
 *
 * Defined once because the two used to disagree: creation could enforce a
 * length that an edit then quietly undid, leaving a guessable code live. The
 * value is trimmed and upper-cased before it is measured, so whitespace cannot
 * pad a short code past the floor.
 */
export const couponCodeSchema = z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .refine((v) => v.length >= MIN_COUPON_CODE_LENGTH, {
        message: `Coupon code must be at least ${MIN_COUPON_CODE_LENGTH} characters`,
    })
    .refine((v) => v.length <= MAX_COUPON_CODE_LENGTH, {
        message: `Coupon code must be ${MAX_COUPON_CODE_LENGTH} characters or fewer`,
    });
