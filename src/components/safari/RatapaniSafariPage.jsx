import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Binoculars,
  Car,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Landmark,
  MessageCircle,
  Mountain,
  PawPrint,
  Plane,
  ShieldCheck,
  Sun,
  Sunset,
  TrainFront,
  TreePine,
} from "lucide-react";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { CountUp, GrowBar, HeroPhoto, ItineraryTabs, SectionNav } from "@/components/safari/SafariClient";

/**
 * /ratapani-tiger-safari — the long-form guide to Ratapani Tiger Reserve.
 *
 * Built from the Stitch design, restyled in the site's own brand: earth-brown
 * (#6E6146), warm beige (#E0D1BC), cream (#FAF7F2), bronze (#9A8864), Playfair
 * for headings and Lato for body text. No black anywhere; the dark tones are
 * a deep brown derived from the brand brown.
 *
 * Only Madhuban's own photographs are used. Where there is no photo of a subject
 * (a leopard, Bhimbetka's rock art), the page uses a text card instead of a
 * stock or generated picture.
 */

export const PAGE_URL = "https://www.madhubanecoretreat.com/ratapani-tiger-safari";
const R2 = "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/";
const EXP = `${R2}experiences/New%20Experiences%20page/`;
const DAY = `${EXP}a%20day%20at%20madhuban/`;
const ACC = `${R2}home/accommodations/`;
const WHATSAPP = "https://wa.me/919770558419?text=Hi%2C%20I%27d%20like%20to%20plan%20a%20Ratapani%20tiger%20safari%20stay";

const IMG = {
  tiger: `${EXP}Hero%20imgs/experiences%20page%20hero%20img%201.png`,
  tigerBanner: `${R2}home/banner/desktop/madhuban-eco-retreat-home-page-banner-tiger-image(1).jpg`,
  safari: `${EXP}jungle%20safari%20ratapani%20tiger%20reserve.jpg`,
  safariDay: `${DAY}experiences%20page%20safari%20section%20img.png`,
  hiking: `${EXP}forest%20hiking%20trails.jpg`,
  walkDay: `${DAY}experiences%20page%20mid%20day%20forest%20walk%20section%20img.png`,
  heritage: `${EXP}heritage%20walk.jpg`,
  villageDay: `${DAY}experience%20page%20village%20walk%20img.png`,
  dinner: `${EXP}bush%20dinning%20madhuban%20eco%20retreat.jpg`,
  dinnerDay: `${DAY}experiences%20page%20bush%20dining%20section%20img.png`,
  camping: `${EXP}jungle%20camping%20ratapani%20tiger%20reserve%20madhuban.jpg`,
  aerial: `${R2}home/banner/desktop/madhuban-eco-retreat-home-page-banner-aerial-view.jpg`,
  forestRoad: `${R2}home/banner/desktop/madhuban-eco-retreat-home-page-banner-ratapani-forest-aerial-road.jpg`,
  lodge: `${R2}home/banner/desktop/Madhuban_Eco_Retreat_3000x1688.jpg`,
  fort: `${R2}nearby-atterations/ginnorgarh-tribal-fort-ratapani-tiger-reserve.jpg`,
};

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "wildlife", label: "Wildlife" },
  { id: "gates", label: "Gates" },
  { id: "planning", label: "Plan a Safari" },
  { id: "best-time", label: "Best Time" },
  { id: "bhimbetka", label: "Bhimbetka" },
  { id: "how-to-reach", label: "How to Reach" },
  { id: "stay", label: "Stay" },
  { id: "faq", label: "FAQ" },
];

const HERO_FACTS = [
  ["Reserve area", "1,271 sq. km"],
  ["Status", "Tiger Reserve, 2024"],
  ["Resident tigers", "40+"],
  ["From Bhopal", "About 1 hour"],
];

const STATS = [
  { to: 1271, label: "Sq. km of protected forest" },
  { to: 40, suffix: "+", label: "Resident tigers" },
  { to: 55, suffix: "%", label: "Teak canopy" },
  { to: 3, label: "Safari gates" },
  { to: 8, suffix: "th", label: "Tiger reserve of Madhya Pradesh" },
];

const WHY = [
  {
    tag: "Unmatched access",
    title: "A tiger reserve close to Bhopal",
    text: "Ratapani is a short drive from Madhya Pradesh’s capital, so a real jungle safari fits into a weekend, with no multi-day transit and no complicated logistics.",
    img: IMG.safari,
    alt: "Jungle safari into Ratapani Tiger Reserve near Bhopal",
  },
  {
    tag: "Topography",
    title: "A landscape of the Vindhya hills",
    text: "Sandstone ridges, rocky plateaus, hidden gorges and teak-covered slopes make Ratapani look and feel different from flat grassland parks.",
    img: IMG.hiking,
    alt: "Forest trail across the Vindhya hills in Ratapani",
  },
  {
    tag: "Thriving fauna",
    title: "A rich wildlife habitat",
    text: "Over 40 resident tigers, plus leopards, sloth bears, striped hyenas, dholes and herds of sambar and chital, share this dry deciduous forest.",
    img: IMG.tigerBanner,
    alt: "Bengal tiger in the dry deciduous forest of Ratapani Tiger Reserve",
  },
  {
    tag: "Ancient heritage",
    title: "Wildlife meets ancient history",
    text: "The UNESCO-listed Bhimbetka rock shelters sit on Ratapani’s edge, so a safari can sit alongside prehistoric rock art in one trip.",
    img: IMG.heritage,
    alt: "Heritage and village walk near Bhimbetka and Ratapani",
  },
];

const FACTS = [
  ["Official name", "Ratapani Tiger Reserve"],
  ["State", "Madhya Pradesh"],
  ["Districts", "Raisen and Sehore"],
  ["Total area", "About 1,271 sq. km"],
  ["Core area", "About 764 sq. km (60%)"],
  ["Buffer area", "About 508 sq. km (40%)"],
  ["Wildlife sanctuary since", "1976"],
  ["Tiger reserve notification", "2024 (Madhya Pradesh’s 8th)"],
  ["Dominant forest", "Dry teak forest (about 55%)"],
  ["Terrain", "Vindhyan hills and sandstone valleys"],
  ["Nearest city and airport", "Bhopal"],
  ["Tourism gates", "Jhiri, Delawadi, Bhimbetka"],
  ["Nearby World Heritage Site", "Bhimbetka Rock Shelters"],
];

