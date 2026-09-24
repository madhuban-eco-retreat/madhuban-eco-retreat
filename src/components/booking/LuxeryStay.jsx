import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookingBanner } from "./BookingBanner";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

// The 5 real, bookable accommodation types — same slugs as
// /stay-in-ratapani-tiger-reserve/[slug], and the same card images used on
// the homepage's own accommodation cards, so a visitor sees the same photo
// whether they land here first or on the homepage first.
//
// The previous version of this list had 8 entries, three of which ("Jungle
// Lodge", "Eco Luxury Room", "Group Stays") don't correspond to any real
// bookable room type or page — there was nowhere for them to actually link
// to. Replaced with the 5 real accommodation types instead, each linking to
// its real detail page.
const STAYS_DATA = [
  {
    title: "Safari Tent",
    subtitle: "Ratapani Resort Safari Stay",
    slug: "safari-tent",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-eco-retreat-safari-tent-exterior-image-home-page-card.jpg",
  },
  {
    title: "Mud House",
    subtitle: "Traditional Jungle Resort Mud House",
    slug: "mud-house-standard",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-eco-retreat-mud-house-exterior-image-home-page-card.jpg",
  },
  {
    title: "Pool Side Villa",
    subtitle: "Resort with Swimming Pool Villa",
    slug: "pool-side-villa",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/poolside-villa-madhuban-eco-retreat-home-page-card.jpg",
  },
  {
    title: "Glamping Tent",
    subtitle: "Luxury Jungle Camp Glamping",
    slug: "glamping-tents",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-eco-retreat-glamping-tent-exterior-image-home-page-card.jpg",
  },
  {
    title: "Camping Tent",
    subtitle: "Nature Forest Resort Camping",
    slug: "camping-tent",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-camping-hammock-under-100kb.jpg",
  },
];

// Memoized so the 5 cards don't re-render on every parent state change.
const StayCard = React.memo(({ title, subtitle, imageUrl, slug, className = "" }) => (
  <Link
    href={`/stay-in-ratapani-tiger-reserve/${slug}`}
    aria-label={`View details for ${title}`}
    className={`group relative block overflow-hidden rounded-3xl aspect-[3/4] md:aspect-auto md:h-[400px] ${className}`}
  >
    <Image quality={90}
      fill
      src={imageUrl}
      alt={title}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <h3 className="text-xl text-white primary-font-family mb-1">{title}</h3>
      <p className="text-warm-beige text-sm font-medium">{subtitle}</p>
    </div>
  </Link>
));

StayCard.displayName = "StayCard";

const LuxeryStay = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 pb-12">
      <section className="mt-12 mb-6 md:mb-8">
        <DecorativeHeading
          as="p"
          text="Luxury Stays"
          subheading="Experience the Eco-friendly Accommodations at Madhuban Eco Retreat"
          subheadingAs="h2"
        />
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6 md:mb-8">
        {STAYS_DATA.map((stay) => (
          <StayCard key={stay.slug} {...stay} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
        <p className="text-charcoal/80 leading-relaxed">
          Looking for a resort in Ratapani that puts you inside the forest
          rather than just near it? Every stay here sits on the edge of
          Ratapani Tiger Reserve, about an hour from Bhopal — a resort in
          Ratapani built around dry deciduous teak forest, sandstone ridges
          and the wildlife that moves through them. From safari tents and
          traditional mud houses to a private pool villa, each accommodation
          is designed to keep you close to the reserve without giving up
          comfort. Whatever you're looking for in a resort near Ratapani —
          quiet mornings, a jungle safari, or a weekend away from the city —
          book directly above and we'll take care of the rest.
        </p>
      </div>

      <BookingBanner />
    </main>
  );
};

export default LuxeryStay;
