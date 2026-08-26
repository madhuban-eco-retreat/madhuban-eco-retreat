import "server-only";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Shared plumbing for the blog admin API: the auth gate, the error envelope and
 * the audit trail, so ten route files do not each re-implement them slightly
 * differently.
 */

export const jsonError = (message, status = 400) =>
  NextResponse.json({ error: message }, { status });

/**
 * Resolves the signed-in admin and a service-role client.
 *
 * Returns `{ response }` when the caller is not an admin, so routes can do
 * `if (gate.response) return gate.response;` and carry on with `gate.user` /
 * `gate.supabase` otherwise.
 */
export async function requireAdmin() {
  const user = await assertAdmin();
  if (!user) return { response: jsonError("Unauthorized", 401) };
  return { user, supabase: createAdminClient() };
}

/** Parses a JSON body, answering 400 rather than throwing on malformed input. */
export async function readJson(req) {
  try {
    return { data: await req.json() };
  } catch {
    return { response: jsonError("Invalid JSON") };
  }
}

/**
 * Records an admin action. Best-effort by design — the audit trail must never
 * be the reason a save fails, so a logging error is reported to the server
 * console and swallowed.
 */
export async function audit(supabase, user, action, entityType, entityId, details = {}) {
  try {
    await supabase.from("audit_log").insert({
      admin_user_id: user.id,
      actor_email: user.email ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  } catch (error) {
    console.error(`[blog-admin] audit write failed for ${action}:`, error);
  }
}

/**
 * Ensures `slug` is free, appending -2, -3 … when it is not.
 *
 * Slugs are the public URL and carry a UNIQUE constraint, so a plain insert
 * would fail with a raw Postgres error. `excludeId` lets a post keep its own
 * slug while being edited.
 */
export async function uniqueSlug(supabase, table, slug, excludeId = null) {
  let candidate = slug;
  for (let n = 2; n < 100; n += 1) {
    let query = supabase.from(table).select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${slug}-${n}`;
  }
  // 98 collisions on one slug means something is wrong upstream; a timestamp
  // is ugly but always free.
  return `${slug}-${Date.now()}`;
}