const SPECIES = [
  { name: "Indian Leopard", latin: "Panthera pardus fusca", text: "Suited to the rocky outcrops and sandstone ledges of the Vindhyas, and often seen on dusk drives." },
  { name: "Sloth Bear", latin: "Melursus ursinus", text: "Forages among mahua trees, termite mounds and rocky crevices across the undulating hills." },
  { name: "Striped Hyena", latin: "Hyaena hyaena", text: "A nocturnal forager of the dry sandstone ridges and scrub-fringed buffer areas." },
  { name: "Chital and Sambar", latin: "Axis axis / Rusa unicolor", text: "The herbivores that sustain the big cats, seen grazing in bamboo clearings at dawn." },
  { name: "Dhole, Nilgai and more", latin: "Cuon alpinus / Boselaphus tragocamelus", text: "Wild dogs, blue bull, four-horned antelope, jungle cat, jackals and wild boar complete the food web." },
];

const FLORA = [
  { icon: TreePine, title: "Teak forests", latin: "Tectona grandis", text: "Teak covers the slopes and plateaus, dropping its broad leaves in winter to open up the hills and turning green again with the monsoon." },
  { icon: Mountain, title: "Bamboo brakes", latin: "Dendrocalamus strictus", text: "Male bamboo lines the drainage channels and ravines, giving deer, bears and tigers natural cover." },
  { icon: Sun, title: "Mixed deciduous flora", latin: "Saja, tendu, mahua, palash", text: "Saja, tendu, mahua and palash trees fill the gaps, with palash lighting up the forest red in spring." },
];

const GATES = [
  { n: "01", name: "Jhiri Gate", sub: "Deep teak valleys and waterholes", text: "A popular entry for tiger enthusiasts, leading into teak valleys, natural watering holes and prime predator territory.", km: "About 34 km" },
  { n: "02", name: "Delawadi Gate", sub: "Scenic hills and canopy views", text: "Known for dramatic changes in elevation, bamboo ravines, birdlife and leopard sightings along rocky crags.", km: "About 52 km" },
  { n: "03", name: "Bhimbetka Gate", sub: "Heritage and cultural forest", text: "Links the prehistoric rock shelters with peaceful woodland drives along the forest’s northern edge.", km: "About 44 km" },
];

const REQUIREMENTS = [
  "Valid government photo ID matching the name on the permit",
  "Your confirmed safari permit or booking voucher",
  "A forest department naturalist guide (assigned for your safari)",
  "An authorised open safari vehicle with a registered driver",
  "Gate entry and vehicle fees, as applicable",
  "Following the forest rules: silence, no plastic, no flash",
];

const SEASONS = [
  { when: "October to February", title: "Winter mist and birding", text: "Cool, pleasant weather. Misty mornings are made for forest photography, and migratory birds are at their peak.", best: "Ideal for birdwatching and relaxed safaris" },
  { when: "March to June", title: "Summer sightings", text: "Hot days, with teak leaves fallen for wide visibility. Wildlife gathers near the shrinking waterholes, which raises the odds of a big-cat sighting.", best: "Ideal for big-cat photography" },
  { when: "July to September", title: "Monsoon rejuvenation", text: "Core safari zones usually close so the forest can breed and recover. The retreat, waterfalls and Bhimbetka stay open and turn strikingly green.", best: "Ideal for wellness stays and heritage" },
];

const MONTHS = [
  ["Jan", "Peak"], ["Feb", "Peak"], ["Mar", "Warm"], ["Apr", "Sightings"], ["May", "Sightings"], ["Jun", "Closing"],
  ["Jul", "Monsoon"], ["Aug", "Monsoon"], ["Sep", "Monsoon"], ["Oct", "Reopening"], ["Nov", "Lush"], ["Dec", "Peak"],
];
const PEAK = new Set(["Peak", "Sightings"]);
const CLOSED = new Set(["Monsoon"]);

const ACTIVITIES = [
  { title: "Open-jeep tiger safaris", text: "Go deep into the forest in an open safari vehicle with a certified forest naturalist and expert trackers.", img: IMG.safariDay, alt: "Jungle safari in an open vehicle in Ratapani", href: "/experiences", cta: "See all experiences" },
  { title: "Canopy birding trails", text: "Look for the reserve’s resident and migratory birds along riverbeds, dam backwaters and bamboo thickets.", icon: Binoculars, href: "/experiences/bird-watching-and-wilderness", cta: "Bird-watching at Madhuban" },
  { title: "Bhimbetka rock shelters", text: "Walk beneath UNESCO-listed rock art painted tens of thousands of years ago on natural sandstone overhangs.", icon: Landmark, href: "/nearby-attractions", cta: "Nearby attractions" },
  { title: "Ginnorgarh Fort", text: "Trek through dense forest to an ancient Gond hill fort set on an isolated ridge.", img: IMG.fort, alt: "Ginnorgarh tribal fort inside Ratapani Tiger Reserve", href: "/nearby-attractions", cta: "Nearby attractions" },
  { title: "Forest walks and nature trails", text: "Slow, guided walks along the ridges, where you notice the detail you miss from a vehicle.", img: IMG.walkDay, alt: "Guided forest walk near Ratapani Tiger Reserve", href: "/experiences/forest-walks-and-nature-trails", cta: "Forest walks and trails" },
  { title: "Starlit bush dinners", text: "A private dinner in a forest clearing, with firelight, local flavours and a sky free of city glow.", img: IMG.dinnerDay, alt: "Bush dinner under the stars at Madhuban Eco Retreat", href: "/dining", cta: "Dining at Madhuban" },
];

const BHIMBETKA = [
  ["Rock-art figures", "Early artists painted the animals still found here, such as tigers, wild bulls and deer, in natural ochre pigments."],
  ["Auditorium Cave", "A vast rock vault, one of the best-known shelters at the site."],
  ["Over 750 shelters", "Spread across roughly 10 kilometres, with art from the Palaeolithic and Mesolithic eras."],
];

const PACKING = [
  ["Binoculars", "8x42 or 10x42 for scanning the canopy"],
  ["Telephoto lens", "300mm or longer for wildlife"],
  ["Dust scarf or buff", "Protection on dry, unpaved tracks"],
  ["Wide-brim hat", "Vital on open afternoon drives"],
  ["Light warm layers", "Winter mornings can be chilly"],
  ["Reusable water bottle", "Single-use plastic is not allowed"],
  ["Government ID", "Carry the original card for entry checks"],
  ["Natural insect repellent", "A DEET-free balm for walking trails"],
];
const SWATCHES = [["Khaki", "#C3B091"], ["Olive", "#7A7A4F"], ["Brown", "#8B6B4A"], ["Green", "#4F6B45"]];

