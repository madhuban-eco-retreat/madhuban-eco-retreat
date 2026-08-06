"use server";
import { getAllBookingsForExport, resolveGuestIdsByName, } from "@/lib/admin/bookings";
export async function fetchBookingsForExport(params) {
    const guestIds = params.q ? await resolveGuestIdsByName(params.q) : [];
    return getAllBookingsForExport(params, guestIds);
}
