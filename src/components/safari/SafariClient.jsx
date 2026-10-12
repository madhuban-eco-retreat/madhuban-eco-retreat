"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Small interactive pieces for the Ratapani Tiger Safari page. Everything here
 * renders complete, readable content on the server (so search engines and
 * no-JavaScript visitors get the full page) and only adds motion in the browser.
 */

/** Hero photo that drifts from 1.0 to 1.08 scale over a few seconds. */
export function HeroPhoto({ src, alt }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      sizes="100vw"
      className={`object-cover transition-transform duration-[14000ms] ease-out ${on ? "scale-[1.08]" : "scale-100"}`}
    />
  );
}

/**
 * A number that counts up the first time it scrolls into view. The server prints
 * the final value, so nothing is lost without JavaScript or with reduced motion.
 */
export function CountUp({ to, decimals = 0, className = "" }) {
  const ref = useRef(null);
  const fmt = (n) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;

    el.textContent = fmt(0);
    let raf;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const run = (now) => {
          const t = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = fmt(to * eased);
          if (t < 1) raf = requestAnimationFrame(run);
        };
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals]);

  return (
    <span ref={ref} className={className}>
      {fmt(to)}
    </span>
  );
}

/** A bar that grows to `percent` when it scrolls into view (set straight on the element, no re-render). */
export function GrowBar({ percent, className = "" }) {
  const track = useRef(null);
  const fill = useRef(null);
  useEffect(() => {
    const el = track.current;
    const bar = fill.current;
    if (!el || !bar || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;
    bar.style.width = "0%";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.style.width = `${percent}%`;
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percent]);
  return (
    <div ref={track} className="h-2 w-full overflow-hidden rounded-full bg-earth-brown/15">
      <div
        ref={fill}
        className={`h-full rounded-full transition-[width] duration-[1400ms] ease-out ${className}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/**
 * Sticky in-page menu. It sits just under the site header (measured, since the
 * header height changes between phone and desktop), highlights the section on
 * screen, and shows a thin reading-progress line.
 */
export function SectionNav({ items, ctaHref, ctaLabel }) {
  const [top, setTop] = useState(80);
  const [active, setActive] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);
  const barRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector("header");
    const measure = () => setTop(header ? Math.round(header.getBoundingClientRect().height) : 80);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.1, 0.5] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active link visible in the scrollable row on phones.
  useEffect(() => {
    const link = barRef.current?.querySelector(`[data-nav="${active}"]`);
    if (link && barRef.current) {
      const box = barRef.current;
      box.scrollTo({ left: link.offsetLeft - box.clientWidth / 2 + link.clientWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      style={{ top }}
      className="sticky z-40 border-b border-[#CEC5B9]/60 bg-cream/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 md:px-6">
        <div ref={barRef} className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              data-nav={i.id}
              aria-current={active === i.id ? "true" : undefined}
              className={`relative shrink-0 px-3 py-3.5 text-sm font-medium tracking-wide transition-colors ${
                active === i.id ? "text-earth-brown" : "text-charcoal/60 hover:text-earth-brown"
              }`}
            >
              {i.label}
              <span
                className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-earth-brown transition-transform duration-300 ${
                  active === i.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </div>
        <a
          href={ctaHref}
          className="hidden shrink-0 rounded-full bg-earth-brown px-5 py-2 text-sm font-medium text-warm-beige transition-colors hover:bg-[rgb(132,116,85)] sm:inline-flex"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="h-[2px] w-full bg-transparent" aria-hidden="true">
        <div className="h-full bg-[#9A8864] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </nav>
  );
}

/** Two-tab itinerary switcher. Both panels stay in the page (the inactive one is just hidden). */
export function ItineraryTabs({ tabs }) {
  const [current, setCurrent] = useState(tabs[0].id);
  return (
    <div>
      <div role="tablist" aria-label="Itinerary length" className="mx-auto flex w-fit gap-1 rounded-full bg-earth-brown/10 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={current === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setCurrent(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              current === t.id ? "bg-earth-brown text-warm-beige shadow" : "text-earth-brown hover:bg-earth-brown/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={current !== t.id}
          className="mt-8 grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] [animation:none]"
        >
          {t.days.map((d) => (
            <article
              key={d.day}
              className="rounded-2xl border border-[#CEC5B9]/50 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-[3px] text-[#9A8864]">{d.day}</p>
              <h3 className="mt-1 font-primary text-xl leading-7 text-charcoal">{d.title}</h3>
              {d.items ? (
                <ul className="mt-3 space-y-2.5 text-[15px] font-light leading-6 text-charcoal/75">
                  {d.items.map(([when, what]) => (
                    <li key={when} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A8864]" />
                      <span>
                        <strong className="font-bold text-earth-brown">{when}:</strong> {what}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[15px] font-light leading-6 text-charcoal/75">{d.text}</p>
              )}
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
