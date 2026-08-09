"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { MAX_CHILDREN, MAX_INFANTS, EXTRA_ADULT_RATE, DEFAULT_ADULTS_INCLUDED, DEFAULT_MAX_ADULTS } from "@/lib/booking/occupancy";

/** "two" reads better than "2" in a sentence; anything unexpected falls back to the digit. */
const ADULT_WORDS = ["zero", "one", "two", "three", "four", "five", "six"];
function adultWord(n) {
    return ADULT_WORDS[n] ?? String(n);
}
const TRUST_BADGES = [
    "Best rate, guaranteed",
    "No booking fees, ever",
    "Cancellation policy applies · See details at checkout",
    "Instant confirmation by email",
];
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
function addDays(d, n) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + n);
    return dt.toISOString().slice(0, 10);
}
const INPUT_BASE = "w-full rounded-lg border bg-background px-3 py-2.5 font-body text-sm text-charcoal placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-earth-brown";
const INPUT_CLS = `${INPUT_BASE} border-border`;
const INPUT_ERR_CLS = `${INPUT_BASE} border-border border-b-2 border-b-red-500`;
const LABEL_CLS = "mb-1 block font-body text-xs font-medium text-charcoal";
const ERROR_CLS = "mt-1 font-body text-xs text-red-600";
const NOTE_CLS = "mt-2 font-body text-xs text-earth-brown/80";
const PHONE_RE = /^\d{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Enforced pause between coupon attempts, and the number of failures after
 * which the guest is nudged rather than left guessing.
 *
 * The server allows five wrong codes an hour; a guest who has already missed
 * three is far more likely to be reading a code wrong than to be one keystroke
 * from the right one, and is better off being told so before they are locked
 * out. The pause is short enough to feel like the form responding and long
 * enough that the field cannot be driven at machine speed.
 */
const COUPON_RETRY_DELAY_MS = 500;
const COUPON_WARN_AFTER_ATTEMPTS = 3;
export function CheckoutForm({ slug, roomId, roomName, defaultCheckIn, defaultCheckOut, defaultAdults, defaultChildren, minNights, adultsIncluded = DEFAULT_ADULTS_INCLUDED, maxAdults = DEFAULT_MAX_ADULTS, }) {
    const router = useRouter();
    const today = todayStr();
    // Booking params
    const [checkIn, setCheckIn] = useState(defaultCheckIn || today);
    const [checkOut, setCheckOut] = useState(defaultCheckOut || addDays(defaultCheckIn || today, Math.max(minNights, 1)));
    const [adults, setAdults] = useState(defaultAdults || adultsIncluded);
    const [children, setChildren] = useState(defaultChildren || 0);
    const [infants, setInfants] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    // Coupon attempt state. The code that is actually sent lives in a ref rather
    // than in the fetchPrice deps: changing dates must re-price the stay without
    // that counting as another go at the coupon. A rejected code is dropped from
    // the ref so the next re-price does not resend it and burn a second attempt.
    const activeCouponRef = useRef("");
    const [couponError, setCouponError] = useState("");
    const [couponFailCount, setCouponFailCount] = useState(0);
    const [couponCooling, setCouponCooling] = useState(false);
    const couponTimerRef = useRef(null);
    // Availability is resolved here, at step 1, rather than on submit at review:
    // finding out the dates are gone after filling in the whole form is the
    // worst possible moment to be told.
    const [availability, setAvailability] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    // Guest details
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    // Pricing state
    const [pricing, setPricing] = useState(null);
    const [pricingError, setPricingError] = useState("");
    const [loadingPrice, setLoadingPrice] = useState(false);
    // Form errors
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    // Mobile sticky-bar expanded breakdown panel (only used on <lg viewports)
    const [mobilePriceExpanded, setMobilePriceExpanded] = useState(false);
    const fetchPrice = useCallback(async (couponOverride) => {
        if (!checkIn || !checkOut || checkOut <= checkIn)
            return;
        const code = couponOverride !== undefined ? couponOverride : activeCouponRef.current;
        setLoadingPrice(true);
        setPricingError("");
        try {
            const res = await fetch("/api/booking/calculate-price", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomSlug: slug,
                    checkIn,
                    checkOut,
                    adults,
                    children,
                    infants,
                    couponCode: code || undefined,
                }),
            });
            const data = (await res.json());
            if (!res.ok) {
                // A coupon-throttle 429 says nothing about the stay itself, so the
                // quote already on screen is kept and the message is shown against
                // the coupon field rather than blanking the whole summary.
                if (res.status === 429 && code) {
                    activeCouponRef.current = "";
                    setCouponError(data.error ?? "Too many coupon attempts. Please try again later.");
                }
                else {
                    setPricingError(data.error ?? "Could not calculate price");
                    setPricing(null);
                }
            }
            else {
                setPricing(data);
                if (data.couponError) {
                    activeCouponRef.current = "";
                    setCouponError(data.couponError);
                    setCouponFailCount((n) => n + 1);
                    setCouponCooling(true);
                    if (couponTimerRef.current)
                        clearTimeout(couponTimerRef.current);
                    couponTimerRef.current = setTimeout(() => setCouponCooling(false), COUPON_RETRY_DELAY_MS);
                }
                else if (code) {
                    setCouponError("");
                }
            }
        }
        catch {
            setPricingError("Could not calculate price. Please try again.");
        }
        finally {
            setLoadingPrice(false);
        }
    }, [slug, checkIn, checkOut, adults, children, infants]);
    // Fetch price on mount and when booking params change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void fetchPrice(); }, [fetchPrice]);
    // Clear a pending retry timer so it cannot fire against an unmounted form.
    useEffect(() => () => {
        if (couponTimerRef.current)
            clearTimeout(couponTimerRef.current);
    }, []);
    const applyCoupon = useCallback(() => {
        const code = couponCode.trim().toUpperCase();
        if (!code || couponCooling || loadingPrice)
            return;
        activeCouponRef.current = code;
        void fetchPrice(code);
    }, [couponCode, couponCooling, loadingPrice, fetchPrice]);
    // Availability lookup, re-run whenever the date range changes. A failed
    // request leaves availability null rather than false — the booking API
    // re-checks authoritatively before taking money, so a network blip here
    // must not block an otherwise valid booking.
    useEffect(() => {
        if (!roomId || !checkIn || !checkOut || checkOut <= checkIn) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAvailability(null);
            return;
        }
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCheckingAvailability(true);
        void (async () => {
            try {
                const res = await fetch("/api/booking/check-availability", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId, checkIn, checkOut }),
                });
                const data = await res.json();
                if (cancelled)
                    return;
                setAvailability(res.ok ? data : null);
            }
            catch {
                if (!cancelled)
                    setAvailability(null);
            }
            finally {
                if (!cancelled)
                    setCheckingAvailability(false);
            }
        })();
        return () => { cancelled = true; };
    }, [roomId, checkIn, checkOut]);
    // If the review step bounced back with a 409, show that reason immediately
    // rather than waiting for the re-check to catch up.
    useEffect(() => {
        try {
            const bounced = sessionStorage.getItem("booking_unavailable");
            if (bounced) {
                sessionStorage.removeItem("booking_unavailable");
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAvailability({ available: false, reason: bounced });
            }
        }
        catch { /* sessionStorage unavailable — the re-check still covers it */ }
    }, []);
    const datesUnavailable = availability?.available === false;
    // Field-level validators — return error string or empty for "valid"
    const validateName = (v) => (v.trim() ? "" : "Name is required");
    const validateEmail = (v) => !v.trim() || !EMAIL_RE.test(v.trim()) ? "Enter a valid email address" : "";
    const validatePhone = (v) => {
        const digits = v.replace(/\D/g, "");
        return PHONE_RE.test(digits)
            ? ""
            : "Enter a 10-digit mobile number (or include country code)";
    };
    const validateDates = (ci, co) => {
        if (!ci || !co)
            return "Select both dates";
        if (co <= ci)
            return "Check-out must be after check-in";
        const n = Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
        if (n < minNights)
            return `Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`;
        return "";
    };
    const setFieldError = (key, value) => setErrors((prev) => {
        const next = { ...prev };
        if (value)
            next[key] = value;
        else
            delete next[key];
        return next;
    });
    const clearFieldError = (key) => {
        if (errors[key])
            setFieldError(key, "");
    };
    const validate = () => {
        const e = {};
        const nameErr = validateName(guestName);
        const emailErr = validateEmail(guestEmail);
        const phoneErr = validatePhone(guestPhone);
        const dateErr = validateDates(checkIn, checkOut);
        if (nameErr)
            e.guestName = nameErr;
        if (emailErr)
            e.guestEmail = emailErr;
        if (phoneErr)
            e.guestPhone = phoneErr;
        if (dateErr)
            e.checkOut = dateErr;
        if (!pricing)
            e.pricing = "Please wait for price calculation";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Belt and braces: the button is disabled in this state, but a stray
        // Enter keypress must not push an unbookable stay into review either.
        if (datesUnavailable)
            return;
        if (!validate() || !pricing)
            return;
        setSubmitting(true);
        const guest = {
            name: guestName.trim(),
            email: guestEmail.trim(),
            phone: guestPhone.trim(),
            specialRequests: specialRequests.trim() || undefined,
        };
        // Save draft to sessionStorage, then redirect to review
        const draft = { guest, pricing };
        try {
            sessionStorage.setItem("booking_draft", JSON.stringify(draft));
            router.push(`/book/${slug}/review`);
        }
        catch {
            setErrors({ submit: "Could not save booking. Please try again." });
            setSubmitting(false);
        }
    };
    const nights = checkIn && checkOut && checkOut > checkIn
        ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
        : 0;
    return (<form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-8 pb-36 lg:grid-cols-[1fr_360px] lg:pb-0">
        {/* ── Left column: details form ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Stay dates */}
          <fieldset className="rounded-xl border border-border p-6">
            <legend className="px-1 font-body text-sm font-semibold text-charcoal">
              Your Stay
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className={LABEL_CLS}>
                  Check-in
                </label>
                <input id="checkIn" type="date" value={checkIn} min={today} onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value >= checkOut)
                setCheckOut(addDays(e.target.value, Math.max(minNights, 1)));
            clearFieldError("checkOut");
        }} onBlur={(e) => setFieldError("checkOut", validateDates(e.target.value, checkOut))} className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS} required/>
              </div>
              <div>
                <label htmlFor="checkOut" className={LABEL_CLS}>
                  Check-out
                </label>
                <input id="checkOut" type="date" value={checkOut} min={checkIn ? addDays(checkIn, minNights) : today} onChange={(e) => {
            setCheckOut(e.target.value);
            clearFieldError("checkOut");
        }} onBlur={(e) => setFieldError("checkOut", validateDates(checkIn, e.target.value))} className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS} required/>
                {errors.checkOut && <p className={ERROR_CLS}>{errors.checkOut}</p>}
              </div>
            </div>

            {/* Availability verdict sits directly under the dates it refers to */}
            {checkingAvailability && (<p className="mt-3 font-body text-xs text-muted-foreground">
                Checking availability…
              </p>)}

            {datesUnavailable && (<p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 font-body text-xs font-medium text-red-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <span>
                  {availability?.reason ?? "These dates are not available."}
                </span>
              </p>)}

            {!checkingAvailability && availability?.available === true && (<p className="mt-3 flex items-center gap-1.5 font-body text-xs font-medium text-[var(--color-moss-green)]">
                <Check className="h-3.5 w-3.5" aria-hidden="true"/>
                These dates are available.
              </p>)}

            {minNights > 1 && (<p className={NOTE_CLS}>
                Minimum stay: {minNights} nights for this room.
              </p>)}

            {/* The surcharge is spelled out in each option rather than surfacing
                as an unexplained jump in the total. Where it starts depends on
                the room: most include two adults, the Pool Side Villa four. */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="adults" className={LABEL_CLS}>
                  Adults
                </label>
                <select id="adults" value={adults} onChange={(e) => setAdults(Number(e.target.value))} className={INPUT_CLS}>
                  {Array.from({ length: maxAdults }, (_, i) => i + 1).map((n) => {
            const extra = Math.max(0, n - adultsIncluded);
            return (<option key={n} value={n}>
                        {n} adult{n > 1 ? "s" : ""}
                        {n === adultsIncluded ? " (included in base price)" : ""}
                        {extra > 0
                    ? ` (+₹${(EXTRA_ADULT_RATE * extra).toLocaleString("en-IN")}/night)`
                    : ""}
                      </option>);
        })}
                </select>
              </div>

              <div>
                <label htmlFor="children" className={LABEL_CLS}>
                  Children <span className="font-normal text-muted-foreground">(5–12 yrs)</span>
                </label>
                <select id="children" value={children} onChange={(e) => setChildren(Number(e.target.value))} className={INPUT_CLS}>
                  {Array.from({ length: MAX_CHILDREN + 1 }, (_, i) => i).map((n) => (<option key={n} value={n}>
                      {n === 0
                    ? "No children"
                    : `${n} child${n > 1 ? "ren" : ""} (+₹${(1500 * n).toLocaleString("en-IN")}/night)`}
                    </option>))}
                </select>
              </div>

              <div>
                <label htmlFor="infants" className={LABEL_CLS}>
                  Infants <span className="font-normal text-muted-foreground">(under 5)</span>
                </label>
                <select id="infants" value={infants} onChange={(e) => setInfants(Number(e.target.value))} className={INPUT_CLS}>
                  {Array.from({ length: MAX_INFANTS + 1 }, (_, i) => i).map((n) => (<option key={n} value={n}>
                      {n === 0 ? "No infants" : `${n} infant${n > 1 ? "s" : ""} (Free)`}
                    </option>))}
                </select>
              </div>
            </div>

            <p className={NOTE_CLS}>
              Rate covers {adultWord(adultsIncluded)} adults. Extra adult
              ₹{EXTRA_ADULT_RATE.toLocaleString("en-IN")}/night and child (5–12)
              ₹1,500/night, plus GST. Infants stay free.
            </p>
          </fieldset>

          {/* Guest details */}
          <fieldset className="rounded-xl border border-border p-6">
            <legend className="px-1 font-body text-sm font-semibold text-charcoal">
              Guest Details
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="guestName" className={LABEL_CLS}>
                  Full name
                </label>
                <input id="guestName" type="text" autoComplete="name" value={guestName} onChange={(e) => {
            setGuestName(e.target.value);
            clearFieldError("guestName");
        }} onBlur={(e) => setFieldError("guestName", validateName(e.target.value))} placeholder="Your full name" className={errors.guestName ? INPUT_ERR_CLS : INPUT_CLS} required/>
                {errors.guestName && <p className={ERROR_CLS}>{errors.guestName}</p>}
              </div>
              <div>
                <label htmlFor="guestEmail" className={LABEL_CLS}>
                  Email
                </label>
                <input id="guestEmail" type="email" autoComplete="email" value={guestEmail} onChange={(e) => {
            setGuestEmail(e.target.value);
            clearFieldError("guestEmail");
        }} onBlur={(e) => setFieldError("guestEmail", validateEmail(e.target.value))} placeholder="you@example.com" className={errors.guestEmail ? INPUT_ERR_CLS : INPUT_CLS} required/>
                {errors.guestEmail && <p className={ERROR_CLS}>{errors.guestEmail}</p>}
              </div>
              <div>
                <label htmlFor="guestPhone" className={LABEL_CLS}>
                  Mobile number
                </label>
                <input id="guestPhone" type="tel" autoComplete="tel" value={guestPhone} onChange={(e) => {
            setGuestPhone(e.target.value);
            clearFieldError("guestPhone");
        }} onBlur={(e) => setFieldError("guestPhone", validatePhone(e.target.value))} placeholder="+91 98765 43210" className={errors.guestPhone ? INPUT_ERR_CLS : INPUT_CLS} required/>
                {errors.guestPhone && <p className={ERROR_CLS}>{errors.guestPhone}</p>}
              </div>
              <div>
                <label htmlFor="specialRequests" className={LABEL_CLS}>
                  Special requests{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea id="specialRequests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} maxLength={2000} placeholder="Dietary needs, accessibility requirements, celebrating a special occasion..." className={INPUT_CLS}/>
              </div>
            </div>
          </fieldset>

          {/* Coupon */}
          <div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="couponCode" className={LABEL_CLS}>
                  Coupon code
                </label>
                <input id="couponCode" type="text" value={couponCode} onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            setCouponError("");
        }} onKeyDown={(e) => {
            // Enter inside the coupon field must apply the code, not submit
            // the booking form and skip straight to review.
            if (e.key === "Enter") {
                e.preventDefault();
                applyCoupon();
            }
        }} placeholder="FOREST20" aria-invalid={couponError ? true : undefined} aria-describedby={couponError ? "couponError" : undefined} className={couponError ? INPUT_ERR_CLS : INPUT_CLS}/>
              </div>
              <div className="flex items-end">
                <button type="button" onClick={applyCoupon} disabled={couponCooling || loadingPrice || !couponCode.trim()} className="h-[42px] rounded-lg border border-earth-brown px-4 font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown">
                  Apply
                </button>
              </div>
            </div>

            {couponError && (<p id="couponError" role="alert" className={ERROR_CLS}>
                {couponError}
              </p>)}

            {couponFailCount >= COUPON_WARN_AFTER_ATTEMPTS && (<p className="mt-1 font-body text-xs font-medium text-earth-brown">
                Please double-check your coupon code
              </p>)}

            {pricing?.couponCode && !couponError && (<p className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-[var(--color-moss-green)]">
                <Check className="h-3.5 w-3.5" aria-hidden="true"/>
                Coupon {pricing.couponCode} applied.
              </p>)}
          </div>

          {/* Why book direct? — trust block above Continue (BOOKING audit) */}
          <aside aria-label="Why book direct" className="rounded-xl border border-earth-brown/10 bg-warm-beige p-5">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-earth-brown/80">
              Why book direct?
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-4">
              {TRUST_BADGES.map((badge) => (<li key={badge} className="flex items-start gap-2 font-body text-sm font-medium text-earth-brown">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-earth-brown" aria-hidden="true"/>
                  <span>{badge}</span>
                </li>))}
            </ul>
          </aside>
        </div>

        {/* ── Right column: price summary (desktop only) ────────────── */}
        <div className="hidden space-y-4 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-medium text-charcoal">
              Price Summary
            </h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              {roomName}
            </p>

            {loadingPrice ? (<div className="mt-6 space-y-2">
                {[1, 2, 3].map((i) => (<div key={i} className="h-4 animate-pulse rounded bg-warm-beige/60"/>))}
              </div>) : pricingError ? (<p className="mt-4 font-body text-sm text-red-600">{pricingError}</p>) : pricing ? (<div className="mt-6 space-y-3 font-body text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>
                    &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights} night
                    {pricing.nights > 1 ? "s" : ""}
                  </span>
                  <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
                </div>

                {pricing.extraGuestLines?.map((line) => (<div key={line.key} className="flex justify-between text-charcoal/70">
                    <span>
                      {line.label} × {line.qty}
                    </span>
                    <span>&#8377;{formatPrice(line.amount)}</span>
                  </div>))}

                {pricing.discountAmount > 0 && (<div className="flex justify-between text-moss-green">
                    <span>Coupon ({pricing.couponCode})</span>
                    <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
                  </div>)}

                {/* CGST and SGST are shown as separate lines because that is
                    what the supply is actually taxed as — a single "GST 18%"
                    line cannot be reconciled against an invoice. */}
                <div className="flex justify-between text-charcoal/70">
                  <span>CGST ({pricing.cgstRate}%)</span>
                  <span>&#8377;{formatPrice(pricing.cgstAmount)}</span>
                </div>

                <div className="flex justify-between text-charcoal/70">
                  <span>SGST ({pricing.sgstRate}%)</span>
                  <span>&#8377;{formatPrice(pricing.sgstAmount)}</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-semibold text-charcoal">
                    <span>Total</span>
                    <span>&#8377;{formatPrice(pricing.totalAmount)}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-warm-beige/40 p-3 text-xs text-charcoal/70">
                  <p>
                    <strong className="text-charcoal">Due now (full payment):</strong>{" "}
                    &#8377;{formatPrice(pricing.totalAmount)}
                  </p>
                  <p className="mt-1">No balance due at check-in.</p>
                </div>
              </div>) : nights > 0 ? (<p className="mt-4 font-body text-sm text-muted-foreground">
                Calculating...
              </p>) : (<p className="mt-4 font-body text-sm text-muted-foreground">
                Select dates to see pricing.
              </p>)}

            {errors.pricing && (<p className={`mt-2 ${ERROR_CLS}`}>{errors.pricing}</p>)}
            {errors.submit && (<p className={`mt-2 ${ERROR_CLS}`}>{errors.submit}</p>)}

            <button type="submit" disabled={submitting || loadingPrice || !pricing || datesUnavailable} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
              {submitting ? "Please wait…" : "Continue to Review"}
            </button>

            <p className="mt-3 text-center font-body text-xs text-muted-foreground">
              No payment charged yet. Review on the next step.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar: Continue + collapsible price ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-ivory shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {/* Expanded breakdown panel (above the compact row) */}
        {mobilePriceExpanded && pricing && (<div id="mobile-price-breakdown" className="border-b border-border bg-warm-beige/40 px-4 py-3">
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between text-charcoal/70">
                <span>
                  &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights}{" "}
                  night{pricing.nights > 1 ? "s" : ""}
                </span>
                <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
              </div>
              {pricing.extraGuestLines?.map((line) => (<div key={line.key} className="flex justify-between text-charcoal/70">
                  <span>{line.label} × {line.qty}</span>
                  <span>&#8377;{formatPrice(line.amount)}</span>
                </div>))}
              {pricing.discountAmount > 0 && (<div className="flex justify-between text-moss-green">
                  <span>Coupon ({pricing.couponCode})</span>
                  <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
                </div>)}
              <div className="flex justify-between text-charcoal/70">
                <span>CGST ({pricing.cgstRate}%)</span>
                <span>&#8377;{formatPrice(pricing.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>SGST ({pricing.sgstRate}%)</span>
                <span>&#8377;{formatPrice(pricing.sgstAmount)}</span>
              </div>
              <p className="pt-1 text-xs text-charcoal/60">
                Full payment now. No balance at check-in.
              </p>
            </div>
          </div>)}

        {/* Compact row: Continue on top, tappable total below */}
        <div className="space-y-2 px-4 py-3">
          <button type="submit" disabled={submitting || loadingPrice || !pricing || datesUnavailable} className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
            {submitting ? "Please wait…" : "Continue to Review"}
          </button>

          <button type="button" onClick={() => setMobilePriceExpanded((v) => !v)} aria-expanded={mobilePriceExpanded} aria-controls="mobile-price-breakdown" disabled={!pricing} className="flex w-full items-center justify-between rounded-lg px-1 py-1 font-body text-sm text-charcoal disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown">
            <span className="flex items-center gap-1.5 text-charcoal/70">
              Total
              <ChevronDown className={`h-4 w-4 transition-transform ${mobilePriceExpanded ? "rotate-180" : ""}`} aria-hidden="true"/>
            </span>
            <span className="font-semibold text-charcoal">
              {loadingPrice
            ? "Calculating…"
            : pricing
                ? `₹${formatPrice(pricing.totalAmount)}`
                : "—"}
            </span>
          </button>
        </div>
      </div>
    </form>);
}
