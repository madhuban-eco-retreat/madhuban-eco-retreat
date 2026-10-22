import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Flag,
  Home,
  Layers,
  MessageCircle,
  Mountain,
  PawPrint,
  Phone,
  Route,
  TreePine,
  Bird,
  UserCheck,
  Users,
  Utensils,
  Sparkles,
  Info,
} from "lucide-react";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { CountUp, HeroPhoto } from "@/components/safari/SafariClient";
import { StickyBookBar, Timeline } from "@/components/jungleSafari/JungleSafariClient";
import { TrailProfile } from "@/components/hike/HikeClient";
import { PAGE_URL, PRICE, UPDATED_ISO, UPDATED_LABEL } from "@/components/hike/hikeData";

/**
 * /experiences/ratapani-hike-experience — the 12 km guided hike from the Saru Maru
 * caves to Madhuban. Brand colours (earth-brown, warm beige, cream, bronze),
 * Playfair headings and Lato body text; only Madhuban's own photographs, all
 * static. To swap a photo, change its line in IMG below.
 */

const SITE = "https://www.madhubanecoretreat.com";
const R2 = "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/";
const WA = (t) => `https://wa.me/919770558419?text=${encodeURIComponent(t)}`;
const WHATSAPP = WA("Hi, I'd like to book the Ratapani Hike Experience.");
const enc = (p) => `${R2}${encodeURI(p)}`;

const IMG = {
  hero: enc("experiences/forest-walk/Ratapani Forest Walk With Madhuban Eco Retreat Team.avif"),
  caves: enc("gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal.jpg"),
  valley: enc("gallery/nature/nature6.jpg"),
  teak: enc("experiences/forest-walk/Nature & Forest From Madhuban Eco Retreat - 1.avif"),
  ridge: enc("gallery/nature/nature12.jpg"),
  sacred: enc("gallery/nature/nature9.jpg"),
  arrive: `${R2}home/banner/desktop/Madhuban_Eco_Retreat_3000x1688.jpg`,
  walkers: enc("experiences/forest-walk/nature-visit-ratapani-madhuban-eco-retreat-bhopal-2.avif"),
};

const FACTS = [
  [Route, "Distance", "12 km, one way, Saru Maru to Madhuban"],
  [Mountain, "Highest point", "About 410 m"],
  [Flag, "Start", "Saru Maru caves"],
  [Home, "Finish", "Madhuban Eco Retreat"],
  [Clock, "Time", "About 8 hours with a lunch break (7:30 AM start, back around 3:30 PM)"],
  [Users, "Group size", "Minimum 4 guests"],
  [UserCheck, "Best for", "Nature lovers, birders, photographers, families with older children, corporate and school groups"],
  [CalendarDays, "Season", "Starts October 2026"],
];

const STOPS = [
  {
    title: "Saru Maru caves",
    tag: "Where you start",
    text: "Your hike starts at the ancient Buddhist monastic site. See the caves and get a feel for how Buddhist monastics, including nuns, lived here.",
    img: IMG.caves,
    alt: "Saru Maru Buddhist caves near Ratapani, where the Madhuban hike begins",
  },
  {
    title: "Vindhyan valley and seasonal streams",
    tag: "Into the valley",
    text: "Find your path down into the valley, crossing seasonal streams along the way.",
    img: IMG.valley,
    alt: "Vindhyan valley forest on the Ratapani hike near Madhuban",
  },
  {
    title: "Dense teak forest",
    tag: "Under the canopy",
    text: "Walk into thick teak forest where the canopy closes in and the air cools. Sandstone outcrops, rich plant life and animal signs, including pugmarks, are often seen.",
    img: IMG.teak,
    alt: "Teak forest trail in Ratapani Tiger Reserve near Madhuban Eco Retreat",
  },
  {
    title: "Grassland and the 410 m ridge",
    tag: "The high point",
    text: "Climb out into open grassland and onto a sandstone mountaintop with wide views, then a steep descent.",
    img: IMG.ridge,
    alt: "Open ridge and grassland view on the Ratapani forest hike",
  },
  {
    title: "Sacred spots and forest patches",
    tag: "Along the trail",
    text: "Pass a revered spot on the trail and patches of palash and saj trees.",
    img: IMG.sacred,
    alt: "Palash and saj trees on the Ratapani hiking trail",
  },
  {
    title: "Arrive at Madhuban",
    tag: "Where you finish",
    text: "Finish at the eco-lodge for tea and rest.",
    img: IMG.arrive,
    alt: "Madhuban Eco Retreat eco-lodge at the edge of Ratapani Tiger Reserve",
  },
];

