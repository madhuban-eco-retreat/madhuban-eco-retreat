import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
export async function PATCH(req, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let body;
    try {
        body = (await req.json());
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text)
        return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    const supabase = createAdminClient();
    const { data: booking } = await supabase
        .from("bookings")
        .select("staff_notes")
        .eq("id", id)
        .single();
    if (!booking)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    const existing = Array.isArray(booking.staff_notes)
        ? booking.staff_notes
        : [];
    const newNote = {
        text,
        author_email: user.email ?? "admin",
        created_at: new Date().toISOString(),
    };
    const updated = [...existing, newNote];
    await supabase
        .from("bookings")
        .update({ staff_notes: updated })
        .eq("id", id);
    await supabase.from("audit_log").insert({
        admin_user_id: user.id,
        actor_email: user.email ?? null,
        action: "internal_note_added",
        entity_type: "booking",
        entity_id: id,
        details: { note: text },
    });
    return NextResponse.json({ ok: true, notes: updated });
}
