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

      {/* Dimming overlay - stronger on hover so the copy stays readable */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 group-focus-within:bg-black/50 transition-colors duration-300" />

      {/* Title - resting state, slides out as the panel comes up */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-transform duration-300 group-hover:-translate-y-full group-focus-within:-translate-y-full">
        <h3 className="text-white font-primary text-base md:text-lg">
          {title}
        </h3>
      </div>

      {/* Full content - kept in the DOM, moved with transform for SEO */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300">
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
  );
};

export default ExperienceCard;
