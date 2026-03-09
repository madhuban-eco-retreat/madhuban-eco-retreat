"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookingWidget from "../BookingWidget";
import { getAltFromUrl } from "@/utills/helperFunctions";

const heroSlides = [
  {
    image:
      "/images/home/banner/desktop/madhuban-eco-retreat-forest-view-hero-section-1.avif",
    mobile:
      "/images/home/banner/mobile/madhuban-eco-retreat-forest-view-hero-section.avif",
    title: "Madhuban Eco Retreat: Eco-Luxury Forest Resort",
    subtitle:
      "Experience eco-luxury living amid the serene wilderness of Ratapani Tiger Reserve at Madhuban Eco Retreat — a peaceful forest stay offering sustainable comfort and mindful escapes.",
  },
  {
    image:
      "/images/home/banner/desktop/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",
    mobile:
      "/images/home/banner/mobile/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",
    title: "Sustainable Travel in India: An Eco-Luxury Retreat",
    subtitle:
      "Reconnect with nature through immersive experiences like birdwatching in Madhya Pradesh, all without compromising on comfort.",
  },
  {
    image: "/images/home/banner/desktop/hero-tiger-madhuban-eco-retreat.webp",
    mobile:
      "/images/home/banner/mobile/mobile-hero-tiger-madhuban-eco-retreat-ratapani-bhopal.avif",
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

  const slide = heroSlides[currentSlide];

  return (
    <>
      <section className="relative min-h-screen overflow-hidden m-0 p-0 lg:min-h-[50vh] md:-mt-[166px] sm:-mt-[116px] max640:-mt-[116px]">
        {/* SINGLE ACTIVE SLIDE ONLY */}
        <div className="absolute inset-0 transition-opacity duration-1000">
          {/* Desktop */}
          <div className="hidden md:block relative w-full min-h-screen">
            <Image
              src={slide.image}
              alt={getAltFromUrl(slide.image)}
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/* Mobile */}
          <div className="block md:hidden relative w-full min-h-screen">
            <Image
              src={slide.mobile}
              alt={getAltFromUrl(slide.image)}
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="font-primary bannerHeading mb-4 max-w-3xl">
            {slide.title}
          </h1>

          <p className="font-arial-narrow bannerSubHeading mb-8 max-w-3xl">
            {slide.subtitle}
          </p>
        </div>
      </section>

      <div className="w-full">
        <BookingWidget />
      </div>
    </>
  );
}