const NOTICE = [
  [Bird, "Birds and butterflies", "Listen and look for forest birds and butterflies as the trail changes."],
  [Layers, "Changing soil and rock", "Every layer has its own soil and its own trees."],
  [TreePine, "Trees", "Teak, saj, palash and more."],
  [PawPrint, "Tracks and signs", "Pugmarks and other animal signs. Wildlife sightings are never guaranteed."],
];

const DAY = [
  ["7:00 AM", "Reporting at Madhuban"],
  ["7:15 AM", "Welcome and trail briefing"],
  ["7:30 AM", "Travel to Saru Maru by our open gypsy, or in your own vehicle, and hike departure"],
  ["8:00 AM onwards", "Guided hike"],
  ["12:30 – 1:30 PM", "Lunch and rest"],
  ["2:30 – 3:30 PM", "Return towards Madhuban"],
  ["4:00 PM", "Experience ends"],
];

const INCLUDES = [
  "Guided nature hike and trail",
  "Nature interpretation by a guide or naturalist",
  "Birdwatching and spotting of plants and animals",
  "Packed breakfast and lunch",
  "Drinking water",
  "Trail briefing and forest guidelines",
  "Madhuban hospitality",
];

const CARRY =
  "Comfortable trekking shoes, hat or cap, sunglasses, light clothing, personal medicines, insect repellent, sunscreen, water bottle, small backpack, binoculars or camera.";

const FAQS = [
  ["Where does the Ratapani hike start and end?", "It starts at the Saru Maru caves and ends at Madhuban. We take you to the start by open gypsy, or you can come in your own vehicle."],
  ["How long is the hike and how hard is it?", "It is 12 km one way and takes about 8 hours with a lunch break. There is a climb to about 410 m and a steep descent, so a steady walking pace and reasonable fitness help. Tell us about your group when you book."],
  ["What is included in the price?", "A guide, breakfast, lunch, drinking water, the trail briefing and Madhuban hospitality. The price is ₹2,000 per person for groups of 4 or more."],
  ["When is the best time for hiking near Bhopal?", "The hike starts in October 2026. The cooler months, from October to February, are the most comfortable, and the trail has seasonal streams."],
  ["What should I carry and wear?", "Trekking shoes, a hat, sunscreen, insect repellent, a water bottle, a small backpack, and binoculars or a camera if you have them."],
];

const BTN_PRIMARY =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-earth-brown px-7 py-3 text-base font-medium text-warm-beige shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(132,116,85)]";
const BTN_LIGHT =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-warm-beige px-7 py-3 text-base font-medium text-earth-brown transition duration-300 hover:-translate-y-0.5 hover:bg-cream";
const BTN_GHOST =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-warm-beige/70 px-7 py-3 text-base font-medium text-warm-beige transition duration-300 hover:-translate-y-0.5 hover:bg-warm-beige/15";
const WRAP = "mx-auto w-full max-w-[1240px] px-4 md:px-6";
const SECTION = "py-12 md:py-16";
const EYEBROW = "text-xs font-bold uppercase tracking-[3px] text-[#9A8864]";
const H2 = "mt-2 font-primary text-[28px] leading-9 text-charcoal md:text-[38px] md:leading-[46px]";
const CARD = "rounded-2xl border border-[#CEC5B9]/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]";

