import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Binoculars,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  IdCard,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  ShieldCheck,
  Star,
  Trees,
  Users,
  Utensils,
  Route,
} from "lucide-react";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { CountUp, HeroPhoto } from "@/components/safari/SafariClient";
import { PackageChooser, PackageTabs, RoomPrice, StickyBookBar, Timeline } from "@/components/jungleSafari/JungleSafariClient";
import { regularRate, formatInr } from "@/lib/pricing/rate-card.mjs";
import { DAY_PRICE, SEASON, THREE_DAY, TWO_DAY, UPDATED_ISO, UPDATED_LABEL, lowest } from "@/components/jungleSafari/data";

/**
 * /experiences/ratapani-jungle-safari — the three safari packages (day, 2D/1N, 3D/2N).
 * Brand colours (earth-brown, warm beige, cream, bronze), Playfair headings and
 * Lato body text; only Madhuban's own photographs.
 */

export const PAGE_URL = "https://www.madhubanecoretreat.com/experiences/ratapani-jungle-safari";
const SITE = "https://www.madhubanecoretreat.com";
const R2 = "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/";
const EXP = `${R2}experiences/New%20Experiences%20page/`;
const DAY = `${EXP}a%20day%20at%20madhuban/`;
const ACC = `${R2}home/accommodations/`;
const WA = (t) => `https://wa.me/919770558419?text=${encodeURIComponent(t)}`;
const WHATSAPP = WA("Hi, I'd like to book a Ratapani jungle safari package.");

const IMG = {
  hero: `${EXP}Hero%20imgs/experiences%20page%20hero%20img%201.png`,
  safari: `${EXP}jungle%20safari%20ratapani%20tiger%20reserve.jpg`,
  safariDay: `${DAY}experiences%20page%20safari%20section%20img.png`,
  lodge: `${R2}home/banner/desktop/Madhuban_Eco_Retreat_3000x1688.jpg`,
  dinner: `${DAY}experiences%20page%20bush%20dining%20section%20img.png`,
  walk: `${DAY}experiences%20page%20mid%20day%20forest%20walk%20section%20img.png`,
  village: `${DAY}experience%20page%20village%20walk%20img.png`,
};

const ROOMS = [
  {
    slug: "safari-tent",
    name: "Safari Tent",
    tag: "Canvas living",
    img: `${ACC}madhuban-eco-retreat-safari-tent-exterior-image-home-page-card.jpg`,
    alt: "Safari tent at Madhuban Eco Retreat, Ratapani Tiger Reserve",
    text: "Canvas under the teak canopy with teak furniture, king bedding and an en-suite stone bathroom.",
  },
  {
    slug: "pool-side-villa",
    name: "Poolside Villa",
    tag: "By the water",
    img: `${ACC}poolside-villa-madhuban-eco-retreat-home-page-card.jpg`,
    alt: "Poolside villa at Madhuban Eco Retreat near Ratapani Tiger Reserve",
    text: "Stone and glass beside the pool, with a private sit-out and wide forest views.",
  },
  {
    slug: "mud-house-standard",
    name: "Mud House",
    tag: "Village craft",
    img: `${ACC}madhuban-eco-retreat-mud-house-exterior-image-home-page-card.jpg`,
    alt: "Mud house stay at Madhuban Eco Retreat, Ratapani",
    text: "A hand-built earthen cottage that stays cool naturally, with local terracotta touches.",
  },
  {
    slug: "glamping-tents",
    name: "Glamping Tent",
    tag: "Quiet and private",
    img: `${ACC}madhuban-eco-retreat-glamping-tent-exterior-image-home-page-card.jpg`,
    alt: "Glamping tent at Madhuban Eco Retreat, Ratapani Tiger Reserve",
    text: "A secluded tent with a private sit-out, well suited to couples and solo travellers.",
  },
];

const PLAN = [
  {
    icon: CalendarCheck,
    title: "1. How to book",
    lines: [
      "Pick a package below.",
      "Tap Book now or message us on WhatsApp with your dates and group size.",
      "We check the permit and your room, then confirm the booking with you.",
    ],
  },
  {
    icon: Route,
    title: "2. How to reach",
    lines: [
      "Madhuban is roughly an hour's drive from Bhopal.",
      "Bhopal airport (BHO) and Rani Kamlapati and Bhopal Junction stations are the easiest points to arrive at.",
      "Pick-up and drop from Bhopal is included in the 3-day package and can be arranged on request for the 2-day stay.",
    ],
  },
  {
    icon: Clock,
    title: "3. Best time and timings",
    lines: [
      "Safaris run in a morning and an afternoon shift; we confirm yours when we book the permit.",
      "October to February is cool and good for birds. March to June is hot, and animals gather near water.",
      "Wildlife cannot be guaranteed on any safari.",
    ],
  },
];

