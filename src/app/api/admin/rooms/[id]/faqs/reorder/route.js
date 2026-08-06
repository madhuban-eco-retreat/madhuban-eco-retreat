import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
export async function POST(request, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // id param unused but validates route context
    await params;
    let body;
    try {
        body = await request.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!Array.isArray(body)) {
        return NextResponse.json({ error: "Body must be [{id, display_order}]" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const updates = body;
    for (const { id, display_order } of updates) {
        const { error } = await supabase
            .from("room_faqs")
            .update({ display_order })
            .eq("id", id);
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}
