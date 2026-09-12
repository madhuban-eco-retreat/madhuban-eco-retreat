import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/admin/auth";
import { loadAllOffers } from "@/lib/pricing/rate-card-db";
import { validateOfferPayload, normaliseOffer } from "@/lib/admin/offers";

/**
 * Offers CRUD.
 *
 * Offers are money in the same way rates are, so every mutation is audit-logged
 * with before and after. Activation is logged too, and separately: "who turned
 * the 40% campaign on" is its own question from "who wrote it".
 */

async function writeAudit(supabase, user, action, entityId, details) {
  await supabase.from("audit_log").insert({
    admin_user_id: user.id ?? null,
    actor_email: user.email,
    action,
    entity_type: "offer",
    entity_id: entityId,
    details,
  });
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const offers = await loadAllOffers();
    return NextResponse.json({ offers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load offers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validateOfferPayload(body);
  if (errors.length > 0) return NextResponse.json({ error: errors[0], errors }, { status: 400 });

  const supabase = createAdminClient();
  const row = { ...normaliseOffer(body), updated_by: user.email };

  const { data, error } = await supabase.from("offers").insert(row).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAudit(supabase, user, "offer_created", data.id, { before: null, after: row });
  return NextResponse.json({ offer: data });
}

export async function PATCH(req) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: before } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

  // Toggling active is its own action: it needs no field validation, and it is
  // the one an auditor is most likely to be looking for.
  if (Object.keys(body).length === 2 && "is_active" in body) {
    const { error } = await supabase
      .from("offers")
      .update({ is_active: Boolean(body.is_active), updated_at: new Date().toISOString(), updated_by: user.email })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await writeAudit(supabase, user, body.is_active ? "offer_activated" : "offer_deactivated", id, {
      before: { is_active: before.is_active },
      after: { is_active: Boolean(body.is_active) },
    });
    return NextResponse.json({ ok: true });
  }

  const errors = validateOfferPayload(body);
  if (errors.length > 0) return NextResponse.json({ error: errors[0], errors }, { status: 400 });

  const row = { ...normaliseOffer(body), updated_by: user.email };
  const { error } = await supabase.from("offers").update(row).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAudit(supabase, user, "offer_updated", id, { before, after: row });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: before } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();

  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAudit(supabase, user, "offer_deleted", id, { before: before ?? null, after: null });
  return NextResponse.json({ ok: true });
}
