import { NextResponse } from "next/server";
import { checkAvailabilitySchema } from "@/lib/booking/schemas";
import { checkAvailability } from "@/lib/booking/availability";
import { checkRateLimit } from "@/lib/ratelimit";
export async function POST(req) {
    const rl = await checkRateLimit(req);
    if (rl.limited) {
        return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfter }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = checkAvailabilitySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    try {
        const { roomId, checkIn, checkOut, units } = parsed.data;
        // Returns { available, availableUnits, totalUnits, reason? } so the caller
        // can distinguish "sold out" from "one tent left".
        const result = await checkAvailability({
            roomId,
            checkIn,
            checkOut,
            unitsRequested: units,
        });
        return NextResponse.json(result);
    }
    catch (err) {
        console.error("[check-availability]", err);
        return NextResponse.json({ error: "Unable to check availability. Please try again." }, { status: 500 });
    }
}
