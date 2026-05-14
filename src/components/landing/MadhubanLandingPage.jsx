"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { phone } from "@/utills/constants";

const VARIANTS = {
  weekend: {
    badge: "WEEKEND SPOTS AVAILABLE",
    h1Pre: "Wake up in the",
    h1Em: "Ratapani jungle",
    h1Post: "just 1 hour from Bhopal",
    sub: "Eco-luxury stays inside India's tiger reserve. Glamping, mud houses, pool villa. From ₹7,500 per night.",
  },
  dayout: {
    badge: "DAY OUTING — ₹1,300 PER PERSON",
    h1Pre: "A perfect day",
    h1Em: "in the jungle",
    h1Post: "just 1 hour from Bhopal",
    sub: "Pool, lunch, naturalist-led walk, pottery, archery and more. Open 9 AM to 6 PM. Family-friendly. Pure vegetarian.",
  },
  jungle: {
    badge: "INSIDE RATAPANI TIGER RESERVE",
    h1Pre: "Real jungle,",
    h1Em: "real quiet",
    h1Post: "just 1 hour from Bhopal",
    sub: "A wilderness retreat in Madhya Pradesh's tiger country. Glamping, mud houses, and a poolside villa. From ₹7,500 per night.",
  },
};

const STAYS = [
  {
    name: "Camping Tent",
    price: 2500,
    desc: "Back-to-basics canvas tent. Closest you get to the wild.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/camping-tent-image-1-madhuban-eco-retreat-bhopal.webp",
    tag: null,
  },
  {
    name: "Glamping Tent",
    price: 7500,
    desc: "Luxury under canvas. Proper beds, en-suite, jungle views.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-eco-retreat-glamping-tent-gallery-image-1.webp",
    tag: "Couples favourite",
  },
  {
    name: "Mud House — Standard",
    price: 9000,
    desc: "Traditional mud architecture, naturally cool. Without bathtub.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Mud_House_Image_2_-_Madhuban_Eco_Retreat_Bhopal_lbzlrg.webp",
    tag: null,
  },
  {
    name: "Mud House — Premium",
    price: 10000,
    desc: "Same earthy stay with a private bathtub. The slow-down room.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/readyForEco/mud-house-madhuban-eco-retreat-bhopal.webp",
    tag: null,
  },
  {
    name: "Safari Tent",
    price: 12000,
    desc: "Elevated canvas tent on stilts. The naturalist's pick.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.webp",
    tag: null,
  },
  {
    name: "Pool Side Villa",
    price: 12000,
    desc: "Two rooms, sleeps four. Direct pool access. Only one available.",
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Pool_Image_2_-_Madhuban_Eco_Retreat_Bhopal_yl1tbg.webp",
    tag: "Only 1 villa",
  },
];

// PLACEHOLDER REVIEWS — must be replaced with real Google reviews before going live.
// Source: https://share.google/5u7E0QdYGlCa1dhik
const REVIEWS = [
  {
    text: "Drove from Indore for a weekend with my wife. The glamping tent was incredible — woke up to peacocks and the morning silence. Already planning our next visit.",
    name: "Rajesh M.",
    location: "Indore",
    date: "Feb 2026",
  },
  {
    text: "Day outing with the family was perfect. Pool, lunch, pottery for the kids, naturalist walk. Much better than the usual resorts near Bhopal.",
    name: "Priya S.",
    location: "Bhopal",
    date: "Mar 2026",
  },
  {
    text: "The mud house was an experience we never expected. Cool inside even in May, farm-fresh food. The naturalist who took us on the walk knew every tree by name.",
    name: "Anjali & Vikram",
    location: "Gwalior",
    date: "Jan 2026",
  },
  {
    text: "No mobile signal for two days and it was the best thing that happened to us. Pool villa is exactly what the website shows. Sattvic food was a surprise highlight.",
    name: "Karthik R.",
    location: "Nagpur",
    date: "Dec 2025",
  },
];

