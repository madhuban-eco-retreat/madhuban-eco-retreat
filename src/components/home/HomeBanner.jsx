"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookingWidget from "../BookingWidget";

const heroSlides = [
  { image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-tiger-image(1).jpg", alt: "Tiger at Ratapani Tiger Reserve near Madhuban Eco Retreat Bhopal", position: "object-top" },
  { image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-aerial-view.jpg", alt: "Aerial view of Madhuban Eco Retreat near Ratapani Tiger Reserve Bhopal", position: "object-center" },
  { image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-jungle-safari(1).jpg", alt: "Jungle safari at Ratapani Tiger Reserve near Madhuban Eco Retreat", position: "object-center" },
  { image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-ratapani-forest-aerial-road.jpg", alt: "Ratapani forest aerial road view near Madhuban Eco Retreat Bhopal", position: "object-center" },
  { image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-common-iora-bird.jpg", alt: "Common Iora bird at Ratapani Wildlife Sanctuary near Madhuban Eco Retreat", position: "object-center" },
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
      <section className="relative h-[60vh] md:h-screen w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} sizes="(max-width: 768px) 100vw, 100vw" quality={95} className={`object-cover ${slide.position}`} />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-6" : "bg-white/50 w-2"}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="bg-[#F5F0E8] py-8 md:py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-primary text-2xl md:text-3xl lg:text-4xl font-bold text-[rgb(110,97,70)] mb-3 leading-tight">Eco Luxury Forest Stay - Ratapani Tiger Reserve</h1>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed max-w-3xl mx-auto">Madhuban Eco Retreat is a nature resort nestled in the heart of Ratapani Tiger Reserve, near Bhopal. Surrounded by ancient forests and wildlife, we offer an eco-luxury escape through safari tents, mud houses, glamping and poolside villas.</p>
        </div>
      </section>

      <div className="w-full relative z-30"><BookingWidget /></div>
    </>
  );
}
