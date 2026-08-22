import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

/**
 * Blog list card. The whole card is the link, so the "Explore More" affordance
 * is a styled span - it was previously a <button> nested inside this <a>, which
 * is invalid markup and silently dropped the href it was given. The `group`
 * class also has to live on the linked element, otherwise the image's
 * group-hover zoom never fires.
 */
const Card = ({
  imageUrl = FALLBACK_IMAGE,
  altText = "Blog Image",
  hrefLink = "#",
  title = "No title found",
  cardkey = "",
  createdAt = "",
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <Link
      href={hrefLink}
      key={cardkey}
      aria-label={title}
      className="group block h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-primary-gray"
    >
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <Image
          src={imgSrc || FALLBACK_IMAGE}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          quality={90}
          alt={altText}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </div>

      <div className="p-4 md:p-5">
        <p className="text-xs text-[#3a3d45]/50 leading-relaxed">{createdAt}</p>
        <h3 className="mt-2 text-base font-semibold leading-relaxed line-clamp-2 text-[#3a3d45]">
          {title}
        </h3>
        <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#6e6146] px-4 h-10 text-sm font-medium text-[#D1C8C1] transition-opacity duration-300 group-hover:opacity-90">
          Explore More <FaChevronRight size={13} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default Card;
