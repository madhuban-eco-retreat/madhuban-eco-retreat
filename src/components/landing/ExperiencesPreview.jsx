"use client";

import { useEffect, useRef, useState } from "react";
import MainNavigation from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Design preview for the redesigned /experiences page (Stitch output,
 * client-approved layout/content, ported into real Next.js/React code).
 * Lives at /experiences-preview (noindex) until the client signs off, at
 * which point this becomes the actual /experiences page.
 *
 * Uses the site's real Header/Footer (not Stitch's own) — the real Header
 * is `sticky` and always solid, not transparent-over-hero, so the hero
 * below no longer needs to compensate for a fixed/overlaying header the
 * way the first draft did.
 *
 * Buttons follow the exact classes the real "Book Now" button uses
 * elsewhere on the site (rounded-full, font-primary, sentence case) rather
 * than Stitch's small-caps tracking-widest style, which doesn't match how
 * buttons look anywhere else on this site.
 *
 * Image note: Stitch's own placeholder image URLs are temporary AI-preview
 * links, not real hosted assets, so every image below has been swapped for
 * a real photo already live on the site. Two (Bush Dinner, Village Walk)
 * don't have a dedicated photo yet — flagged inline — and are standing in
 * on the closest thematically-honest image available until real photography
 * exists for those two specific experiences.
 */

const IMG = {
  heroAerial:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-aerial-view.jpg",
  tiger:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-tiger-image(1).jpg",
  hiking:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/experiences/students-walking-ratapani-tiger-reserve-madhuban-eco-retreat-team.webp",
  camping:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-camping-hammock-under-100kb.jpg",
  // Placeholder — no dedicated bush-dinner photo exists yet.
  bushDinner:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/experiences/adventure-activity-at-madhuban-eco-retreat-bhopal.webp",
  // Placeholder — using the Gond-inspired mud-house architecture as the
  // closest honest stand-in until a real village-walk photo exists.
  village:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/readyForEco/mud-house-madhuban-eco-retreat-bhopal.webp",
};

const STATS = [
  { target: 150, suffix: "+", label: "Bird species recorded across Ratapani" },
  { target: 1, suffix: "hr", label: "From Bhopal", unitInline: true },
  { target: 5, suffix: "", label: "Ways to experience the reserve" },
  { target: 1, suffix: "", label: "Tiger reserve at the doorstep" },
];

const DAY_MOMENTS = [
  { time: "06:00 AM", title: "Sunrise Safari", img: IMG.tiger, desc: "First light over the sal forest, and the best chance of spotting movement before the heat sets in." },
  { time: "10:30 AM", title: "Midday Forest Walk", img: IMG.hiking, desc: "Slower, quieter, closer to the ground — the details you miss from a vehicle." },
  { time: "03:30 PM", title: "Afternoon in the Village", img: IMG.village, desc: "Tea with a Gond family, and a look at architecture that's shaped this land for generations." },
  { time: "07:30 PM", title: "Bush Dinner at Dusk", img: IMG.bushDinner, desc: "Firelight, forest sounds, dinner under a sky with no city glow to compete with." },
];

const REVIEWS = [
  { text: "One of the best experiences I've had near Bhopal. The stay, the food, pottery, yoga, the healing power of nature — everything was top notch. So therapeutic. Going back relaxed and grateful.", name: "Shristi Pandey", location: "Local Guide" },
  { text: "Truly enriching — scenic surroundings, comfortable stay, nature walks, birding, delicious food. The respect for tribal communities of Madhya Pradesh is beautifully reflected in the architecture and cuisine.", name: "Amit Jethwa", location: "Local Guide" },
  { text: "Stayed overnight and had a truly amazing experience. Meditation, yoga, swimming, food — everything was perfect. Staff was outstanding. Highly recommended for family stay and a peaceful getaway.", name: "Anshul Agrawal", location: "Bhopal" },
];

const FAQS = [
  { q: "How far is Madhuban from Bhopal?", a: "About an hour's drive from Bhopal, on the edge of Ratapani Tiger Reserve." },
  { q: "Can I do more than one experience during my stay?", a: "Yes — most guests combine two or three across a weekend stay; talk to us when booking and we'll help plan the pace." },
  { q: "Do I need to be an experienced hiker to join a hiking trail?", a: "No — trails are chosen to suit the group, from an easy morning walk to a longer trek for more experienced hikers." },
  { q: "Is the safari inside the actual tiger reserve?", a: "Yes, safaris go into Ratapani Tiger Reserve itself with a naturalist guide." },
  { q: "Are these experiences suitable for children?", a: "Most are — the forest walk, village walk and bush dinner work well for families; the safari and camping are enjoyable for children old enough to sit through a few quiet hours." },
];

