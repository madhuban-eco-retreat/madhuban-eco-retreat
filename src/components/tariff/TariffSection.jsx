import React from "react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import {
  ROOM_CATEGORIES,
  BASE_NIGHTLY_RATES,
  PEAK_SURCHARGE_RATE,
  PEAK_PERIODS,
  DISCOUNT_BLACKOUT_PERIODS,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  INFANT_MAX_AGE,
  CHILD_MAX_AGE,
  CHILD_RATE,
  EXTRA_ADULT_RATE,
  DAY_OUTING_RATE_PER_PERSON,
  OTHER_CHARGES,
} from "@/lib/pricing/config.mjs";

// Every figure on this page is read from the rate card the booking engine
// prices with, so the published tariff and the checkout total cannot disagree.
// The peak and 2+ night columns are derived here rather than stored, for the
// same reason: there is one base rate per room and two arithmetic rules.
const roomTariff = ROOM_CATEGORIES.map(({ slug, label }) => {
  const regular = BASE_NIGHTLY_RATES[slug];
  return {
    category: label,
    regular,
    peak: Math.round(regular * PEAK_SURCHARGE_RATE),
    longStay: Math.round(regular * (1 - LONG_STAY_DISCOUNT_RATE)),
  };
});

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const extraCharges = [
  { label: `Infant (up to ${INFANT_MAX_AGE} years)`, value: "Complimentary — no charges" },
  {
    label: `Child (${INFANT_MAX_AGE}–${CHILD_MAX_AGE} years)`,
    value: `${inr(CHILD_RATE)} per night`,
  },
  {
    label: `Adult above ${CHILD_MAX_AGE} years (extra person)`,
    value: `${inr(EXTRA_ADULT_RATE)} per night`,
  },
];

// The day outing has its own card below, so it is not repeated in this list.
const paidExperiences = OTHER_CHARGES.filter((c) => c.key !== "day-outing").map((c) => ({
  label: c.label,
  value: `${inr(c.amount)} ${c.unit}`,
}));

const inclusions = [
  "Accommodation on double occupancy",
  "Breakfast for two guests",
  "Guided nature walk",
  "Yoga and meditation session",
  "Pottery session",
];

const peakPct = Math.round((PEAK_SURCHARGE_RATE - 1) * 100);
const longStayPct = Math.round(LONG_STAY_DISCOUNT_RATE * 100);

// "17 Oct–20 Oct 2026" from a config range, so the season list below is one
// more thing that cannot fall out of step with what the engine charges.
const fmtRange = (start, end) => {
  const from = new Date(`${start}T00:00:00Z`);
  const to = new Date(`${end}T00:00:00Z`);
  const base = { day: "numeric", month: "short", timeZone: "UTC" };
  const fromLabel = from.toLocaleDateString("en-IN", base);
  const toLabel = to.toLocaleDateString("en-IN", { ...base, year: "numeric" });
  return from.getUTCFullYear() === to.getUTCFullYear()
    ? `${fromLabel}–${toLabel}`
    : `${fromLabel} ${from.getUTCFullYear()} – ${toLabel}`;
};

// Header styling is shared so a second table cannot drift to its own colour.
// Festival and long-weekend dates are the only place the long-stay discount is
// withheld without a surcharge to explain it, so the footnote names them rather
// than leaving "notified" pointing at nothing a guest can read.
const blackoutDatesLabel = DISCOUNT_BLACKOUT_PERIODS.map(
  (p) => `${p.label} ${fmtRange(p.start, p.end)}`,
).join(", ");

const TABLE_HEAD = "bg-earth-brown text-cream";
const TH = "px-4 py-3 text-sm md:text-base font-semibold";

