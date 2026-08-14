import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";
import {
    OCCUPYING_STATUSES,
    fetchOverlappingBlocks,
    totalBlockedUnits,
} from "@/lib/booking/inventory";
import { CUSTOM_BLOCK_REASON } from "@/lib/admin/block-reasons";
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
// The admin UI posts snake_case; the documented API shape is camelCase. Both are
// accepted so an integration written against either keeps working.
const BlockSchema = z.object({
    room_id: z.string().uuid().optional(),
    roomId: z.string().uuid().optional(),
    roomSlug: z.string().min(1).optional(),
    start_date: dateStr.optional(),
    startDate: dateStr.optional(),
    end_date: dateStr.optional(),
    endDate: dateStr.optional(),
    // Absent means one unit, which is what every pre-multi-unit caller meant.
    units: z.number().int().min(1).max(50).optional(),
    units_blocked: z.number().int().min(1).max(50).optional(),
    reason: z.string().min(1),
    custom_reason: z.string().max(200).optional(),
    customReason: z.string().max(200).optional(),
    notes: z.string().max(500).optional(),
});
export async function POST(req) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = BlockSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
    }
    const b = parsed.data;
    const roomRef = b.room_id ?? b.roomId ?? b.roomSlug;
    const start_date = b.start_date ?? b.startDate;
    const end_date = b.end_date ?? b.endDate;
    if (!roomRef)
        return NextResponse.json({ error: "Room is required" }, { status: 400 });
    if (!start_date || !end_date)
        return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    if (end_date <= start_date) {
        return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }
    // "Custom" is a UI affordance, not a stored value — the free-text reason is
    // what gets written, so the calendar and the audit log read the same either
    // way and nothing downstream has to special-case the literal word.
    const customReason = (b.custom_reason ?? b.customReason ?? "").trim();
    if (b.reason === CUSTOM_BLOCK_REASON && !customReason) {
        return NextResponse.json({ error: "A custom reason is required when Custom is selected" }, { status: 400 });
    }
    const reason = b.reason === CUSTOM_BLOCK_REASON ? customReason : b.reason;
    const supabase = createAdminClient();
    const isUuid = /^[0-9a-f-]{36}$/i.test(roomRef);
    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("id, name, inventory_count")
        .eq(isUuid ? "id" : "slug", roomRef)
        .single();
    if (roomError || !room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const inventory = Math.max(room.inventory_count ?? 1, 1);
    const unitsToBlock = b.units ?? b.units_blocked ?? 1;
    if (unitsToBlock > inventory) {
        return NextResponse.json({
            error: `${room.name} has only ${inventory} unit${inventory === 1 ? "" : "s"}. Cannot block ${unitsToBlock}.`,
        }, { status: 400 });
    }
    // A block used to be refused whenever any booking overlapped, because a block
    // meant the whole room type. With per-unit blocking the question is narrower:
    // is there a free unit left to block? Blocking one Safari Tent while the other
    // is booked is legitimate and now allowed.
    const { count: bookedUnits, error: bookingCheckError } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("room_id", room.id)
        .in("status", OCCUPYING_STATUSES)
        .lt("checkin", end_date)
        .gt("checkout", start_date);
    if (bookingCheckError) {
        return NextResponse.json({ error: "Failed to check for conflicts" }, { status: 500 });
    }
    let existingBlocks;
    try {
        existingBlocks = await fetchOverlappingBlocks(supabase, {
            from: start_date,
            to: end_date,
            roomId: room.id,
        });
    }
    catch {
        return NextResponse.json({ error: "Failed to check for conflicts" }, { status: 500 });
    }
    const alreadyBlocked = totalBlockedUnits(existingBlocks, room.id, inventory);
    const free = inventory - (bookedUnits ?? 0) - alreadyBlocked;
    if (unitsToBlock > free) {
        return NextResponse.json({
            error: free <= 0
                ? `No units of ${room.name} are free in this range — ${bookedUnits ?? 0} booked, ${alreadyBlocked} already blocked.`
                : `Only ${free} unit${free === 1 ? "" : "s"} of ${room.name} free in this range (${bookedUnits ?? 0} booked, ${alreadyBlocked} already blocked).`,
            availableUnits: Math.max(0, free),
            totalUnits: inventory,
        }, { status: 409 });
    }
    const row = {
        room_id: room.id,
        date_from: start_date,
        date_to: end_date,
        reason,
        notes: b.notes?.trim() || null,
        created_by: user.id,
    };
    let { data: block, error: insertError } = await supabase
        .from("manual_blocks")
        .insert({ ...row, units_blocked: unitsToBlock })
        .select("id")
        .single();
    // If this deploy is ahead of the SQL migration the column is not there yet.
    // A row without it already means "the whole room type", so a full block still
    // writes correctly; a partial one cannot be expressed and has to say so rather
    // than quietly closing units the admin meant to keep selling.
    if (insertError?.code === "42703") {
        if (unitsToBlock < inventory) {
            return NextResponse.json({
                error: "Partial blocking needs a pending database migration (manual_blocks.units_blocked). Block all units, or run the migration first.",
            }, { status: 503 });
        }
        ({ data: block, error: insertError } = await supabase
            .from("manual_blocks")
            .insert(row)
            .select("id")
            .single());
    }
    if (insertError || !block) {
        return NextResponse.json({ error: "Failed to create block" }, { status: 500 });
    }
    await supabase.from("audit_log").insert({
        admin_user_id: user.id,
        actor_email: user.email ?? null,
        action: "manual_block_created",
        entity_type: "manual_block",
        entity_id: block.id,
        details: {
            room_id: room.id,
            start_date,
            end_date,
            units_blocked: unitsToBlock,
            inventory_count: inventory,
            reason,
            notes: b.notes?.trim() || null,
        },
    });
    return NextResponse.json({
        success: true,
        block_id: block.id,
        units_blocked: unitsToBlock,
        remaining_units: free - unitsToBlock,
        total_units: inventory,
    });
}
