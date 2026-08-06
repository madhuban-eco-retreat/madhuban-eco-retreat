import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
const ROLE_RANK = { admin: 3, front_desk: 2, read_only: 1 };

/**
 * Resolves the signed-in user and whether they are authorised for the admin
 * panel, in one place.
 *
 * Authorisation used to be spelled out three different ways: the (authed)
 * layout accepted ANY authenticated Supabase user, assertAdmin() additionally
 * required an active user_profiles row or an exact ADMIN_EMAIL match, and the
 * invoice print page required the ADMIN_EMAIL match alone. A signed-in account
 * without a profile row therefore passed the layout and saw the whole panel,
 * while every route behind it answered 401 — which is exactly how invoice PDF,
 * Generate Invoice and Print Voucher came to fail together while the UI around
 * them looked fine.
 *
 * Returning the reason (rather than just null) lets the layout say which
 * account is signed in and why it was refused, instead of bouncing to a login
 * page that will succeed and then fail the same way.
 */
export async function resolveAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, authorized: false, reason: "signed_out" };

  const db = createAdminClient();
  const { data: profile } = await db
    .from("user_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (profile?.is_active) {
    return { user, profile, authorized: true, reason: null };
  }
  if (profile && !profile.is_active) {
    return { user, profile, authorized: false, reason: "deactivated" };
  }
  // Bootstrap path: the primary admin address works before anyone has been
  // provisioned, so a fresh install is not locked out of its own panel.
  if (user.email === ADMIN_EMAIL) {
    return { user, profile: null, authorized: true, reason: null };
  }
  return { user, profile: null, authorized: false, reason: "not_provisioned" };
}

/** The signed-in user when they may use the admin panel, otherwise null. */
export async function assertAdmin() {
  const { user, authorized } = await resolveAdminUser();
  return authorized ? user : null;
}

export async function assertRole(minRole) {
  const { user, profile, authorized } = await resolveAdminUser();
  if (!user || !authorized) return null;
  // The ADMIN_EMAIL bootstrap has no profile row; treat it as full admin so it
  // is not silently denied by a role gate it can never satisfy.
  const role = profile?.role ?? "admin";
  if ((ROLE_RANK[role] ?? 0) < ROLE_RANK[minRole]) return null;
  return { user, role };
}

export function can(role, action) {
    const perms = {
        manage_settings: ["admin"],
        manage_staff: ["admin"],
        cancel_booking: ["admin"],
        create_booking: ["admin", "front_desk"],
        edit_booking: ["admin", "front_desk"],
        view_booking: ["admin", "front_desk", "read_only"],
        view_audit_log: ["admin"],
        send_email: ["admin", "front_desk"],
    };
    return (perms[action] ?? []).includes(role);
}
