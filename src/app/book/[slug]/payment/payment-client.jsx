"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { formatPrice } from "@/lib/utils";
import { stayPageForRoomSlug } from "@/lib/rooms/booking-links";

/**
 * `bookingIds` (plural, 2+) switches this to the combined-order flow: one
 * Razorpay order and one verification call cover every booking in the array.
 * Omit it (or pass a single-element array) for the original one-booking flow,
 * which is unchanged.
 */
export function PaymentClient({ bookingId, bookingIds, roomSlug, totalAmountRupees, guestName, guestEmail, guestMobile, bookingRef }) {
  const router = useRouter();
  const isGroup = Array.isArray(bookingIds) && bookingIds.length > 1;
  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const hasFetched = useRef(false);

  const isFree = Number(totalAmountRupees) <= 0;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void (async () => {
      try {
        if (isFree) {
          if (isGroup) {
            for (const id of bookingIds) {
              const res = await fetch("/api/booking/confirm-free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: id }),
              });
              const data = await res.json();
              if (!res.ok) {
                setOrderError(data.error ?? "Could not confirm booking.");
                setLoadingOrder(false);
                return;
              }
            }
            router.replace(`/book/confirmation?refs=${bookingRef}`);
            return;
          }
          const res = await fetch("/api/booking/confirm-free", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
          const data = await res.json();
          if (!res.ok) {
            setOrderError(data.error ?? "Could not confirm booking.");
            setLoadingOrder(false);
            return;
          }
          router.replace(`/book/confirmation?ref=${data.bookingRef}`);
          return;
        }

        const res = await fetch(isGroup ? "/api/booking/create-group-order" : "/api/booking/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isGroup ? { bookingIds } : { bookingId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setOrderError(data.error ?? "Could not prepare payment. Please try again.");
        } else {
          setOrderData(data);
        }
        setLoadingOrder(false);
      } catch {
        setOrderError("Network error. Please refresh and try again.");
        setLoadingOrder(false);
      }
    })();
  }, [bookingId, bookingIds, isGroup, isFree, router, bookingRef]);

  const handlePay = () => {
    if (!orderData || !scriptReady || typeof window.Razorpay === "undefined") return;
    setPayError("");
    setPaying(true);
    const rzp = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "Madhuban Eco Retreat",
      description: `Booking payment — ${bookingRef}`,
      prefill: { name: guestName, email: guestEmail, contact: guestMobile },
      theme: { color: "#6E6146" },
      modal: { ondismiss: () => setPaying(false) },
      handler: async (response) => {
        try {
          const verifyRes = await fetch(isGroup ? "/api/booking/verify-group-payment" : "/api/booking/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(isGroup ? { bookingIds } : { bookingId }),
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.ok && (verifyData.bookingRef || verifyData.bookingRefs)) {
            const refs = verifyData.bookingRefs ? verifyData.bookingRefs.join(",") : verifyData.bookingRef;
            router.push(isGroup ? `/book/confirmation?refs=${refs}` : `/book/confirmation?ref=${refs}`);
          } else {
            setPayError(verifyData.error ?? "Payment verification failed. Please contact us.");
            setPaying(false);
          }
        } catch {
          setPayError("Verification failed. Please contact us with your payment ID.");
          setPaying(false);
        }
      },
    });
    rzp.open();
  };

  if (loadingOrder) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-earth-brown border-t-transparent" />
          <p className="font-body text-sm text-muted-foreground">{isFree ? "Confirming your booking…" : "Preparing secure payment…"}</p>
        </div>
      </div>
    );
  }
  if (orderError) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="font-body text-sm text-red-600">{orderError}</p>
        <a href={stayPageForRoomSlug(roomSlug)} className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline">← Back to room</a>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-earth-brown/10">
              <svg className="h-7 w-7 text-earth-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Booking Confirmed — Payment Required</p>
            <div className="mt-2 rounded-lg border border-border bg-warm-beige/30 px-4 py-2">
              <p className="font-body text-xs text-muted-foreground">{isGroup ? "References" : "Reference"}</p>
              <p className="font-body text-lg font-semibold tracking-wider text-earth-brown">{bookingRef}</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-cream p-4">
            <div className="flex items-center justify-between font-body text-sm">
              <span className="text-charcoal/70">{isGroup ? "Total for all rooms" : "Total amount"}</span>
              <span className="text-xl font-semibold text-charcoal">₹{formatPrice(totalAmountRupees)}</span>
            </div>
            <p className="mt-2 font-body text-xs text-muted-foreground">Full payment collected now. No balance due at check-in.</p>
          </div>

          {payError && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">{payError}</p>}

          <p className="mb-3 text-center font-body text-xs text-charcoal/70">Cancellation policy applies · See details at checkout</p>

          <button onClick={handlePay} disabled={paying || !scriptReady || !orderData} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-earth-brown font-body text-base font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
            {paying ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent" />Processing…</>) : !scriptReady ? "Loading payment…" : `Pay ₹${formatPrice(totalAmountRupees)}`}
          </button>

          <ul className="mt-5 space-y-2 font-body text-xs text-charcoal/70" aria-label="Payment security and policies">
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
                <path d="M14.3 3l-4.4 8.2h3l-3.2 9.8L17.9 9.2h-3L18 3z" fill="#3395FF" />
              </svg>
              <span>Secured by Razorpay — UPI, Cards, Net Banking, Wallets</span>
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-earth-brown" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <rect x="4" y="10" width="16" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>PCI-DSS compliant · 256-bit TLS encryption</span>
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-earth-brown" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Cancellation policy applies · See details at checkout</span>
            </li>
          </ul>

          <div className="mt-4 border-t border-border pt-4">
            <a href={`https://wa.me/919770558419?text=${encodeURIComponent(`Hi, I have a booking at Madhuban Eco Retreat (ref: ${bookingRef}). Need help with payment.`)}`} target="_blank" rel="noopener noreferrer" className="block text-center font-body text-xs text-earth-brown underline-offset-4 hover:underline">
              Need help? WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