const EXPERIENCE_CARDS = [
  {
    tag: "Adventure",
    title: "Forest Hiking Trails",
    img: IMG.hiking,
    desc: "Guided hikes across Ratapani's forest trails and sandstone ridgelines, at a pace suited to you — from an easy morning walk to a longer trek with sweeping valley views. One of the more rewarding ways to experience Ratapani Tiger Reserve on foot, near Bhopal.",
    idealFor: "Trekkers, fitness travelers, nature photographers",
    span: "md:col-span-7",
  },
  {
    tag: "Adventure",
    title: "Jungle Camping",
    img: IMG.camping,
    desc: "Spend a night under canvas at the edge of the reserve — campfire, star-filled skies, and the forest's own night sounds instead of traffic. A camping experience near Bhopal built for groups, couples or anyone who wants to properly disconnect for a night.",
    idealFor: "Adventure groups, couples, corporate outings",
    span: "md:col-span-5",
  },
  {
    tag: "Dining",
    title: "Bush Dinner Under the Stars",
    img: IMG.bushDinner,
    desc: "A private open-air dinner set up in a forest clearing — firelight, a clear night sky, and a menu drawing on local, regional flavors. One of the more memorable ways to mark an occasion at a resort near Bhopal, away from anything resembling a banquet hall.",
    idealFor: "Couples, anniversaries, special occasions",
    span: "md:col-span-5",
  },
  {
    tag: "Culture",
    title: "Cultural & Heritage Village Walk",
    img: IMG.village,
    desc: "Walk through the Gond villages bordering Ratapani with a local guide, learning about tribal architecture, traditional crafts and forest-based livelihoods that have shaped this landscape for generations. A genuine cultural experience near Bhopal, not a staged one.",
    idealFor: "Culture & history enthusiasts, families, curious travelers",
    span: "md:col-span-7",
  },
];

// Matches the real "Book Now" button exactly (see Header.jsx).
const BTN_PRIMARY =
  "inline-flex items-center justify-center rounded-full px-7 py-3 font-primary text-base font-medium text-warm-beige bg-earth-brown hover:bg-[rgb(132,116,85)] transition-colors whitespace-nowrap";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-primary text-base font-medium text-earth-brown border border-earth-brown hover:bg-earth-brown/10 transition-colors whitespace-nowrap";

