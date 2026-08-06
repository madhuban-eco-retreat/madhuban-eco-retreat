import Link from "next/link";
import { Bell } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
import { Card, Badge } from "@/components/admin/ui";

export const metadata = { title: "Notifications — Madhuban Admin" };
// Always current: a notification list that can be served stale is worse than
// no list at all.
export const dynamic = "force-dynamic";

const TYPE_LABELS = {
  booking_created: "Booking",
  payment_received: "Payment",
  check_in_today: "Check-in",
  booking_cancelled: "Cancelled",
  lead_received: "Lead",
  newsletter_subscribed: "Newsletter",
  gallery_uploaded: "Gallery",
};

function fmtTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NotificationsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, link_url, read_at, created_at")
    .eq("recipient_email", ADMIN_EMAIL)
    .order("created_at", { ascending: false })
    .limit(100);

  const notifications = data ?? [];
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-charcoal">
          Notifications
        </h1>
        <p className="mt-1 font-body text-xs text-charcoal/50">
          {notifications.length} recent
          {unread > 0 ? ` · ${unread} unread` : ""}
        </p>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="mx-auto mb-3 h-8 w-8 text-charcoal/20" />
          <p className="font-body text-sm text-charcoal/50">
            Nothing yet. New bookings and payments will appear here.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-admin-card-border p-0">
          {notifications.map((n) => {
            const row = (
              <div
                className={`flex items-start gap-3 px-5 py-4 ${
                  !n.read_at ? "bg-gold-accent/5" : ""
                }`}
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    !n.read_at ? "bg-gold-accent" : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant={n.read_at ? "neutral" : "info"}>
                      {TYPE_LABELS[n.type] ?? n.type}
                    </Badge>
                    <span className="font-body text-[11px] text-charcoal/40">
                      {fmtTime(n.created_at)}
                    </span>
                    {!n.read_at && (
                      <span className="font-body text-[11px] font-semibold uppercase tracking-wider text-gold-accent">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm font-medium text-charcoal">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="font-body text-xs text-charcoal/60">{n.body}</p>
                  )}
                </div>
              </div>
            );

            return n.link_url ? (
              <Link
                key={n.id}
                href={n.link_url}
                className="block transition-colors hover:bg-warm-beige/20"
              >
                {row}
              </Link>
            ) : (
              <div key={n.id}>{row}</div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
