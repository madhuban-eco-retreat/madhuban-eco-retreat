"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Background photo slideshow for the Experiences hero: cross-fades through the
 * images in order, every few seconds. It only draws the pictures and the dark
 * overlay; the headline stays in the server-rendered hero around it.
 *
 * - The first image is preloaded (priority) so the hero paints fast.
 * - With "reduce motion" switched on, or a single image, it just shows the first one.
 * - The little dots are real buttons, so people can pick a picture themselves.
 */
const INTERVAL_MS = 6000;

export default function ExperiencesHeroSlider({ images }) {
  const [active, setActive] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, active]);

  return (
    <>
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt=""
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className={`object-cover ${
              i === active
                ? "scale-[1.07] opacity-80 [transition:opacity_1400ms_ease-in-out,transform_9000ms_ease-out]"
                : "scale-100 opacity-0 [transition:opacity_1400ms_ease-in-out,transform_0s_1400ms]"
            }`}
          />
        ))}
        {/* Darkens the lower half so the headline always reads clearly. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B17] via-[#1B1B17]/45 to-[#1B1B17]/20" />
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 md:bottom-10 md:right-[60px]">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#F6E0B7]" : "w-2 bg-[#FCF9F4]/50 hover:bg-[#FCF9F4]/80"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
