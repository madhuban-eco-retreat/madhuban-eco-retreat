"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * The few interactive pieces of the Ratapani Jungle Safari packages page.
 * Every panel's full content is rendered on the server (inactive panels are only
 * `hidden`), so search engines and no-JavaScript visitors read all three packages.
 * Motion uses the Web Animations API and is skipped for "reduce motion".
 */

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Tabs: the active package lives in the URL hash, so it can be linked ---------- */

const subscribeHash = (cb) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";

export function PackageTabs({ tabs }) {
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const index = Math.max(0, tabs.findIndex((t) => t.id === hash));
  const current = tabs[index].id;
  const panelsRef = useRef(null);
  const first = useRef(true);

  // Fade and slide the new panel's blocks in, one after another.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduceMotion() || !panelsRef.current) return;
    const panel = panelsRef.current.querySelector(`[data-panel="${current}"]`);
    if (!panel) return;
    panel.querySelectorAll("[data-anim]").forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 520, delay: i * 90, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
      );
    });
  }, [current]);

  const select = useCallback((id) => {
    window.history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new Event("hashchange"));
  }, []);

  const onKeyDown = (e) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length].id;
    select(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ratapani safari packages"
        onKeyDown={onKeyDown}
        className="relative mx-auto grid max-w-[640px] grid-cols-3 rounded-full border border-[#CEC5B9]/60 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-earth-brown shadow transition-transform duration-500 ease-[cubic-bezier(.3,.8,.3,1)]"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={current === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={current === t.id ? 0 : -1}
            onClick={() => select(t.id)}
            className={`relative z-10 flex min-h-[48px] flex-col items-center justify-center rounded-full px-2 py-1.5 text-center text-[13px] font-medium leading-tight transition-colors duration-300 sm:text-base ${
              current === t.id ? "text-warm-beige" : "text-earth-brown hover:text-[#9A8864]"
            }`}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span
                className={`mt-0.5 text-[10px] font-bold uppercase tracking-[1.5px] ${
                  current === t.id ? "text-[#F6E0B7]" : "text-[#9A8864]"
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div ref={panelsRef} className="mt-6">
        {tabs.map((t) => (
          <div
            key={t.id}
            id={`panel-${t.id}`}
            data-panel={t.id}
            role="tabpanel"
            aria-labelledby={`tab-${t.id}`}
            hidden={current !== t.id}
          >
            {t.panel}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Room chooser: swaps the price with a small flip ---------- */

export function RoomPrice({ packageName, options, unit = "per couple" }) {
  const [i, setI] = useState(0);
  const priceRef = useRef(null);
  const first = useRef(true);
  const pick = options[i];

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduceMotion() || !priceRef.current) return;
    priceRef.current.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 380, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
  }, [i]);

  const wa = `https://wa.me/919770558419?text=${encodeURIComponent(
    `Hi, I'd like to book the ${packageName} in the ${pick.name}.`,
  )}`;

  return (
    <div>
      <p className="text-sm font-medium text-charcoal/70" id={`rooms-${packageName}`}>
        Choose your room
      </p>
      <div role="radiogroup" aria-labelledby={`rooms-${packageName}`} className="mt-2 grid grid-cols-2 gap-2">
        {options.map((o, n) => (
          <button
            key={o.name}
            type="button"
            role="radio"
            aria-checked={i === n}
            onClick={() => setI(n)}
            className={`min-h-[44px] rounded-xl border px-3 py-2 text-left text-sm transition duration-300 ${
              i === n
                ? "border-earth-brown bg-earth-brown text-warm-beige shadow"
                : "border-[#CEC5B9] bg-white text-earth-brown hover:-translate-y-0.5 hover:border-earth-brown"
            }`}
          >
            <span className="block font-medium">{o.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[#F4EFE8] p-4">
        <div ref={priceRef}>
          <p className="font-primary text-[32px] leading-10 text-earth-brown">
            ₹{pick.price.toLocaleString("en-IN")}
            <span className="ml-2 font-sans text-sm font-normal text-charcoal/70">{unit} + 18% GST</span>
          </p>
          <p className="text-sm text-charcoal/70">{pick.name}</p>
        </div>
      </div>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-earth-brown px-7 py-3 text-base font-medium text-warm-beige transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(132,116,85)]"
      >
        Book the {pick.name}
      </a>
    </div>
  );
}

/* ---------- Timeline: the line draws itself as it scrolls in ---------- */

export function Timeline({ children }) {
  const ref = useRef(null);
  const line = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const bar = line.current;
    if (!el || !bar || reduceMotion()) return undefined;
    if (el.offsetParent === null) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        bar.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
          duration: 1100,
          easing: "ease-out",
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <ol ref={ref} className="relative space-y-4 pl-8">
      <span
        ref={line}
        aria-hidden="true"
        className="absolute bottom-2 left-[9px] top-2 w-px origin-top bg-[#CEC5B9]"
      />
      {children}
    </ol>
  );
}

/* ---------- Sticky "Book now" bar on phones, shown once the hero has scrolled away ---------- */

export function StickyBookBar({ href, label }) {
  const bar = useRef(null);
  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    const el = bar.current;
    if (!sentinel || !el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      el.style.transform = show ? "translateY(0)" : "translateY(110%)";
      el.style.visibility = show ? "visible" : "hidden";
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={bar}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#CEC5B9]/60 bg-cream/95 py-2.5 pl-4 pr-[84px] backdrop-blur transition-transform duration-500 md:hidden"
      style={{ transform: "translateY(110%)", visibility: "hidden" }}
    >
      <a
        href={href}
        className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-earth-brown px-6 text-base font-medium text-warm-beige"
      >
        {label}
      </a>
    </div>
  );
}
