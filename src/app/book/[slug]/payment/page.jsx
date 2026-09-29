import { createAdminClient } from "@/lib/supabase/admin";
import { PaymentClient } from "./payment-client";
import Link from "next/link";
import { stayPageForRoomSlug } from "@/lib/rooms/booking-links";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params, searchParams }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const ids = sp.ids ? sp.ids.split(",").filter(Boolean) : sp.id ? [sp.id] : [];

  if (ids.length === 0) {
    return <NotFound slug={slug} message="No booking ID provided." />;
  }

  const supabase = createAdminClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount, created_at,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name )
    `)
    .in("id", ids);

  if (!bookings || bookings.length !== ids.length) {
    return <NotFound slug={slug} message="Booking not found." />;
  }

  // Keep the original selection order, not whatever order the query returned.
  const ordered = ids.map((id) => bookings.find((b) => b.id === id));

  const statusMessages = {
    CONFIRMED: "This booking has already been confirmed and paid.",
    CANCELLED: "This booking has been cancelled.",
    CHECKED_IN: "This booking is checked in.",
    CHECKED_OUT: "This booking has checked out.",
    NO_SHOW: "This booking was marked as no-show.",
  };
  const notPending = ordered.find((b) => b.status !== "PENDING_PAYMENT");
  if (notPending) {
    const msg = statusMessages[notPending.status] ?? `Booking status: ${notPending.status}`;
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="mx-auto max-w-md text-center">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            {notPending.status === "CONFIRMED" ? "Payment Complete" : "Booking Status"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium text-charcoal">
            {notPending.status === "CONFIRMED" ? "You&apos;re all set!" : "Booking Update"}
          </h1>
          <p className="mt-4 font-body text-sm text-charcoal/70">{msg}</p>
          {notPending.status === "CONFIRMED" && (
            <Link href={`/book/confirmation?ref=${notPending.booking_ref}`} className="mt-6 inline-flex h-12 items-center rounded-lg bg-earth-brown px-6 font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90">
              View Confirmation
            </Link>
          )}
        </div>
      </div>
    );
  }

  const first = ordered[0];
  const guest = Array.isArray(first.guests) ? first.guests[0] : first.guests;
  const roomNames = ordered.map((b) => (Array.isArray(b.rooms) ? b.rooms[0]?.name : b.rooms?.name)).filter(Boolean);
  const totalAmount = ordered.reduce((s, b) => s + Number(b.total_amount), 0);
  const isGroup = ordered.length > 1;

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Booking steps" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-xs">
            <li className="text-muted-foreground">1. Your Details</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="text-muted-foreground">2. Review</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="font-semibold text-earth-brown">3. Payment</li>
          </ol>
        </nav>

        <div className="mb-8 text-center">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Step 3 of 3</p>
          <h1 className="font-display text-3xl font-medium text-charcoal md:text-4xl">Secure Payment</h1>
          <p className="mt-2 font-body text-sm text-charcoal/70">
            Complete your payment to confirm your stay{isGroup ? ` — ${roomNames.join(", ")}` : ` at ${roomNames[0] ?? "Madhuban Eco Retreat"}`}.
          </p>
        </div>

        <PaymentClient
          bookingId={first.id}
          bookingIds={isGroup ? ordered.map((b) => b.id) : undefined}
          roomSlug={slug}
          totalAmountRupees={totalAmount}
          guestName={guest?.name ?? ""}
          guestEmail={guest?.email ?? ""}
          guestMobile={guest?.mobile ?? ""}
          roomName={roomNames[0] ?? ""}
          bookingRef={isGroup ? ordered.map((b) => b.booking_ref).join(", ") : first.booking_ref}
        />
      </div>
    </div>
  );
}

function NotFound({ slug, message }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-body text-sm text-charcoal/70">{message}</p>
        <Link href={stayPageForRoomSlug(slug)} className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline">
          ← Back to room
        </Link>
      </div>
    </div>
  );
}
