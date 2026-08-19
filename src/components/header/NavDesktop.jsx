"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PRIMARY_NAV, EXPLORE_NAV, isLinkActive } from "@/lib/content/navigation";

/**
 * The reference uses a Base UI DropdownMenu with openOnHover. That dependency
 * is not in this project, so the Explore menu is hand-rolled to the same
 * behaviour: opens on hover with a short close delay, opens on click/Enter,
 * closes on Escape, on outside click, and on selection.
 */
export function NavDesktop({ pathname, exploreActive }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);
  const menuId = useId();

  const open = () => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e) => e.key === "Escape" && setDropdownOpen(false);
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [dropdownOpen]);

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
      {PRIMARY_NAV.map((item) => {
        const active = isLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`px-3 py-2 text-sm font-medium rounded-[0.8rem] transition-colors duration-200 hover:bg-earth-brown/10 hover:text-earth-brown ${
              active
                ? "text-earth-brown underline underline-offset-4"
                : "text-charcoal"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-controls={dropdownOpen ? menuId : undefined}
          aria-current={exploreActive ? "page" : undefined}
          onClick={() => setDropdownOpen((v) => !v)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[0.8rem] transition-colors duration-200 hover:bg-earth-brown/10 hover:text-earth-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown ${
            exploreActive
              ? "text-earth-brown underline underline-offset-4"
              : "text-charcoal"
          }`}
        >
          Explore
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {dropdownOpen && (
          <ul
            id={menuId}
            role="menu"
            className="absolute right-0 top-full mt-2 w-52 bg-cream border border-border shadow-md rounded-[1rem] p-1 z-50"
          >
            {EXPLORE_NAV.map((item) => {
              const active = isLinkActive(pathname, item.href);
              return (
                <li key={item.href} role="none">
                  <Link
                    role="menuitem"
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setDropdownOpen(false)}
                    className={`block rounded-[0.8rem] px-3 py-2 text-sm cursor-pointer transition-colors duration-200 hover:bg-earth-brown/10 ${
                      active ? "text-earth-brown font-medium" : "text-charcoal"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
