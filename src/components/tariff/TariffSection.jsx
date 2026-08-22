import React from "react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

// Single source of truth for room tariff. Peak Season is +20% on the regular
// rate; the 2+ nights rate is a flat 20% off the regular room rent.
const roomTariff = [
  { category: "Mud House – Standard", regular: 9000, peak: 10800, twoNights: 7200 },
  { category: "Mud House – Premium", regular: 10000, peak: 12000, twoNights: 8000 },
  { category: "Glamping Tent", regular: 7500, peak: 9000, twoNights: 6000 },
  { category: "Safari Tent", regular: 12000, peak: 14400, twoNights: 9600 },
  { category: "Poolside Villa", regular: 12000, peak: 14400, twoNights: 9600 },
];

const extraCharges = [
  { label: "Infant (up to 5 years)", value: "Complimentary — no charges" },
  { label: "Child (5–12 years)", value: "₹1,500 per night" },
  { label: "Adult above 12 years (extra person)", value: "₹2,000 per night" },
];

const paidExperiences = [
  { label: "Ratapani Safari", value: "₹6,500 per safari" },
  { label: "Ratapani Safari with Naturalist", value: "₹8,000 per safari" },
  { label: "Guided Hiking / Saru Maru Trek", value: "₹2,000 per person (min 4 guests)" },
  { label: "Bush Dining Experience", value: "₹3,000 per couple" },
];

const inclusions = [
  "Accommodation on double occupancy",
  "Breakfast for two guests",
  "Guided nature walk",
  "Yoga and meditation session",
  "Pottery session",
];

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const TariffSection = () => {
  return (
    <section className="bg-stone-50 py-16 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <DecorativeHeading text={"Tariff & Rates"} as="h2" color="#6e6146" />
          <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
            All room rates are per night on double occupancy. GST is charged
            separately as applicable (rates are no longer GST inclusive).
          </p>
        </div>

        {/* GST callout — prominent, appears next to every rate */}
        <div className="bg-green-800 text-white rounded-xl px-5 py-4 mb-8 text-center shadow-subtle">
          <p className="font-semibold text-sm md:text-base">
            GST extra as applicable — 5% GST on ₹7,500 rooms, 18% GST on rooms
            above ₹7,500
          </p>
        </div>

        {/* Room tariff — regular & peak */}
        <div className="bg-white rounded-xl shadow-subtle overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-800 text-white">
                  <th className="px-4 py-3 text-sm md:text-base font-semibold">Room Category</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold whitespace-nowrap">Regular Season</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold whitespace-nowrap">Peak Season (+20%)</th>
                </tr>
              </thead>
              <tbody>
                {roomTariff.map((r, i) => (
                  <tr key={r.category} className={i % 2 ? "bg-stone-50" : "bg-white"}>
                    <td className="px-4 py-3 text-sm md:text-base text-stone-800 font-medium">{r.category}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-stone-700 whitespace-nowrap">{inr(r.regular)}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-stone-700 whitespace-nowrap">{inr(r.peak)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500 px-4 py-3">
            Per night, double occupancy. GST extra — 5% GST on ₹7,500 rooms, 18%
            GST on rooms above ₹7,500.
          </p>
        </div>

        {/* 2+ nights discount — prominent */}
        <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden mb-8">
          <div className="bg-green-700 text-white px-5 py-3 text-center">
            <p className="font-bold text-sm md:text-lg">
              Stay 2 Nights or More — Flat 20% Off on Room Rent
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-800">
                  <th className="px-4 py-3 text-sm md:text-base font-semibold">Room Category</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold whitespace-nowrap">Regular Rate</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold whitespace-nowrap">2+ Nights (after 20% off)</th>
                </tr>
              </thead>
              <tbody>
                {roomTariff.map((r, i) => (
                  <tr key={r.category} className={i % 2 ? "bg-green-50" : "bg-white"}>
                    <td className="px-4 py-3 text-sm md:text-base text-stone-800 font-medium">{r.category}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-stone-500 line-through whitespace-nowrap">{inr(r.regular)}</td>
                    <td className="px-4 py-3 text-sm md:text-base text-green-700 font-bold whitespace-nowrap">{inr(r.twoNights)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 px-4 py-3">
            The 20% discount is <strong>not applicable</strong> during Peak Season,
            Christmas/New Year, and long weekends. GST extra as applicable.
          </p>
        </div>

        {/* Season classification */}
        <div className="bg-white rounded-xl shadow-subtle p-5 md:p-6 mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-3">Season Classification</h3>
          <ul className="space-y-2 text-sm md:text-base text-stone-700 list-disc pl-5">
            <li>
              <strong>Regular Season:</strong> 01 July – 20 December and 05 January
              – 30 June (except long weekends)
            </li>
            <li>
              <strong>Peak Season:</strong> 21 December – 04 January (Christmas/New
              Year) and all notified long weekends
            </li>
            <li>
              <strong>Long Weekends 2026–27:</strong> Dussehra 17–20 Oct 2026,
              Diwali 06–14 Nov 2026, Holi 19–22 Mar 2027
            </li>
          </ul>
        </div>

        {/* Extra person / child + Day outing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-3">Extra Person / Child Charges</h3>
            <ul className="space-y-2 text-sm md:text-base text-stone-700">
              {extraCharges.map((c) => (
                <li key={c.label} className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                  <span>{c.label}</span>
                  <span className="font-medium text-right whitespace-nowrap">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-subtle p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-3">Day Outing</h3>
            <p className="text-2xl font-bold text-green-700">₹1,500 <span className="text-base font-normal text-stone-600">per person</span></p>
            <p className="text-sm text-stone-600 mt-2">GST extra as applicable.</p>
          </div>
        </div>

        {/* Optional paid experiences */}
        <div className="bg-white rounded-xl shadow-subtle p-5 md:p-6 mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-3">Optional Paid Experiences</h3>
          <ul className="space-y-2 text-sm md:text-base text-stone-700">
            {paidExperiences.map((e) => (
              <li key={e.label} className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                <span>{e.label}</span>
                <span className="font-medium text-right whitespace-nowrap">{e.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Package inclusions */}
        <div className="bg-white rounded-xl shadow-subtle p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-stone-800 mb-3">What's Included in Your Room Rate</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base text-stone-700 list-disc pl-5">
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
