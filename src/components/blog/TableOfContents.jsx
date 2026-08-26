"use client";

import { useEffect, useState } from "react";

/**
 * Sticky contents list for the article sidebar.
 *
 * The heading list is computed on the server (see prepareArticleHtml) and the
 * ids are already in the served HTML, so the links work before hydration and a
 * crawler can follow them. This component only adds the two things that need a
 * browser: scroll-spy highlighting and smooth scrolling.
 */
export function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);
    if (elements.length === 0) return undefined;

    // The top band is ignored so a heading only counts as "current" once it has
    // reached the upper part of the viewport, rather than the instant it
    // appears at the bottom.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  function jumpTo(event, id) {
    const target = document.getElementById(id);
    if (!target) return; // Let the plain anchor handle it.
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    // Keeps the URL shareable and the back button meaningful.
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-labelledby="toc-heading" className="flex flex-col gap-3">
      <h2
        id="toc-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(110,97,70)]"
      >
        On this page
      </h2>
      <ul className="flex flex-col gap-1 border-l border-[#c8b99a]/50">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => jumpTo(e, heading.id)}
                aria-current={active ? "location" : undefined}
                className={[
                  "block border-l-2 py-1.5 text-sm leading-snug transition-colors",
                  heading.level === 3 ? "pl-6" : "pl-3",
                  active
                    ? "border-[rgb(110,97,70)] font-medium text-[rgb(110,97,70)]"
                    : "border-transparent text-[#3a3d45]/65 hover:text-[#3a3d45]",
                ].join(" ")}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
