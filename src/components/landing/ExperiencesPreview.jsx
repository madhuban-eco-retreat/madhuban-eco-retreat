import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Hourglass, MapPinned, MessageCircle, TreePine } from "lucide-react";
import ExperiencesHeroSlider from "@/components/landing/ExperiencesHeroSlider";
import RevealOnScroll from "@/components/landing/RevealOnScroll";

/**
 * The redesigned Experiences page, built from the Figma design (1440px frame).
 *
 * Every size, gap and colour below is read from the design's own CSS:
 *   - content column 1120px: two 540px cards, then three 347px cards, 40px apart
 *   - cards: 16px radius, 1px border at 50%, photo 538x336 (large) / 4:3 (small),
 *     32px inner padding, "Ideal for" rule at 30%
 *   - hero 700px tall on #1B1B17 with a 3-photo slideshow, dark "By the Numbers" strip,
 *     "A Day at Madhuban" (4 moments), "Why different" strip on #F6F3EE, guest reviews,
 *     FAQ on #FAF7F2 and a white closing call-to-action
 * The header, ratings bar, footer, cookie banner and floating contact buttons come
 * from the (marketing) layout, so this component is only the page body.
 *
 * It is served at /experiences/testing (noindex, nofollow) until the client signs
 * off. To make it the live page, render <ExperiencesPage /> from
 * src/app/(marketing)/experiences/page.jsx and give that route real SEO metadata.
 *
 * Deliberate departures from the Figma file, so nothing is a surprise:
 *   - Body text is the site's Lato and headings are the site's heading font
 *     (the design mixes Arial Narrow and Plus Jakarta Sans).
 *   - Buttons use the live site's earth-brown pill, not the design's #9A8864.
 *   - The Camping and Village Walk tags exist in the design but sit underneath
 *     their photos in Figma (a layer-order slip); they are shown here.
 *   - Cards in a row are equal height and the stray hyphen in the headline is
 *     fixed.
 *   - The design's own header and footer are not drawn; the site's real ones are used.
 */

const PHOTOS = "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/New%20Experiences%20page/";
const WHATSAPP_URL = "https://wa.me/919770558419";

// Hero slideshow, in the order they appear.
const HERO_IMAGES = [
  { src: `${PHOTOS}Hero%20imgs/experiences%20page%20hero%20img%201.png` },
  { src: `${PHOTOS}Hero%20imgs/hero%20img%202.png` },
  { src: `${PHOTOS}Hero%20imgs/hero%20img%203.png` },
];

const DAY_PHOTOS = `${PHOTOS}a%20day%20at%20madhuban/`;

const STATS = [
  { value: "150", suffix: "+", label: "Bird species recorded across Ratapani" },
  { value: "1", suffix: "hr", label: "From Bhopal" },
  { value: "5", label: "Ways to experience the reserve" },
  { value: "1", label: "Tiger reserve at the doorstep" },
];

const DAY_MOMENTS = [
  {
    time: "06:00 AM",
    title: "Sunrise Safari",
    text: "First light over the sal forest, and the best chance of spotting movement before the heat sets in.",
    photo: `${DAY_PHOTOS}experiences%20page%20safari%20section%20img.png`,
    alt: "Sunrise jungle safari in Ratapani Tiger Reserve",
  },
  {
    time: "10:30 AM",
    title: "Midday Forest Walk",
    text: "Slower, quieter, closer to the ground — the details you miss from a vehicle.",
    photo: `${DAY_PHOTOS}experiences%20page%20mid%20day%20forest%20walk%20section%20img.png`,
    alt: "Guided midday forest walk near Madhuban Eco Retreat",
  },
  {
    time: "03:30 PM",
    title: "Afternoon in the Village",
    text: "Tea with a Gond family, and a look at architecture that’s shaped this land for generations.",
    photo: `${DAY_PHOTOS}experience%20page%20village%20walk%20img.png`,
    alt: "Afternoon village walk through a Gond village near Ratapani",
  },
  {
    time: "07:30 PM",
    title: "Bush Dinner at Dusk",
    text: "Firelight, forest sounds, dinner under a sky with no city glow to compete with.",
    photo: `${DAY_PHOTOS}experiences%20page%20bush%20dining%20section%20img.png`,
    alt: "Bush dinner by firelight at dusk, Madhuban Eco Retreat",
  },
];