const TariffSection = () => {
  const gstLine = `GST extra as applicable — ${GST_RATE_LOW}% GST on ${inr(
    GST_THRESHOLD,
  )} rooms, ${GST_RATE_HIGH}% GST on rooms above ${inr(GST_THRESHOLD)}`;

  return (
    <section className="bg-cream py-16 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <DecorativeHeading text={"Tariff & Rates"} as="h2" color="#6E6146" />
          <p className="text-earth-brown max-w-2xl mx-auto text-sm md:text-base">
            All room rates are per night on double occupancy. GST is charged
            separately as applicable (rates are no longer GST inclusive).
          </p>
        </div>

        {/* GST callout — prominent, appears next to every rate */}
        <div className="bg-forest-green text-cream rounded-xl px-5 py-4 mb-8 text-center shadow-subtle">
          <p className="font-semibold text-sm md:text-base">{gstLine}</p>
        </div>

        {/* Room tariff — regular & peak */}
        <div className="bg-ivory rounded-xl shadow-subtle overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={TABLE_HEAD}>
                  <th className={TH}>Room Category</th>
                  <th className={`${TH} whitespace-nowrap`}>Regular Season</th>
                  <th className={`${TH} whitespace-nowrap`}>Peak Season (+{peakPct}%)</th>
                </tr>
              </thead>
              <tbody>
                {roomTariff.map((r, i) => (
                  <tr key={r.category} className={i % 2 ? "bg-cream" : "bg-ivory"}>
                    <td className="px-4 py-3 text-sm md:text-base text-charcoal font-medium">{r.category}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-charcoal whitespace-nowrap">{inr(r.regular)}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-charcoal whitespace-nowrap">{inr(r.peak)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-earth-brown px-4 py-3">
            Per night, double occupancy. {gstLine}.
          </p>
        </div>

        {/* 2+ nights discount — prominent */}
        <div className="bg-cream border border-warm-beige rounded-xl overflow-hidden mb-8">
          <div className="bg-moss-green text-cream px-5 py-3 text-center">
            <p className="font-bold text-sm md:text-lg">
              Stay {LONG_STAY_MIN_NIGHTS} Nights or More — Flat {longStayPct}% Off on Room Rent
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={TABLE_HEAD}>
                  <th className={TH}>Room Category</th>
                  <th className={`${TH} whitespace-nowrap`}>Regular Rate</th>
                  <th className={`${TH} whitespace-nowrap`}>
                    {LONG_STAY_MIN_NIGHTS}+ Nights (after {longStayPct}% off)
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomTariff.map((r, i) => (
                  <tr key={r.category} className={i % 2 ? "bg-cream" : "bg-ivory"}>
                    <td className="px-4 py-3 text-sm md:text-base text-charcoal font-medium">{r.category}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-earth-brown line-through whitespace-nowrap">{inr(r.regular)}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-moss-green font-bold whitespace-nowrap">{inr(r.longStay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-charcoal px-4 py-3">
            The {longStayPct}% discount is <strong>not applicable</strong> during
            Christmas/New Year (21 December – 04 January) or on notified festival
            and long-weekend dates: {blackoutDatesLabel}. GST extra as applicable.
          </p>
        </div>

        {/* Season classification */}
        <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6 mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Season Classification</h3>
          <ul className="space-y-2 text-sm md:text-base text-charcoal list-disc pl-5">
            <li>
              <strong>Regular Season:</strong> 01 July – 20 December and 05 January
              – 30 June
            </li>
            <li>
              <strong>Peak Season (+{peakPct}%):</strong> 21 December – 04 January
              (Christmas/New Year) only
            </li>
            <li>
              <strong>Notified Peak Dates:</strong>{" "}
              {PEAK_PERIODS.map((p) => `${p.label} ${fmtRange(p.start, p.end)}`).join(", ")}
            </li>
          </ul>
        </div>

        {/* Extra person / child + Day outing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Extra Person / Child Charges</h3>
            <ul className="space-y-2 text-sm md:text-base text-charcoal">
              {extraCharges.map((c) => (
                <li key={c.label} className="flex justify-between gap-3 border-b border-warm-beige pb-2">
                  <span>{c.label}</span>
                  <span className="font-medium text-right whitespace-nowrap">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Day Outing</h3>
            <p className="text-2xl font-bold text-moss-green">
              {inr(DAY_OUTING_RATE_PER_PERSON)}{" "}
              <span className="text-base font-normal text-charcoal">per person</span>
            </p>
            <p className="text-sm text-earth-brown mt-2">GST extra as applicable.</p>
          </div>
        </div>

        {/* Optional paid experiences */}
        <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6 mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Optional Paid Experiences</h3>
          <ul className="space-y-2 text-sm md:text-base text-charcoal">
            {paidExperiences.map((e) => (
              <li key={e.label} className="flex justify-between gap-3 border-b border-warm-beige pb-2">
                <span>{e.label}</span>
                <span className="font-medium text-right whitespace-nowrap">{e.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Package inclusions */}
        <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">
            What&apos;s Included in Your Room Rate
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base text-charcoal list-disc pl-5">
            {inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TariffSection;
