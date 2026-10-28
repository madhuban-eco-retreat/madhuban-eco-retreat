"use client";
import React, { useEffect, useRef, useState } from "react";
import "./blog-article.css";

const pad = (n) => String(n + 1).padStart(2, "0");

const BlogDescription = ({ blog }) => {
  const [headings, setHeadings] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const barRef = useRef(null);
  const articleRef = useRef(null);

  let data = blog?.content?.replace(
    /(<iframe\b[^>]*?)\s*sandbox=(["']?)?[^"'\s>]*?(["']?)?([^>]*>)/gi,
    "$1 $4"
  );

  data = data?.replace(
    /<table([^>]*)>([\s\S]*?)<\/table>/gi,
    '<div class="table-wrapper"><table$1>$2</table></div>'
  );

  useEffect(() => {
    const content = document.querySelector(".discriptionContent");
    if (!content) return;

    const elements = content.querySelectorAll("h2");

    const newHeadings = Array.from(elements).map((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      return {
        id,
        text: el.innerText,
        level: el.tagName,
      };
    });

    setHeadings(newHeadings);
  }, [blog]);

  // Highlight the section being read.
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Thin reading-progress bar. Written straight to the element, not React
  // state, so scrolling never re-renders the page.
  useEffect(() => {
    const el = articleRef.current;
    const bar = barRef.current;
    if (!el || !bar) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const done = Math.min(1, Math.max(0, (-rect.top + window.innerHeight * 0.2) / Math.max(1, total)));
      bar.style.transform = `scaleX(${done})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [blog]);

  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const activeText = activeIndex >= 0 ? headings[activeIndex].text : "Jump to a section";

  return (
    <div className="bg-[#FAF7F2] pt-6 md:pt-8">
      {/* Reading progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full origin-left bg-[#9A8864]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div className="custom-container">

        {/* ========== MOBILE / TABLET: compact "On this page" ========== */}
        {headings.length > 0 && (
          <div className="xl:hidden mb-6 rounded-2xl border border-[#CEC5B9]/70 bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="blog-toc-mobile"
              className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
            >
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-[2px] text-[#9A8864]">
                  On this page
                </span>
                <span className="block truncate font-primary text-[15px] leading-6 text-earth-brown">
                  {activeText}
                </span>
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`shrink-0 text-[#9A8864] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id="blog-toc-mobile"
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ol className="blog-toc-scroll max-h-[55vh] space-y-0.5 overflow-y-auto border-t border-[#CEC5B9]/60 px-2 py-2">
                  {headings.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex min-h-[44px] items-start gap-3 rounded-lg px-2 py-2.5 text-[14.5px] leading-5 transition-colors ${
                          activeId === item.id
                            ? "bg-warm-beige/40 font-medium text-earth-brown"
                            : "text-charcoal/75 hover:bg-warm-beige/25"
                        }`}
                      >
                        <span className="mt-px text-[11px] font-bold tabular-nums text-[#9A8864]">{pad(i)}</span>
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* MAIN LAYOUT: article first, contents second on wide screens. */}
        <div className="flex flex-col gap-8 pb-6 md:gap-10 md:pb-8 xl:flex-row xl:justify-center">
          <main className="w-full min-w-0 max-w-3xl">
            <div className="no-tailwind" ref={articleRef}>
              <div className="discriptionContent prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data }} ></div>
            </div>
          </main>

          {/* Contents: a quiet sticky card. */}
          <aside className="hidden shrink-0 xl:block xl:w-[240px]">
            <div className="sticky top-28">
              {headings.length > 0 && (
                <nav
                  aria-label="Table of contents"
                  className="rounded-2xl border border-[#CEC5B9]/70 bg-white/70 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9A8864]">On this page</p>
                  <ol className="blog-toc-scroll relative mt-3 max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-1">
                    {headings.map((item, i) => {
                      const active = activeId === item.id;
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            aria-current={active ? "true" : undefined}
                            className={`group relative flex items-start gap-2.5 rounded-lg py-1.5 pl-3 pr-1 text-[13px] leading-[18px] transition-colors duration-200 ${
                              active ? "text-earth-brown" : "text-charcoal/60 hover:text-earth-brown"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`absolute inset-y-1 left-0 w-[2px] rounded-full transition-all duration-300 ${
                                active ? "bg-[#9A8864]" : "bg-transparent group-hover:bg-[#CEC5B9]"
                              }`}
                            />
                            <span className={`mt-px text-[10px] font-bold tabular-nums ${active ? "text-[#9A8864]" : "text-[#9A8864]/60"}`}>
                              {pad(i)}
                            </span>
                            <span className={`line-clamp-3 ${active ? "font-medium" : ""}`}>{item.text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDescription;