export const SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Experiences", item: `${SITE}/experiences` },
      { "@type": "ListItem", position: 3, name: "Ratapani Hike Experience", item: PAGE_URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Ratapani Hike Experience: Hiking Near Bhopal, 12 km Forest Trail",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "Madhuban Eco Retreat", url: `${SITE}/` },
    primaryImageOfPage: { "@type": "ImageObject", url: IMG.hero },
    datePublished: UPDATED_ISO,
    dateModified: UPDATED_ISO,
    author: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#glance-title"] },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${PAGE_URL}#hike`,
    name: "Ratapani Hike Experience: 12 km Forest Hike from Saru Maru to Madhuban",
    description:
      "A guided 12 km day hike from the Saru Maru caves to Madhuban Eco Retreat through the Vindhyan valley, seasonal streams and dense teak forest. Breakfast and lunch included. Minimum 4 guests.",
    image: [IMG.hero],
    brand: { "@id": `${SITE}/#organization` },
    offers: {
      "@type": "Offer",
      name: "Ratapani Hike Experience, per person",
      price: PRICE,
      priceCurrency: "INR",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE}/#organization` },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faq`,
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

export default function RatapaniHikePage() {
  return (
    <main className="bg-cream text-charcoal">
      {/* 1. Hero */}
      <section className="relative isolate flex min-h-[540px] items-end overflow-hidden bg-[#3A3123] md:min-h-[620px]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <HeroPhoto src={IMG.hero} alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A3123] via-[#3A3123]/55 to-[#3A3123]/20" />
        </div>
        <div className={`${WRAP} pb-10 pt-16 md:pb-14`}>
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-warm-beige/85">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/experiences" className="hover:underline">Experiences</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-warm-beige">Ratapani Hike Experience</li>
            </ol>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]">Hiking near Bhopal · Ratapani Tiger Reserve</p>
          <h1 className="mt-3 max-w-[860px] font-primary text-[34px] leading-[42px] text-cream md:text-[54px] md:leading-[62px]">
            Ratapani Hike Experience: 12 km Forest Hike from Saru Maru to Madhuban
          </h1>
          <p className="mt-4 max-w-[640px] text-base font-light leading-7 text-warm-beige md:text-lg md:leading-8">
            A guided day hike through the Vindhyan valley, seasonal streams and dense teak forest, with breakfast and lunch included. About an hour from Bhopal.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#booking-card" className={BTN_LIGHT}>Book the hike <ArrowRight size={16} aria-hidden="true" /></a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {[
              [Route, "12 km trail"],
              [UserCheck, "Guided by a naturalist"],
              [Utensils, "Breakfast and lunch included"],
              [Sparkles, "From ₹2,000 per person"],
            ].map(([Icon, t], i) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-full border border-warm-beige/40 bg-[#3A3123]/50 px-3.5 py-1.5 text-sm text-warm-beige backdrop-blur-sm motion-safe:[animation:chipIn_700ms_cubic-bezier(.2,.7,.2,1)_both]"
                style={{ animationDelay: `${300 + i * 120}ms` }}
              >
                <Icon size={15} aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div id="hero-end" aria-hidden="true" />

      {/* 2. The hike at a glance */}
      <section className={`${SECTION} pb-6 md:pb-8`} aria-labelledby="glance-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Quick summary</p>
          <h2 id="glance-title" className={H2}>The hike at a glance</h2>
          <RevealOnScroll>
            <div className={`${CARD} mt-6 grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-10`}>
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {FACTS.map(([Icon, k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-beige text-earth-brown">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[1.5px] text-[#9A8864]">{k}</dt>
                      <dd className="text-[15px] leading-6 text-charcoal/85">{v}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col justify-center rounded-xl bg-[#F4EFE8] p-4 md:p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#9A8864]">Trail profile</p>
                  <p className="text-sm font-medium text-earth-brown"><CountUp to={12} /> km</p>
                </div>
                <div className="mt-2"><TrailProfile /></div>
                <p className="mt-2 text-xs text-charcoal/60">Illustrative sketch, not to scale.</p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. The route */}
      <section className={SECTION} aria-labelledby="route-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Trail progression</p>
          <h2 id="route-title" className={H2}>Hiking near Bhopal: the route, step by step</h2>
          <p className="mt-2 max-w-[640px] text-base leading-7 text-charcoal/75">Six stops from the Saru Maru caves to Madhuban, on foot and with a guide.</p>
          <div className="mt-8 max-w-[1000px]">
            <Timeline>
              {STOPS.map((s, i) => (
                <li key={s.title} className="relative pb-4">
                  <span aria-hidden="true" className="absolute -left-8 top-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-earth-brown text-[10px] font-bold text-warm-beige">{i + 1}</span>
                  <RevealOnScroll>
                    <article className={`${CARD} grid overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]`}>
                      <div className="p-5 md:p-6">
                        <p className={EYEBROW}>{s.tag}</p>
                        <h3 className="mt-1 font-primary text-[22px] leading-8 text-charcoal">{s.title}</h3>
                        <p className="mt-2 text-[15px] leading-6 text-charcoal/80">{s.text}</p>
                      </div>
                      <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#E0D1BC] md:aspect-auto md:min-h-[170px]">
                        <Image
                          src={s.img}
                          alt={s.alt}
                          fill
                          quality={75}
                          sizes="(min-width:768px) 300px, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </article>
                  </RevealOnScroll>
                </li>
              ))}
            </Timeline>
          </div>
        </div>
      </section>

      {/* 4. What you will notice */}
      <section className={`${SECTION} bg-[#F4EFE8]`} aria-labelledby="notice-title">
        <div className={WRAP}>
          <p className={EYEBROW}>On the trail</p>
          <h2 id="notice-title" className={H2}>What you will notice on the trail</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NOTICE.map(([Icon, title, text], i) => (
              <RevealOnScroll key={title} delay={i * 90}>
                <article className={`${CARD} h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-beige text-earth-brown"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-3 font-primary text-xl leading-7 text-charcoal">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-charcoal/75">{text}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Your day and the package */}
      <section className={SECTION} aria-labelledby="package-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Itinerary and package</p>
          <h2 id="package-title" className={H2}>Your day and the package</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <RevealOnScroll>
              <div className={`${CARD} h-full p-5 md:p-7`}>
                <h3 className="font-primary text-2xl leading-8 text-charcoal">A day on the trail</h3>
                <div className="mt-5">
                  <Timeline>
                    {DAY.map(([when, what]) => (
                      <li key={when} className="relative">
                        <span aria-hidden="true" className="absolute -left-8 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-white bg-[#9A8864]" />
                        <p className="text-sm font-bold text-earth-brown">{when}</p>
                        <p className="text-[15px] leading-6 text-charcoal/80">{what}</p>
                      </li>
                    ))}
                  </Timeline>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div id="booking-card" className={`${CARD} h-full scroll-mt-24 p-5 md:p-7`}>
                <p className={EYEBROW}>The package</p>
                <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Ratapani Hike Experience</h3>
                <p className="mt-3 font-primary text-[36px] leading-10 text-earth-brown">
                  ₹{PRICE.toLocaleString("en-IN")}
                  <span className="ml-2 font-sans text-sm font-normal text-charcoal/70">per person</span>
                </p>
                <p className="text-sm text-charcoal/70">Minimum group of 4 guests.</p>
                <p className="mt-4 text-sm font-bold text-earth-brown">Includes</p>
                <ul className="mt-2 space-y-2.5">
                  {INCLUDES.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-6 text-charcoal/80">
                      <Check size={18} className="mt-0.5 shrink-0 text-[#9A8864]" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-lg bg-[#F4EFE8] p-3 text-sm leading-5 text-charcoal/80">
                  Customised hikes are available for larger groups, corporate teams, school groups and private experiences.
                </p>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={`${BTN_PRIMARY} mt-5 w-full`}>Book the hike</a>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll>
            <div className={`${CARD} mt-5 flex flex-col gap-2 p-4 md:flex-row md:items-start md:gap-4 md:p-5`}>
              <p className="flex shrink-0 items-center gap-2 font-medium text-earth-brown">
                <Backpack size={20} aria-hidden="true" /> What to carry
              </p>
              <p className="text-[15px] leading-6 text-charcoal/80">{CARRY}</p>
            </div>
          </RevealOnScroll>
          <p className="mt-4 flex items-start gap-2 text-sm leading-5 text-charcoal/65">
            <Info size={16} className="mt-0.5 shrink-0 text-[#9A8864]" aria-hidden="true" />
            The hike is in a forest and wildlife area. Please follow the guide&apos;s instructions and forest rules. Wildlife sightings are not guaranteed, and the trail and timings may change with weather and forest regulations.
          </p>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className={`${SECTION} bg-[#F4EFE8] pt-12`} aria-labelledby="faq-title">
        <div className={`${WRAP} max-w-[900px]`}>
          <p className={EYEBROW}>Good to know</p>
          <h2 id="faq-title" className={H2}>Ratapani hike FAQs</h2>
          <p className="mt-1 text-sm text-charcoal/60">Last updated: {UPDATED_LABEL}</p>
          <div className="mt-6 space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className={`${CARD} group`}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-medium leading-6">{q}</h3>
                  <ChevronDown size={20} className="shrink-0 text-[#9A8864] transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-4 text-[15px] leading-6 text-charcoal/80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="bg-[#3A3123] py-14 text-center md:py-16" aria-labelledby="cta-title">
        <div className={`${WRAP} max-w-[760px]`}>
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]">Reserve your hike</p>
          <h2 id="cta-title" className="mt-2 font-primary text-[30px] leading-9 text-cream md:text-[42px] md:leading-[50px]">Book your Ratapani Hike Experience</h2>
          <p className="mt-3 text-base leading-7 text-warm-beige">Tell us your date and group size and we will confirm the hike.</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_LIGHT}>Book now</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
            <a href="tel:+919770558419" className={BTN_GHOST}><Phone size={16} aria-hidden="true" /> Call 09770558419</a>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-warm-beige/85">
            <Link href="/experiences/ratapani-jungle-safari" className="underline-offset-4 hover:underline">Ratapani jungle safari packages</Link>
            <span aria-hidden="true">·</span>
            <Link href="/experiences/forest-walks-and-nature-trails" className="underline-offset-4 hover:underline">Forest walks and nature trails</Link>
            <span aria-hidden="true">·</span>
            <Link href="/stay-in-ratapani-tiger-reserve" className="underline-offset-4 hover:underline">Stay at Madhuban</Link>
          </p>
        </div>
      </section>

      <StickyBookBar href="#booking-card" label="Book the hike · ₹2,000 per person" />
    </main>
  );
}
