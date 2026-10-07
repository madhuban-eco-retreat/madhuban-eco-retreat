"use client";

import { useEffect, useRef } from "react";

/**
 * Fades its children up into place the first time they scroll into view.
 *
 * Built so the page is never hidden by it:
 *   - The server renders the content fully visible. The hidden state is only
 *     applied in the browser, and only to elements that start below the fold,
 *     so crawlers, no-JS visitors and anything already on screen see the content
 *     immediately and never see a flash.
 *   - It respects "reduce motion": nothing is hidden and nothing animates.
 *   - It writes a data attribute straight onto the element rather than keeping
 *     React state, so scrolling never re-renders the page.
 */
export default function RevealOnScroll({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // Already on screen when the page loads: leave it visible.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition duration-700 ease-out data-[reveal=hidden]:translate-y-6 data-[reveal=hidden]:opacity-0 motion-reduce:transition-none ${className}`}
    >
      {children}
    </Tag>
  );
}