export default function ExperiencesPreview() {
  const [openFaq, setOpenFaq] = useState(null);
  const heroParallaxRef = useRef(null);
  const statStripRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  // Hero parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (heroParallaxRef.current && window.scrollY < 1000) {
        heroParallaxRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.35}px, 0)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-triggered fade-up reveals
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up-element");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stat count-up, triggers once when the strip scrolls into view
  useEffect(() => {
    if (!statStripRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsStarted) {
            setStatsStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statStripRef.current);
    return () => observer.disconnect();
  }, [statsStarted]);

  return (
    <div className="bg-cream font-body text-charcoal antialiased">
      <style jsx global>{`
        .fade-up-element {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up-element.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .underline-sweep {
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: left bottom;
          transition: background-size 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .underline-sweep {
          background-size: 100% 1px;
        }
      `}</style>

      <MainNavigation />

      <main className="w-full">
        {/* HERO */}
        <section className="relative w-full h-[60vh] min-h-[480px] max-h-[680px] overflow-hidden flex items-end justify-start bg-charcoal">
          <div
            ref={heroParallaxRef}
            className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url('${IMG.heroAerial}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-charcoal/40 to-black/30" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 max-w-[1380px] w-full mx-auto px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
            <div className="max-w-4xl space-y-5">
              <div className="fade-up-element" style={{ transitionDelay: "150ms" }}>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-cream">Ratapani Tiger Reserve</span>
                </div>
              </div>
              <h1
                className="fade-up-element font-primary text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight"
                style={{ transitionDelay: "350ms" }}
              >
                Experiences at Madhuban — Ratapani Tiger Reserve, Near Bhopal
              </h1>
              <p
                className="fade-up-element text-lg md:text-xl text-white/85 max-w-2xl font-light leading-relaxed"
                style={{ transitionDelay: "550ms" }}
              >
                Five ways to step into the forest, just an hour from Bhopal.
              </p>
            </div>
          </div>
        </section>

        {/* INTRO QUOTE */}
        <section className="w-full bg-cream py-16 md:py-20 border-b border-earth-brown/10">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center fade-up-element">
            <span className="text-xs uppercase tracking-[0.25em] text-earth-brown font-semibold block mb-6">Unscripted Immersion</span>
            <div className="w-10 h-px bg-gold-accent mx-auto mb-8" />
            <p className="font-primary italic text-2xl md:text-3xl text-charcoal leading-relaxed md:leading-[1.5]">
              "Madhuban Eco Retreat sits on the edge of Ratapani Tiger Reserve, where dry deciduous teak forest, sandstone ridges and centuries-old tribal villages meet. Whether you have an afternoon or a full weekend, there's a way to experience it that matches your pace — from a guided jungle safari to a quiet hike, an overnight camp under canvas, a bush dinner by firelight, or an afternoon walking through a Gond village. Each experience near Bhopal is led by people who live and work on this forest's edge."
            </p>
            <div className="w-10 h-px bg-gold-accent mx-auto mt-8" />
          </div>
        </section>

        {/* FEATURED — JUNGLE SAFARI */}
        <section className="w-full bg-cream py-10 md:py-14">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="mb-5 flex items-center justify-between fade-up-element">
              <span className="text-xs tracking-[0.2em] uppercase text-earth-brown font-semibold">Flagship Experience</span>
              <span className="text-xs tracking-wider text-charcoal/50">01 / 05</span>
            </div>
            <a
              className="group block relative w-full h-[480px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl cursor-pointer fade-up-element"
              href="/experiences/jungle-safari"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${IMG.tiger}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 sm:p-12 md:p-14 flex flex-col justify-end text-white max-w-3xl">
                <div className="mb-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-gold-accent/90 text-charcoal font-semibold text-xs uppercase tracking-widest backdrop-blur-sm">
                    Wildlife
                  </span>
                </div>
                <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4 group-hover:text-cream transition-colors">
                  Jungle Safari
                </h2>
                <p className="text-white/85 text-base sm:text-lg font-light leading-relaxed mb-6 max-w-2xl">
                  Ride into Ratapani Tiger Reserve with a naturalist guide, tracking pugmarks, spotting deer, sloth bears and over 150 recorded bird species across the reserve's teak and sal forest. A jungle safari near Bhopal that puts you inside the wilderness, not just looking at it.
                </p>
                <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-white/60 mb-0.5">Ideal for</span>
                    <span className="text-sm font-light text-white/95">Wildlife enthusiasts, photographers, families</span>
                  </div>
                  <div className="inline-flex items-center gap-2 font-primary text-sm font-medium text-gold-accent group-hover:text-white transition-colors duration-300">
                    <span>Learn More</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ASYMMETRIC GRID — 4 EXPERIENCES */}
        <section className="w-full bg-cream pb-16 md:pb-20">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {EXPERIENCE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className={`group ${card.span} bg-cream rounded-2xl overflow-hidden border border-earth-brown/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col cursor-pointer fade-up-element`}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-warm-beige/20">
                    <img
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      src={card.img}
                    />
                    <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors duration-500" />
                    <div className="absolute top-5 left-5">
                      <span className="inline-block px-3 py-1 rounded bg-cream/95 backdrop-blur-md text-earth-brown text-xs font-semibold uppercase tracking-wider shadow-sm">
                        {card.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h3 className="font-primary text-2xl md:text-3xl text-charcoal group-hover:text-earth-brown transition-colors">
                        <span className="underline-sweep text-earth-brown">{card.title}</span>
                      </h3>
                      <p className="text-charcoal/70 font-light text-base leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-earth-brown/15 flex items-center justify-between">
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-charcoal/50 mb-0.5">Ideal for</span>
                        <span className="text-xs md:text-sm text-charcoal font-light">{card.idealFor}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-primary text-sm font-medium text-earth-brown group-hover:text-gold-accent transition-colors">
                        <span>Learn More</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BY THE NUMBERS */}
        <section ref={statStripRef} className="w-full bg-charcoal text-white py-16 border-y border-white/10">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center max-w-xl mx-auto mb-10 fade-up-element">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-accent font-semibold block mb-3">By the Numbers</span>
              <h3 className="font-primary text-2xl md:text-3xl text-white">An Untamed Sanctuary in Central India</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} started={statsStarted} />
              ))}
            </div>
          </div>
        </section>

        {/* A DAY AT MADHUBAN */}
        <section className="w-full bg-cream py-16 md:py-20">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-2xl mb-10 fade-up-element">
              <span className="text-xs uppercase tracking-[0.25em] text-earth-brown font-semibold block mb-3">Rhythm of the Wilderness</span>
              <h2 className="font-primary text-3xl md:text-4xl text-charcoal">A Day at Madhuban</h2>
              <p className="text-charcoal/70 font-light text-base mt-2">The passage of light and stillness, from pre-dawn mist to ember-lit clear skies.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DAY_MOMENTS.map((m) => (
                <div key={m.title} className="group flex flex-col space-y-3 fade-up-element">
                  <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-sm bg-warm-beige/20">
                    <img alt={m.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={m.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded text-white text-[11px] tracking-widest uppercase font-semibold">{m.time}</span>
                  </div>
                  <div className="space-y-1.5 px-1">
                    <h4 className="font-primary text-xl text-charcoal">{m.title}</h4>
                    <p className="text-sm text-charcoal/70 font-light leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY DIFFERENT — 3 PILLARS */}
        <section className="w-full bg-warm-beige/20 py-16 md:py-20">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-2xl mb-10 fade-up-element">
              <span className="text-xs uppercase tracking-[0.25em] text-earth-brown font-semibold block mb-3">Philosophy &amp; Cadence</span>
              <h2 className="font-primary text-3xl md:text-4xl text-charcoal">Why an experience at Madhuban is different</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: "Led by people who live here", desc: "Every guide is local to Ratapani, not flown in for the season.", tag: "Indigenous Knowledge" },
                { title: "Small groups, real pace", desc: "No herding between checkpoints; each experience is shaped around the people on it.", tag: "Private & Unrushed" },
                { title: "Inside the forest's edge", desc: "Every experience starts from the resort itself, not a 90-minute transfer to a \u201cwildlife zone.\u201d", tag: "Direct Sanctuary Access" },
              ].map((p) => (
                <div key={p.title} className="relative bg-cream p-6 md:p-8 rounded-2xl border border-earth-brown/15 shadow-sm flex flex-col justify-between fade-up-element">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-warm-beige/40 flex items-center justify-center text-earth-brown mb-5 text-2xl">●</div>
                    <h4 className="font-primary text-2xl text-charcoal mb-3">{p.title}</h4>
                    <p className="text-charcoal/70 font-light text-base leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-earth-brown/15 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-accent" />
                    <span className="text-xs uppercase tracking-wider text-charcoal/50">{p.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GUEST REVIEWS */}
        <section className="w-full bg-cream py-16 md:py-20 border-t border-earth-brown/10">
          <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-10 fade-up-element">
              <span className="text-xs uppercase tracking-[0.25em] text-earth-brown font-semibold block mb-3">Guest Voices</span>
              <h2 className="font-primary text-3xl md:text-4xl text-charcoal">What Guests Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {REVIEWS.map((r) => (
                <div key={r.name} className="bg-warm-beige/15 p-6 md:p-8 rounded-2xl border border-earth-brown/15 flex flex-col justify-between relative fade-up-element">
                  <span className="font-primary text-6xl text-earth-brown/15 absolute top-4 right-6 select-none">"</span>
                  <p className="font-primary italic text-base md:text-lg text-charcoal leading-relaxed mb-6">"{r.text}"</p>
                  <div className="pt-4 border-t border-earth-brown/15">
                    <p className="font-medium text-sm text-charcoal">{r.name}</p>
                    <p className="text-xs text-charcoal/50 font-light">{r.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full bg-cream py-16 md:py-20 border-t border-earth-brown/10">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10 fade-up-element">
              <span className="text-xs uppercase tracking-[0.25em] text-earth-brown font-semibold block mb-3">Planning Ahead</span>
              <h2 className="font-primary text-3xl md:text-4xl text-charcoal">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={item.q} className="border border-earth-brown/15 rounded-xl overflow-hidden bg-white/50 fade-up-element">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-primary text-lg text-charcoal hover:text-earth-brown transition-colors"
                    >
                      <span>{item.q}</span>
                      <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-out bg-cream/50"
                      style={{ maxHeight: isOpen ? "300px" : "0px" }}
                    >
                      <p className="p-5 pt-0 text-charcoal/70 font-light text-base leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="w-full bg-cream py-16 md:py-20 border-t border-earth-brown/10">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-6 fade-up-element">
            <h2 className="font-primary text-4xl md:text-5xl text-charcoal tracking-tight">Ready to plan your stay?</h2>
            <p className="text-charcoal/70 font-light text-lg max-w-xl mx-auto leading-relaxed">
              Every experience above can be arranged as part of your stay at Madhuban Eco Retreat, on the edge of Ratapani Tiger Reserve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a className={BTN_PRIMARY} href="/stay-in-ratapani-tiger-reserve">
                Book Your Stay
              </a>
              <a className={BTN_OUTLINE} href="https://wa.me/919770558419" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ stat, started }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const startTime = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * stat.target));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(stat.target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, stat.target]);

  return (
    <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="font-primary text-4xl sm:text-5xl lg:text-6xl text-gold-accent mb-2">
        <span>{value}</span>
        {stat.unitInline ? (
          <span className="text-2xl sm:text-3xl font-body font-light ml-1">{stat.suffix}</span>
        ) : (
          <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
        )}
      </div>
      <p className="text-xs sm:text-sm font-light text-white/80 max-w-[200px] mx-auto leading-relaxed">{stat.label}</p>
    </div>
  );
}
