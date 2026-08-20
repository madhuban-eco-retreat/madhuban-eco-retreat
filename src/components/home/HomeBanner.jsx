"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookingWidget from "../BookingWidget";
import { getAltFromUrl } from "@/utills/helperFunctions";

const heroSlides = [
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-forest-view-hero-section-1.avif",

    mobile:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/mobile/madhuban-eco-retreat-forest-view-hero-section.avif",

    title: "Madhuban Eco Retreat: Eco-Luxury Forest Resort",

    subtitle:
      "Experience eco-luxury living amid the serene wilderness of Ratapani Tiger Reserve at Madhuban Eco Retreat — a peaceful forest stay offering sustainable comfort and mindful escapes.",
  },

  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",

    mobile:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/mobile/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",

    title: "Sustainable Travel in India: An Eco-Luxury Retreat",

    subtitle:
      "Reconnect with nature through immersive experiences like birdwatching in Madhya Pradesh, all without compromising on comfort.",
  },

  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/hero-tiger-madhuban-eco-retreat.webp",

    mobile:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/mobile/mobile-hero-tiger-madhuban-eco-retreat-ratapani-bhopal.avif",

    title: "Connect With Wildlife & Nature",

    subtitle:
      "Located next to the Ratapani Wildlife Sanctuary, Madhuban is ideal for serene forest walks and birdwatching adventures.",
  },
];

export default function HomeBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-gray-900">
        {/* Crossfade. This wrapper holds the slide IMAGE, so the active slide
            must stay at opacity-100 -- dimming it here would dim the photo.
            The dark scrim for text contrast is the separate div below. */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Desktop Image */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slide.image}
                alt={getAltFromUrl(slide.image)}
                fill
                priority={index === 0} // Only priority for the first slide
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                sizes="100vw"
                className="object-cover"
                quality={90}
              />
            </div>

            {/* Mobile Image */}
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={slide.mobile}
                alt={getAltFromUrl(slide.image)}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                sizes="100vw"
                className="object-cover"
                quality={90}
              />
            </div>

            {/* Text-contrast scrim only. Kept at 30% so the photography reads
                clearly; the headline carries its own drop shadow for legibility. */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        {/* Content - Static position so text doesn't flicker during slide change */}
        <div className="relative z-20 min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="font-primary bannerHeading mb-4 max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="font-arial-narrow bannerSubHeading mb-8 max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {heroSlides[currentSlide].subtitle}
          </p>
        </div>
      </section>

      <div className="w-full relative z-30">
        <BookingWidget />
      </div>
    </>
  );
}