const DAY_FLOW = [
  ["12:00 – 1:00 PM", "Arrive at Madhuban and freshen up"],
  ["1:00 PM", "Vegetarian lunch at the lodge"],
  ["3:00 PM", "Leave for the Ratapani gate in our open gypsy"],
  ["3:00 – 6:00 PM", "Afternoon jungle safari"],
  ["After 6:00 PM", "Return to the lodge, then head home"],
];

const TWO_DAY_FLOW = [
  ["Day 1", "Arrival and retreat", ["Check-in from 2:00 PM", "Lunch at the dining pavilion", "Swimming pool, hammock time and pottery", "Evening in the forest, then dinner"]],
  ["Day 2", "Safari and departure", ["Early tea and biscuits", "Morning Ratapani Tiger Reserve safari", "Breakfast at Madhuban", "Check-out"]],
];

const THREE_DAY_FLOW = [
  ["Day 1", "Arrival and bush dinner", "Check-in at 2:00 PM, farm lunch, pottery, pool or cycling. After dark, fireside stories and a bush dinner under the stars."],
  ["Day 2", "Ratapani safari and Bhimbetka", "Early tea, the Ratapani tiger safari, then breakfast and rest. After lunch, a guided visit to the Bhimbetka Rock Shelters (UNESCO World Heritage Site). Dinner and overnight."],
  ["Day 3", "Sunrise birding and departure", "Yoga on the deck, a guided bird walk, breakfast and a 10:30 AM check-out with private transfer back to Bhopal."],
];

const COMPARE = [
  ["Safari permit and open gypsy", true, true, true],
  ["Overnight stay", false, "1 night", "2 nights"],
  ["Meals", "Lunch and hi-tea", "As per MAP plan", "All vegetarian meals"],
  ["Bush dinner by firelight", false, false, true],
  ["Bhimbetka Rock Shelters visit", false, false, true],
  ["Bhopal pick-up and drop", false, "On request", true],
  ["Morning yoga and guided bird walk", false, false, true],
];

const WHY = [
  { icon: MapPin, title: "On the edge of the forest", text: "Our lodge sits at the edge of the reserve, so the drive to your safari gate stays short." },
  { icon: ShieldCheck, title: "One team, one booking", text: "Permit, safari vehicle, stay and meals are arranged together by a single team." },
  { icon: Binoculars, title: "Local naturalists", text: "Guides who grew up here know the tracks, waterholes and the habits of the animals." },
  { icon: Users, title: "Small groups, no rush", text: "We keep groups small and plans unhurried, so you spend your time in the forest, not in queues." },
];

const STATS = [
  { to: 60, suffix: "+", label: "Resident tigers" },
  { to: 1, suffix: " hr", label: "Drive from Bhopal" },
  { to: 5, suffix: "", label: "Room types" },
  { to: 3, suffix: "", label: "Safari gates" },
];

const BIO = [
  [60, "Tigers"],
  [35, "Mammal species"],
  [205, "Bird species"],
  [33, "Reptile species"],
  [10, "Amphibian species"],
  [129, "Tree species"],
];

const REVIEWS = [
  ["One of the best experiences I've had near Bhopal. The stay, the food, pottery, yoga, the healing power of nature – everything was top notch.", "Shristi Pandey", "Google Local Guide"],
  ["Truly enriching – scenic surroundings, comfortable stay, nature walks, birding, delicious food. The respect for tribal communities is beautifully reflected.", "Amit Jethwa", "Google Local Guide"],
  ["Stayed overnight and had a truly amazing experience. Meditation, yoga, swimming, food – everything was perfect. Staff was outstanding.", "Anshul Agrawal", "Overnight guest"],
];

