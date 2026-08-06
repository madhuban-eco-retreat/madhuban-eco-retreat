"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
export function ReviewClient({ slug }) {
    const router = useRouter();
    const [draft, setDraft] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    // Reading from sessionStorage (external system) and syncing to state.
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem("booking_draft");
            if (!raw) {
                router.replace(`/book/${slug}`);
                return;
            }
            const parsed = JSON.parse(raw);
            if (parsed.pricing.roomSlug !== slug) {
                router.replace(`/book/${slug}`);
                return;
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDraft(parsed);
        }
        catch {
            router.replace(`/book/${slug}`);
        }
    }, [slug, router]);
    const handleConfirm = async () => {
        if (!draft)
            return;
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/booking/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomSlug: draft.pricing.roomSlug,
                    checkIn: draft.pricing.checkIn,
                    checkOut: draft.pricing.checkOut,
                    adults: draft.pricing.adults,
                    children: draft.pricing.children,
                    guestName: draft.guest.name,
                    guestEmail: draft.guest.email,
                    guestPhone: draft.guest.phone,
                    specialRequests: draft.guest.specialRequests,
                    couponCode: draft.pricing.couponCode ?? undefined,
                }),
            });
            const data = (await res.json());
            if (!res.ok) {
                setError(data.error ?? "Could not create booking. Please try again.");
                setSubmitting(false);
                return;
            }
            sessionStorage.removeItem("booking_draft");
            router.push(`/book/${slug}/payment?id=${data.bookingId}`);
        }
        catch {
            setError("A network error occurred. Please try again.");
            setSubmitting(false);
        }
    };
    if (!draft) {
        return (<div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </div>);
    }
    const { guest, pricing } = draft;
    return (<div className="mx-auto max-w-2xl space-y-6">
      {/* Stay summary */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your Stay
        </h2>
        <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
          <dt className="text-muted-foreground">Room</dt>
          <dd className="font-medium text-charcoal">{pricing.roomName}</dd>
          <dt className="text-muted-foreground">Check-in</dt>
          <dd className="font-medium text-charcoal">
            {new Date(pricing.checkIn).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "long", year: "numeric",
        })}
          </dd>
          <dt className="text-muted-foreground">Check-out</dt>
          <dd className="font-medium text-charcoal">
            {new Date(pricing.checkOut).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "long", year: "numeric",
        })}
          </dd>
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="font-medium text-charcoal">
            {pricing.nights} night{pricing.nights > 1 ? "s" : ""}
          </dd>
          <dt className="text-muted-foreground">Guests</dt>
          <dd className="font-medium text-charcoal">
            {pricing.adults} adult{pricing.adults > 1 ? "s" : ""}
            {pricing.children > 0 &&
            `, ${pricing.children} child${pricing.children > 1 ? "ren" : ""}`}
          </dd>
        </dl>
      </section>

      {/* Guest details */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Guest Details
        </h2>
        <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium text-charcoal">{guest.name}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="break-all font-medium text-charcoal">{guest.email}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium text-charcoal">{guest.phone}</dd>
          {guest.specialRequests && (<>
              <dt className="text-muted-foreground">Requests</dt>
              <dd className="font-medium text-charcoal">{guest.specialRequests}</dd>
            </>)}
        </dl>
        <button type="button" onClick={() => router.back()} className="mt-4 font-body text-xs text-earth-brown underline-offset-4 hover:underline">
          Edit details
        </button>
      </section>

      {/* Price breakdown */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Price Breakdown
        </h2>
        <div className="space-y-2 font-body text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>
              &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights}{" "}
              night{pricing.nights > 1 ? "s" : ""}
            </span>
            <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
          </div>

          {pricing.discountAmount > 0 && (<div className="flex justify-between text-[var(--color-moss-green)]">
              <span>Coupon discount ({pricing.couponCode})</span>
              <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
            </div>)}

          {/* Tariffs are stored GST-inclusive, so the base and tax are
              back-calculated from the total. Showing all three lines makes the
              arithmetic checkable rather than asking the guest to trust a
              single "incl. GST" figure. */}
          <div className="flex justify-between border-t border-border pt-3 text-charcoal/70">
            <span>Base price (excl. GST)</span>
            <span>&#8377;{formatPrice(pricing.subtotalBeforeGst)}</span>
          </div>

          <div className="flex justify-between text-charcoal/70">
            <span>GST @ {pricing.gstRate}%</span>
            <span>+ &#8377;{formatPrice(pricing.gstAmount)}</span>
          </div>

          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-charcoal">
            <span>Total payable</span>
            <span>&#8377;{formatPrice(pricing.totalAmount)}</span>
          </div>

          <div className="mt-4 rounded-lg bg-warm-beige/40 p-4 text-xs text-charcoal/70">
            <p>
              <strong className="text-charcoal">Due now (full payment):</strong>{" "}
              &#8377;{formatPrice(pricing.totalAmount)}
            </p>
            <p className="mt-1">No balance due at check-in.</p>
          </div>
        </div>
      </section>

      {/* Cancellation policy — shown before the confirm button so the terms are
          on screen at the moment of commitment, not linked away from it. */}
      <section className="rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 p-6">
        <div className="mb-3 flex items-start gap-2">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <h2 className="font-body text-sm font-semibold text-charcoal">
            Cancellation Policy
          </h2>
        </div>
        <ul className="ml-1 list-disc space-y-1.5 pl-4 font-body text-xs text-charcoal/80">
          <li>More than 45 days before arrival: 10% cancellation charge</li>
          <li>Between 15 and 45 days before arrival: 50% cancellation charge</li>
          <li>Within 15 days of arrival / No Show: 100% cancellation charge</li>
          <li>
            Christmas, New Year, Holi, Diwali &amp; long weekend bookings:
            Non-refundable
          </li>
          <li>Group bookings (more than 3 rooms): Non-refundable</li>
        </ul>
        <p className="mt-3 font-body text-xs font-medium text-charcoal/80">
          Charges are calculated on the total booking value, not just the
          advance paid.
        </p>
      </section>

      {error && (<p className="rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
          {error}
        </p>)}

      <button type="button" onClick={() => void handleConfirm()} disabled={submitting} className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-base font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
        {submitting ? "Creating booking…" : "Confirm & Proceed to Payment"}
      </button>

      <p className="text-center font-body text-xs text-muted-foreground">
        By confirming, you agree to our{" "}
        <a href="/terms-and-condition" target="_blank" className="text-earth-brown underline-offset-4 hover:underline">
          Terms & Conditions
        </a>
        .
      </p>
    </div>);
}