const REVIEWS = [
  {
    quote:
      "One of the best experiences I've had near Bhopal. The stay, the food, pottery, yoga, the healing power of nature — everything was top notch. So therapeutic. Going back relaxed and grateful.",
    name: "Shristi Pandey",
    note: "Local Guide",
  },
  {
    quote:
      "Truly enriching — scenic surroundings, comfortable stay, nature walks, birding, delicious food. The respect for tribal communities of Madhya Pradesh is beautifully reflected in the architecture and cuisine.",
    name: "Amit Jethwa",
    note: "Local Guide",
  },
  {
    quote:
      "Stayed overnight and had a truly amazing experience. Meditation, yoga, swimming, food — everything was perfect. Staff was outstanding. Highly recommended for family stay and a peaceful getaway.",
    name: "Anshul Agrawal",
    note: "Bhopal",
  },
];

// The design only shows the questions (all collapsed). The answers are written to
// match the rest of the page; please check them before this goes live.
const FAQS = [
  {
    q: "How far is Madhuban from Bhopal?",
    a: "Madhuban Eco Retreat is about an hour’s drive from Bhopal, on the edge of Ratapani Tiger Reserve. Every experience starts from the resort itself, so there is no long transfer on the day.",
  },
  {
    q: "Can I do more than one experience during my stay?",
    a: "Yes. Many guests pair a sunrise safari or forest walk with a village walk or a bush dinner in the evening. Tell us what you’d like when you book and we’ll plan the days around it.",
  },
  {
    q: "Do I need to be an experienced hiker to join a hiking trail?",
    a: "No. The trails are guided and paced to the group, from an easy morning walk to a longer trek with valley views. Your guide will suggest the right route once they know who’s walking.",
  },
  {
    q: "Is the safari inside the actual tiger reserve?",
    a: "Yes. The jungle safari goes into Ratapani Tiger Reserve with a naturalist guide. Entry timings and zones follow the forest department’s rules, and we’ll confirm what’s available for your dates.",
  },
  {
    q: "Are these experiences suitable for children?",
    a: "Most are, especially the safari, the village walk and the bush dinner. Hikes and camping depend on your children’s age and stamina, so let us know how old they are and we’ll suggest what fits.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// Where each card's "Learn More" goes. The five dedicated experience pages do not
// exist yet, so these point at the closest live pages. Change them here once the
// real pages ship.
const ROUTES = {
  safari: "/nearby-attractions",
  hiking: "/experiences/forest-walks-and-nature-trails",
  camping: "/stay-in-ratapani-tiger-reserve/camping-tent",
  dinner: "/dining",
  village: "/nearby-attractions",
};

const LARGE_CARDS = [
  {
    key: "jungle-safari",
    tag: "Wildlife",
    title: "Jungle Safari",
    photo: `${PHOTOS}jungle%20safari%20ratapani%20tiger%20reserve.jpg`,
    alt: "Jungle safari in Ratapani Tiger Reserve near Bhopal",
    description:
      "Ride into Ratapani Tiger Reserve with a naturalist guide, tracking pugmarks, spotting deer, sloth bears and over 150 recorded bird species across the reserve’s teak and sal forest. A jungle safari near Bhopal that puts you inside the wilderness, not just looking at it.",
    idealFor: "Wildlife enthusiasts, photographers, families",
    href: ROUTES.safari,
  },
  {
    key: "forest-hiking-trails",
    tag: "Adventure",
    title: "Forest Hiking Trails",
    photo: `${PHOTOS}forest%20hiking%20trails.jpg`,
    alt: "Guided forest hiking trail in Ratapani near Bhopal",
    description:
      "Guided hikes across Ratapani’s forest trails and sandstone ridgelines, at a pace suited to you — from an easy morning walk to a longer trek with sweeping valley views. One of the more rewarding ways to experience Ratapani Tiger Reserve on foot, near Bhopal.",
    idealFor: "Trekkers, fitness travelers, nature photographers",
    href: ROUTES.hiking,
  },
];

const SMALL_CARDS = [
  {
    key: "jungle-camping",
    tag: "Adventure",
    title: "Jungle Camping",
    photo: `${PHOTOS}jungle%20camping%20ratapani%20tiger%20reserve%20madhuban.jpg`,
    alt: "Jungle camping at the edge of Ratapani Tiger Reserve, Madhuban Eco Retreat",
    description:
      "Spend a night under canvas at the edge of the reserve — campfire, star-filled skies, and the forest’s own night sounds instead of traffic. A camping experience near Bhopal built for groups, couples or anyone who wants to properly disconnect for a night.",
    idealFor: "Adventure groups, couples, corporate team outings",
    href: ROUTES.camping,
  },
  {
    key: "bush-dinner",
    tag: "Dining",
    title: "Bush Dinner Under the Stars",
    photo: `${PHOTOS}bush%20dinning%20madhuban%20eco%20retreat.jpg`,
    alt: "Private bush dinner in a forest clearing at Madhuban Eco Retreat",
    description:
      "A private open-air dinner set up in a forest clearing — firelight, a clear night sky, and a menu drawing on local, regional flavors. One of the more memorable ways to mark an occasion at a resort near Bhopal, away from anything resembling a banquet hall.",
    idealFor: "Couples, anniversaries, special occasions",
    href: ROUTES.dinner,
  },
  {
    key: "heritage-village-walk",
    tag: "Culture",
    title: "Cultural & Heritage Village Walk",
    photo: `${PHOTOS}heritage%20walk.jpg`,
    alt: "Cultural and heritage village walk near Ratapani Tiger Reserve",
    description:
      "Walk through the Gond villages bordering Ratapani with a local guide, learning about tribal architecture, traditional crafts and forest-based livelihoods that have shaped this landscape for generations. A genuine cultural experience near Bhopal, not a staged one.",
    idealFor: "Culture and history enthusiasts, families, curious travelers",
    href: ROUTES.village,
  },
];

const PILLARS = [
  {
    icon: MapPinned,
    title: "Led by people who live here",
    text: "Every guide is local to Ratapani, not flown in for the season.",
  },
  {
    icon: Hourglass,
    title: "Small groups, real pace",
    text: "No herding between checkpoints; each experience is shaped around the people on it.",
  },
  {
    icon: TreePine,
    title: "Inside the forest’s edge",
    text: "Every experience starts from the resort itself, not a 90-minute transfer to a “wildlife zone.”",
  },
];

// The live site's button styles (see the Header's "Book Now").
const BTN_PRIMARY =
  "inline-flex items-center justify-center rounded-full bg-earth-brown px-7 py-3 font-primary text-base font-medium text-warm-beige shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[rgb(132,116,85)]";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-2 rounded-full border border-earth-brown px-7 py-3 font-primary text-base font-medium text-earth-brown transition-colors hover:bg-earth-brown/10";

function ExperienceCard({ item, large, index }) {
  return (
    <RevealOnScroll delay={index * 80} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#CEC5B9]/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className={`relative w-full overflow-hidden bg-[#F0EDE9] ${large ? "aspect-[538/336]" : "aspect-[4/3]"}`}>
          <Image
            src={item.photo}
            alt={item.alt}
            fill
            quality={90}
            sizes={
              large
                ? "(max-width: 768px) 100vw, 540px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 347px"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 z-10 rounded border border-[#CEC5B9]/60 bg-white/90 px-3 py-1 text-xs font-medium leading-4 tracking-[0.025em] text-[#6C5C3C] backdrop-blur-[2px]">
            {item.tag}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between p-8">
          <div>
            <h3
              className={`font-primary font-normal text-[#1C1C19] ${
                large ? "text-[32px] leading-10" : "text-2xl leading-8"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-[7px] font-light text-[#4B463D] ${
                large ? "text-[15px] leading-6 tracking-[0.005em]" : "text-[13px] leading-[21px] tracking-[0.01em]"
              }`}
            >
              {item.description}
            </p>
          </div>

          <div className="pt-4">
            {/* Same block height on every card in a row (49px large, 73px small, as in the
                design), so the divider lines up even when one card's text wraps more. */}
            <div
              className={`flex items-center justify-between gap-4 border-t border-[#CEC5B9]/30 pt-2 ${
                large ? "min-h-[49px]" : "min-h-[92px]"
              }`}
            >
              <div>
                <p className="text-[11px] uppercase leading-4 tracking-[0.05em] text-[#7D766B]">Ideal for</p>
                <p className="mt-[3px] text-[13px] leading-5 tracking-[0.01em] text-[#4B463D]">{item.idealFor}</p>
              </div>
              {/* One link per card; the pseudo-element stretches it over the whole
                  card so the entire tile is clickable. */}
              <Link
                href={item.href}
                aria-label={`Learn more about ${item.title}`}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium tracking-[0.02em] text-[#554930] after:absolute after:inset-0 after:content-['']"
              >
                Learn More
                <ArrowRight
                  size={11}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}

export default function ExperiencesPreview() {
  return (
    <div className="bg-white font-body text-[#4B463D] antialiased">
      <main>
        {/* HERO — 700px, left-aligned, text sits on the bottom edge */}
        <section className="relative isolate overflow-hidden bg-[#1B1B17]">
          <ExperiencesHeroSlider images={HERO_IMAGES} />
          <div className="relative mx-auto flex min-h-[520px] max-w-[1440px] flex-col justify-end px-6 pb-14 md:min-h-[700px] md:px-[60px] md:pb-[97px]">
            <p className="flex items-center gap-2 pl-[15px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F6E0B7]" aria-hidden="true" />
              <span className="text-xs leading-4 tracking-[0.02em] text-[#F6E0B7]">Ratapani Tiger Reserve</span>
            </p>
            <h1 className="mt-[23px] max-w-[768px] font-primary text-[36px] font-normal leading-[44px] tracking-[-0.02em] text-[#FCF9F4] md:text-[48px] md:leading-[58px] lg:text-[56px] lg:leading-[68px]">
              Experiences at Madhuban — Ratapani Tiger Reserve, Near Bhopal
            </h1>
            <p className="mt-4 text-lg leading-[30px] tracking-[0.02em] text-[#FCF9F4]/80">
              Five ways to step into the forest, just an hour from Bhopal.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="px-6 pb-[70px] pt-[60px]">
          <RevealOnScroll>
            <p className="mx-auto max-w-[768px] text-center text-lg leading-[29px] tracking-[0.02em] text-[#4B463D]">
              Madhuban Eco Retreat sits on the edge of Ratapani Tiger Reserve, where dry deciduous teak forest,
              sandstone ridges and centuries-old tribal villages meet. Whether you have an afternoon or a full
              weekend, there’s a way to experience it that matches your pace — from a guided jungle safari to a quiet
              hike, an overnight camp under canvas, a bush dinner by firelight, or an afternoon walking through a Gond
              village. Each experience near Bhopal is led by people who live and work on this forest’s edge.
            </p>
          </RevealOnScroll>
        </section>

        {/* EXPERIENCE CARDS — 2 large, then 3 small */}
        <section aria-labelledby="experiences-heading" className="px-6 pb-[60px] xl:px-0">
          <h2 id="experiences-heading" className="sr-only">
            Experiences at Madhuban Eco Retreat
          </h2>
          <div className="mx-auto max-w-[1120px]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {LARGE_CARDS.map((item, i) => (
                <ExperienceCard key={item.key} item={item} large index={i} />
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {SMALL_CARDS.map((item, i) => (
                <ExperienceCard key={item.key} item={item} large={false} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* BY THE NUMBERS — dark full-bleed strip */}
        <section aria-labelledby="by-the-numbers" className="border-y border-[#292524] bg-[#2A2A2A] py-16 md:py-[97px]">
          <div className="mx-auto max-w-[1380px] px-6 md:px-16">
            <RevealOnScroll className="mx-auto max-w-[640px] text-center">
              <p className="text-xs font-bold uppercase leading-4 tracking-[3px] text-[#C9A84C]">By the Numbers</p>
              <h2
                id="by-the-numbers"
                className="mt-3 font-primary text-2xl font-normal leading-8 text-white md:text-[30px] md:leading-9"
              >
                An Untamed Sanctuary in Central India
              </h2>
            </RevealOnScroll>

            <dl className="mt-12 grid grid-cols-2 gap-4 md:mt-16 lg:grid-cols-4 lg:gap-12">
              {STATS.map((s, i) => (
                <RevealOnScroll key={s.label} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-6 text-center md:p-[25px] md:pb-[44px]">
                    <dt className="order-2 max-w-[200px] text-sm font-light leading-5 text-white/80">{s.label}</dt>
                    <dd className="order-1 flex items-end justify-center font-primary leading-[60px] text-[#C9A84C]">
                      <span className="text-[56px] md:text-[72px]">{s.value}</span>
                      {s.suffix && (
                        <span className={`pb-1 ${s.suffix === "hr" ? "pl-1 text-[28px] font-light md:text-[30px]" : "text-[30px] md:text-4xl"}`}>
                          {s.suffix}
                        </span>
                      )}
                    </dd>
                  </div>
                </RevealOnScroll>
              ))}
            </dl>
          </div>
        </section>

        {/* A DAY AT MADHUBAN — four moments from dawn to dusk */}
        <section aria-labelledby="a-day" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[1380px] px-6 md:px-16">
            <RevealOnScroll className="max-w-[672px]">
              <p className="text-xs font-bold uppercase leading-4 tracking-[3px] text-earth-brown">
                Rhythm of the Wilderness
              </p>
              <h2
                id="a-day"
                className="mt-2 font-primary text-[28px] font-normal leading-9 text-[#1C1C19] md:text-4xl md:leading-10"
              >
                A Day at Madhuban
              </h2>
              <p className="mt-3 text-base font-light leading-6 text-[#4B463D]">
                The passage of light and stillness, from pre-dawn mist to ember-lit clear skies.
              </p>
            </RevealOnScroll>

            <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-6">
              {DAY_MOMENTS.map((m, i) => (
                <li key={m.title}>
                  <RevealOnScroll delay={i * 80}>
                    <figure>
                      <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-[#EDE6DC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <Image
                          src={m.photo}
                          alt={m.alt}
                          fill
                          quality={90}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 295px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 rounded bg-black/40 px-3 py-1 text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] text-white backdrop-blur-[6px]">
                          {m.time}
                        </span>
                      </div>
                      <figcaption className="px-1 pt-4">
                        <h3 className="font-primary text-xl font-normal leading-7 text-[#1C1C19]">{m.title}</h3>
                        <p className="mt-1 text-sm font-light leading-[22.75px] text-[#4B463D]">{m.text}</p>
                      </figcaption>
                    </figure>
                  </RevealOnScroll>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* WHY AN EXPERIENCE AT MADHUBAN IS DIFFERENT */}
        <section aria-labelledby="why-different" className="bg-[#F6F3EE] py-16 md:py-24">
          {/* 1200px of content (1248 less the 24px side padding), the design's width;
              the three columns sit 40px inside it, so each is 346.66px wide. */}
          <div className="mx-auto max-w-[1248px] px-6">
            <RevealOnScroll className="max-w-[672px]">
              <p className="text-xs uppercase leading-4 tracking-[0.02em] text-[#7D766B]">Philosophy &amp; Cadence</p>
              <h2
                id="why-different"
                className="mt-2 font-primary text-[28px] font-normal leading-9 text-[#1C1C19] md:text-[32px] md:leading-10"
              >
                Why an experience at Madhuban is different
              </h2>
            </RevealOnScroll>

            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:px-10">
              {PILLARS.map(({ icon: Icon, title, text }, i) => (
                <RevealOnScroll key={title} delay={i * 80}>
                  <div className="h-full border-l border-[#CEC5B9]/60 pl-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCF9F4] text-earth-brown">
                      <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="pt-3 font-primary text-xl font-normal leading-7 text-[#1C1C19]">{title}</h3>
                    <p className="pt-[7px] text-[15px] leading-6 tracking-[0.02em] text-[#4B463D]">{text}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT GUESTS SAY */}
        <section aria-labelledby="guest-voices" className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1380px] px-6 md:px-16">
            <RevealOnScroll className="mx-auto max-w-[672px] text-center">
              <p className="text-xs font-bold uppercase leading-4 tracking-[3px] text-earth-brown">Guest Voices</p>
              <h2
                id="guest-voices"
                className="mt-3 font-primary text-[28px] font-normal leading-9 text-[#1C1C19] md:text-4xl md:leading-10"
              >
                What Guests Say
              </h2>
            </RevealOnScroll>

            <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-10">
              {REVIEWS.map((r, i) => (
                <RevealOnScroll key={r.name} delay={i * 80} className="h-full">
                  <figure className="relative flex h-full flex-col justify-between rounded-2xl border border-[#CEC5B9]/40 bg-[#F4EFE8]/60 p-8 md:p-[41px]">
                    <span
                      aria-hidden="true"
                      className="absolute right-[23px] top-4 font-serif text-[60px] leading-[60px] text-earth-brown/20"
                    >
                      “
                    </span>
                    <blockquote className="pb-6 font-primary text-lg italic leading-7 text-[#1C1C19]">
                      <p>“{r.quote}”</p>
                    </blockquote>
                    <figcaption className="mt-7 border-t border-[#CEC5B9]/30 pt-[17px]">
                      <p className="text-sm leading-5 text-[#1C1C19]">{r.name}</p>
                      <p className="text-xs font-light leading-4 text-[#7D766B]">{r.note}</p>
                    </figcaption>
                  </figure>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — native <details>, so it works without JavaScript and every answer
            is in the page for search engines. */}
        <section aria-labelledby="faq" className="border-t border-[#CEC5B9]/30 bg-[#FAF7F2] px-6 py-16 md:py-[112px]">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
          <div className="mx-auto max-w-[672px]">
            <RevealOnScroll className="text-center">
              <p className="text-xs font-bold uppercase leading-4 tracking-[3px] text-earth-brown">Planning Ahead</p>
              <h2
                id="faq"
                className="mt-3 font-primary text-[28px] font-normal leading-9 text-[#1C1C19] md:text-4xl md:leading-10"
              >
                Frequently Asked Questions
              </h2>
            </RevealOnScroll>

            <div className="mt-12 flex flex-col gap-4 md:mt-14">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group overflow-hidden rounded-xl border border-[#CEC5B9]/50 bg-white/50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-primary text-lg font-normal leading-7 text-[#1C1C19] marker:hidden md:p-6 md:text-xl [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-earth-brown transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="px-5 pb-6 text-[15px] font-light leading-6 tracking-[0.01em] text-[#4B463D] md:px-6">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CALL TO ACTION */}
        <section className="bg-white px-6 py-16 md:py-24">
          <RevealOnScroll className="mx-auto flex max-w-[672px] flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-primary text-[32px] font-normal leading-10 tracking-[-0.01em] text-[#1C1C19] md:text-[40px] md:leading-[50px]">
                Ready to plan your stay?
              </h2>
              <p className="max-w-[512px] text-lg leading-[29px] tracking-[0.02em] text-[#4B463D]">
                Every experience above can be arranged as part of your stay at Madhuban Eco Retreat, on the edge of
                Ratapani Tiger Reserve.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Link href="/booking" className={BTN_PRIMARY}>
                Book Your Stay
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={BTN_OUTLINE}>
                <MessageCircle size={15} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>
          </RevealOnScroll>
        </section>
      </main>
    </div>
  );
}