const RULES = [
  ["Maintain silence", "Whisper only; sudden noises stress animals."],
  ["Keep your distance", "Give animals space and never crowd them."],
  ["Stay inside", "Never step out of the safari vehicle."],
  ["Follow your guide", "The naturalist’s instructions come first."],
  ["Do not feed", "Feeding wildlife changes how it behaves."],
  ["Zero plastic", "Take all your rubbish out of the forest."],
  ["No flash", "Flash photography disturbs wildlife."],
];

const ROUTES = [
  { icon: Plane, title: "By air", place: "Raja Bhoj Airport (BHO), Bhopal", text: "Bhopal is connected by direct flights to several major cities. From the airport, the reserve and Madhuban are about a drive of an hour or so.", note: "Private transfers can be arranged." },
  { icon: TrainFront, title: "By train", place: "Bhopal Junction and Rani Kamlapati", text: "Both stations are major rail hubs on the Delhi–Mumbai and Delhi–Chennai corridors, with fast express services. The safari gates lie to the south of the city.", note: "We can arrange pick-up from either station." },
  { icon: Car, title: "By road", place: "Bhopal–Obaidullaganj–Barkhera", text: "Good highways lead out of Bhopal toward Obaidullaganj and Barkhera. The drive is easy by private car, self-drive or a chartered cab.", note: "About an hour from Bhopal." },
];

const STAYS = [
  { name: "Safari Tents", text: "Canvas suites on raised decks with forest views.", img: `${ACC}madhuban-eco-retreat-safari-tent-exterior-image-home-page-card.jpg`, href: "/stay-in-ratapani-tiger-reserve/safari-tent" },
  { name: "Mud Houses", text: "Earthen walls that stay naturally cool, with private sit-outs.", img: `${ACC}madhuban-eco-retreat-mud-house-exterior-image-home-page-card.jpg`, href: "/stay-in-ratapani-tiger-reserve/mud-house-standard" },
  { name: "Glamping Tents", text: "Intimate canvas stays under the teak canopy.", img: `${ACC}madhuban-eco-retreat-glamping-tent-exterior-image-home-page-card.jpg`, href: "/stay-in-ratapani-tiger-reserve/glamping-tents" },
  { name: "Camping", text: "Nature-first tents for stargazers, birders and hikers.", img: `${ACC}madhuban-camping-hammock-under-100kb.jpg`, href: "/stay-in-ratapani-tiger-reserve/camping-tent" },
  { name: "Pool-side Villas", text: "Spacious villas beside the pool with private balconies.", img: `${ACC}poolside-villa-madhuban-eco-retreat-home-page-card.jpg`, href: "/stay-in-ratapani-tiger-reserve/pool-side-villa" },
];

const ITINERARIES = [
  {
    id: "2d",
    label: "2 days / 1 night",
    days: [
      {
        day: "Day 01",
        title: "Arrival, heritage and a twilight safari",
        items: [
          ["Morning", "Arrive in Bhopal and head to the Bhimbetka rock shelters for a guided visit."],
          ["Midday", "Check in at Madhuban Eco Retreat and enjoy a farm-style lunch."],
          ["Afternoon", "Afternoon safari into Ratapani, looking for resident tigers."],
          ["Evening", "Campfire dinner under clear skies."],
        ],
      },
      {
        day: "Day 02",
        title: "Dawn tracking and return",
        items: [
          ["Early morning", "Coffee and a dawn departure for the morning safari."],
          ["Mid-morning", "Breakfast back at the retreat."],
          ["Late morning", "Relaxed check-out."],
          ["Afternoon", "Drive back to the Bhopal airport or station."],
        ],
      },
    ],
  },
  {
    id: "3d",
    label: "3 days / 2 nights",
    days: [
      { day: "Day 01", title: "Wilderness arrival", text: "Transfer from Bhopal to Madhuban. Take an afternoon safari focused on tiger corridors, then enjoy a starlit bush dinner." },
      { day: "Day 02", title: "Double safari and heritage", text: "A dawn safari in the rocky gorges, a midday visit to the Bhimbetka rock art, and a late-afternoon drive to the Ratapani Dam backwaters." },
      { day: "Day 03", title: "Ridge walk and departure", text: "A guided morning walk along the sandstone ridges with a naturalist, then a relaxed brunch before heading back to Bhopal." },
    ],
  },
];

const FAQS = [
  ["When was Ratapani declared a Tiger Reserve?", "Ratapani became a wildlife sanctuary in 1976 and was notified as Madhya Pradesh’s 8th tiger reserve in December 2024."],
  ["How far is Ratapani Tiger Reserve from Bhopal?", "The safari gates are roughly 35 to 55 km from Bhopal depending on the gate, about 34 km to Jhiri, 44 km to Bhimbetka and 52 km to Delawadi. Madhuban Eco Retreat is about an hour from Bhopal."],
  ["How many tigers live in Ratapani?", "The reserve is home to more than 40 resident tigers, along with leopards, sloth bears, striped hyenas and dholes."],
  ["What are the safari timings in Ratapani?", "Safaris run in two shifts, a morning drive and an afternoon drive. Exact timings change with the season and sunrise and sunset, so we confirm them for your dates."],
  ["How do I book a Ratapani safari?", "Safari bookings are made through the Madhya Pradesh Forest Department’s MPOnline portal. We can guide you or help arrange it as part of your stay. Message us with your dates."],
  ["Is Ratapani open all year?", "The core safari zones usually close during the monsoon, roughly July to mid-October, and reopen afterwards. Check the current dates before you plan, and we’ll confirm them when you book."],
  ["Which safari gate is best for tigers?", "Jhiri is popular for tiger sightings, while Delawadi is loved for scenery, leopards and sloth bears. No sighting can be guaranteed, since these are wild animals."],
  ["Can I visit Bhimbetka on the same trip?", "Yes. Bhimbetka sits at the edge of the reserve and pairs easily with a safari. We can include it in your itinerary."],
  ["Can I drive my own vehicle inside the safari zones?", "No. Safaris use authorised open safari vehicles with registered drivers and a forest department naturalist."],
  ["What should I wear on a safari?", "Earthy, muted colours such as khaki, olive and brown. Avoid bright white, neon shades and strong perfume, and bring light layers for cool mornings."],
  ["Is a Ratapani safari suitable for children and older guests?", "Yes. The short distance from Bhopal makes it far less tiring than remote reserves, and we can plan gentle itineraries and ground-level stays."],
  ["Can I go birdwatching outside the safari?", "Yes. The buffer areas, stream banks and the grounds of Madhuban offer good birding, with guided bird-watching available."],
];

const SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.madhubanecoretreat.com/" },
      { "@type": "ListItem", position: 2, name: "Ratapani Tiger Safari", item: PAGE_URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Ratapani Tiger Safari: Gates, Timings & Stay Near Bhopal",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "Madhuban Eco Retreat", url: "https://www.madhubanecoretreat.com/" },
    about: { "@id": `${PAGE_URL}#reserve` },
    primaryImageOfPage: { "@type": "ImageObject", url: IMG.tiger },
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${PAGE_URL}#reserve`,
    name: "Ratapani Tiger Reserve",
    description:
      "Ratapani Tiger Reserve is Madhya Pradesh’s 8th tiger reserve, about 1,271 sq. km of dry teak forest and Vindhyan sandstone hills in Raisen and Sehore districts, near Bhopal.",
    image: IMG.tiger,
    touristType: ["Wildlife safari", "Nature and birdwatching", "Heritage travel"],
    geo: { "@type": "GeoCoordinates", latitude: 23.1, longitude: 77.75 },
    containedInPlace: { "@type": "AdministrativeArea", name: "Madhya Pradesh, India" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

/* ---------- small building blocks ---------- */

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-earth-brown px-7 py-3 text-base font-medium text-warm-beige shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(132,116,85)]";
const BTN_LIGHT =
  "inline-flex items-center justify-center gap-2 rounded-full bg-warm-beige px-7 py-3 text-base font-medium text-earth-brown transition duration-300 hover:-translate-y-0.5 hover:bg-cream";
const BTN_GHOST_LIGHT =
  "inline-flex items-center justify-center gap-2 rounded-full border border-warm-beige/70 px-7 py-3 text-base font-medium text-warm-beige transition duration-300 hover:bg-warm-beige/15";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-2 rounded-full border border-earth-brown px-7 py-3 text-base font-medium text-earth-brown transition duration-300 hover:bg-earth-brown/10";

function Section({ id, tone = "white", children, className = "" }) {
  const bg = { white: "bg-white", cream: "bg-cream", sand: "bg-[#F4EFE8]" }[tone];
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`scroll-mt-28 py-12 md:py-16 ${bg} ${className}`}>
      <div className="mx-auto max-w-[1240px] px-4 md:px-6">{children}</div>
    </section>
  );
}

function Heading({ id, eyebrow, title, lead, center = false, light = false }) {
  return (
    <RevealOnScroll className={`mb-8 max-w-[720px] md:mb-10 ${center ? "mx-auto text-center" : ""}`}>
      <p className={`text-xs font-bold uppercase leading-4 tracking-[3px] ${light ? "text-warm-beige" : "text-earth-brown"}`}>{eyebrow}</p>
      <h2
        id={id ? `${id}-title` : undefined}
        className={`mt-2 font-primary text-[28px] font-normal leading-9 md:text-4xl md:leading-[44px] ${light ? "text-cream" : "text-charcoal"}`}
      >
        {title}
      </h2>
      <span className={`mt-3 block h-[2px] w-14 bg-[#9A8864] ${center ? "mx-auto" : ""}`} aria-hidden="true" />
      {lead && <p className={`mt-4 text-base font-light leading-7 md:text-lg md:leading-8 ${light ? "text-cream/85" : "text-charcoal/75"}`}>{lead}</p>}
    </RevealOnScroll>
  );
}

