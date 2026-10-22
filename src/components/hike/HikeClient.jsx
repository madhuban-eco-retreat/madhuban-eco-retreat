"use client";

import { useEffect, useRef } from "react";

/**
 * Trail profile sketch for the Ratapani hike. The full line is drawn by the
 * server, so it is complete without JavaScript or with reduced motion; in the
 * browser the line draws itself the first time it scrolls into view.
 * The shape is illustrative and not to scale.
 */
export function TrailProfile() {
  const wrap = useRef(null);
  const line = useRef(null);
  const dots = useRef([]);

  useEffect(() => {
    const el = wrap.current;
    const path = line.current;
    if (!el || !path) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    dots.current.forEach((d) => d && (d.style.opacity = "0"));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
          duration: 1800,
          easing: "cubic-bezier(.3,.7,.2,1)",
          fill: "forwards",
        });
        dots.current.forEach((d, i) => {
          if (!d) return;
          d.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 400,
            delay: 400 + i * 450,
            fill: "forwards",
          });
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pts = [
    [14, 84],
    [150, 70],
    [248, 24],
    [366, 82],
  ];
  return (
    <div ref={wrap}>
      <svg viewBox="0 0 380 118" className="h-auto w-full" role="img" aria-label="Illustrative trail profile: valley, forest, the 410 metre ridge, then down to Madhuban">
        <defs>
          <linearGradient id="hikeFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6E6146" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6E6146" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[24, 58, 92].map((y) => (
          <line key={y} x1="0" x2="380" y1={y} y2={y} stroke="#6E6146" strokeOpacity="0.12" strokeDasharray="2 4" />
        ))}
        <path d="M14 84 Q48 80 86 88 T150 70 Q205 28 248 24 T318 74 L366 82 L366 104 L14 104 Z" fill="url(#hikeFill)" />
        <path
          ref={line}
          d="M14 84 Q48 80 86 88 T150 70 Q205 28 248 24 T318 74 L366 82"
          fill="none"
          stroke="#6E6146"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {pts.map(([x, y], i) => (
          <circle key={x} ref={(n) => (dots.current[i] = n)} cx={x} cy={y} r={i === 2 ? 5 : 4} fill="#FAF7F2" stroke={i === 2 ? "#9A8864" : "#6E6146"} strokeWidth="2" />
        ))}
        <text x="14" y="114" fontSize="10" fill="#6E6146">Saru Maru</text>
        <text x="196" y="14" fontSize="10.5" fontWeight="700" fill="#6E6146">Ridge, about 410 m</text>
        <text x="318" y="114" fontSize="10" fill="#6E6146">Madhuban</text>
      </svg>
    </div>
  );
}
