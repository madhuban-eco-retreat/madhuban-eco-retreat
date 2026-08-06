import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
export async function POST(request, { params }) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: roomId } = await params;
    let body;
    try {
        body = (await request.json());
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    if (!question)
        return NextResponse.json({ error: "question required" }, { status: 400 });
    const supabase = createAdminClient();
    // Get next display_order
    const { data: last } = await supabase
        .from("room_faqs")
        .select("display_order")
        .eq("room_id", roomId)
        .order("display_order", { ascending: false })
        .limit(1)
        .maybeSingle();
    const nextOrder = (last?.display_order ?? -1) + 1;
    const { data, error } = await supabase
        .from("room_faqs")
        .insert({ room_id: roomId, question, answer, display_order: nextOrder })
        .select("*")
        .single();
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
