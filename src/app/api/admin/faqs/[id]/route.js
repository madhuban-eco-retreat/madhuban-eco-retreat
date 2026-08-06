import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
export async function PATCH(request, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let body;
    try {
        body = (await request.json());
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    // Strip immutable fields
    delete body.id;
    delete body.room_id;
    delete body.created_at;
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("room_faqs")
        .update(body)
        .eq("id", id)
        .select("*")
        .single();
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
export async function DELETE(_req, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from("room_faqs").delete().eq("id", id);
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return new NextResponse(null, { status: 204 });
}