const FAQS = [
  ["What is included in a Ratapani jungle safari package?", "Every package includes the Forest Department safari permit, an open gypsy with a driver and a guide. The 2-day and 3-day packages add your room and meals, and the day package adds lunch and hi-tea. Full inclusions are listed above for each package."],
  ["How far is Ratapani Tiger Reserve from Bhopal?", "Madhuban is roughly an hour's drive from Bhopal. The safari gate you are allotted adds a short further drive, which we confirm when we book your permit."],
  ["Can I book a Ratapani safari online?", "At the Jhiri and Delawadi gates, safaris can be booked online or at the entry gate, and visitors travel in vehicles registered with the sanctuary. At Bhimbetka, safari is booked offline only, and visitors can go in their own private vehicles. Our packages take care of the permit and the vehicle for you."],
  ["Are safari permits included in the price?", "Yes. The permit, the gypsy and the driver are part of each package price. You do not pay the gate separately."],
  ["What are the morning and afternoon safari timings?", "Safaris run in a morning and an afternoon shift, and the hours shift a little with the season and the Forest Department schedule. We confirm your exact timing when your booking is confirmed. The day package uses the afternoon shift, roughly 3 to 6 PM."],
  ["Which animals can we expect to see?", "Ratapani has more than 60 resident tigers, along with leopards, sloth bears, striped hyenas, dholes, sambar, chital and nilgai. The sanctuary has recorded 35 mammal species and 205 bird species. Sightings are never guaranteed, because these are wild animals."],
  ["Which safari gate will we use?", "The sanctuary has three gates: Jhiri, Delawadi and Bhimbetka. Jhiri and Delawadi are the safari gates, and Bhimbetka is the heritage gate near the rock shelters. Your safari gate depends on your dates and permit availability, and we confirm it when we book."],
  ["Is the safari safe for children and senior citizens?", "Yes, but forest tracks are dusty and uneven. Morning or afternoon shifts both work for families; we suggest carrying a light jacket in winter and a hat in summer. Tell us your group when you book and we will plan accordingly."],
  ["Can we add extra safaris to the 2-day or 3-day stay?", "Yes. Extra shifts can be added when permits are available. Tell us when you book, and we will check the quota for your dates."],
  ["Which documents do we need for the safari?", "Every guest needs a valid government photo ID, such as Aadhaar, passport, voter ID or driving licence. Foreign guests carry their passport. The same ID used for booking must be carried on the safari."],
  ["Is the food vegetarian?", "Yes. The kitchen serves fresh vegetarian meals, using produce from our own farm and nearby villages."],
  ["What is the cancellation and refund policy?", "Terms depend on the package and the dates, and Forest Department permits follow state rules. We share the exact terms when you book, and you can read our general terms on the Terms and Conditions page."],
  ["What should we wear on a jungle safari?", "Muted colours such as olive, khaki, beige or brown. Avoid bright colours and pure white. A hat, sunglasses, sunscreen and a light layer for the early morning are useful."],
  ["How early should we book?", "Safari vehicles are limited each day. For weekends, holidays and the winter months, book as early as you can, and message us on WhatsApp to check your dates."],
];

const SCHEMA_PRODUCT = (name, desc, image, offers, anchor) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${PAGE_URL}#${anchor}`,
  name,
  description: desc,
  image: [image],
  brand: { "@id": `${SITE}/#organization` },
  offers: offers.map(([label, price]) => ({
    "@type": "Offer",
    name: label,
    price,
    priceCurrency: "INR",
    url: `${PAGE_URL}#${anchor}`,
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE}/#organization` },
  })),
});

export const SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Experiences", item: `${SITE}/experiences` },
      { "@type": "ListItem", position: 3, name: "Ratapani Jungle Safari", item: PAGE_URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Ratapani Jungle Safari Packages: 1, 2 & 3-Day Tiger Safari",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "Madhuban Eco Retreat", url: `${SITE}/` },
    primaryImageOfPage: { "@type": "ImageObject", url: IMG.hero },
    datePublished: UPDATED_ISO,
    dateModified: UPDATED_ISO,
    author: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#packages-intro"] },
  },
  SCHEMA_PRODUCT(
    "Ratapani Day Tiger Safari with Lunch",
    "Day outing at Madhuban Eco Retreat: lunch, an afternoon jungle safari in Ratapani Tiger Reserve with permit and open gypsy, and hi-tea. Price is per person; minimum group of 4 to 6.",
    IMG.safariDay,
    [["Day safari, per person", DAY_PRICE]],
    "day-safari",
  ),
  SCHEMA_PRODUCT(
    "Ratapani Jungle Safari Stay (2 Days / 1 Night)",
    "One night at Madhuban Eco Retreat with meals as per the MAP plan and one Ratapani Tiger Reserve safari with permit and gypsy. Prices are per couple, plus 18% GST.",
    IMG.lodge,
    TWO_DAY.map((o) => [`${o.name}, per couple`, o.price]),
    "2-day-safari",
  ),
  SCHEMA_PRODUCT(
    "Ratapani Tiger Safari Package (3 Days / 2 Nights)",
    "Two nights at Madhuban Eco Retreat with a Ratapani Tiger Reserve safari, Bhimbetka Rock Shelters visit, bush dinner, bird walk and Bhopal transfers. Prices are per couple, plus 18% GST.",
    IMG.dinner,
    THREE_DAY.map((o) => [`${o.name}, per couple`, o.price]),
    "3-day-safari",
  ),
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

