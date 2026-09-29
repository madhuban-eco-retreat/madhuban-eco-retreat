"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

/**
 * The booking(s) are already created by this point — checkout-form calls
 * /api/booking/create per room unit before navigating here, so this step is
 * display-only: show the guest what was created, then move to payment. A
 * single room goes to the existing single-booking payment page; more than
 * one goes to the same page with a comma-separated list of booking ids,
 * which pays for all of them through one combined Razorpay order.
 */
export function ReviewClient({ slug }) {
  const router = useRouter();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("booking_draft");
      if (!raw) {
        router.replace(`/book/${slug}`);
        return;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.bookings?.length) {
        router.replace(`/book/${slug}`);
        return;
      }
      setDraft(parsed);
    } catch {
      router.replace(`/book/${slug}`);
    }
  }, [slug, router]);

  const handleContinue = () => {
    if (!draft) return;
    sessionStorage.removeItem("booking_draft");
    const ids = draft.bookings.map((b) => b.bookingId);
    if (ids.length === 1) {
      router.push(`/book/${slug}/payment?id=${ids[0]}`);
    } else {
      router.push(`/book/${slug}/payment?ids=${ids.join(",")}`);
    }
  };

  if (!draft) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const { guest, checkIn, checkOut, mealPlan, bookings, totals } = draft;
  const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Stay summary */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your Stay</h2>
        <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
          <dt className="text-muted-foreground">Check-in</dt>
          <dd className="font-medium text-charcoal">{fmtDate(checkIn)}</dd>
          <dt className="text-muted-foreground">Check-out</dt>
          <dd className="font-medium text-charcoal">{fmtDate(checkOut)}</dd>
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="font-medium text-charcoal">{nights} night{nights > 1 ? "s" : ""}</dd>
          {mealPlan && (<>
            <dt className="text-muted-foreground">Meal plan</dt>
            <dd className="font-medium text-charcoal">{mealPlan}</dd>
          </>)}
        </dl>

        <h3 className="mt-5 mb-2 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Rooms</h3>
        <ul className="space-y-1.5 font-body text-sm">
          {bookings.map((b) => (
            <li key={b.bookingId} className="flex justify-between text-charcoal">
              <span>{b.roomName}</span>
              <span className="text-muted-foreground">{b.bookingRef}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Guest details */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">Guest Details</h2>
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
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">Price Breakdown</h2>
        <div className="space-y-2 font-body text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>Room rent</span>
            <span>&#8377;{formatPrice(totals.baseNightlyTotal)}</span>
          </div>
          {totals.mealSupplementTotal > 0 && (
            <div className="flex justify-between text-charcoal/70">
              <span>Meal plan</span>
              <span>&#8377;{formatPrice(totals.mealSupplementTotal)}</span>
            </div>
          )}
          {totals.extraGuestTotal > 0 && (
            <div className="flex justify-between text-charcoal/70">
              <span>Extra guests</span>
              <span>&#8377;{formatPrice(totals.extraGuestTotal)}</span>
            </div>
          )}
          {totals.multiNightDiscount > 0 && (
            <div className="flex justify-between text-success">
              <span>2+ nights discount</span>
              <span>−&#8377;{formatPrice(totals.multiNightDiscount)}</span>
            </div>
          )}
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-success">
              <span>Coupon discount</span>
              <span>−&#8377;{formatPrice(totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-charcoal/70">
            <span>Subtotal (excl. GST)</span>
            <span>&#8377;{formatPrice(totals.subtotalBeforeGst)}</span>
          </div>
          <div className="flex justify-between text-charcoal/70">
            <span>CGST</span>
            <span>+ &#8377;{formatPrice(totals.cgstAmount)}</span>
          </div>
          <div className="flex justify-between text-charcoal/70">
            <span>SGST</span>
            <span>+ &#8377;{formatPrice(totals.sgstAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-charcoal">
            <span>Total</span>
            <span>&#8377;{formatPrice(totals.totalAmount)}</span>
          </div>
          <div className="mt-4 rounded-lg bg-warm-beige/40 p-4 text-xs text-charcoal/70">
            <p><strong className="text-charcoal">Due now (full payment):</strong> &#8377;{formatPrice(totals.totalAmount)}</p>
            <p className="mt-1">No balance due at check-in.</p>
          </div>
        </div>
      </section>

      {/* Cancellation policy */}
      <section className="rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 p-6">
        <div className="mb-3 flex items-start gap-2">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <h2 className="font-body text-sm font-semibold text-charcoal">Cancellation Policy</h2>
        </div>
        <ul className="ml-1 list-disc space-y-1.5 pl-4 font-body text-xs text-charcoal/80">
          <li>7 days or less before arrival: 100% of the booking amount</li>
          <li>8 to 21 days before arrival: 20% cancellation charge</li>
          <li>Date changes within 7 days of arrival count as a cancellation</li>
          <li>Christmas, New Year &amp; long weekend bookings: Non-refundable</li>
          <li>Group bookings (more than 3 rooms): Non-refundable</li>
        </ul>
        <p className="mt-3 font-body text-xs font-medium text-charcoal/80">
          Charges are calculated on the total booking value, not just the advance paid. Cancellations are accepted only by email.
        </p>
      </section>

      <button type="button" onClick={handleContinue} className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-base font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
        Proceed to Payment
      </button>

      <p className="text-center font-body text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="/terms-and-condition" target="_blank" className="text-earth-brown underline-offset-4 hover:underline">Terms &amp; Conditions</a>.
      </p>
    </div>
  );
}