const FAQ = [
  {
    q: "How far is Madhuban from Bhopal?",
    a: "About 60 km — roughly 1 hour by car. The road is fully tarmac and accessible by any vehicle. We share directions and a Google Maps pin with every booking confirmation.",
  },
  {
    q: "What is included in the ₹1,300 Day Outing?",
    a: "Pool access, full vegetarian lunch, naturalist-led nature walk, on-site adventure activities, pottery session, and evening tea. Available 9 AM to 6 PM.",
  },
  {
    q: "What meals are included in overnight stays?",
    a: "Breakfast is included in all room rates. Lunch, evening tea, and dinner are available on order at the in-house dining hall — pure vegetarian, made with garden-grown and locally sourced ingredients.",
  },
  {
    q: "Is alcohol allowed on the property?",
    a: "No. Madhuban is a 100% pure vegetarian, alcohol-free property. We keep it this way out of respect for the Tiger Reserve and the families who choose us.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 7 days before check-in. Within 7 days, we offer full credit toward any future stay within 6 months. No hidden charges.",
  },
  {
    q: "Will I see wildlife?",
    a: "We sit adjacent to Ratapani Tiger Reserve. Tiger sightings on the property are rare, but peacocks, deer, langurs, and over 100 bird species are common. Buffer-zone safaris can be arranged on request.",
  },
  {
    q: "How do I book and pay?",
    a: "Fill the booking form — our team replies on WhatsApp within 15 minutes during 9 AM to 9 PM with availability and a payment link. Confirm with ₹500 (refundable per policy) or pay in full.",
  },
  {
    q: "Do you have Jain or special-diet food?",
    a: "Yes. Pure vegetarian sattvic meals by default. Jain food (no onion/garlic) is available with advance notice. Many ingredients come from our own kitchen garden.",
  },
];

const STAY_TYPES = [
  { value: "camping", label: "Camping Tent", price: 2500 },
  { value: "glamping", label: "Glamping Tent", price: 7500 },
  { value: "mud-standard", label: "Mud House (no bathtub)", price: 9000 },
  { value: "mud-premium", label: "Mud House (with bathtub)", price: 10000 },
  { value: "safari", label: "Safari Tent", price: 12000 },
  { value: "pool-villa", label: "Pool Side Villa", price: 12000 },
  { value: "recommend", label: "Help me pick", price: null },
];

const GUEST_OPTIONS = [
  { value: "2-adults", label: "2 Adults", count: 2 },
  { value: "2-adults-1-child", label: "2 Adults + 1 Child", count: 3 },
  { value: "2-adults-2-children", label: "2 Adults + 2 Children", count: 4 },
  { value: "4-adults", label: "4 Adults", count: 4 },
  { value: "group", label: "Group (5+)", count: 6 },
];

const HERO_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/madhuban-eco-retreat-forest-view-hero-section-1.avif";
// Reserved: hero video. Disabled because the source is vertically framed and
// cropped badly into the wide hero. Reintroduce only as a side-by-side or
// sidebar element with its native aspect ratio respected.
// const HERO_VIDEO =
//   "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/welcome/madhuban-intro.mp4";
const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7356.4265978489275!2d77.490283!3d22.794559!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397db52b7cf3a4f1%3A0xb82cef7e7d9cfa61!2sMadhuban%20Resort%20By%20Somaiya!5e0!3m2!1sen!2sin!4v1747417125028!5m2!1sen!2sin";
const REVIEWS_LINK = "https://share.google/5u7E0QdYGlCa1dhik";
const DIRECTIONS_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=Madhuban+Eco+Retreat+Ratapani";

const HERO_OVERLAY =
  "linear-gradient(180deg, rgba(45,58,46,0.20) 0%, rgba(45,58,46,0.55) 60%, rgba(45,58,46,0.78) 100%)";

