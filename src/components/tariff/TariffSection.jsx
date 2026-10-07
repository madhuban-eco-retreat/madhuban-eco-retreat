import React from "react";
import Link from "next/link";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import {
  MEAL_PLANS,
  MEAL_PLAN_CODES,
  EXTRA_GUEST_RATES,
  PEAK_SURCHARGE_RATE,
  LONG_WEEKEND_PERIODS,
  RECURRING_PEAK_MONTH_DAYS,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  INFANT_MAX_AGE,
  CHILD_MAX_AGE,
  DAY_OUTING_RATE_PER_PERSON,
  OTHER_CHARGES,
  TARIFF_LABEL,
  TARIFF_VALID_FROM,
  TARIFF_VALID_TO,
} from "@/lib/pricing/config.mjs";
import { rateCardRows, formatInr } from "@/lib/pricing/rate-card.mjs";

// Every figure on this page is read from the rate card the booking engine prices
// with, so the published tariff and the checkout total cannot disagree. A fare is
// always shown as what it is made of: the room rate plus the meal plan.
const rows = rateCardRows();

const fmtDay = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// "17 Oct–20 Oct 2026" from a config range, so the season list below is one more
// thing that cannot fall out of step with what the engine charges.
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

const longWeekendsLabel = LONG_WEEKEND_PERIODS.map((p) => `${p.label}: ${fmtRange(p.start, p.end)}`).join(" | ");

const peakPct = Math.round((PEAK_SURCHARGE_RATE - 1) * 100);
const offerPct = Math.round(LONG_STAY_DISCOUNT_RATE * 100);

const TABLE_HEAD = "bg-earth-brown text-cream";
const TH = "px-4 py-3 text-sm md:text-base font-semibold";
const TD = "px-4 py-3 text-sm md:text-base text-charcoal";
const BANNER = "bg-earth-brown text-cream";
const CARD = "bg-ivory rounded-xl shadow-subtle p-5 md:p-6 mb-8";

