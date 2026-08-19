// src/components/Header.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";
import {
  facebook,
  gmail,
  instagram,
  linkedin,
  phone,
  youtube,
} from "@/utills/constants";
import { isLandingRoute } from "@/utills/landingRoutes";
import Image from "next/image";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const navigation = [
  {
    name: "Home",
    path: "/",
    dropdown: null,
  },
  {
    name: "About",
    path: "/about-us",
  },
  {
    name: "Stay",
    path: "/stay-in-ratapani-tiger-reserve",
  },
  {
    name: "Experiences",
    path: "/experiences",
  },
  {
    name: "Dining",
    path: "/dining",
  },
  {
    name: "Nearby Attractions",
    path: "/nearby-attractions",
  },
  {
    name: "Gallery",
    path: "/gallery",
  },
  {
    name: "Blogs",
    path: "/blogs",
    hideOnDesktop: true,
  },
  {
    name: "Day Outing",
    path: "/day-outing",
    dropdown: null,
  },
  {
    name: "Contact",
    path: "/contact-us",
    dropdown: null,
  },
];

// Inline SVG throughout. The previous markup pulled the Facebook and WhatsApp
// marks from upload.wikimedia.org — a third-party host, on every page view —
// and the rest as raster PNGs that could not inherit a hover colour.
const socialLinks = [
  { name: "Instagram", href: instagram, Icon: Instagram },
  { name: "Facebook", href: facebook, Icon: Facebook },
  { name: "YouTube", href: youtube, Icon: Youtube },
  { name: "LinkedIn", href: linkedin, Icon: Linkedin },
  { name: "WhatsApp", href: `https://wa.me/${phone}`, Icon: WhatsAppIcon },
];

const MainNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer when the route changes. Adjusted during render rather than
  // in an effect: an effect here fires a second render pass on every navigation
  // (and trips react-hooks/set-state-in-effect). This covers back/forward too,
  // which per-link onClick handlers alone would miss.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

  // Lock body scroll behind the mobile drawer.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  if (isLandingRoute(pathname)) return null;

  const isActive = (itemPath) =>
    itemPath === "/" ? pathname === "/" : pathname.startsWith(itemPath);

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-light shadow-md">
      {/* Top Info Bar — brand.ink ground so the small text clears WCAG AA */}
      <div className="hidden lg:block bg-brand-ink text-brand-light">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex h-9 items-center justify-between font-body text-xs tracking-wider">
            <div className="flex items-center gap-6">
              <a
                href={`tel:+${phone}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>+{phone}</span>
              </a>
              <a
                href={`mailto:${gmail}`}
                aria-label="Send us an email"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{gmail}</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar — 64px mobile / 80px desktop */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="z-20 flex shrink-0 items-center gap-3"
            aria-label="Madhuban Eco Retreat — home"
          >
            {/* Intrinsic ratio is 1978x1452 (1.362). Height is driven by CSS and
                width left auto, so the lockup is never squeezed into a square. */}
            <Image
              src="/images/logo/madhuban-eco-retreat-bhopal-logo.png"
              width={272}
              height={200}
              alt="Madhuban Eco Retreat"
              className="h-10 w-auto object-contain lg:h-12"
              priority
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-base font-bold leading-tight tracking-wide text-brand-ink lg:text-xl">
                Madhuban Eco Retreat
              </span>
              <span className="font-body text-[11px] leading-tight tracking-wider text-[#5C4F3A]">
                Ratapani Tiger Reserve, Bhopal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — switches at lg (1024px) */}
          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center gap-x-3 lg:flex xl:gap-x-5"
          >
            {navigation
              .filter((item) => !item.hideOnDesktop)
              .map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    aria-current={active ? "page" : undefined}
                    className={`group relative whitespace-nowrap font-body text-xs font-medium uppercase tracking-widest text-brand-ink transition-colors xl:text-sm ${
                      active ? "" : "hover:text-[#5C4F3A]"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] w-full origin-bottom-right bg-brand-dark transition-transform duration-300 group-hover:origin-bottom-left group-hover:scale-x-100 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
          </nav>

          {/* Book Now — desktop */}
          <Link
            href="/stay-in-ratapani-tiger-reserve"
            className="hidden shrink-0 rounded-md bg-brand-dark px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-widest text-brand-deep transition-colors hover:bg-[#8A7856] lg:block xl:text-sm"
          >
            Book Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="z-20 -mr-1 flex h-10 w-10 items-center justify-center rounded-md text-brand-ink transition-colors hover:bg-black/5 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 min-h-screen transform bg-brand-light px-6 pt-20 transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center rounded-md text-brand-ink hover:bg-black/5"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        <nav
          aria-label="Mobile primary"
          className="flex h-[calc(100vh-6rem)] flex-col overflow-y-auto pb-10"
        >
          <div className="border-l-2 border-brand-dark">
            {navigation.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`ml-4 flex min-h-[48px] items-center border-b border-black/10 px-4 font-body text-sm uppercase tracking-widest transition-colors ${
                    active
                      ? "rounded-r-md bg-brand-dark font-semibold text-brand-deep"
                      : "text-brand-ink hover:text-[#5C4F3A]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <Link
            href="/stay-in-ratapani-tiger-reserve"
            onClick={() => setIsMenuOpen(false)}
            className="mt-6 w-full rounded-md bg-brand-dark py-3 text-center font-body text-sm font-semibold uppercase tracking-widest text-brand-deep transition-colors hover:bg-[#8A7856]"
          >
            Book Now
          </Link>

          {/* Contact + socials */}
          <div className="mt-8 space-y-3 border-t border-black/10 pt-6">
            <a
              href={`tel:+${phone}`}
              className="flex items-center gap-2 font-body text-sm text-brand-ink"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#5C4F3A]" aria-hidden="true" />
              <span>+{phone}</span>
            </a>
            <a
              href={`mailto:${gmail}`}
              className="flex items-center gap-2 font-body text-sm text-brand-ink"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#5C4F3A]" aria-hidden="true" />
              <span>{gmail}</span>
            </a>
            <div className="flex items-center gap-5 pt-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-[#5C4F3A] transition-colors hover:text-brand-ink"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default MainNavigation;
