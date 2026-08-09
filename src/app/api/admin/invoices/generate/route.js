import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, isInterStateGuest, computeTaxBreakdown, getFinancialYear } from "@/lib/gst";
import { extraGuestCharges } from "@/lib/booking/occupancy";
import { assertAdmin } from "@/lib/admin/auth";
const ISSUER = {
    legal_name: "Somaiya Properties And Investments Private Limited",
    trade_name: "Madhuban Eco Retreat",
    gstin: "23AAACT5004A1Z9",
    address: "Narmada Farm Kheri, Rehti, Sehore, Madhya Pradesh, 466446",
    state: "Madhya Pradesh",
};
/** Checks if "Madhya Pradesh" or common abbreviations appear in an address string. */
function extractStateFromAddress(address) {
    if (!address)
        return null;
    const lower = address.toLowerCase();
    if (lower.includes("madhya pradesh") || lower.includes("m.p."))
        return "Madhya Pradesh";
    return null;
}
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
    const { booking_id } = body;
    if (!booking_id)
        return NextResponse.json({ error: "booking_id required" }, { status: 400 });
    const supabase = createAdminClient();
    // Check if invoice already exists for this booking
    const { data: existing } = await supabase
        .from("invoices")
        .select("id, invoice_number")
        .eq("booking_id", booking_id)
        .maybeSingle();
    if (existing) {
        return NextResponse.json({ error: "Invoice already exists for this booking", invoice_id: existing.id, invoice_number: existing.invoice_number }, { status: 409 });
    }
    // Fetch booking + guest + room
    const { data: bookingRaw, error: bookingErr } = await supabase
        .from("bookings")
        .select(`
      *,
      guests!guest_id ( id, name, mobile, email, address, gstin ),
      rooms!room_id ( id, name, base_price_per_night )
    `)
        .eq("id", booking_id)
        .single();
    if (bookingErr || !bookingRaw) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = bookingRaw;
    const guest = Array.isArray(booking.guests) ? booking.guests[0] ?? null : booking.guests;
    const room = Array.isArray(booking.rooms) ? booking.rooms[0] ?? null : booking.rooms;
    if (booking.status === "CANCELLED") {
        return NextResponse.json({ error: "Cannot invoice a cancelled booking" }, { status: 400 });
    }
    if (!room) {
        return NextResponse.json({ error: "Room data missing" }, { status: 500 });
    }
    // Compute nights
    const checkinDate = new Date(booking.checkin + "T00:00:00");
    const checkoutDate = new Date(booking.checkout + "T00:00:00");
    const nights = Math.max(1, Math.round((checkoutDate.getTime() - checkinDate.getTime()) / 86400000));
    // Format dates for description
    const checkinLabel = checkinDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const checkoutLabel = checkoutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    // Build line items — amounts are pre-GST, matching how rooms are tariffed.
    const addons = (Array.isArray(booking.addons) ? booking.addons : []);
    // Extra occupants are charged on the booking but are not addon rows, so they
    // are reconstructed from the stored headcount. Without these the invoice
    // total would fall short of what the guest actually paid.
    const extras = extraGuestCharges({
        adults: booking.num_adults ?? 0,
        children: booking.num_children ?? 0,
        nights,
    });
    const lineItems = [
        {
            description: `${room.name} · ${nights} Night${nights > 1 ? "s" : ""} · ${checkinLabel} to ${checkoutLabel}`,
            hsn: "9963",
            qty: nights,
            rate: room.base_price_per_night,
            amount: Math.round(room.base_price_per_night * nights * 100) / 100,
        },
        ...extras.lines.map((l) => ({
            description: `${l.label} × ${l.qty} · ${nights} night${nights > 1 ? "s" : ""}`,
            hsn: "9963",
            qty: l.qty * nights,
            rate: l.ratePerNight,
            amount: l.amount,
        })),
        ...addons.map((a) => ({
            description: `${a.label} × ${a.qty}`,
            hsn: "9963",
            qty: a.qty,
            rate: a.price,
            amount: Math.round(a.price * a.qty * 100) / 100,
        })),
    ];
    // GST rate always computed from base price — never read stored column
    const gstRatePct = computeRoomGstRate(room.base_price_per_night);
    // Line amounts exclude GST, so their sum IS the taxable value; the tax is
    // added on top by computeTaxBreakdown below.
    const taxableAmount = Math.round(lineItems.reduce((s, i) => s + i.amount, 0) * 100) / 100;
    // Determine guest state for intra/inter-state split
    const isCorporate = !!booking.corporate_gstin;
    const rawAddress = isCorporate ? booking.corporate_address : guest?.address ?? null;
    const detectedState = extractStateFromAddress(rawAddress);
    const interState = isInterStateGuest(detectedState);
    const tax = computeTaxBreakdown(taxableAmount, gstRatePct, interState);
    // Bill-to details
    const billTo = {
        name: isCorporate ? (booking.corporate_company_name ?? guest?.name ?? "Guest") : (guest?.name ?? "Guest"),
        phone: guest?.mobile ?? null,
        email: guest?.email ?? null,
        address: rawAddress ?? null,
        state: detectedState ?? (interState ? null : "Madhya Pradesh"),
        gstin: isCorporate ? booking.corporate_gstin : (guest?.gstin ?? null),
        company_name: isCorporate ? booking.corporate_company_name : null,
    };
    const fy = getFinancialYear();
    // Call atomic create function
    const { data: result, error: rpcErr } = await supabase.rpc("create_invoice_atomic", {
        p_booking_id: booking_id,
        p_issuer: ISSUER,
        p_bill_to: billTo,
        p_service: {
            fy,
            from: booking.checkin,
            to: booking.checkout,
            place_of_supply_state: "Madhya Pradesh",
        },
        p_tax: {
            is_inter_state: tax.isInterState,
            gst_rate: tax.gstRate,
            taxable: tax.taxableAmount,
            cgst_rate: tax.cgstRate ?? "",
            cgst_amount: tax.cgstAmount ?? "",
            sgst_rate: tax.sgstRate ?? "",
            sgst_amount: tax.sgstAmount ?? "",
            igst_rate: tax.igstRate ?? "",
            igst_amount: tax.igstAmount ?? "",
            total_gst: tax.totalGst,
            total: tax.totalAmount,
        },
        p_line_items: lineItems,
        p_generated_by: user.email,
    });
    if (rpcErr) {
        console.error("create_invoice_atomic error:", rpcErr);
        return NextResponse.json({ error: "Invoice creation failed", detail: rpcErr.message }, { status: 500 });
    }
    const { invoice_id, invoice_number } = result;
    // Audit log
    await supabase.from("audit_log").insert({
        admin_user_id: user.id,
        actor_email: user.email ?? null,
        action: "invoice_generated",
        entity_type: "invoice",
        entity_id: invoice_id,
        details: { invoice_number, booking_id, generated_by: user.email },
    });
    return NextResponse.json({ invoice_id, invoice_number }, { status: 200 });
}
