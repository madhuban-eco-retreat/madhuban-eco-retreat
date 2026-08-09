import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/admin/auth";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

/**
 * Backs the notification bell in the admin top bar.
 *
 * The bell, its unread dot, the dropdown and both mark-read actions were all
 * already built and polling this path every 30 seconds — the route itself was
 * never added, so every poll 404d, the client swallowed it, and the bell sat
 * permanently at zero while bookings piled up. Writes already happen: both
 * booking/create and verify-payment call createNotification().
 */

// Reads the session cookie and live rows; never cacheable.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  // Notifications are addressed to the shared admin inbox rather than per-user,
  // matching how createNotification writes them.
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, link_url, read_at, created_at")
    .eq("recipient_email", ADMIN_EMAIL)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (error) {
    console.error("[admin/notifications] list failed:", error);
    return NextResponse.json({ error: "Could not load notifications" }, { status: 500 });
  }

  const notifications = data ?? [];
  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((n) => !n.read_at).length,
  });
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

  const supabase = createAdminClient();
  const readAt = new Date().toISOString();

  if (body?.markAllRead === true) {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("recipient_email", ADMIN_EMAIL)
      .is("read_at", null);
    if (error) {
      console.error("[admin/notifications] mark all read failed:", error);
      return NextResponse.json({ error: "Could not update notifications" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (typeof body?.id !== "string" || !body.id) {
    return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("id", body.id)
    .eq("recipient_email", ADMIN_EMAIL);

  if (error) {
    console.error("[admin/notifications] mark read failed:", error);
    return NextResponse.json({ error: "Could not update notification" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
