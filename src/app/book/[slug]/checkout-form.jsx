"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  MAX_CHILDREN,
  MAX_INFANTS,
  DEFAULT_ADULTS_INCLUDED,
  DEFAULT_MAX_ADULTS,
  adultsIncludedFor,
  maxAdultsFor,
} from "@/lib/booking/occupancy";
import { MEAL_PLANS, MEAL_PLAN_CODES, DEFAULT_MEAL_PLAN } from "@/lib/pricing/config.mjs";
import { hasTariff, formatInr } from "@/lib/pricing/rate-card.mjs";

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
function newLineId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
}
const INPUT_BASE = "w-full rounded-lg border bg-background px-3 py-2.5 font-body text-sm text-charcoal placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-earth-brown";
const INPUT_CLS = `${INPUT_BASE} border-border`;
const INPUT_ERR_CLS = `${INPUT_BASE} border-border border-b-2 border-b-red-500`;
const LABEL_CLS = "mb-1 block font-body text-xs font-medium text-charcoal";
const ERROR_CLS = "mt-1 font-body text-xs text-red-600";
const NOTE_CLS = "mt-2 font-body text-xs text-earth-brown/80";
const PHONE_RE = /^\d{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUPON_RETRY_DELAY_MS = 500;
const COUPON_WARN_AFTER_ATTEMPTS = 3;

/** A fresh room line, defaulted for `room` (one entry from `allRooms`). */
function makeLine(room) {
  const included = adultsIncludedFor(room.slug);
  return {
    id: newLineId(),
    roomId: room.id,
    roomSlug: room.slug,
    roomName: room.name,
    minNights: room.min_nights ?? 1,
    inventoryCount: Math.max(room.inventory_count ?? 1, 1),
    adults: included,
    children: 0,
    infants: 0,
    quantity: 1,
    pricing: null,
    pricingError: "",
    loadingPrice: false,
    availability: null,
  };
}

export function CheckoutForm({
  slug,
  roomId,
  roomName,
  defaultCheckIn,
  defaultCheckOut,
  defaultAdults,
  defaultChildren,
  minNights,
  adultsIncluded = DEFAULT_ADULTS_INCLUDED,
  maxAdults = DEFAULT_MAX_ADULTS,
  allRooms = [],
}) {
  const router = useRouter();
  const today = todayStr();

  const [checkIn, setCheckIn] = useState(defaultCheckIn || today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut || addDays(defaultCheckIn || today, Math.max(minNights, 1)));

  const initialRoom = useMemo(
    () => allRooms.find((r) => r.slug === slug) ?? { id: roomId, slug, name: roomName, min_nights: minNights, inventory_count: 1 },
    [allRooms, slug, roomId, roomName, minNights],
  );
  const [lines, setLines] = useState(() => [
    { ...makeLine(initialRoom), adults: defaultAdults || adultsIncluded, children: defaultChildren || 0 },
  ]);

  // Default to AP (all three meals) rather than the site-wide DEFAULT_MEAL_PLAN
  // (MAP) — scoped to just this guest-facing selector so admin defaults and
  // pricing fallbacks elsewhere are untouched.
  const [mealPlan, setMealPlan] = useState("AP");
  const [couponCode, setCouponCode] = useState("");
  const activeCouponRef = useRef("");
  const [couponError, setCouponError] = useState("");
  const [couponFailCount, setCouponFailCount] = useState(0);
  const [couponCooling, setCouponCooling] = useState(false);
  const couponTimerRef = useRef(null);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mobilePriceExpanded, setMobilePriceExpanded] = useState(false);

  const totalUnits = lines.reduce((s, l) => s + l.quantity, 0);
  const isMultiRoom = lines.length > 1 || totalUnits > 1;
  // A coupon is one line item in calculate-price and discounts one room's rent.
  // Applying it identically to every unit of a multi-room order would over-
  // discount, so coupons are scoped to the simple, single-unit case for now.
  const couponAllowed = !isMultiRoom;

  const updateLine = (id, patch) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const addLine = () => {
    const fallback = allRooms[0] ?? initialRoom;
    setLines((prev) => [...prev, makeLine(fallback)]);
  };
  const removeLine = (id) => {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  };

  const nights = checkIn && checkOut && checkOut > checkIn
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

  // Fetch price + availability for one line. Each line is priced for ONE unit;
  // the line's total is the per-unit figure x quantity, since every unit of
  // the same room type on the same dates is priced identically.
  const fetchLinePrice = useCallback(async (line, couponOverride) => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    const code = couponAllowed ? (couponOverride !== undefined ? couponOverride : activeCouponRef.current) : "";
    updateLine(line.id, { loadingPrice: true, pricingError: "" });
    try {
      const [priceRes, availRes] = await Promise.all([
        fetch("/api/booking/calculate-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomSlug: line.roomSlug,
            checkIn,
            checkOut,
            adults: line.adults,
            children: line.children,
            infants: line.infants,
            mealPlan: hasTariff(line.roomSlug) ? mealPlan : undefined,
            couponCode: code || undefined,
          }),
        }),
        fetch("/api/booking/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: line.roomId, checkIn, checkOut, units: line.quantity }),
        }),
      ]);
      const priceData = await priceRes.json();
      const availData = availRes.ok ? await availRes.json() : null;
      if (!priceRes.ok) {
        updateLine(line.id, { pricingError: priceData.error ?? "Could not calculate price", pricing: null, loadingPrice: false, availability: availData });
        return;
      }
      if (priceData.couponError) {
        activeCouponRef.current = "";
        setCouponError(priceData.couponError);
        setCouponFailCount((n) => n + 1);
        setCouponCooling(true);
        if (couponTimerRef.current) clearTimeout(couponTimerRef.current);
        couponTimerRef.current = setTimeout(() => setCouponCooling(false), COUPON_RETRY_DELAY_MS);
      } else if (code) {
        setCouponError("");
      }
      updateLine(line.id, { pricing: priceData, pricingError: "", loadingPrice: false, availability: availData });
    } catch {
      updateLine(line.id, { pricingError: "Could not calculate price. Please try again.", pricing: null, loadingPrice: false });
    }
  }, [checkIn, checkOut, mealPlan, couponAllowed]);

  // Re-price every line when shared inputs (dates, meal plan) or the number of
  // lines changes; a line's own inputs (adults/children/quantity) re-price
  // just that one line through repriceLine below.
  useEffect(() => {
    lines.forEach((l) => void fetchLinePrice(l));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, mealPlan, lines.length]);

  useEffect(() => () => {
    if (couponTimerRef.current) clearTimeout(couponTimerRef.current);
  }, []);

  const repriceLine = (id) => {
    const line = lines.find((l) => l.id === id);
    if (line) void fetchLinePrice(line);
  };

  const applyCoupon = useCallback(() => {
    if (!couponAllowed) return;
    const code = couponCode.trim().toUpperCase();
    if (!code || couponCooling || lines.some((l) => l.loadingPrice)) return;
    activeCouponRef.current = code;
    lines.forEach((l) => void fetchLinePrice(l, code));
  }, [couponAllowed, couponCode, couponCooling, lines, fetchLinePrice]);

  const datesUnavailable = lines.some((l) => l.availability?.available === false);
  const anyChecking = lines.some((l) => l.loadingPrice);
  const allPriced = lines.every((l) => l.pricing);

  // Combined totals across every line, each multiplied by its quantity.
  const totals = useMemo(() => {
    const sum = (pick) => lines.reduce((s, l) => s + (l.pricing ? pick(l.pricing) * l.quantity : 0), 0);
    return {
      baseNightlyTotal: sum((p) => p.baseNightlyTotal),
      mealSupplementTotal: sum((p) => p.mealSupplementTotal ?? 0),
      extraGuestTotal: sum((p) => p.extraGuestTotal),
      multiNightDiscount: sum((p) => p.multiNightDiscount),
      discountAmount: sum((p) => p.discountAmount),
      subtotalBeforeGst: sum((p) => p.subtotalBeforeGst),
      cgstAmount: sum((p) => p.cgstAmount),
      sgstAmount: sum((p) => p.sgstAmount),
      totalAmount: sum((p) => p.totalAmount),
    };
  }, [lines]);

  const validateName = (v) => (v.trim() ? "" : "Name is required");
  const validateEmail = (v) => !v.trim() || !EMAIL_RE.test(v.trim()) ? "Enter a valid email address" : "";
  const validatePhone = (v) => {
    const digits = v.replace(/\D/g, "");
    return PHONE_RE.test(digits) ? "" : "Enter a 10-digit mobile number (or include country code)";
  };
  const validateDates = (ci, co) => {
    if (!ci || !co) return "Select both dates";
    if (co <= ci) return "Check-out must be after check-in";
    const n = Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
    const need = Math.max(...lines.map((l) => l.minNights), 1);
    if (n < need) return `Minimum stay is ${need} night${need > 1 ? "s" : ""}`;
    return "";
  };
  const setFieldError = (key, value) => setErrors((prev) => {
    const next = { ...prev };
    if (value) next[key] = value; else delete next[key];
    return next;
  });
  const clearFieldError = (key) => { if (errors[key]) setFieldError(key, ""); };

  const validate = () => {
    const e = {};
    const nameErr = validateName(guestName);
    const emailErr = validateEmail(guestEmail);
    const phoneErr = validatePhone(guestPhone);
    const dateErr = validateDates(checkIn, checkOut);
    if (nameErr) e.guestName = nameErr;
    if (emailErr) e.guestEmail = emailErr;
    if (phoneErr) e.guestPhone = phoneErr;
    if (dateErr) e.checkOut = dateErr;
    if (!allPriced) e.pricing = "Please wait for price calculation";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (datesUnavailable) return;
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    const guest = {
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      specialRequests: specialRequests.trim() || undefined,
    };
    try {
      // One /api/booking/create call per unit across every line — a booking
      // row is one unit, exactly like the single-room flow, just looped.
      const created = [];
      for (const line of lines) {
        for (let i = 0; i < line.quantity; i += 1) {
          const res = await fetch("/api/booking/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomSlug: line.roomSlug,
              checkIn,
              checkOut,
              adults: line.adults,
              children: line.children,
              infants: line.infants,
              mealPlan: hasTariff(line.roomSlug) ? mealPlan : undefined,
              guestName: guest.name,
              guestEmail: guest.email,
              guestPhone: guest.phone,
              specialRequests: guest.specialRequests,
              couponCode: couponAllowed && created.length === 0 ? (line.pricing?.couponCode ?? undefined) : undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setSubmitError(`${line.roomName}: ${data.error ?? "Could not create booking"}`);
            setSubmitting(false);
            return;
          }
          created.push({ bookingId: data.bookingId, bookingRef: data.referenceNumber, roomName: line.roomName });
        }
      }
      const draft = { guest, checkIn, checkOut, mealPlan, bookings: created, totals };
      sessionStorage.setItem("booking_draft", JSON.stringify(draft));
      router.push(`/book/${slug}/review`);
    } catch {
      setSubmitError("Could not save booking. Please try again.");
      setSubmitting(false);
    }
  };

  return (<form onSubmit={handleSubmit} noValidate>
    <div className="grid grid-cols-1 gap-8 pb-36 lg:grid-cols-[1fr_360px] lg:pb-0">
      <div className="space-y-6">
        {/* Stay dates — shared across every room line */}
        <fieldset className="rounded-xl border border-border p-6">
          <legend className="px-1 font-body text-sm font-semibold text-charcoal">Your Stay</legend>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkIn" className={LABEL_CLS}>Check-in</label>
              <input id="checkIn" type="date" value={checkIn} min={today} onChange={(e) => {
                setCheckIn(e.target.value);
                if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, Math.max(minNights, 1)));
                clearFieldError("checkOut");
              }} onBlur={(e) => setFieldError("checkOut", validateDates(e.target.value, checkOut))} className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS} required/>
            </div>
            <div>
              <label htmlFor="checkOut" className={LABEL_CLS}>Check-out</label>
              <input id="checkOut" type="date" value={checkOut} min={checkIn ? addDays(checkIn, minNights) : today} onChange={(e) => {
                setCheckOut(e.target.value);
                clearFieldError("checkOut");
              }} onBlur={(e) => setFieldError("checkOut", validateDates(checkIn, e.target.value))} className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS} required/>
              {errors.checkOut && <p className={ERROR_CLS}>{errors.checkOut}</p>}
            </div>
          </div>
        </fieldset>

        {/* Meal plan — one plan for the whole booking */}
        {lines.some((l) => hasTariff(l.roomSlug)) && (
          <fieldset className="rounded-xl border border-border p-6">
            <legend className="px-1 font-body text-sm font-semibold text-charcoal">Meal Plan</legend>
            <p className={NOTE_CLS}>Your fare is the room rate plus the meal plan, per night for two guests, before GST.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MEAL_PLAN_CODES.map((code) => {
                const plan = MEAL_PLANS[code];
                const selected = mealPlan === code;
                return (<label key={code} className={`cursor-pointer rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-earth-brown ${selected ? "border-earth-brown bg-warm-beige/40" : "border-border hover:border-earth-brown/50"}`}>
                  <input type="radio" name="mealPlan" value={code} checked={selected} onChange={() => setMealPlan(code)} className="sr-only"/>
                  <span className="block font-body text-sm font-semibold text-charcoal">{plan.label}</span>
                  <span className="block font-body text-xs text-charcoal/70">{plan.includes}</span>
                  <span className="mt-2 block font-body text-xs font-semibold text-earth-brown">+ {formatInr(plan.supplementPerNight)} per night</span>
                </label>);
              })}
            </div>
          </fieldset>
        )}

        {/* Room lines */}
        {lines.map((line, idx) => {
          const maxA = maxAdultsFor(line.roomSlug);
          const included = adultsIncludedFor(line.roomSlug);
          return (
            <fieldset key={line.id} className="rounded-xl border border-border p-6">
              <legend className="px-1 font-body text-sm font-semibold text-charcoal">
                Room {lines.length > 1 ? idx + 1 : ""}
              </legend>

              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className={LABEL_CLS}>Room type</label>
                  <select
                    value={line.roomSlug}
                    onChange={(e) => {
                      const room = allRooms.find((r) => r.slug === e.target.value);
                      if (!room) return;
                      updateLine(line.id, { ...makeLine(room) });
                    }}
                    className={INPUT_CLS}
                  >
                    {allRooms.map((r) => (<option key={r.slug} value={r.slug}>{r.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>
                    Number of rooms {line.inventoryCount > 1 ? `(up to ${line.inventoryCount})` : ""}
                  </label>
                  <select
                    value={line.quantity}
                    onChange={(e) => {
                      updateLine(line.id, { quantity: Number(e.target.value) });
                      repriceLine(line.id);
                    }}
                    className={INPUT_CLS}
                    disabled={line.inventoryCount <= 1}
                  >
                    {Array.from({ length: line.inventoryCount }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {line.loadingPrice === false && line.availability?.available === false && (
                <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 font-body text-xs font-medium text-red-700">
                  {line.availability?.reason ?? "Not enough rooms of this type are available for these dates."}
                </p>
              )}
              {line.availability?.available === true && (
                <p className="mt-3 flex items-center gap-1.5 font-body text-xs font-medium text-success">
                  <Check className="h-3.5 w-3.5" aria-hidden="true"/>
                  {line.quantity > 1 ? `${line.availability.availableUnits} available — enough for your selection.` : "These dates are available."}
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLS}>Adults (per room)</label>
                  <select value={line.adults} onChange={(e) => { updateLine(line.id, { adults: Number(e.target.value) }); repriceLine(line.id); }} className={INPUT_CLS}>
                    {Array.from({ length: maxA }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} adult{n > 1 ? "s" : ""}{n === included ? " (included in base price)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Children <span className="font-normal text-muted-foreground">(5–12 yrs)</span></label>
                  <select value={line.children} onChange={(e) => { updateLine(line.id, { children: Number(e.target.value) }); repriceLine(line.id); }} className={INPUT_CLS}>
                    {Array.from({ length: MAX_CHILDREN + 1 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>{n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Infants <span className="font-normal text-muted-foreground">(under 5)</span></label>
                  <select value={line.infants} onChange={(e) => { updateLine(line.id, { infants: Number(e.target.value) }); repriceLine(line.id); }} className={INPUT_CLS}>
                    {Array.from({ length: MAX_INFANTS + 1 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>{n === 0 ? "No infants" : `${n} infant${n > 1 ? "s" : ""} (Free)`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-body text-sm text-charcoal">
                  {line.loadingPrice ? "Calculating…" : line.pricingError ? <span className="text-red-600">{line.pricingError}</span> : line.pricing ? (
                    <>₹{formatPrice(line.pricing.totalAmount * line.quantity)} <span className="text-xs text-charcoal/60">for {line.quantity} room{line.quantity > 1 ? "s" : ""}, {nights} night{nights !== 1 ? "s" : ""}</span></>
                  ) : "—"}
                </p>
                {lines.length > 1 && (
                  <button type="button" onClick={() => removeLine(line.id)} className="inline-flex items-center gap-1 font-body text-xs text-red-600 hover:underline">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true"/> Remove
                  </button>
                )}
              </div>
            </fieldset>
          );
        })}

        <button type="button" onClick={addLine} className="inline-flex items-center gap-1.5 rounded-lg border border-earth-brown px-4 py-2 font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory">
          <Plus className="h-4 w-4" aria-hidden="true"/> Add another room
        </button>

        {/* Guest details */}
        <fieldset className="rounded-xl border border-border p-6">
          <legend className="px-1 font-body text-sm font-semibold text-charcoal">Guest Details</legend>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="guestName" className={LABEL_CLS}>Full name</label>
              <input id="guestName" type="text" autoComplete="name" value={guestName} onChange={(e) => { setGuestName(e.target.value); clearFieldError("guestName"); }} onBlur={(e) => setFieldError("guestName", validateName(e.target.value))} placeholder="Your full name" className={errors.guestName ? INPUT_ERR_CLS : INPUT_CLS} required/>
              {errors.guestName && <p className={ERROR_CLS}>{errors.guestName}</p>}
            </div>
            <div>
              <label htmlFor="guestEmail" className={LABEL_CLS}>Email</label>
              <input id="guestEmail" type="email" autoComplete="email" value={guestEmail} onChange={(e) => { setGuestEmail(e.target.value); clearFieldError("guestEmail"); }} onBlur={(e) => setFieldError("guestEmail", validateEmail(e.target.value))} placeholder="you@example.com" className={errors.guestEmail ? INPUT_ERR_CLS : INPUT_CLS} required/>
              {errors.guestEmail && <p className={ERROR_CLS}>{errors.guestEmail}</p>}
            </div>
            <div>
              <label htmlFor="guestPhone" className={LABEL_CLS}>Mobile number</label>
              <input id="guestPhone" type="tel" autoComplete="tel" value={guestPhone} onChange={(e) => { setGuestPhone(e.target.value); clearFieldError("guestPhone"); }} onBlur={(e) => setFieldError("guestPhone", validatePhone(e.target.value))} placeholder="+91 98765 43210" className={errors.guestPhone ? INPUT_ERR_CLS : INPUT_CLS} required/>
              {errors.guestPhone && <p className={ERROR_CLS}>{errors.guestPhone}</p>}
            </div>
            <div>
              <label htmlFor="specialRequests" className={LABEL_CLS}>Special requests <span className="font-normal text-muted-foreground">(optional)</span></label>
              <textarea id="specialRequests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} maxLength={2000} placeholder="Dietary needs, accessibility requirements, celebrating a special occasion..." className={INPUT_CLS}/>
            </div>
          </div>
        </fieldset>

        {/* Coupon — single-room bookings only */}
        {couponAllowed ? (
          <div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="couponCode" className={LABEL_CLS}>Coupon code</label>
                <input id="couponCode" type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }} placeholder="FOREST20" aria-invalid={couponError ? true : undefined} className={couponError ? INPUT_ERR_CLS : INPUT_CLS}/>
              </div>
              <div className="flex items-end">
                <button type="button" onClick={applyCoupon} disabled={couponCooling || anyChecking || !couponCode.trim()} className="h-[42px] rounded-lg border border-earth-brown px-4 font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50">
                  Apply
                </button>
              </div>
            </div>
            {couponError && <p role="alert" className={ERROR_CLS}>{couponError}</p>}
            {couponFailCount >= COUPON_WARN_AFTER_ATTEMPTS && <p className="mt-1 font-body text-xs font-medium text-earth-brown">Please double-check your coupon code</p>}
            {lines[0]?.pricing?.couponCode && !couponError && (
              <p className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-success"><Check className="h-3.5 w-3.5" aria-hidden="true"/>Coupon {lines[0].pricing.couponCode} applied.</p>
            )}
          </div>
        ) : (
          <p className={NOTE_CLS}>Coupon codes apply to single-room bookings only.</p>
        )}

        <aside aria-label="Why book direct" className="rounded-xl border border-earth-brown/10 bg-warm-beige p-5">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-earth-brown/80">Why book direct?</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <li key={badge} className="flex items-start gap-2 font-body text-sm font-medium text-earth-brown">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-earth-brown" aria-hidden="true"/><span>{badge}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Right column: combined price summary */}
      <div className="hidden space-y-4 lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-medium text-charcoal">Price Summary</h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {lines.length > 1 ? `${lines.length} room types · ${totalUnits} rooms` : `${lines[0].roomName} × ${lines[0].quantity}`}
          </p>

          {anyChecking ? (
            <div className="mt-6 space-y-2">{[1, 2, 3].map((i) => (<div key={i} className="h-4 animate-pulse rounded bg-warm-beige/60"/>))}</div>
          ) : allPriced ? (
            <div className="mt-6 space-y-3 font-body text-sm">
              {lines.map((l) => (
                <div key={l.id} className="flex justify-between text-charcoal/70">
                  <span>{l.roomName} × {l.quantity} × {nights}n</span>
                  <span>&#8377;{formatPrice(l.pricing.baseNightlyTotal * l.quantity)}</span>
                </div>
              ))}
              {totals.mealSupplementTotal > 0 && (
                <div className="flex justify-between text-charcoal/70"><span>Meal plan ({MEAL_PLANS[mealPlan].label})</span><span>&#8377;{formatPrice(totals.mealSupplementTotal)}</span></div>
              )}
              {totals.extraGuestTotal > 0 && (
                <div className="flex justify-between text-charcoal/70"><span>Extra guests</span><span>&#8377;{formatPrice(totals.extraGuestTotal)}</span></div>
              )}
              {totals.multiNightDiscount > 0 && (
                <div className="flex justify-between text-success"><span>2+ nights discount</span><span>−&#8377;{formatPrice(totals.multiNightDiscount)}</span></div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-success"><span>Coupon</span><span>−&#8377;{formatPrice(totals.discountAmount)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-charcoal/70"><span>Subtotal</span><span>&#8377;{formatPrice(totals.subtotalBeforeGst)}</span></div>
              <div className="flex justify-between text-charcoal/70"><span>CGST</span><span>&#8377;{formatPrice(totals.cgstAmount)}</span></div>
              <div className="flex justify-between text-charcoal/70"><span>SGST</span><span>&#8377;{formatPrice(totals.sgstAmount)}</span></div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-charcoal"><span>Total</span><span>&#8377;{formatPrice(totals.totalAmount)}</span></div>
              </div>
            </div>
          ) : nights > 0 ? (
            <p className="mt-4 font-body text-sm text-muted-foreground">Calculating...</p>
          ) : (
            <p className="mt-4 font-body text-sm text-muted-foreground">Select dates to see pricing.</p>
          )}

          {errors.pricing && <p className={`mt-2 ${ERROR_CLS}`}>{errors.pricing}</p>}
          {submitError && <p className={`mt-2 ${ERROR_CLS}`}>{submitError}</p>}

          <button type="submit" disabled={submitting || anyChecking || !allPriced || datesUnavailable} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "Please wait…" : "Continue to Review"}
          </button>
          <p className="mt-3 text-center font-body text-xs text-muted-foreground">No payment charged yet. Review on the next step.</p>
        </div>
      </div>
    </div>

    {/* Mobile sticky bar */}
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-ivory shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {mobilePriceExpanded && allPriced && (
        <div className="border-b border-border bg-warm-beige/40 px-4 py-3">
          <div className="space-y-2 font-body text-sm">
            {lines.map((l) => (
              <div key={l.id} className="flex justify-between text-charcoal/70"><span>{l.roomName} × {l.quantity}</span><span>&#8377;{formatPrice(l.pricing.totalAmount * l.quantity)}</span></div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-charcoal"><span>Total</span><span>&#8377;{formatPrice(totals.totalAmount)}</span></div>
          </div>
        </div>
      )}
      <div className="space-y-2 px-4 py-3">
        <button type="submit" disabled={submitting || anyChecking || !allPriced || datesUnavailable} className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? "Please wait…" : "Continue to Review"}
        </button>
        <button type="button" onClick={() => setMobilePriceExpanded((v) => !v)} aria-expanded={mobilePriceExpanded} disabled={!allPriced} className="flex w-full items-center justify-between rounded-lg px-1 py-1 font-body text-sm text-charcoal disabled:opacity-50">
          <span className="flex items-center gap-1.5 text-charcoal/70">Total <ChevronDown className={`h-4 w-4 transition-transform ${mobilePriceExpanded ? "rotate-180" : ""}`} aria-hidden="true"/></span>
          <span className="font-semibold text-charcoal">{anyChecking ? "Calculating…" : allPriced ? `₹${formatPrice(totals.totalAmount)}` : "—"}</span>
        </button>
      </div>
    </div>
  </form>);
}
