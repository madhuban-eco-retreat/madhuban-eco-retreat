"use client";
import React, { useEffect, useState } from "react";

const BlogDescription = ({ blog }) => {
  const [headings, setHeadings] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

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

  //  heading highlight
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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="bg-[#FAF7F2] pt-8">
      <div className="custom-container">

        {/* ========== MOBILE / TABLET: TOC Dropdown ========== */}
        {headings.length > 0 && (
          <div className="xl:hidden w-full mb-6">
            <button onClick={() => setOpen(!open)} className="w-full text-left py-3 border-b border-earth-brown/20 font-primary text-lg flex justify-between items-center text-earth-brown" >
              Contents
              <span className="text-xl font-normal">{open ? "−" : "+"}</span>
            </button>

            {open && (
              <ul className="pt-3 pb-2 space-y-2 text-sm">
                {headings.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} onClick={() => setOpen(false)}
                      className={`block py-1 transition-colors ${
                        activeId === item.id ? "text-earth-brown font-semibold"  : "text-charcoal/70 hover:text-earth-brown"  }`} >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* MAIN LAYOUT — just TOC + content, no sidebar. Centered as a pair
            (not left-aligned) since the content column is capped narrower
            than the outer container for readability — left-aligning it
            would otherwise dump all the leftover width as dead space on
            the right. */}
        <div className="flex flex-col xl:flex-row xl:justify-center gap-8 md:gap-10 pb-6 md:pb-8">
          {/* Table of Contents — plain list, no box, just an accent line on
              the active item. Fixed narrow width so the article gets the
              rest of the space instead of splitting it three ways. */}
          <aside className="hidden xl:block xl:w-[200px] shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              {headings.length > 0 && (
                <nav>
                  <h3 className="font-primary text-base text-earth-brown mb-4"> Contents </h3>
                  <ul className="space-y-3 text-sm border-l border-earth-brown/15">
                    {headings.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}
                          className={`block pl-4 -ml-px border-l-2 transition-colors duration-200 ${
                            activeId === item.id
                              ? "border-earth-brown text-earth-brown font-semibold"
                              : "border-transparent text-charcoal/60 hover:text-earth-brown" }`}>
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>

          {/* Blog Content — no card, no border, no shadow: flows directly
              on the page background so it doesn't read as a separate box
              sitting on top of the page, just the article itself. */}
          <main className="w-full min-w-0 max-w-3xl">
            <div className="no-tailwind">
              <div className="discriptionContent prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data }} ></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogDescription;