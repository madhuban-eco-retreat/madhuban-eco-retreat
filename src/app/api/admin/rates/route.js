import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/admin/auth";
import { getRatesAndRules, validateRatePayload } from "@/lib/admin/rates";

/**
 * Rates & Rules: read everything, write one thing at a time.
 *
 * Each PATCH names the `kind` of row it is touching, so a price edit cannot
 * accidentally carry a stale GST block along with it. Every write is validated
 * server-side even though the form validates too — the form is a convenience,
 * this is the boundary.
 *
 * Every write is audit-logged with before AND after. Rates are money, and
 * "who changed the Safari Tent to Rs 18,000 and what was it before" is a
 * question that will eventually be asked.
 */

async function writeAudit(supabase, user, action, entityId, details) {
  await supabase.from("audit_log").insert({
    admin_user_id: user.id ?? null,
    actor_email: user.email,
    action,
    entity_type: "rate_card",
    entity_id: entityId,
    details,
  });
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await getRatesAndRules());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load rates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

  const { kind, ...payload } = body ?? {};
  const errors = validateRatePayload(kind, payload);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0], errors }, { status: 400 });
  }

  const supabase = createAdminClient();
  const stamp = { updated_at: new Date().toISOString(), updated_by: user.email };

  try {
    switch (kind) {
      case "room_rate": {
        const { data: before } = await supabase
          .from("room_rates")
          .select("*")
          .eq("room_slug", payload.room_slug)
          .maybeSingle();

        const row = {
          room_slug: payload.room_slug,
          label: payload.label ?? before?.label ?? payload.room_slug,
          regular_rate: Number(payload.regular_rate),
          peak_rate: Number(payload.peak_rate),
          sort_order: payload.sort_order ?? before?.sort_order ?? 0,
          is_active: payload.is_active ?? before?.is_active ?? true,
          ...stamp,
        };
        const { error } = await supabase
          .from("room_rates")
          .upsert(row, { onConflict: "room_slug" });
        if (error) throw new Error(error.message);

        await writeAudit(supabase, user, "rate_updated", payload.room_slug, {
          before: before
            ? { regular_rate: before.regular_rate, peak_rate: before.peak_rate }
            : null,
          after: { regular_rate: row.regular_rate, peak_rate: row.peak_rate },
        });
        break;
      }

      case "gst": {
        const { data: before } = await supabase
          .from("gst_rules")
          .select("*")
          .eq("id", "singleton")
          .maybeSingle();
        const row = {
          id: "singleton",
          threshold: Number(payload.threshold),
          rate_low: Number(payload.rate_low),
          rate_high: Number(payload.rate_high),
          ...stamp,
        };
        const { error } = await supabase.from("gst_rules").upsert(row, { onConflict: "id" });
        if (error) throw new Error(error.message);
        await writeAudit(supabase, user, "gst_rules_updated", "singleton", {
          before: before ?? null,
          after: row,
        });
        break;
      }

      case "occupancy": {
        const { data: before } = await supabase
          .from("occupancy_rules")
          .select("*")
          .eq("id", "singleton")
          .maybeSingle();
        const row = {
          id: "singleton",
          extra_adult_rate: Number(payload.extra_adult_rate),
          child_rate: Number(payload.child_rate),
          infant_rate: Number(payload.infant_rate ?? 0),
          extra_bedding_rate: Number(payload.extra_bedding_rate),
          infant_max_age: Number(payload.infant_max_age),
          child_max_age: Number(payload.child_max_age),
          default_adults_included: Number(payload.default_adults_included),
          default_max_adults: Number(payload.default_max_adults),
          ...stamp,
        };
        const { error } = await supabase.from("occupancy_rules").upsert(row, { onConflict: "id" });
        if (error) throw new Error(error.message);
        await writeAudit(supabase, user, "occupancy_rules_updated", "singleton", {
          before: before ?? null,
          after: row,
        });
        break;
      }

      case "long_stay": {
        const { data: before } = await supabase
          .from("long_stay_rules")
          .select("*")
          .eq("id", "singleton")
          .maybeSingle();
        const row = {
          id: "singleton",
          discount_rate: Number(payload.discount_rate),
          min_nights: Number(payload.min_nights),
          applies_on_peak: Boolean(payload.applies_on_peak),
          is_active: payload.is_active ?? true,
          ...stamp,
        };
        const { error } = await supabase.from("long_stay_rules").upsert(row, { onConflict: "id" });
        if (error) throw new Error(error.message);
        await writeAudit(supabase, user, "long_stay_rules_updated", "singleton", {
          before: before ?? null,
          after: row,
        });
        break;
      }

      case "season": {
        const row = {
          kind: payload.kind_of_season,
          label: String(payload.label).trim(),
          is_recurring: Boolean(payload.is_recurring),
          start_date: payload.is_recurring ? null : payload.start_date,
          end_date: payload.is_recurring ? null : payload.end_date,
          start_month: payload.is_recurring ? Number(payload.start_month) : null,
          start_day: payload.is_recurring ? Number(payload.start_day) : null,
          end_month: payload.is_recurring ? Number(payload.end_month) : null,
          end_day: payload.is_recurring ? Number(payload.end_day) : null,
          surcharge_rate:
            payload.kind_of_season === "peak" && payload.surcharge_rate
              ? Number(payload.surcharge_rate)
              : null,
          is_active: payload.is_active ?? true,
          sort_order: Number(payload.sort_order ?? 0),
          ...stamp,
        };

        if (payload.id) {
          const { data: before } = await supabase
            .from("pricing_seasons")
            .select("*")
            .eq("id", payload.id)
            .maybeSingle();
          const { error } = await supabase
            .from("pricing_seasons")
            .update(row)
            .eq("id", payload.id);
          if (error) throw new Error(error.message);
          await writeAudit(supabase, user, "season_updated", payload.id, {
            before: before ?? null,
            after: row,
          });
        } else {
          const { data: created, error } = await supabase
            .from("pricing_seasons")
            .insert(row)
            .select("id")
            .single();
          if (error) throw new Error(error.message);
          await writeAudit(supabase, user, "season_created", created?.id ?? null, {
            before: null,
            after: row,
          });
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown kind: ${kind}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/** Deletes one season row. Nothing else here is deletable — rates and rules are
 *  edited, never removed, because the engine needs a value for every field. */
export async function DELETE(req) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("seasonId");
  if (!id) return NextResponse.json({ error: "seasonId is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: before } = await supabase
    .from("pricing_seasons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("pricing_seasons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAudit(supabase, user, "season_deleted", id, { before: before ?? null, after: null });
  return NextResponse.json({ ok: true });
}
