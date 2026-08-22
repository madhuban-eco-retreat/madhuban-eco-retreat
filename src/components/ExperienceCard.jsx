// src/components/ExperienceCard.js
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getAltFromUrl } from "@/utills/helperFunctions";

/**
 * Resting state shows the image and the title only; the full copy slides up on
 * hover. Everything stays mounted and is moved with `transform` rather than
 * conditionally rendered, so the description and the link remain in the HTML
 * for crawlers. The panel also opens on `focus-within`, otherwise the link
 * inside it would be tabbable while sitting off-card and invisible.
 */
const ExperienceCard = ({ experience }) => {
  const { title, image, description, learnMoreBtn, path, idealFor } =
    experience;

  return (
    <div className="group relative w-full h-56 md:h-72 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Image - always visible */}
      <Image
        src={image}
        alt={getAltFromUrl(image)}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        quality={80}
      />

      {/* Resting state - title only. Fades out as the hover panel fades in,
          so the two never read on top of each other mid-transition. */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent">
        <div className="p-4 w-full transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2 group-focus-within:opacity-0 group-focus-within:translate-y-2">
          <h3 className="text-white font-primary text-base md:text-lg tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      {/* Hover panel - kept mounted and revealed with opacity + transform
          rather than conditional rendering, so the copy and the link stay in
          the HTML for crawlers. `pointer-events-none` while hidden keeps the
          invisible layer from swallowing clicks on the card beneath it. */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-300">
        <div className="p-4 w-full translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-primary text-sm md:text-base mb-1">
            {title}
          </h3>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
          {idealFor && (
            <p className="text-white/70 text-xs md:text-sm leading-relaxed mt-1 line-clamp-2">
              Ideal For : {idealFor}
            </p>
          )}
          <Link
            href={`/experiences/${path}`}
            className="inline-flex items-center text-white font-arial-narrow font-semibold tracking-wider text-xs md:text-sm mt-2"
          >
            {learnMoreBtn}
            <ChevronRight
              className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-label="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