// One tariff table. `rentOf` gives the room rate for a row and `fareOf` the fare
// for a row and plan; the meal supplement is the difference.
function FareTable({ rentHeading, rentOf, fareOf }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={TABLE_HEAD}>
            <th className={TH}>Room Category</th>
            <th className={`${TH} whitespace-nowrap`}>{rentHeading}</th>
            {MEAL_PLAN_CODES.map((code) => (
              <th key={code} className={`${TH} whitespace-nowrap`}>
                {MEAL_PLANS[code].label}
                <span className="block text-xs font-normal opacity-90">
                  + {formatInr(MEAL_PLANS[code].supplementPerNight)} meals
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.slug} className={i % 2 ? "bg-cream" : "bg-ivory"}>
              <td className={`${TD} font-medium`}>{r.label}</td>
              <td className={`${TD} whitespace-nowrap`}>{formatInr(rentOf(r))}</td>
              {MEAL_PLAN_CODES.map((code) => (
                <td key={code} className={`${TD} whitespace-nowrap`}>
                  <span className="font-bold text-earth-brown">{formatInr(fareOf(r, code))}</span>
                  <span className="block text-xs text-charcoal/60">
                    {formatInr(rentOf(r))} + {formatInr(MEAL_PLANS[code].supplementPerNight)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const paidExperiences = OTHER_CHARGES.filter((c) => c.key !== "day-outing").map((c) => ({
  label: c.label,
  value: `${formatInr(c.amount)} ${c.unit}`,
}));

const inclusions = [
  "Accommodation on double occupancy",
  `Meals as per your plan — MAP: ${MEAL_PLANS.MAP.includes.toLowerCase()}; AP: ${MEAL_PLANS.AP.includes.toLowerCase()}`,
  "Guided nature walk",
  "Yoga and meditation session",
  "Obstacle course",
  "Swimming pool access",
  "Pottery session",
];

const notes = [
  "Check-in is 2:00 PM and check-out is 11:00 AM. Early check-in or late check-out is subject to availability.",
  "Guests must carry an original government photo ID for check-in formalities and for safari.",
  "Rates are subject to change without prior notice unless a booking is confirmed with advance payment.",
  "Included experiences are subject to the resort schedule, weather conditions and prior booking.",
  "Pool operations and outdoor activities are subject to weather and local authority guidelines. In standard cases the pool is open 7 AM to 9 PM, and pool costume is mandatory.",
  "The retreat is in a forest-fringe landscape; internet, network and digital payment services may occasionally be affected.",
  "Guests who need a GST invoice are requested to share their GST details in advance.",
];

const TariffSection = () => {
  // The slab is read from the tariff for the night BEFORE any discount (see
  // GST_SLAB_ON_PRE_DISCOUNT_VALUE), so a discounted fare below ₹7,500 on this
  // page is still taxed on the tariff it was discounted from.
  const gstLine = `GST extra as applicable — ${GST_RATE_LOW}% GST where the tariff for the night (before any discount) is ${formatInr(
    GST_THRESHOLD,
  )} or less, ${GST_RATE_HIGH}% where it is more`;

  return (
    <section className="bg-cream py-16 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <DecorativeHeading text={"Tariff & Rates"} as="h2" color="#6E6146" />
          <p className="text-earth-brown max-w-2xl mx-auto text-sm md:text-base">
            Standard tariff &amp; stay packages {TARIFF_LABEL}, valid {fmtDay(TARIFF_VALID_FROM)} to{" "}
            {fmtDay(TARIFF_VALID_TO)}. Rates are per room per night for 2 guests on double occupancy.
            Your fare is the room rate plus your meal plan.
          </p>
        </div>

        <div className={`${BANNER} rounded-xl px-5 py-4 mb-8 text-center shadow-subtle`}>
          <p className="font-semibold text-sm md:text-base">{gstLine}</p>
        </div>

        {/* Meal plans */}
        <div className={CARD}>
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Choose Your Meal Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEAL_PLAN_CODES.map((code) => (
              <div key={code} className="rounded-lg border border-warm-beige bg-cream p-4">
                <p className="font-semibold text-charcoal">{MEAL_PLANS[code].label}</p>
                <p className="text-sm text-charcoal/80">{MEAL_PLANS[code].includes}</p>
                <p className="mt-2 text-sm font-bold text-earth-brown">
                  + {formatInr(MEAL_PLANS[code].supplementPerNight)} per night, added to the room rate
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-earth-brown mt-3">
            The meal plan is the same in every season: peak season adds {peakPct}% to the room rate only, and
            the {LONG_STAY_MIN_NIGHTS}+ night offer takes {offerPct}% off the room rate only.
          </p>
        </div>

        {/* Regular season */}
        <div className="bg-ivory rounded-xl shadow-subtle overflow-hidden mb-8">
          <div className={`${BANNER} px-5 py-3 text-center`}>
            <p className="font-bold text-sm md:text-lg">Per Night Tariff for 2 Guests — Regular Season</p>
          </div>
          <FareTable rentHeading="Room Rate" rentOf={(r) => r.rent} fareOf={(r, code) => r.regular[code]} />
          <p className="text-xs text-earth-brown px-4 py-3">Fare = room rate + meal plan. {gstLine}.</p>
        </div>

        {/* Peak season */}
        <div className="bg-ivory rounded-xl shadow-subtle overflow-hidden mb-8">
          <div className={`${BANNER} px-5 py-3 text-center`}>
            <p className="font-bold text-sm md:text-lg">
              Per Night Tariff for 2 Guests — Peak Season / Long Weekends (+{peakPct}% on room rate)
            </p>
          </div>
          <FareTable
            rentHeading={`Room Rate (+${peakPct}%)`}
            rentOf={(r) => r.rent * PEAK_SURCHARGE_RATE}
            fareOf={(r, code) => r.peak[code]}
          />
          <p className="text-xs text-earth-brown px-4 py-3">
            The {peakPct}% applies to the room rate; the meal plan is unchanged. {gstLine}.
          </p>
        </div>

        {/* 2+ nights offer */}
        <div className="bg-cream border border-warm-beige rounded-xl overflow-hidden mb-8">
          <div className={`${BANNER} px-5 py-3 text-center`}>
            <p className="font-bold text-sm md:text-lg">
              Stay {LONG_STAY_MIN_NIGHTS} Nights or More — Flat {offerPct}% Off on Room Rent
            </p>
          </div>
          <FareTable
            rentHeading={`Room Rate (after ${offerPct}% off)`}
            rentOf={(r) => r.rent * (1 - LONG_STAY_DISCOUNT_RATE)}
            fareOf={(r, code) => r.longStay[code]}
          />
          <p className="text-xs text-charcoal px-4 py-3">
            Per night, regular season, for 2 guests. The {offerPct}% comes off the room rate only — the meal plan
            is not discounted. This offer is <strong>not applicable</strong> during Peak Season, the
            Christmas/New Year period and long weekends. {gstLine}.
          </p>
        </div>

        {/* Season classification */}
        <div className={CARD}>
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Season Classification</h3>
          <ul className="space-y-2 text-sm md:text-base text-charcoal list-disc pl-5">
            <li>
              <strong>Regular Season:</strong> 01 July – 20 December and 05 January – 30 June, except notified
              long weekends.
            </li>
            <li>
              <strong>Peak Season / Long Weekends (+{peakPct}%):</strong> {RECURRING_PEAK_MONTH_DAYS.from.day}{" "}
              December – {String(RECURRING_PEAK_MONTH_DAYS.to.day).padStart(2, "0")} January, the Christmas / New
              Year period, and all notified long weekends.
            </li>
            <li>
              <strong>Notified Long Weekends for {TARIFF_LABEL}:</strong> {longWeekendsLabel}
            </li>
          </ul>
        </div>

        {/* Additional guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Additional Guest Tariff</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm md:text-base text-charcoal">
                <thead>
                  <tr className="border-b border-warm-beige">
                    <th className="py-2 pr-3 font-semibold">Per night</th>
                    {MEAL_PLAN_CODES.map((code) => (
                      <th key={code} className="py-2 px-2 font-semibold">{code} Plan</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-warm-beige">
                    <td className="py-2 pr-3">Additional adult (above {CHILD_MAX_AGE} yrs)</td>
                    {MEAL_PLAN_CODES.map((code) => (
                      <td key={code} className="py-2 px-2 font-medium whitespace-nowrap">
                        {formatInr(EXTRA_GUEST_RATES[code].adult)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">Child ({INFANT_MAX_AGE}–{CHILD_MAX_AGE} yrs)</td>
                    {MEAL_PLAN_CODES.map((code) => (
                      <td key={code} className="py-2 px-2 font-medium whitespace-nowrap">
                        {formatInr(EXTRA_GUEST_RATES[code].child)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-earth-brown mt-3">
              One child below {INFANT_MAX_AGE} years is complimentary, sharing the room with parents without an
              extra bed. GST extra as applicable.
            </p>
          </div>
          <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Day Outing</h3>
            <p className="text-2xl font-bold text-success">
              {formatInr(DAY_OUTING_RATE_PER_PERSON)}{" "}
              <span className="text-base font-normal text-charcoal">per person</span>
            </p>
            <p className="text-sm text-earth-brown mt-2">GST extra as applicable.</p>
          </div>
        </div>

        {/* Optional paid experiences */}
        <div className={CARD}>
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Optional Paid Experiences</h3>
          <ul className="space-y-2 text-sm md:text-base text-charcoal">
            {paidExperiences.map((e) => (
              <li key={e.label} className="flex justify-between gap-3 border-b border-warm-beige pb-2">
                <span>{e.label}</span>
                <span className="font-medium text-right whitespace-nowrap">{e.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-earth-brown mt-3">
            Safari confirmation is subject to the availability of permits, forest department rules and applicable
            government regulations. Full safari payment and guest ID details are required at the time of safari
            booking.
          </p>
        </div>

        {/* Package inclusions */}
        <div className={CARD}>
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">What&apos;s Included in Your Stay</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base text-charcoal list-disc pl-5">
            {inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Food policy and important notes */}
        <div className="bg-ivory rounded-xl shadow-subtle p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Food &amp; Alcohol Policy</h3>
          <p className="text-sm md:text-base text-charcoal mb-5">
            Madhuban Eco Retreat follows Gandhian principles of simplicity, mindful living and respect for all
            life. In keeping with this ethos, alcohol is not permitted on the premises and only vegetarian food is
            served at the retreat. Guests are requested not to carry or consume alcohol or non-vegetarian food
            within the property.
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm md:text-base text-charcoal list-disc pl-5">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="text-xs text-earth-brown mt-4">
            Payment, cancellation and rescheduling terms are in our{" "}
            <Link href="/terms-and-condition" className="underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default TariffSection;
