import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
export async function GET(_req, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const supabase = createAdminClient();
    const [roomRes, faqsRes] = await Promise.all([
        supabase.from("rooms").select("*").eq("id", id).single(),
        supabase.from("room_faqs").select("*").eq("room_id", id).order("display_order"),
    ]);
    if (roomRes.error || !roomRes.data)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ room: roomRes.data, faqs: faqsRes.data ?? [] });
}
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
    // Strip non-updatable fields
    delete body.id;
    delete body.created_at;
    const supabase = createAdminClient();
    const { data: old } = await supabase
        .from("rooms")
        .select("slug, is_active")
        .eq("id", id)
        .single();
    // If slug changed, check uniqueness
    if (body.slug && body.slug !== old?.slug) {
        const { data: conflict } = await supabase
            .from("rooms")
            .select("id")
            .eq("slug", body.slug)
            .neq("id", id)
            .maybeSingle();
        if (conflict)
            return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    const { data, error } = await supabase
        .from("rooms")
        .update(body)
        .eq("id", id)
        .select("id, slug, is_active")
        .single();
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    // Revalidate public pages
    revalidatePath("/stay");
    if (old?.slug)
        revalidatePath(`/stay/${old.slug}`);
    if (data?.slug && data.slug !== old?.slug)
        revalidatePath(`/stay/${data.slug}`);
    return NextResponse.json(data);
}
export async function DELETE(_req, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const supabase = createAdminClient();
    const { data: room } = await supabase
        .from("rooms")
        .select("slug")
        .eq("id", id)
        .single();
    // FAQs cascade-delete via FK on delete
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/stay");
    if (room?.slug)
        revalidatePath(`/stay/${room.slug}`);
    return new NextResponse(null, { status: 204 });
}