function formatINR(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getInitials(name) {
  const parts = name
    .split(/\s+/)
    .filter((s) => /^[A-Za-z]/.test(s));
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function Stars() {
  return (
    <span
      className="text-amber-400 text-xs tracking-wider"
      aria-label="5 out of 5 stars"
    >
      ★★★★★
    </span>
  );
}

export default function MadhubanLandingPage({ variant = "weekend" }) {
  const v = VARIANTS[variant] || VARIANTS.weekend;

  const formRef = useRef(null);
  const mapWrapRef = useRef(null);

  const [tab, setTab] = useState(variant === "dayout" ? "dayout" : "overnight");
  const [stayType, setStayType] = useState("glamping");
  const [checkin, setCheckin] = useState("");
  const [guests, setGuests] = useState("2-adults");
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckin(tomorrowISO());
  }, []);

  const readTracking = useCallback(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmTerm: params.get("utm_term") || "",
      utmContent: params.get("utm_content") || "",
      gclid: params.get("gclid") || "",
    };
  }, []);

  useEffect(() => {
    if (!mapWrapRef.current || mapVisible) return;
    const target = mapWrapRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [mapVisible]);

  const guestCount = useMemo(
    () => GUEST_OPTIONS.find((g) => g.value === guests)?.count ?? 2,
    [guests],
  );

  const estimate = useMemo(() => {
    if (tab === "dayout") return 1300 * guestCount;
    const found = STAY_TYPES.find((s) => s.value === stayType);
    if (!found || found.price == null) return 7500;
    return found.price;
  }, [tab, stayType, guestCount]);

  const estimateSubtitle =
    tab === "overnight" ? "Breakfast included" : "Lunch & activities included";

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openDayOuting = useCallback(() => {
    setTab("dayout");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phoneInput.trim();
    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }
    const digits = trimmedPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmitting(true);

    const stayLabel =
      tab === "overnight"
        ? STAY_TYPES.find((s) => s.value === stayType)?.label || ""
        : "";
    const guestLabel =
      GUEST_OPTIONS.find((g) => g.value === guests)?.label || "";
    const packageLabel = tab === "overnight" ? "Overnight Stay" : "Day Outing";

    const payload = {
      name: trimmedName,
      phone: trimmedPhone,
      package: packageLabel,
      stayType: stayLabel,
      checkin,
      guests: guestLabel,
      estimate: String(estimate),
      ...readTracking(),
      landingPage:
        typeof window !== "undefined" ? window.location.pathname : "",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => console.error("[lead post]", err));
    } catch (err) {
      console.error("[lead post]", err);
    }

    try {
      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      if (
        typeof window !== "undefined" &&
        typeof window.gtag === "function" &&
        conversionId
      ) {
        window.gtag("event", "conversion", {
          send_to: conversionId,
          value: 50,
          currency: "INR",
        });
      }
    } catch (err) {
      console.error("[gtag conversion]", err);
    }

    const lines = [
      "Hi, I'd like to book Madhuban Eco Retreat.",
      "",
      `Package: ${packageLabel}`,
    ];
    if (tab === "overnight") lines.push(`Room: ${stayLabel}`);
    lines.push(`Date: ${checkin}`);
    lines.push(`Guests: ${guestLabel}`);
    lines.push(`Estimate: ${formatINR(estimate)}`);
    lines.push("");
    lines.push(`Name: ${trimmedName}`);
    lines.push(`Phone: ${trimmedPhone}`);
    lines.push("");
    lines.push("Please confirm availability.");

    const message = lines.join("\n");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmitting(false);
  };

  return (
    <main className="bg-white text-stone-800">
      {/* ───── HERO ───── */}
      <section className="relative min-h-[560px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Madhuban Eco Retreat at the edge of Ratapani forest"
            className="w-full h-full object-cover object-bottom scale-105"
            fetchPriority="high"
            loading="eager"
          />
        </div>
        <div
          className="absolute inset-0 z-10"
          style={{ background: HERO_OVERLAY }}
        />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-10 md:pt-24 md:pb-20">
          <span className="inline-block text-[10px] sm:text-[11px] tracking-[0.18em] font-semibold text-white/90 border border-white/40 px-2.5 py-1 rounded-full mb-5">
            {v.badge}
          </span>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight font-bold max-w-3xl">
            {v.h1Pre}{" "}
            <em className="font-serif italic text-[#d8b66e]">{v.h1Em}</em>{" "}
            — {v.h1Post}
          </h1>
          <p className="mt-4 md:mt-6 text-sm md:text-base text-white/90 max-w-[30ch] sm:max-w-[40ch] md:max-w-[44ch] leading-relaxed">
            {v.sub}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={scrollToForm}
              className="bg-[#25d366] hover:bg-[#1da851] text-white text-sm md:text-base font-bold px-6 py-3.5 md:px-7 md:py-4 rounded-full shadow-lg hover:shadow-xl transition"
            >
              Check availability on WhatsApp
            </button>
            <a
              href={`tel:+${phone}`}
              className="bg-white/10 hover:bg-white/20 border border-white/40 text-white text-sm md:text-base font-semibold px-6 py-3.5 md:px-7 md:py-4 rounded-full transition backdrop-blur-sm"
            >
              Call +{phone}
            </a>
          </div>
          <div className="mt-7 pt-4 border-t border-white/20">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-medium text-white/70">
              1 hour from Bhopal · From ₹7,500 per night · Replies in 15 min
            </p>
          </div>
        </div>
      </section>

      {/* ───── WHY MADHUBAN ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8 md:mb-12">
            <p className="text-[11px] tracking-[0.18em] font-semibold text-brown-700 mb-2">
              WHY MADHUBAN
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight font-semibold">
              Why Madhuban
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                n: "01",
                t: "Inside Ratapani Tiger Reserve",
                d: "Not 'near the forest' — surrounded by it. Peacocks for alarm clocks, star-thick nights, langurs in the trees outside your tent.",
              },
              {
                n: "02",
                t: "Six ways to stay",
                d: "Mud houses, glamping tents on canvas, a stilted safari tent, a pool-side villa, classic camping. One property, six experiences.",
              },
              {
                n: "03",
                t: "A sattvic kitchen",
                d: "100% pure vegetarian, no alcohol. Garden-grown vegetables, tribal-village ingredients, food that genuinely tastes like the place it came from.",
              },
            ].map((b) => (
              <div key={b.n}>
                <div className="w-10 h-px bg-stone-300 mb-5" />
                <p className="text-4xl md:text-5xl text-green-700 mb-5 font-bold leading-none">
                  {b.n}
                </p>
                <h3 className="text-xl md:text-2xl text-stone-900 mb-3 font-semibold leading-tight">
                  {b.t}
                </h3>
                <p className="text-sm md:text-base text-stone-700 leading-relaxed">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 md:mt-12 text-sm md:text-base text-stone-500 italic max-w-3xl">
            Every stay includes breakfast, naturalist-led nature walks, pottery
            sessions, yoga, archery, and access to the pool.
          </p>
        </div>
      </section>

      {/* ───── STAYS ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 max-w-2xl">
            <p className="text-[11px] tracking-[0.18em] font-semibold text-brown-700 mb-2">
              WHERE YOU STAY
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight font-semibold">
              Where you&rsquo;ll sleep
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {STAYS.map((s) => (
              <article
                key={s.name}
                className="bg-white rounded-xl overflow-hidden ring-1 ring-stone-200 hover:ring-stone-300 hover:shadow-lg transition group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {s.tag ? (
                    <span className="absolute top-3 left-3 bg-white text-green-800 text-[11px] tracking-wide font-semibold px-2.5 py-1 rounded-full shadow-md">
                      {s.tag}
                    </span>
                  ) : null}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <h3 className="text-base sm:text-lg text-stone-900 font-semibold leading-tight">
                      {s.name}
                    </h3>
                    <span className="text-base sm:text-lg text-green-700 font-bold whitespace-nowrap">
                      {formatINR(s.price)}
                      <span className="text-[11px] text-stone-500 font-normal">
                        {" "}
                        /night
                      </span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───── DAY OUTING ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-gradient-to-br from-green-800 to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.18em] font-semibold text-white/70 mb-3">
            DAY OUTING
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-semibold">
            A full day in the wild —{" "}
            <em className="font-serif italic text-[#f1d28a]">
              ₹1,300 per person
            </em>
          </h2>
          <p className="mt-4 md:mt-5 text-sm md:text-base text-white/85 leading-relaxed mx-auto max-w-2xl">
            Pool access, full vegetarian lunch, naturalist-led walk, pottery
            session, archery, and evening tea. Open 9 AM to 6 PM. The easiest
            way to spend a Sunday.
          </p>
          <button
            type="button"
            onClick={openDayOuting}
            className="mt-6 bg-white text-green-800 hover:bg-stone-100 text-sm md:text-base font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
          >
            Book day outing
          </button>
        </div>
      </section>

      {/* ───── REVIEWS ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-700 bg-white border border-stone-200 rounded-full px-3 py-1.5 shadow-sm">
              <span className="font-bold text-green-800">4.8</span>
              <Stars />
              <span className="text-stone-500">on Google · 200+ reviews</span>
            </div>
            <p className="text-[11px] tracking-[0.18em] font-semibold text-brown-700 mt-5 mb-2">
              REVIEWS
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight font-semibold">
              What guests say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="bg-white border border-stone-200 rounded-md p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-1">
                  <Stars />
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    {r.date}
                  </span>
                </div>
                <blockquote className="text-sm text-stone-700 leading-relaxed line-clamp-3 mt-1 mb-4">
                  {r.text}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-green-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {getInitials(r.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {r.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {r.location}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline underline-offset-4 hover:text-green-800 text-xs sm:text-sm"
            >
              Read all reviews on Google →
            </a>
          </div>
        </div>
      </section>

      {/* ───── LOCATION ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch">
          <div className="flex flex-col h-full">
            <p className="text-[11px] tracking-[0.18em] font-semibold text-brown-700 mb-2">
              FINDING US
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight mb-3 font-semibold">
              Finding us
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed mb-6">
              Most guests come from Bhopal, Indore, and Gwalior.
            </p>
            <dl className="space-y-3 text-sm md:text-base text-stone-700">
              {[
                ["From Bhopal", "~60 km · 1 hour drive"],
                ["From Indore", "~190 km · 3.5 hours via NH47"],
                ["Nearest airport", "Bhopal (BHO) · 1.5 hours"],
                ["Nearest station", "Obaidullaganj · 30 min drive"],
                [
                  "Address",
                  "Near Ratapani Wildlife Sanctuary, Madhya Pradesh",
                ],
              ].map(([k, val]) => (
                <div
                  key={k}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-6 border-b border-stone-200 pb-2.5"
                >
                  <dt className="text-xs sm:text-sm font-semibold text-stone-500 sm:w-40 shrink-0">
                    {k}
                  </dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                OPEN DAILY
              </p>
              <p className="text-sm md:text-base text-stone-700">
                9 AM – 9 PM · Reservations via WhatsApp
              </p>
            </div>
            <a
              href={DIRECTIONS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start mt-auto pt-6 inline-block"
            >
              <span className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm md:text-base font-semibold px-5 py-2.5 rounded-full shadow hover:shadow-md transition">
                Get directions
              </span>
            </a>
          </div>
          <div
            ref={mapWrapRef}
            className="w-full h-[300px] md:h-[420px] rounded-xl overflow-hidden ring-1 ring-stone-200 bg-stone-200"
          >
            {mapVisible ? (
              <iframe
                title="Madhuban Eco Retreat location"
                src={MAP_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500 text-sm">
                Loading map…
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-12 md:py-16 lg:py-20 px-5 sm:px-8 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.18em] font-semibold text-brown-700 mb-2">
            QUESTIONS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight mb-8 md:mb-12 font-semibold">
            Common questions
          </h2>
          <ul className="divide-y divide-stone-200 border-t border-b border-stone-200">
            {FAQ.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 py-3.5 text-left"
                  >
                    <span className="text-sm md:text-base font-medium text-stone-900">
                      {item.q}
                    </span>
                    <span
                      className={`text-green-700 text-lg leading-none transition-transform shrink-0 ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {open ? (
                    <div className="pb-4 pr-8 text-sm md:text-base text-stone-600 leading-relaxed">
                      {item.a}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───── BOOKING FORM ───── */}
      <section
        ref={formRef}
        id="booking"
        className="py-12 md:py-16 lg:py-20 px-4 sm:px-8 bg-gradient-to-br from-stone-900 to-green-800 text-white"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-5 md:mb-8">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide">
              Check availability
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-white/75">
              Replies on WhatsApp in 15 minutes during 9 AM – 9 PM.
            </p>
          </div>

          <div className="bg-white text-stone-800 rounded-2xl shadow-xl ring-1 ring-stone-200 p-5 md:p-8">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-full mb-6 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setTab("overnight")}
                className={`py-2 rounded-full transition ${
                  tab === "overnight"
                    ? "bg-green-700 text-white shadow"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Overnight Stay
              </button>
              <button
                type="button"
                onClick={() => setTab("dayout")}
                className={`py-2 rounded-full transition ${
                  tab === "dayout"
                    ? "bg-green-700 text-white shadow"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Day Outing
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {tab === "overnight" ? (
                <div>
                  <label
                    htmlFor="stayType"
                    className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-1.5"
                  >
                    Accommodation Type
                  </label>
                  <select
                    id="stayType"
                    value={stayType}
                    onChange={(e) => setStayType(e.target.value)}
                    className="w-full max-w-full truncate bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm md:text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    {STAY_TYPES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkin"
                    className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-1.5"
                  >
                    {tab === "overnight" ? "Check-in date" : "Visit date"}
                  </label>
                  <input
                    id="checkin"
                    type="date"
                    min={todayISO()}
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    className="w-full max-w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm md:text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-1.5"
                  >
                    Guests
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full max-w-full truncate bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm md:text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    {GUEST_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm md:text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phoneInput"
                  className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-1.5"
                >
                  WhatsApp number
                </label>
                <input
                  id="phoneInput"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phoneInput}
                  onChange={(e) =>
                    setPhoneInput(e.target.value.replace(/[^\d+\s-]/g, ""))
                  }
                  placeholder="10-digit mobile number"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm md:text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                />
              </div>

              <div className="flex items-center justify-between bg-stone-50 border border-stone-100 rounded-xl p-3 sm:p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                    Estimate
                  </p>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {estimateSubtitle}
                  </p>
                </div>
                <p className="text-2xl md:text-3xl text-green-800 font-bold">
                  {formatINR(estimate)}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#25d366] hover:bg-[#1da851] disabled:opacity-60 text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded-full shadow-lg hover:shadow-xl transition"
              >
                {submitting ? "Opening WhatsApp…" : "Get quote on WhatsApp"}
              </button>
              <p className="text-center text-[11px] sm:text-xs text-stone-500">
                We reply in 15 minutes during 9 AM – 9 PM. No spam.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-stone-900 text-stone-400 py-5 px-5 sm:px-8">
        <p className="max-w-6xl mx-auto text-center text-[11px] sm:text-xs">
          © {new Date().getFullYear()} Madhuban Eco Retreat · Near Ratapani
          Wildlife Sanctuary, Madhya Pradesh
        </p>
      </footer>

      {/* ───── MOBILE STICKY CTA ───── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200 shadow-2xl">
        <div className="grid grid-cols-2 gap-2 p-2.5">
          <a
            href={`tel:+${phone}`}
            className="text-center py-2.5 rounded-full border border-green-700 text-green-800 text-sm font-semibold"
          >
            Call
          </a>
          <button
            type="button"
            onClick={scrollToForm}
            className="bg-[#25d366] hover:bg-[#1da851] text-white text-sm font-bold py-2.5 rounded-full shadow-md"
          >
            Book on WhatsApp
          </button>
        </div>
      </div>
      <div className="md:hidden h-16" aria-hidden="true" />
    </main>
  );
}