function Photo({ src, alt, sizes, className = "", ratio = "aspect-[4/3]" }) {
  return (
    <div className={`relative overflow-hidden bg-[#EDE6DC] ${ratio} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={90}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
}

const CARD = "group overflow-hidden rounded-2xl border border-[#CEC5B9]/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-xl";

/* ---------- the page ---------- */

export default function RatapaniSafariPage() {
  return (
    <div className="bg-white font-body text-charcoal antialiased">
      {/* HERO */}
      <header id="top" className="relative isolate overflow-hidden bg-[#3A3123]">
        <div className="absolute inset-0 -z-10">
          <HeroPhoto src={IMG.tiger} alt="Bengal tiger in Ratapani Tiger Reserve near Bhopal" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A3123] via-[#3A3123]/55 to-[#3A3123]/20" />
        </div>
        <div className="mx-auto flex min-h-[560px] max-w-[1240px] flex-col justify-end px-4 pb-10 pt-24 md:min-h-[640px] md:px-6 md:pb-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-cream/80">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Ratapani Tiger Safari</li>
            </ol>
          </nav>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-warm-beige">
            <span className="h-1.5 w-1.5 rounded-full bg-warm-beige" aria-hidden="true" />
            Madhya Pradesh · Near Bhopal
          </p>
          <h1 className="mt-3 max-w-[820px] font-primary text-[38px] font-normal leading-[46px] tracking-[-0.01em] text-cream md:text-[56px] md:leading-[66px]">
            Ratapani Tiger Safari: Discover the Tiger Reserve Near Bhopal
          </h1>
          <p className="mt-4 max-w-[640px] text-base font-light leading-7 text-cream/90 md:text-lg md:leading-8">
            An untouched expanse of Vindhyan sandstone, teak forest and tiger country, just an hour from Bhopal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/booking" className={BTN_LIGHT}>Plan your safari <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/stay-in-ratapani-tiger-reserve" className={BTN_GHOST_LIGHT}>Explore stay options</Link>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {HERO_FACTS.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-warm-beige/30 bg-[#3A3123]/45 px-4 py-3 backdrop-blur-sm">
                <dt className="text-[11px] uppercase tracking-[0.1em] text-warm-beige">{k}</dt>
                <dd className="mt-0.5 font-primary text-lg leading-6 text-cream">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <SectionNav items={NAV} ctaHref="/booking" ctaLabel="Plan safari" />

      <main>
        {/* OVERVIEW */}
        <Section id="overview">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <Heading eyebrow="Discover Ratapani" title="Where ancient ridges meet silent predators" />
              <RevealOnScroll className="space-y-4 text-base font-light leading-7 text-charcoal/80 md:text-[17px] md:leading-8">
                <p>
                  Folded into the Vindhya Range across Raisen and Sehore districts, Ratapani Tiger Reserve is central India’s newest and one
                  of its most approachable wilderness areas, within easy reach of Bhopal.
                </p>
                <p>
                  Set up as a wildlife sanctuary in 1976, it was notified as Madhya Pradesh’s 8th tiger reserve in 2024. It covers about 1,271
                  square kilometres of dry deciduous and teak forest, so a real <strong className="font-bold text-earth-brown">tiger safari near Bhopal</strong> needs no
                  long journey.
                </p>
                <p>
                  Unlike crowded tourist hubs, Ratapani offers an unhurried safari. Rock monoliths rise above seasonal streams, leopards bask on
                  sandstone ledges, and Bengal tigers move through sun-dappled teak groves.
                </p>
              </RevealOnScroll>
            </div>
            <RevealOnScroll className="grid grid-cols-2 gap-4">
              <div className={`${CARD} mt-6`}><Photo src={IMG.safari} alt="Safari vehicle entering Ratapani Tiger Reserve" sizes="(max-width: 1024px) 50vw, 300px" ratio="aspect-[3/4]" /></div>
              <div className={CARD}><Photo src={IMG.forestRoad} alt="Forest road through Ratapani near Madhuban Eco Retreat" sizes="(max-width: 1024px) 50vw, 300px" ratio="aspect-[3/4]" /></div>
            </RevealOnScroll>
          </div>
        </Section>

        {/* NUMBERS */}
        <section aria-label="Ratapani at a glance" className="bg-earth-brown py-10 md:py-12">
          <dl className="mx-auto grid max-w-[1240px] grid-cols-2 gap-4 px-4 md:grid-cols-5 md:px-6">
            {STATS.map((s, i) => (
              <RevealOnScroll key={s.label} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-warm-beige/20 bg-cream/[0.06] px-3 py-5 text-center">
                  <dd className="order-1 font-primary text-[40px] leading-[44px] text-warm-beige md:text-5xl md:leading-[52px]">
                    <CountUp to={s.to} />{s.suffix}
                  </dd>
                  <dt className="order-2 text-sm font-light leading-5 text-cream/90">{s.label}</dt>
                </div>
              </RevealOnScroll>
            ))}
          </dl>
        </section>

        {/* ABOUT */}
        <Section id="about" tone="cream">
          <Heading eyebrow="About the reserve" title="The genesis of a protected haven" lead="Anchored by the Ratapani reservoir and framed by prehistoric rock shelters, this is one of the most cohesive teak ecosystems in central India." />
          <div className="grid gap-6 lg:grid-cols-3">
            <RevealOnScroll className="h-full">
              <div className="h-full rounded-2xl border border-[#CEC5B9]/50 bg-white p-6">
                <h3 className="font-primary text-xl leading-7">Historical evolution</h3>
                <ol className="mt-4 space-y-5 border-l border-[#9A8864]/50 pl-5">
                  <li className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-earth-brown" aria-hidden="true" />
                    <p className="font-primary text-2xl text-earth-brown">1976</p>
                    <p className="font-medium">Wildlife sanctuary declared</p>
                    <p className="mt-1 text-[15px] font-light leading-6 text-charcoal/75">Notified to protect the Vindhyan deciduous forests and their wildlife.</p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-earth-brown" aria-hidden="true" />
                    <p className="font-primary text-2xl text-earth-brown">2024</p>
                    <p className="font-medium">Notified as a Tiger Reserve</p>
                    <p className="mt-1 text-[15px] font-light leading-6 text-charcoal/75">Raised to Madhya Pradesh’s 8th tiger reserve, protecting big-cat corridors around Bhopal, Raisen and Sehore.</p>
                  </li>
                </ol>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={80} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[#CEC5B9]/50 bg-white p-6">
                <div>
                  <h3 className="font-primary text-xl leading-7">Zoned protection</h3>
                  <p className="mt-3 text-[15px] font-light leading-6 text-charcoal/75">A secure core habitat is surrounded by a buffer where local communities share in stewardship.</p>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm font-medium text-earth-brown"><span>Core 60%</span><span>Buffer 40%</span></div>
                  <GrowBar percent={60} className="bg-earth-brown" />
                  <p className="mt-2 text-xs text-charcoal/60">About 764 sq. km core and 508 sq. km buffer</p>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={160} className="h-full">
              <figure className="relative h-full min-h-[220px] overflow-hidden rounded-2xl bg-earth-brown">
                <Image src={IMG.aerial} alt="Aerial view of the forest around Madhuban Eco Retreat and Ratapani" fill quality={90} sizes="(max-width: 1024px) 100vw, 400px" className="object-cover opacity-45" />
                <blockquote className="relative flex h-full items-end p-6 font-primary text-xl italic leading-8 text-cream">
                  “More than half of the canopy is teak, forming a vital dry deciduous forest sanctuary.”
                </blockquote>
              </figure>
            </RevealOnScroll>
          </div>
        </Section>

        {/* WHY */}
        <Section id="why">
          <Heading eyebrow="Why Ratapani" title="Four reasons to experience this wilderness" center />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <RevealOnScroll key={w.title} delay={i * 80} className="h-full">
                <article className={`${CARD} flex h-full flex-col`}>
                  <div className="relative">
                    <Photo src={w.img} alt={w.alt} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 290px" />
                    <span className="absolute left-3 top-3 rounded border border-[#CEC5B9]/60 bg-white/90 px-3 py-1 text-xs font-medium text-[#6C5C3C]">{w.tag}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-primary text-xl leading-7">{w.title}</h3>
                    <p className="mt-2 text-[15px] font-light leading-6 text-charcoal/75">{w.text}</p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* QUICK FACTS */}
        <Section id="facts" tone="sand">
          <Heading eyebrow="Essential details" title="Reserve quick facts" />
          <RevealOnScroll>
            <dl className="grid overflow-hidden rounded-2xl border border-[#CEC5B9]/60 bg-white md:grid-cols-2">
              {FACTS.map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between gap-4 border-b border-[#CEC5B9]/40 px-5 py-3.5 ${i % 2 === 0 ? "md:border-r" : ""}`}>
                  <dt className="text-sm text-charcoal/60">{k}</dt>
                  <dd className="text-right text-sm font-medium text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-charcoal/60">Figures are rounded and based on Madhya Pradesh Forest Department and Project Tiger notifications.</p>
          </RevealOnScroll>
        </Section>

        {/* WILDLIFE */}
        <Section id="wildlife">
          <Heading eyebrow="Flora and fauna" title="Wildlife of Ratapani Tiger Reserve" lead="From the silent prowl of the Royal Bengal Tiger to nightjars calling over sandstone ledges, meet the inhabitants of this ancient Vindhyan forest." />
          <RevealOnScroll>
            <article className="group grid overflow-hidden rounded-2xl border border-[#CEC5B9]/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:grid-cols-2">
              <Photo src={IMG.tigerBanner} alt="Bengal tiger walking through the dry deciduous forest of Ratapani" sizes="(max-width: 1024px) 100vw, 620px" ratio="aspect-[4/3] lg:aspect-auto lg:min-h-[380px]" />
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-earth-brown"><PawPrint size={14} aria-hidden="true" /> Flagship predator</p>
                <h3 className="mt-2 font-primary text-3xl leading-10">The Royal Bengal Tiger</h3>
                <p className="text-sm italic text-charcoal/60">Panthera tigris tigris</p>
                <p className="mt-4 text-base font-light leading-7 text-charcoal/80">
                  Ratapani’s tigers have long thrived in near-secrecy. Across the valleys around Jhiri, Delawadi and beyond, more than 40 resident tigers hold territory, and their tracks crisscross quiet riverbeds and rocky teak plateaus.
                </p>
                <div className="mt-5"><Link href="/booking" className={BTN_PRIMARY}>Book a tiger safari stay <ArrowRight size={16} aria-hidden="true" /></Link></div>
              </div>
            </article>
          </RevealOnScroll>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIES.map((s, i) => (
              <RevealOnScroll key={s.name} delay={(i % 3) * 80} className="h-full">
                <article className="h-full rounded-2xl border border-[#CEC5B9]/50 bg-cream p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="font-primary text-xl leading-7">{s.name}</h3>
                  <p className="text-sm italic text-[#9A8864]">{s.latin}</p>
                  <p className="mt-2 text-[15px] font-light leading-6 text-charcoal/75">{s.text}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* FLORA */}
        <Section id="flora" tone="cream">
          <Heading eyebrow="Canopy and understory" title="Botanical tapestry of the Vindhyas" />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <RevealOnScroll>
              <figure className="group relative h-full min-h-[280px] overflow-hidden rounded-2xl">
                <Image src={IMG.forestRoad} alt="Teak and bamboo forest canopy in Ratapani" fill quality={90} sizes="(max-width: 1024px) 100vw, 440px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3A3123]/85 to-transparent p-5 text-cream">
                  <span className="font-primary text-4xl">55%</span> <span className="text-sm uppercase tracking-[2px]">Teak</span>
                </figcaption>
              </figure>
            </RevealOnScroll>
            <div className="grid gap-4">
              {FLORA.map(({ icon: Icon, title, latin, text }, i) => (
                <RevealOnScroll key={title} delay={i * 80}>
                  <article className="flex gap-4 rounded-2xl border border-[#CEC5B9]/50 bg-white p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-earth-brown/10 text-earth-brown"><Icon size={20} strokeWidth={1.5} aria-hidden="true" /></span>
                    <div>
                      <h3 className="font-primary text-xl leading-7">{title}</h3>
                      <p className="text-sm italic text-[#9A8864]">{latin}</p>
                      <p className="mt-1 text-[15px] font-light leading-6 text-charcoal/75">{text}</p>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Section>

        {/* GATES */}
        <Section id="gates">
          <Heading eyebrow="Safari access" title="Tourism gates and safari zones" lead="Safaris enter through three forest department gates, each leading into a different sector of the reserve." />
          <div className="grid gap-6 md:grid-cols-3">
            {GATES.map((g, i) => (
              <RevealOnScroll key={g.name} delay={i * 80} className="h-full">
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#CEC5B9]/50 bg-white p-6 transition duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <span className="absolute right-4 top-2 font-primary text-6xl text-earth-brown/10" aria-hidden="true">{g.n}</span>
                  <p className="text-xs font-bold uppercase tracking-[3px] text-[#9A8864]">Gate {g.n}</p>
                  <h3 className="mt-1 font-primary text-2xl leading-8">{g.name}</h3>
                  <p className="text-sm font-medium text-earth-brown">{g.sub}</p>
                  <p className="mt-3 flex-1 text-[15px] font-light leading-6 text-charcoal/75">{g.text}</p>
                  <p className="mt-4 border-t border-[#CEC5B9]/40 pt-3 text-sm"><strong className="font-bold">Distance from Bhopal:</strong> {g.km}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll className="mt-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-earth-brown p-6 text-cream md:flex-row md:items-center md:px-8">
              <div>
                <h3 className="font-primary text-xl leading-7">Safari permits are booked in advance</h3>
                <p className="mt-1 max-w-[680px] text-[15px] font-light leading-6 text-cream/90">
                  Safari vehicles, guides and permits are booked through the Madhya Pradesh Forest Department’s MPOnline portal. We can help you plan it around your stay.
                </p>
              </div>
              <Link href="/booking" className={`${BTN_LIGHT} shrink-0`}>Plan my safari</Link>
            </div>
          </RevealOnScroll>
        </Section>

        {/* PLANNING */}
        <Section id="planning" tone="sand">
          <Heading eyebrow="Practical guide" title="Planning your jungle safari" lead="Safaris follow two forest department shifts, timed to the hours when animals are most active." />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { icon: Sun, shift: "Shift 01", when: "Dawn hours", title: "Morning safari", time: "Roughly 6 AM to 10 AM, varies by season", text: "Mist rising off the teak canopy, alarm calls, fresh pugmarks on soft tracks and predators returning from the night’s hunt." },
                { icon: Sunset, shift: "Shift 02", when: "Dusk hours", title: "Afternoon safari", time: "Roughly 2:30 PM to 6 PM, varies by season", text: "The forest slips into twilight, leopards lounge on warm rocks and tigers move toward the waterholes." },
              ].map((s, i) => (
                <RevealOnScroll key={s.title} delay={i * 80}>
                  <article className="rounded-2xl border border-[#CEC5B9]/50 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-earth-brown"><s.icon size={16} aria-hidden="true" /> {s.shift}</span>
                      <span className="text-xs uppercase tracking-wider text-charcoal/50">{s.when}</span>
                    </div>
                    <h3 className="mt-2 font-primary text-2xl leading-8">{s.title}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#9A8864]"><Clock size={14} aria-hidden="true" /> {s.time}</p>
                    <p className="mt-2 text-[15px] font-light leading-6 text-charcoal/75">{s.text}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
            <RevealOnScroll delay={120}>
              <div className="h-full rounded-2xl bg-white p-6 md:p-8">
                <h3 className="font-primary text-xl leading-7">What you need for your safari</h3>
                <ul className="mt-4 space-y-3">
                  {REQUIREMENTS.map((r) => (
                    <li key={r} className="flex gap-3 text-[15px] leading-6 text-charcoal/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-earth-brown text-warm-beige"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 border-t border-[#CEC5B9]/50 pt-4 text-sm">
                  <span className="text-charcoal/60">Need help with the booking?</span>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-medium text-earth-brown underline-offset-4 hover:underline">Ask our safari desk →</a>
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Section>

        {/* BEST TIME */}
        <Section id="best-time">
          <Heading eyebrow="When to travel" title="Best time to visit Ratapani" lead="Core safari zones generally close for the monsoon and reopen in autumn. Check the current dates before you plan; we confirm them when you book." />
          <RevealOnScroll>
            <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
              {MONTHS.map(([m, s]) => (
                <li
                  key={m}
                  className={`rounded-xl border px-2 py-3 text-center transition duration-300 hover:-translate-y-0.5 ${
                    PEAK.has(s) ? "border-earth-brown bg-earth-brown text-cream" : CLOSED.has(s) ? "border-[#CEC5B9]/50 bg-[#F4EFE8] text-charcoal/55" : "border-[#CEC5B9] bg-cream text-charcoal"
                  }`}
                >
                  <span className="block font-primary text-lg leading-6">{m}</span>
                  <span className="block text-[11px] uppercase tracking-wider opacity-80">{s}</span>
                </li>
              ))}
            </ol>
          </RevealOnScroll>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {SEASONS.map((s, i) => (
              <RevealOnScroll key={s.title} delay={i * 80} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-[#CEC5B9]/50 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-[3px] text-[#9A8864]">{s.when}</p>
                  <h3 className="mt-1 font-primary text-xl leading-7">{s.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] font-light leading-6 text-charcoal/75">{s.text}</p>
                  <p className="mt-4 rounded-full bg-earth-brown/10 px-4 py-1.5 text-center text-xs font-medium text-earth-brown">{s.best}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* ACTIVITIES */}
        <Section id="activities" tone="cream">
          <Heading eyebrow="Curated adventures" title="Activities in and around Ratapani" center />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((a, i) => (
              <RevealOnScroll key={a.title} delay={(i % 3) * 80} className="h-full">
                <article className={`${CARD} relative flex h-full flex-col`}>
                  {a.img ? (
                    <Photo src={a.img} alt={a.alt} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px" ratio="aspect-[16/10]" />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-earth-brown to-[#9A8864] text-warm-beige">
                      <a.icon size={44} strokeWidth={1.25} aria-hidden="true" className="transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-primary text-xl leading-7">{a.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] font-light leading-6 text-charcoal/75">{a.text}</p>
                    <Link href={a.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-earth-brown after:absolute after:inset-0 after:content-['']">
                      {a.cta} <ArrowRight size={12} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* BHIMBETKA */}
        <section id="bhimbetka" aria-labelledby="bhimbetka-title" className="scroll-mt-28 bg-earth-brown py-12 text-cream md:py-16">
          <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-4 md:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <RevealOnScroll>
              <p className="text-xs font-bold uppercase tracking-[3px] text-warm-beige">UNESCO World Heritage</p>
              <h2 id="bhimbetka-title" className="mt-2 font-primary text-[28px] font-normal leading-9 md:text-4xl md:leading-[44px]">
                Ratapani and Bhimbetka: where wilderness meets deep human time
              </h2>
              <span className="mt-3 block h-[2px] w-14 bg-warm-beige" aria-hidden="true" />
              <ul className="mt-5 space-y-2 font-primary text-lg italic text-warm-beige">
                <li>Forest meets history.</li>
                <li>Wildlife meets archaeology.</li>
                <li>Teak forests meet ancient rock art.</li>
              </ul>
              <p className="mt-5 text-base font-light leading-7 text-cream/90">
                On the northern edge of Ratapani lie the Bhimbetka Rock Shelters, a UNESCO World Heritage Site. Over 750 shelters spread across about 10 kilometres hold paintings made over many thousands of years. Early hunter-gatherers drew the same animals you may meet on safari today, using natural ochre pigments.
              </p>
              <div className="mt-6"><Link href="/nearby-attractions" className={BTN_LIGHT}>Explore nearby attractions <ArrowRight size={16} aria-hidden="true" /></Link></div>
            </RevealOnScroll>
            <div className="grid gap-4">
              {BHIMBETKA.map(([t, d], i) => (
                <RevealOnScroll key={t} delay={i * 80}>
                  <article className="rounded-2xl border border-warm-beige/25 bg-cream/[0.07] p-5 transition duration-300 hover:bg-cream/[0.12]">
                    <h3 className="font-primary text-lg leading-7 text-warm-beige">{t}</h3>
                    <p className="mt-1 text-[15px] font-light leading-6 text-cream/85">{d}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* PACKING + RULES */}
        <Section id="packing">
          <Heading eyebrow="Preparation" title="Safari packing essentials" lead="The right kit keeps you comfortable and keeps you blended into the dry teak forest." />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <RevealOnScroll>
              <div className="h-full rounded-2xl border border-[#CEC5B9]/50 bg-cream p-6">
                <h3 className="font-primary text-xl leading-7">Recommended gear</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {PACKING.map(([k, v]) => (
                    <li key={k} className="flex gap-3 text-[15px] leading-6">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-earth-brown text-warm-beige"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>
                      <span><strong className="font-bold">{k}:</strong> <span className="font-light text-charcoal/75">{v}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="h-full rounded-2xl border border-[#CEC5B9]/50 bg-[#F4EFE8] p-6">
                <h3 className="font-primary text-xl leading-7">Colours and clothing</h3>
                <p className="mt-2 text-[15px] font-light leading-6 text-charcoal/75">Choose earth tones that blend with teak and dry leaf litter. Avoid bright white, neon and strong perfume. Breathable cotton and linen suit the climate.</p>
                <ul className="mt-4 flex gap-4">
                  {SWATCHES.map(([n, c]) => (
                    <li key={n} className="text-center text-xs text-charcoal/70">
                      <span className="mx-auto mb-1 block h-10 w-10 rounded-full border border-[#CEC5B9] shadow-inner" style={{ background: c }} />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>

          <div className="mt-10">
            <Heading eyebrow="Forest code" title="Responsible safari guidelines" lead="Forest department rules protect wildlife habits and core corridors. Please follow them on every drive." />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RULES.map(([t, d], i) => (
                <RevealOnScroll key={t} delay={(i % 4) * 60} as="li" className="h-full">
                  <div className="h-full rounded-2xl border border-[#CEC5B9]/50 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="font-primary text-3xl text-[#9A8864]/60">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-primary text-lg leading-6">{t}</h3>
                    <p className="mt-1 text-sm font-light leading-5 text-charcoal/70">{d}</p>
                  </div>
                </RevealOnScroll>
              ))}
              <li className="flex items-center rounded-2xl bg-earth-brown p-5 text-cream sm:col-span-2 lg:col-span-1">
                <p className="flex gap-3 font-primary text-lg italic leading-6"><ShieldCheck size={22} className="shrink-0 text-warm-beige" aria-hidden="true" /> Leave nothing behind but tyre tracks; take nothing but memories.</p>
              </li>
            </ul>
          </div>
        </Section>

        {/* CONSERVATION */}
        <Section id="conservation" tone="cream">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <RevealOnScroll>
              <div className="group overflow-hidden rounded-2xl"><Photo src={IMG.camping} alt="Camp at the edge of Ratapani Tiger Reserve under the forest canopy" sizes="(max-width: 1024px) 100vw, 580px" ratio="aspect-[4/3]" className="[&_img]:object-bottom" /></div>
            </RevealOnScroll>
            <div>
              <Heading eyebrow="Corridors and future" title="The 2024 tiger reserve mandate and ecological continuity" />
              <RevealOnScroll className="space-y-4 text-base font-light leading-7 text-charcoal/80">
                <p>Ratapani was long known as a tiger-rich sanctuary without formal tiger-reserve status. The 2024 notification safeguards about 1,271 square kilometres of forest and brings dedicated protection and funding.</p>
                <p>The forest also works as a green corridor linking Raisen, Sehore and neighbouring districts, helping tigers move between habitats. Low-impact tourism and trained local guides, many from nearby Gond communities, tie local livelihoods to the survival of the tiger.</p>
              </RevealOnScroll>
            </div>
          </div>
        </Section>

        {/* HOW TO REACH */}
        <Section id="how-to-reach">
          <Heading eyebrow="Directions and transit" title="How to reach Ratapani" lead="Ratapani is one of the easiest tiger reserves in Madhya Pradesh to reach." center />
          <div className="grid gap-6 md:grid-cols-3">
            {ROUTES.map(({ icon: Icon, title, place, text, note }, i) => (
              <RevealOnScroll key={title} delay={i * 80} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-[#CEC5B9]/50 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-earth-brown text-warm-beige"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
                  <h3 className="mt-4 font-primary text-2xl leading-8">{title}</h3>
                  <p className="text-sm font-medium text-earth-brown">{place}</p>
                  <p className="mt-2 flex-1 text-[15px] font-light leading-6 text-charcoal/75">{text}</p>
                  <p className="mt-4 border-t border-[#CEC5B9]/40 pt-3 text-sm text-charcoal/65">{note}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* STAY */}
        <Section id="stay" tone="sand">
          <Heading eyebrow="Wilderness sanctuary" title="Where to stay: Madhuban Eco Retreat" lead="An intimate, earth-conscious retreat on the edge of Ratapani’s teak forest, with direct help arranging safaris." />
          <RevealOnScroll>
            <div className="group grid overflow-hidden rounded-2xl border border-[#CEC5B9]/50 bg-white lg:grid-cols-2">
              <Photo src={IMG.lodge} alt="Madhuban Eco Retreat lodge glowing at dusk beside Ratapani Tiger Reserve" sizes="(max-width: 1024px) 100vw, 620px" ratio="aspect-[16/10] lg:aspect-auto lg:min-h-[340px]" />
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-xs font-bold uppercase tracking-[3px] text-earth-brown">Low-impact luxury</p>
                <h3 className="mt-2 font-primary text-2xl leading-8 md:text-3xl md:leading-10">Immersive forest living rooted in craft</h3>
                <p className="mt-3 text-base font-light leading-7 text-charcoal/80">
                  Built with local stone, salvaged wood and hand-plastered mud walls, Madhuban blends rustic architecture with quiet comfort. Wake to birdsong, dine under the stars and set out on safari from the forest’s edge.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/stay-in-ratapani-tiger-reserve" className={BTN_PRIMARY}>Explore stay options</Link>
                  <Link href="/booking" className={BTN_OUTLINE}>Check availability</Link>
                </div>
              </div>
            </div>
          </RevealOnScroll>
          <h3 className="mb-4 mt-8 font-primary text-xl leading-7">Signature accommodations</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STAYS.map((s, i) => (
              <RevealOnScroll key={s.name} delay={(i % 5) * 60} className="h-full">
                <article className={`${CARD} relative flex h-full flex-col`}>
                  <Photo src={s.img} alt={`${s.name} at Madhuban Eco Retreat near Ratapani Tiger Reserve`} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 230px" />
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="font-primary text-lg leading-6">{s.name}</h4>
                    <p className="mt-1 flex-1 text-sm font-light leading-5 text-charcoal/70">{s.text}</p>
                    <Link href={s.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-earth-brown after:absolute after:inset-0 after:content-['']">
                      View stay <ArrowRight size={12} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* ITINERARIES */}
        <Section id="itineraries">
          <Heading eyebrow="Curated journeys" title="Suggested itineraries" lead="Two ready-made ways to combine safaris, heritage and a forest stay." center />
          <ItineraryTabs tabs={ITINERARIES} />
        </Section>

        {/* FAQ */}
        <Section id="faq" tone="cream">
          <div className="mx-auto max-w-[820px]">
            <Heading eyebrow="Inquiries and answers" title="Frequently asked questions" lead="Permits, seasons, logistics and tiger sightings in Ratapani." center />
            <div className="flex flex-col gap-3">
              {FAQS.map(([q, a], i) => (
                <details key={q} className="group overflow-hidden rounded-xl border border-[#CEC5B9]/60 bg-white/70 open:bg-white open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-primary text-lg leading-7 marker:hidden md:text-xl [&::-webkit-details-marker]:hidden">
                    <span>{i + 1}. {q}</span>
                    <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-earth-brown transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-[15px] font-light leading-6 text-charcoal/80">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {/* FINAL CTA */}
      <section aria-labelledby="final-cta" className="relative isolate overflow-hidden bg-[#3A3123] py-14 text-center text-cream md:py-20">
        <Image src={IMG.aerial} alt="" fill quality={85} sizes="100vw" className="-z-10 object-cover opacity-35" />
        <RevealOnScroll className="mx-auto max-w-[760px] px-4">
          <p className="text-xs font-bold uppercase tracking-[3px] text-warm-beige">Madhya Pradesh’s wildest horizon</p>
          <h2 id="final-cta" className="mt-2 font-primary text-[32px] font-normal leading-10 md:text-5xl md:leading-[56px]">Plan your Ratapani tiger safari</h2>
          <p className="mt-3 text-lg font-light text-cream/90">The forest is waiting.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/booking" className={BTN_LIGHT}>Book your stay</Link>
            <Link href="/stay-in-ratapani-tiger-reserve" className={BTN_GHOST_LIGHT}>Explore stay options</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={BTN_GHOST_LIGHT}><MessageCircle size={16} aria-hidden="true" /> Talk to our safari desk</a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-cream/75"><Compass size={14} aria-hidden="true" /> Madhuban Eco Retreat · Edge of Ratapani Tiger Reserve · Madhya Pradesh</p>
        </RevealOnScroll>
      </section>
    </div>
  );
}

export { SCHEMAS };
