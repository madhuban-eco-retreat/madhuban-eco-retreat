import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hourglass, MapPinned, MessageCircle, TreePine } from "lucide-react";
import RevealOnScroll from "@/components/landing/RevealOnScroll";

/**
 * The redesigned Experiences page, built from the Figma design (1440px frame).
 *
 * Every size, gap and colour below is read from the design's own CSS:
 *   - content column 1120px: two 540px cards, then three 347px cards, 40px apart
 *   - cards: 16px radius, 1px border at 50%, photo 538x336 (large) / 4:3 (small),
 *     32px inner padding, "Ideal for" rule at 30%
 *   - hero 700px tall on #1B1B17, "Why different" strip on #F6F3EE (96px padding),
 *     closing call-to-action on #FCF9F4
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

// The design's hero is a plain dark block. Set this to a photo URL and the hero
// gets the picture with a gradient so the text stays readable.
const HERO_IMAGE = null;

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
          {HERO_IMAGE && (
            <>
              <Image src={HERO_IMAGE} alt="" fill priority quality={90} sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B17] via-[#1B1B17]/55 to-[#1B1B17]/25" />
            </>
          )}
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

        {/* CLOSING CALL TO ACTION */}
        <section className="bg-[#FCF9F4] px-6 py-16 md:py-24">
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