/* ---------- small pieces ---------- */

const BTN_PRIMARY =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-earth-brown px-7 py-3 text-base font-medium text-warm-beige shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(132,116,85)]";
const BTN_LIGHT =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-warm-beige px-7 py-3 text-base font-medium text-earth-brown transition duration-300 hover:-translate-y-0.5 hover:bg-cream";
const BTN_GHOST =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-warm-beige/70 px-7 py-3 text-base font-medium text-warm-beige transition duration-300 hover:-translate-y-0.5 hover:bg-warm-beige/15";
const BTN_OUTLINE =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-earth-brown px-7 py-3 text-base font-medium text-earth-brown transition duration-300 hover:bg-earth-brown/10";
const WRAP = "mx-auto w-full max-w-[1240px] px-4 md:px-6";
const SECTION = "py-12 md:py-16";
const EYEBROW = "text-xs font-bold uppercase tracking-[3px] text-[#9A8864]";
const H2 = "mt-2 font-primary text-[28px] leading-9 text-charcoal md:text-[38px] md:leading-[46px]";
const CARD = "rounded-2xl border border-[#CEC5B9]/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]";

function Includes({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-[15px] leading-6 text-charcoal/80">
          <Check size={18} className="mt-0.5 shrink-0 text-[#9A8864]" aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function PhotoTop({ src, alt }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-[#E0D1BC]">
      <Image src={src} alt={alt} fill quality={75} sizes="(min-width:1024px) 480px, 100vw" className="object-cover" />
    </div>
  );
}

function PhotoFill({ src, alt, caption }) {
  return (
    <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl bg-[#E0D1BC]">
      <Image src={src} alt={alt} fill quality={75} sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3A3123]/80 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-cream">{caption}</div>
    </div>
  );
}

function Cell({ v }) {
  if (v === true) return <Check size={18} className="mx-auto text-earth-brown" aria-label="Included" />;
  if (v === false) return <Minus size={18} className="mx-auto text-charcoal/30" aria-label="Not included" />;
  return <span>{v}</span>;
}

/* ---------- the three package panels ---------- */

const dayPanel = (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" id="day-safari-detail">
    <div data-anim className={`${CARD} overflow-hidden`}>
      <PhotoTop src={IMG.safariDay} alt="Open gypsy safari in Ratapani Tiger Reserve with Madhuban Eco Retreat" />
      <div className="p-5 md:p-6">
        <p className={EYEBROW}>A Madhuban day outing</p>
        <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Ratapani Day Tiger Safari with Lunch</h3>
        <p className="mt-2 text-[15px] leading-6 text-charcoal/75">Come for the day, spend the afternoon in the forest and head home that evening.</p>
        <p className="mt-4 font-primary text-[32px] leading-10 text-earth-brown">
          ₹{DAY_PRICE.toLocaleString("en-IN")}
          <span className="ml-2 font-sans text-sm font-normal text-charcoal/70">per person</span>
        </p>
        <p className="text-sm text-charcoal/70">For groups of 4 to 6 guests or more.</p>
        <div className="mt-4"><Includes items={["Ratapani safari permit", "Gypsy (open jeep) safari from the lodge", "Lunch at Madhuban", "Snacks and hi-tea on the safari", "Use of the lodge grounds between lunch and safari"]} /></div>
        <p className="mt-4 text-sm leading-5 text-charcoal/65">Safari timings, routes and permits follow Madhya Pradesh Forest Department rules.</p>
        <a href={WA("Hi, I'd like to book the Ratapani Day Safari with lunch.")} target="_blank" rel="noopener noreferrer" className={`${BTN_PRIMARY} mt-5 w-full`}>Book the day safari</a>
      </div>
    </div>
    <div data-anim className="flex flex-col gap-5">
    <div className={`${CARD} p-5 md:p-6`}>
      <p className={EYEBROW}>Day flow</p>
      <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Your afternoon in the forest</h3>
      <div className="mt-5">
        <Timeline>
          {DAY_FLOW.map(([when, what]) => (
            <li key={when} className="relative">
              <span aria-hidden="true" className="absolute -left-8 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-white bg-[#9A8864]" />
              <p className="text-sm font-bold text-earth-brown">{when}</p>
              <p className="text-[15px] leading-6 text-charcoal/80">{what}</p>
            </li>
          ))}
        </Timeline>
      </div>
    </div>
    <PhotoFill src={IMG.safari} alt="Jungle safari in Ratapani Tiger Reserve" caption="Your safari: an open gypsy into Ratapani" />
    </div>
  </div>
);

const twoDayPanel = (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" id="two-day-detail">
    <div data-anim className={`${CARD} overflow-hidden`}>
      <PhotoTop src={IMG.lodge} alt="Madhuban Eco Retreat eco lodge on the edge of Ratapani Tiger Reserve" />
      <div className="p-5 md:p-6">
        <p className={EYEBROW}>Weekend breakaway</p>
        <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Ratapani Jungle Safari Stay</h3>
        <p className="mt-2 text-[15px] leading-6 text-charcoal/75">One night in the forest and one jungle safari: an easy weekend break.</p>
        <div className="mt-4"><RoomPrice packageName="2 Days / 1 Night safari stay" options={TWO_DAY} /></div>
        <p className="mt-4 text-sm text-charcoal/70">MAP meal plan included (breakfast, lunch or dinner).</p>
        <div className="mt-4"><Includes items={["1 night in your chosen room", "Meals as per the MAP plan", "1 Ratapani Tiger Reserve safari with permit", "Safari jeep with a skilled local driver", "Swimming pool, pottery workshop and in-house activities"]} /></div>
        <p className="mt-4 text-sm leading-5 text-charcoal/65">One safari is included. Extra shifts can be added at booking, subject to permits.</p>
      </div>
    </div>
    <div data-anim className="flex flex-col gap-5">
    <div className={`${CARD} p-5 md:p-6`}>
      <p className={EYEBROW}>Itinerary</p>
      <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Two days, one safari</h3>
      <div className="mt-5">
        <Timeline>
          {TWO_DAY_FLOW.map(([day, title, items]) => (
            <li key={day} className="relative">
              <span aria-hidden="true" className="absolute -left-8 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-white bg-[#9A8864]" />
              <p className="text-sm font-bold text-earth-brown">{day}: {title}</p>
              <ul className="mt-1 space-y-1 text-[15px] leading-6 text-charcoal/80">
                {items.map((t) => (<li key={t}>{t}</li>))}
              </ul>
            </li>
          ))}
        </Timeline>
      </div>
    </div>
    <PhotoFill src={IMG.walk} alt="Mid-day forest walk near Madhuban Eco Retreat" caption="Slow forest time between rides" />
    </div>
  </div>
);

const threeDayPanel = (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" id="three-day-detail">
    <div data-anim className={`${CARD} overflow-hidden`}>
      <PhotoTop src={IMG.dinner} alt="Bush dinner by firelight at Madhuban Eco Retreat, Ratapani" />
      <div className="p-5 md:p-6">
        <p className={EYEBROW}>Signature experience</p>
        <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Ratapani Tiger Safari Package</h3>
        <p className="mt-2 text-[15px] leading-6 text-charcoal/75">The full experience: safari, Bhimbetka rock shelters, a bush dinner and a night under the stars.</p>
        <div className="mt-4"><RoomPrice packageName="3 Days / 2 Nights tiger safari package" options={THREE_DAY} /></div>
        <div className="mt-4"><Includes items={["2 nights in your chosen room", "Bhopal airport or railway pick-up and drop", "All vegetarian meals", "1 Ratapani Tiger Reserve safari with permit", "Bush dining by firelight with forest stories", "Bhimbetka Rock Shelters visit (UNESCO site)", "Sunrise yoga and a guided bird walk", "Pottery studio, obstacle course and cycling trail"]} /></div>
        <ul className="mt-4 space-y-1 text-sm leading-5 text-charcoal/65">
          <li>Minimum 4 guests for private package bookings.</li>
          <li>Permits are subject to the Forest Department quota and route allocation.</li>
          <li>Bush dining and stargazing depend on the weather.</li>
        </ul>
      </div>
    </div>
    <div data-anim className="flex flex-col gap-5">
    <div className={`${CARD} p-5 md:p-6`}>
      <p className={EYEBROW}>Three-day journey</p>
      <h3 className="mt-1 font-primary text-2xl leading-8 text-charcoal">Safari, rock art and stars</h3>
      <div className="mt-5">
        <Timeline>
          {THREE_DAY_FLOW.map(([day, title, text]) => (
            <li key={day} className="relative">
              <span aria-hidden="true" className="absolute -left-8 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-white bg-[#9A8864]" />
              <p className="text-sm font-bold text-earth-brown">{day}: {title}</p>
              <p className="text-[15px] leading-6 text-charcoal/80">{text}</p>
            </li>
          ))}
        </Timeline>
      </div>
    </div>
    <PhotoFill src={IMG.village} alt="Village walk near Madhuban Eco Retreat, Ratapani" caption="Walks and craft with the local villages" />
    </div>
  </div>
);

const TABS = [
  { id: "day-safari", label: "Day Safari", panel: dayPanel },
  { id: "2-day-safari", label: "2 Days / 1 Night", panel: twoDayPanel },
  { id: "3-day-safari", label: "3 Days / 2 Nights", badge: "Most popular", panel: threeDayPanel },
];

/* ---------- page ---------- */

export default function RatapaniJungleSafariPage() {
  return (
    <main className="bg-cream text-charcoal">
      {/* Hero */}
      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-[#3A3123] md:min-h-[600px]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <HeroPhoto src={IMG.hero} alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A3123] via-[#3A3123]/55 to-[#3A3123]/15" />
        </div>
        <div className={`${WRAP} pb-10 pt-16 md:pb-14`}>
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-warm-beige/85">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/experiences" className="hover:underline">Experiences</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-warm-beige">Ratapani Jungle Safari</li>
            </ol>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]">Ratapani Tiger Reserve · Madhya Pradesh</p>
          <h1 className="mt-3 max-w-[820px] font-primary text-[36px] leading-[44px] text-cream md:text-[56px] md:leading-[64px]">
            Ratapani Jungle Safari Packages: Day, 2-Day &amp; 3-Day Tiger Safari
          </h1>
          <p className="mt-4 max-w-[640px] text-base font-light leading-7 text-warm-beige md:text-lg md:leading-8">
            Choose a day safari, a 2-day stay or a 3-day tiger safari package. The permit, safari jeep, meals and stay are planned for you, about an hour from Bhopal.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#packages" className={BTN_LIGHT}>See safari packages <ArrowRight size={16} aria-hidden="true" /></a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {[
              [MapPin, "1 hour from Bhopal"],
              [ShieldCheck, "Safari permit included"],
              [Utensils, "Meals included"],
              [Users, "Small groups"],
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

      {/* Plan in 60 seconds */}
      <section className={`${SECTION} pb-6 md:pb-8`} aria-labelledby="plan-title">
        <div className={WRAP}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={EYEBROW}>Quick answers</p>
              <h2 id="plan-title" className={H2}>Plan your Ratapani jungle safari in 60 seconds</h2>
            </div>
            <Link href="/ratapani-tiger-safari" className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-brown underline-offset-4 hover:underline">
              Read the full Ratapani tiger safari guide <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PLAN.map(({ icon: Icon, title, lines }, i) => (
              <RevealOnScroll key={title} delay={i * 90}>
                <article className={`${CARD} h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-beige text-earth-brown"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-3 font-primary text-xl leading-7 text-charcoal">{title}</h3>
                  <ul className="mt-2 space-y-1.5 text-[15px] leading-6 text-charcoal/75">
                    {lines.map((l) => (<li key={l}>{l}</li>))}
                  </ul>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className={`${SECTION} scroll-mt-20`} aria-labelledby="packages-title">
        <div className={WRAP}>
          <div className="text-center">
            <p className={EYEBROW}>Safari packages · Season {SEASON}</p>
            <h2 id="packages-title" className={H2}>Ratapani Tiger Safari Packages: Choose Your Stay</h2>
            <p id="packages-intro" className="mx-auto mt-3 max-w-[680px] text-base leading-7 text-charcoal/75">
              Three ways to do a Ratapani jungle safari with Madhuban: a day safari with lunch from ₹{DAY_PRICE.toLocaleString("en-IN")} per person, a 2 days / 1 night stay from {formatInr(lowest(TWO_DAY))} per couple, or a 3 days / 2 nights tiger safari package from {formatInr(lowest(THREE_DAY))} per couple. Every package includes the safari permit and gypsy.
            </p>
          </div>

          <PackageChooser
            options={[
              { id: "day-safari", question: "Only a day?", label: "Day Safari" },
              { id: "2-day-safari", question: "One night away?", label: "2 Days / 1 Night" },
              { id: "3-day-safari", question: "Full forest weekend?", label: "3 Days / 2 Nights" },
            ]}
          />

          <div className="mt-8">
            <PackageTabs tabs={TABS} defaultId="3-day-safari" />
          </div>

          <div className="mt-10">
            <h3 className="font-primary text-2xl leading-8 text-charcoal">Compare the safari packages</h3>
            <div className={`${CARD} mt-4 overflow-x-auto`}>
              <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
                <caption className="sr-only">What each Ratapani jungle safari package includes</caption>
                <thead>
                  <tr className="bg-earth-brown text-warm-beige">
                    <th scope="col" className="px-4 py-3 font-medium">Feature</th>
                    <th scope="col" className="px-4 py-3 text-center font-medium">Day Safari</th>
                    <th scope="col" className="px-4 py-3 text-center font-medium">2 Days / 1 Night</th>
                    <th scope="col" className="px-4 py-3 text-center font-medium">3 Days / 2 Nights</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map(([label, a, b, c], i) => (
                    <tr key={label} className={i % 2 ? "bg-[#F4EFE8]" : "bg-white"}>
                      <th scope="row" className="px-4 py-3 font-medium text-charcoal">{label}</th>
                      <td className="px-4 py-3 text-center text-charcoal/80"><Cell v={a} /></td>
                      <td className="px-4 py-3 text-center text-charcoal/80"><Cell v={b} /></td>
                      <td className="px-4 py-3 text-center text-charcoal/80"><Cell v={c} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Madhuban */}
      <section className={`${SECTION} bg-[#F4EFE8]`} aria-labelledby="why-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Why Madhuban</p>
          <h2 id="why-title" className={H2}>Why Book Your Ratapani Jungle Safari With Madhuban</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, text }, i) => (
              <RevealOnScroll key={title} delay={i * 80}>
                <article className={`${CARD} h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-beige text-earth-brown"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-3 font-primary text-xl leading-7 text-charcoal">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-charcoal/75">{text}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-earth-brown p-5 text-center md:grid-cols-4 md:p-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className=" text-sm text-warm-beige/85">{s.label}</dt>
                <dd className="font-primary text-[34px] leading-10 text-cream">
                  <CountUp to={s.to} />{s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What is a Ratapani jungle safari */}
      <section className={SECTION} aria-labelledby="what-title">
        <div className={`${WRAP} grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start`}>
          <div>
            <p className={EYEBROW}>Natural history</p>
            <h2 id="what-title" className={H2}>What Is a Ratapani Jungle Safari?</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-charcoal/80">
              <p>Ratapani Tiger Reserve spreads across the Raisen and Sehore districts of Madhya Pradesh, in the Vindhyan hills. Dry deciduous teak forest, bamboo, and sandstone cliffs make up the landscape, and the reserve links tiger habitat across central India.</p>
              <p>A Ratapani jungle safari is a guided drive through the forest in an open gypsy, accompanied by a Forest Department guide. Along with more than 60 resident tigers, visitors look for leopards, sloth bears, striped hyenas, dholes, sambar and chital, and over 200 recorded bird species.</p>
              <p>Wildlife sightings can never be promised. What we promise is a well-planned safari and a calm stay at the edge of the forest.</p>
            </div>
            <Link href="/ratapani-tiger-safari" className="mt-4 inline-flex items-center gap-1.5 font-medium text-earth-brown underline-offset-4 hover:underline">
              Full guide: Ratapani Tiger Safari <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <h3 className="mt-6 font-primary text-xl leading-7 text-charcoal">Wildlife recorded in the sanctuary</h3>
            <dl className="mt-3 grid grid-cols-3 gap-2.5">
              {BIO.map(([n, label]) => (
                <div key={label} className="flex flex-col-reverse rounded-xl border border-[#CEC5B9]/60 bg-white px-3 py-3 text-center">
                  <dt className="text-xs leading-4 text-charcoal/70">{label}</dt>
                  <dd className="font-primary text-2xl leading-8 text-earth-brown"><CountUp to={n} />{n === 60 ? "+" : ""}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs leading-5 text-charcoal/60">Species recorded in Ratapani Wildlife Sanctuary, from official sanctuary information.</p>
          </div>
          <aside className={`${CARD} overflow-hidden`}>
            <div className="relative aspect-[16/9] w-full bg-[#E0D1BC]">
              <Image src={IMG.safari} alt="Jungle safari in Ratapani Tiger Reserve" fill quality={75} sizes="(min-width:1024px) 460px, 100vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="flex items-center gap-2 font-primary text-xl text-charcoal"><Trees size={18} className="text-[#9A8864]" aria-hidden="true" /> Safari at a glance</h3>
              <dl className="mt-3 divide-y divide-[#CEC5B9]/60 text-[15px]">
                {[
                  ["Where", "Ratapani Tiger Reserve (Raisen and Sehore)"],
                  ["Distance", "About an hour from Bhopal"],
                  ["Vehicle", "Open gypsy registered with the sanctuary, up to 6 guests"],
                  ["Shifts", "Morning and afternoon"],
                  ["Best seasons", "Oct–Feb for birds and cool weather; Mar–Jun for water-hole sightings"],
                  ["Gates", "Jhiri and Delawadi (online or at the gate); Bhimbetka (offline only)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-2">
                    <dt className="w-24 shrink-0 font-medium text-earth-brown">{k}</dt>
                    <dd className="text-charcoal/80">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#F4EFE8] p-3 text-sm leading-5 text-charcoal/80">
                <IdCard size={18} className="mt-0.5 shrink-0 text-earth-brown" aria-hidden="true" />
                A valid government photo ID is required for every guest to get the safari permit.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Rooms */}
      <section className={`${SECTION} bg-[#F4EFE8]`} aria-labelledby="rooms-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Eco-lodge stay</p>
          <h2 id="rooms-title" className={H2}>Stay Near Ratapani Tiger Reserve: Our Rooms</h2>
          <p className="mt-2 max-w-[640px] text-base leading-7 text-charcoal/75">Every room is built with local stone, wood and earth. Nightly prices below include the MAP meal plan, before tax.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROOMS.map((r, i) => (
              <RevealOnScroll key={r.slug} delay={i * 80}>
                <article className={`${CARD} group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E0D1BC]">
                    <Image src={r.img} alt={r.alt} fill quality={75} sizes="(min-width:1024px) 290px, (min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-bold text-earth-brown">
                      From {formatInr(regularRate(r.slug, "MAP"))}/night
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className={EYEBROW}>{r.tag}</p>
                    <h3 className="mt-1 font-primary text-xl leading-7 text-charcoal">{r.name}</h3>
                    <p className="mt-1.5 flex-1 text-[15px] leading-6 text-charcoal/75">{r.text}</p>
                    <Link href={`/stay-in-ratapani-tiger-reserve/${r.slug}`} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 font-medium text-earth-brown underline-offset-4 hover:underline">
                      Explore {r.name} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={SECTION} aria-labelledby="reviews-title">
        <div className={WRAP}>
          <p className={EYEBROW}>Guest stories</p>
          <h2 id="reviews-title" className={H2}>What Guests Say</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {REVIEWS.map(([quote, name, role], i) => (
              <RevealOnScroll key={name} delay={i * 90}>
                <figure className={`${CARD} h-full p-5 md:p-6`}>
                  <div className="flex gap-0.5 text-[#9A8864]" aria-label="5 out of 5 stars" role="img">
                    {Array.from({ length: 5 }).map((_, n) => (<Star key={n} size={16} fill="currentColor" aria-hidden="true" />))}
                  </div>
                  <blockquote className="mt-3 text-[15px] leading-6 text-charcoal/80">“{quote}”</blockquote>
                  <figcaption className="mt-4 text-sm"><span className="font-bold text-earth-brown">{name}</span> · {role}</figcaption>
                </figure>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${SECTION} bg-[#F4EFE8] pt-12`} aria-labelledby="faq-title">
        <div className={`${WRAP} max-w-[900px]`}>
          <p className={EYEBROW}>Good to know</p>
          <h2 id="faq-title" className={H2}>Ratapani Jungle Safari FAQs</h2>
          <div className="mt-6 space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className={`${CARD} group`}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-medium leading-6">{q}</h3>
                  <ChevronDown size={20} className="shrink-0 text-[#9A8864] transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-4 text-[15px] leading-6 text-charcoal/80">
                  {a}
                  {q.startsWith("What is the cancellation") && (<> <Link href="/terms-and-condition" className="font-medium text-earth-brown underline">Read the terms</Link>.</>)}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-charcoal/60">Last updated {UPDATED_LABEL}.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-earth-brown py-12 text-center md:py-16" aria-labelledby="cta-title">
        <div className={`${WRAP} max-w-[760px]`}>
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F6E0B7]">Start planning</p>
          <h2 id="cta-title" className="mt-2 font-primary text-[28px] leading-9 text-cream md:text-[40px] md:leading-[48px]">Book Your Ratapani Tiger Safari Package</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-base leading-7 text-warm-beige">Tell us your dates and group size. We will check your permit, prepare the safari jeep and arrange your stay.</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/booking" className={BTN_LIGHT}>Book now</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp</a>
            <a href="tel:+919770558419" className={BTN_GHOST}><Phone size={16} aria-hidden="true" /> Call 09770558419</a>
          </div>
          <p className="mt-6 text-sm text-warm-beige/80">
            More to do here: <Link href="/experiences" className="underline">all experiences</Link> · <Link href="/nearby-attractions" className="underline">nearby attractions</Link> · <Link href="/stay-in-ratapani-tiger-reserve" className="underline">our rooms</Link>
          </p>
        </div>
      </section>

      <StickyBookBar href="#packages" label="See safari packages" />
    </main>
  );
}
