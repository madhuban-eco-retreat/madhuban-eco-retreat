import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, addGst } from "@/lib/gst";
function diffDays(a, b) {
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function calcAddonTotal(addons, nights) {
    return addons.reduce((sum, addon) => {
        // 'per night' addons multiply by nights; all others use qty directly
        const multiplier = addon.unit === 'per night' ? nights : 1;
        return sum + addon.price * addon.qty * multiplier;
    }, 0);
}
export async function calculateAdminPricing(params) {
    const { roomId, checkIn, checkOut, addons } = params;
    const supabase = createAdminClient();
    const { data: room, error } = await supabase
        .from("rooms")
        .select("id, name, base_price_per_night")
        .eq("id", roomId)
        .single();
    if (error || !room)
        throw new Error("Room not found");
    const nights = diffDays(checkIn, checkOut);
    if (nights < 1)
        throw new Error("Check-out must be after check-in");
    const basePricePerNight = Number(room.base_price_per_night);
    const roomTotal = +(basePricePerNight * nights).toFixed(2);
    const addonsTotal = +calcAddonTotal(addons, nights).toFixed(2);
    // Room tariffs and addon prices are both pre-GST, so the subtotal is the
    // taxable base and the tax goes on top of it.
    const subtotalBeforeGst = +(roomTotal + addonsTotal).toFixed(2);
    const gstRatePct = computeRoomGstRate(basePricePerNight);
    const { gst: gstAmount, total: totalAmount } = addGst(subtotalBeforeGst, gstRatePct);
    return {
        roomId: room.id,
        roomName: room.name,
        checkIn,
        checkOut,
        nights,
        basePricePerNight,
        roomTotal,
        addonsTotal,
        gstRatePct,
        subtotalBeforeGst,
        gstAmount,
        totalAmount,
        // Kept as an alias so existing admin callers reading `subtotalInclusive`
        // get the payable figure rather than a stale pre-tax one.
        subtotalInclusive: totalAmount,
    };
}
