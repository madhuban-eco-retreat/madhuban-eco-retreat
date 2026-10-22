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
  notice: enc("gallery/nature/nature14.jpg"),
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

const ORG = { "@id": `${SITE}/#organization` };
const TOURIST_TYPES = ["Hikers", "Nature lovers", "Birdwatchers", "Photographers", "Families with older children", "Corporate groups", "School groups"];

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
    name: "Ratapani Hike Experience | Hiking Near Bhopal, 12 km Trail",
    description: "Guided 12 km hike near Bhopal from the Saru Maru caves to Madhuban Eco Retreat.",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "Madhuban Eco Retreat", url: `${SITE}/` },
    about: [
      { "@type": "Place", name: "Ratapani Tiger Reserve" },
      { "@type": "Place", name: "Saru Maru caves" },
    ],
    primaryImageOfPage: { "@type": "ImageObject", url: IMG.caves },
    datePublished: UPDATED_ISO,
    dateModified: UPDATED_ISO,
    lastReviewed: UPDATED_ISO,
    author: ORG,
    publisher: ORG,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#hero-lead", "#glance-title"] },
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${PAGE_URL}#trip`,
    name: "Ratapani Hike Experience: 12 km Forest Hike from Saru Maru to Madhuban",
    description:
      "A guided 12 km day hike from the Saru Maru caves to Madhuban Eco Retreat through the Vindhyan valley, seasonal streams and dense teak forest. Breakfast and lunch included. Minimum 4 guests.",
    url: PAGE_URL,
    image: [IMG.caves],
    touristType: TOURIST_TYPES,
    provider: ORG,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: STOPS.length,
      itemListElement: STOPS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: s.title, description: s.text },
      })),
    },
    offers: {
      "@type": "Offer",
      name: "Ratapani Hike Experience, per person",
      price: PRICE,
      priceCurrency: "INR",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-10-01",
      seller: ORG,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${PAGE_URL}#hike`,
    name: "Ratapani Hike Experience",
    description:
      "Guided 12 km forest hike from the Saru Maru caves to Madhuban Eco Retreat, near Bhopal. Breakfast and lunch included. Minimum 4 guests.",
    image: [IMG.caves],
    brand: ORG,
    offers: {
      "@type": "Offer",
      name: "Per person, minimum 4 guests",
      price: PRICE,
      priceCurrency: "INR",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
      seller: ORG,
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

const RISE = "motion-safe:[animation:chipIn_800ms_cubic-bezier(.2,.7,.2,1)_both]";

export default function RatapaniHikePage() {
  return (
    <main className="bg-cream text-charcoal">
      {/* 1. Hero: one message, two buttons */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#3A3123] md:min-h-[640px]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <HeroPhoto src={IMG.hero} alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3A3123]/90 via-[#3A3123]/55 to-[#3A3123]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#3A3123]/70 to-transparent" />
        </div>
        <div className={`${WRAP} pb-24 pt-20 md:pb-28`}>
          <nav aria-label="Breadcrumb" className={`${RISE} text-[13px] text-warm-beige/80`}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/experiences" className="hover:underline">Experiences</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-warm-beige">Ratapani Hike Experience</li>
            </ol>
          </nav>
          <p className={`${RISE} mt-5 text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]`} style={{ animationDelay: "120ms" }}>
            Hiking near Bhopal · Ratapani Tiger Reserve
          </p>
          <h1 className={`${RISE} mt-3 max-w-[700px] font-primary text-[32px] leading-[40px] text-cream md:text-[48px] md:leading-[56px]`} style={{ animationDelay: "240ms" }}>
            Ratapani Hike Experience: 12 km Forest Hike from Saru Maru to Madhuban
          </h1>
          <p id="hero-lead" className={`${RISE} mt-4 max-w-[520px] text-base font-light leading-7 text-warm-beige md:text-lg md:leading-8`} style={{ animationDelay: "380ms" }}>
            A guided day hike through valley, streams and teak forest. Breakfast and lunch included.
          </p>
          <div className={`${RISE} mt-7 flex flex-col gap-3 sm:flex-row`} style={{ animationDelay: "520ms" }}>
            <a href="#booking-card" className={BTN_LIGHT}>Book the hike <ArrowRight size={16} aria-hidden="true" /></a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
      <div id="hero-end" aria-hidden="true" />

      {/* Stat bar overlapping the hero */}
      <div className={`${WRAP} relative z-10 -mt-12 md:-mt-14`}>
        <RevealOnScroll>
          <dl className={`${CARD} grid grid-cols-2 divide-[#CEC5B9]/60 shadow-[0_8px_30px_rgba(58,49,35,0.12)] md:grid-cols-4 md:divide-x`}>
            {[
              [<><CountUp to={12} /> km</>, "One way, on foot"],
              [<>~<CountUp to={8} /> hrs</>, "With a lunch break"],
              [<><CountUp to={410} /> m</>, "Highest point"],
              [<>₹<CountUp to={2000} /></>, "Per person, min 4"],
            ].map(([v, l], i) => (
              <div key={l} className={`px-4 py-4 text-center md:py-5 ${i < 2 ? "border-b border-[#CEC5B9]/60 md:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-[#CEC5B9]/60 md:border-r-0" : ""}`}>
                <dt className="font-primary text-[26px] leading-8 text-earth-brown md:text-[32px] md:leading-10">{v}</dt>
                <dd className="mt-0.5 text-[13px] text-charcoal/65">{l}</dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>

      {/* 2. The hike at a glance: facts on the left, photo and profile on the right */}
      <section className={SECTION} aria-labelledby="glance-title">
        <div className={`${WRAP} grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12`}>
          <div>
            <p className={EYEBROW}>Quick summary</p>
            <h2 id="glance-title" className={H2}>The hike at a glance</h2>
            <dl className="mt-6 divide-y divide-[#CEC5B9]/60">
              {FACTS.map(([Icon, k, v], i) => (
                <RevealOnScroll key={k} delay={i * 50}>
                  <div className="flex gap-3 py-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-beige text-earth-brown">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[1.5px] text-[#9A8864]">{k}</dt>
                      <dd className="text-[15px] leading-6 text-charcoal/85">{v}</dd>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-5">
            <RevealOnScroll>
              <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#E0D1BC]">
                <Image src={IMG.walkers} alt="Guided forest hike near Ratapani Tiger Reserve with the Madhuban team" fill quality={75} sizes="(min-width:1024px) 600px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3A3123]/80 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-cream">Walk with a local guide, at an easy pace</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className={`${CARD} p-4 md:p-5`}>
                <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#9A8864]">Trail profile</p>
                <div className="mt-2"><TrailProfile /></div>
                <p className="mt-2 text-xs text-charcoal/60">Illustrative sketch, not to scale.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 3. The route: zig-zag stops */}
      <section className={`${SECTION} bg-[#F4EFE8]`} aria-labelledby="route-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Trail progression</p>
          <h2 id="route-title" className={H2}>Hiking near Bhopal: the route, step by step</h2>
          <p className="mt-2 max-w-[640px] text-base leading-7 text-charcoal/75">Six stops from the Saru Maru caves to Madhuban, on foot and with a guide.</p>
          <div className="mt-8">
            <Timeline>
              {STOPS.map((s, i) => (
                <li key={s.title} className="relative pb-5">
                  <span aria-hidden="true" className="absolute -left-8 top-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-earth-brown text-[10px] font-bold text-warm-beige">{i + 1}</span>
                  <RevealOnScroll>
                    <article className={`${CARD} group grid overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg md:grid-cols-2`}>
                      <div className={`flex flex-col justify-center p-5 md:p-8 ${i % 2 ? "md:order-2" : ""}`}>
                        <p className={EYEBROW}>{s.tag}</p>
                        <h3 className="mt-1 font-primary text-[22px] leading-8 text-charcoal md:text-[26px] md:leading-9">{s.title}</h3>
                        <p className="mt-2 text-[15px] leading-6 text-charcoal/80">{s.text}</p>
                      </div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E0D1BC] md:aspect-auto md:min-h-[260px]">
                        <Image src={s.img} alt={s.alt} fill quality={75} sizes="(min-width:768px) 560px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </article>
                  </RevealOnScroll>
                </li>
              ))}
            </Timeline>
          </div>
        </div>
      </section>

      {/* 4. What you will notice: photo plus four short points */}
      <section className={SECTION} aria-labelledby="notice-title">
        <div className={`${WRAP} grid items-center gap-8 lg:grid-cols-2 lg:gap-12`}>
          <RevealOnScroll>
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#E0D1BC]">
              <Image src={IMG.notice} alt="Forest on the Ratapani hiking trail near Madhuban Eco Retreat" fill quality={75} sizes="(min-width:1024px) 600px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </RevealOnScroll>
          <div>
            <p className={EYEBROW}>On the trail</p>
            <h2 id="notice-title" className={H2}>What you will notice on the trail</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {NOTICE.map(([Icon, title, text], i) => (
                <RevealOnScroll key={title} delay={i * 90} as="li">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-beige text-earth-brown"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-2 font-primary text-xl leading-7 text-charcoal">{title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-charcoal/75">{text}</p>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Your day and the package */}
      <section className={`${SECTION} bg-[#F4EFE8]`} aria-labelledby="package-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Itinerary and package</p>
          <h2 id="package-title" className={H2}>Your day and the package</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
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
              <div id="booking-card" className="h-full scroll-mt-24 rounded-2xl bg-[#3A3123] p-5 text-cream shadow-[0_8px_30px_rgba(58,49,35,0.18)] md:p-7">
                <p className="text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]">The package</p>
                <h3 className="mt-1 font-primary text-2xl leading-8">Ratapani Hike Experience</h3>
                <p className="mt-3 font-primary text-[40px] leading-[48px] text-warm-beige">
                  ₹{PRICE.toLocaleString("en-IN")}
                  <span className="ml-2 font-sans text-sm font-normal text-warm-beige/75">per person</span>
                </p>
                <p className="text-sm text-warm-beige/75">Minimum group of 4 guests.</p>
                <ul className="mt-4 space-y-2.5">
                  {INCLUDES.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-6 text-warm-beige/90">
                      <Check size={18} className="mt-0.5 shrink-0 text-[#F6E0B7]" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-lg bg-cream/10 p-3 text-sm leading-5 text-warm-beige/85">
                  Customised hikes are available for larger groups, corporate teams, school groups and private experiences.
                </p>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={`${BTN_LIGHT} mt-5 w-full`}>Book the hike</a>
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
      <section id="faq" className={SECTION} aria-labelledby="faq-title">
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

      {/* 7. Final CTA over a photo */}
      <section className="relative isolate overflow-hidden bg-[#3A3123] py-16 text-center md:py-20" aria-labelledby="cta-title">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Image src={IMG.ridge} alt="" fill quality={75} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#3A3123]/85" />
        </div>
        <div className={`${WRAP} max-w-[760px]`}>
          <RevealOnScroll>
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
          </RevealOnScroll>
        </div>
      </section>

      <StickyBookBar href="#booking-card" label="Book the hike · ₹2,000 per person" />
    </main>
  );
}
