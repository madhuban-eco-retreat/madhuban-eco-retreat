"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

/**
 * Blog list/related-post card. Image-led, editorial: the whole card is the
 * link (no per-card "Explore More" button — repeating the same CTA on every
 * card is noise; the image zoom and title color shift on hover already say
 * "this is clickable"). Category renders as a small chip overlaid on the
 * image, not a boxed label below the fold.
 *
 * Wrapped in its own card shell (white background, soft border, shadow) —
 * previously the image and text just sat directly on the page background
 * with nothing to read as "a card." Deliberately not using earth-brown here
 * — a dark filled card background was too heavy for a grid of nine of them.
 *
 * `variant` picks a fixed-height class (defined in globals.css as plain
 * hand-authored CSS, not a Tailwind utility — see the note there on why)
 * so a wide "large" card and a narrow "small" card next to it share the
 * same height instead of both scaling by aspect-ratio, which would make
 * the wider one taller too.
 */
const Card = ({
  imageUrl = FALLBACK_IMAGE,
  altText = "Blog Image",
  hrefLink = "#",
  title = "No title found",
  cardkey = "",
  createdAt = "",
  category = "",
  variant = null, // "large" | "small" | "trio" | null (default 4:3 aspect)
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const isLarge = variant === "large";
  const imgClassName = variant
    ? `blog-card-img blog-card-img-${variant}`
    : "blog-card-img";

  return (
    <Link
      href={hrefLink}
      key={cardkey}
      aria-label={title}
      className="group block h-full rounded-xl overflow-hidden bg-white border border-warm-beige/60 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div
        className={imgClassName}
        style={variant ? undefined : { aspectRatio: "4 / 3" }}
      >
        <Image
          src={imgSrc || FALLBACK_IMAGE}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          alt={altText}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm text-earth-brown text-xs font-medium">
            {category}
          </span>
        )}
      </div>

      <div className="p-4">
        {createdAt && (
          <p className="text-xs text-charcoal/45 tracking-wide">{createdAt}</p>
        )}
        <h3
          className={`font-primary mt-1.5 leading-snug text-charcoal line-clamp-2 transition-colors duration-300 group-hover:text-brand-bronze ${isLarge ? "text-xl md:text-2xl" : "text-lg"}`}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default Card;
