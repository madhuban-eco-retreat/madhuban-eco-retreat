// src/components/Header.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { isLandingRoute } from "@/utills/landingRoutes";
import { isExploreActive } from "@/lib/content/navigation";
import { TopBar } from "@/components/header/TopBar";
import { NavDesktop } from "@/components/header/NavDesktop";
import { MobileDrawer } from "@/components/header/MobileDrawer";

/**
 * Structure ported from the reference build: a non-sticky top bar that scrolls
 * away, then a sticky main bar that shrinks 80px -> 64px past 40px of scroll.
 *
 * Note this is `sticky`, not `fixed` as before, which is what lets the top bar
 * scroll out while the main bar stays. It also means page content now begins
 * below the header rather than underneath it.
 */
const MainNavigation = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on navigation. Adjusted during render rather than in an
  // effect so it does not trigger a second render pass on every route change.
  const [drawerPathname, setDrawerPathname] = useState(pathname);
  if (pathname !== drawerPathname) {
    setDrawerPathname(pathname);
    setDrawerOpen(false);
  }

  if (isLandingRoute(pathname)) return null;

  return (
    <>
      {/* Skip to content — first focusable element on the page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[0.8rem] focus:bg-earth-brown focus:text-ivory focus:font-medium focus:text-sm"
      >
        Skip to content
      </a>

      {/* Top bar — non-sticky, scrolls out naturally */}
      <TopBar />

      {/* Main header — sticky */}
      <header
        role="banner"
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled ? "h-16 bg-cream shadow-md" : "h-20 bg-cream/95"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Logo + name + tagline */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-3"
            aria-label="Madhuban Eco Retreat — Ratapani Tiger Reserve, Bhopal — home"
          >
            {/* Square, mark-only asset (256x256, transparent) so it drops into a
                square box without the wordmark being squeezed. */}
            <Image
              src="/images/logo/madhuban-mark.webp"
              alt="Madhuban Eco Retreat logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-lg font-bold text-charcoal tracking-tight">
                Madhuban Eco Retreat
              </span>
              <span className="hidden md:block text-[10px] md:text-xs font-normal text-earth-brown/70 tracking-wide">
                Ratapani Tiger Reserve, Bhopal, Madhya Pradesh, India
              </span>
            </div>
          </Link>

          {/* Desktop nav — center/right */}
          <NavDesktop pathname={pathname} exploreActive={isExploreActive(pathname)} />

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Book Now — desktop */}
            <Link
              href="/stay-in-ratapani-tiger-reserve"
              className="hidden lg:inline-flex shrink-0 items-center justify-center gap-1.5 h-12 px-4 rounded-[1rem] border border-transparent bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap transition-all hover:bg-primary/80 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book Now
            </Link>

            {/* Book — mobile compact */}
            <Link
              href="/stay-in-ratapani-tiger-reserve"
              className="lg:hidden inline-flex shrink-0 items-center justify-center gap-1 h-9 px-3 rounded-[0.75rem] border border-transparent bg-primary text-primary-foreground text-[0.8rem] font-medium whitespace-nowrap transition-all hover:bg-primary/80 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[0.8rem] hover:bg-earth-brown/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown"
            >
              <Menu className="size-5 text-charcoal" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered outside header to avoid stacking context issues */}
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} pathname={pathname} />
    </>
  );
};

export default MainNavigation;
