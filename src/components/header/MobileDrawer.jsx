"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, Mail, X } from "lucide-react";
import {
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconLinkedIn,
  IconWhatsApp,
} from "@/components/icons/SocialIcons";
import { PRIMARY_NAV, EXPLORE_NAV, isLinkActive } from "@/lib/content/navigation";
import { BUSINESS } from "@/lib/content/business";
import { facebook, instagram, linkedin, youtube } from "@/utills/constants";

const SOCIAL_LINKS = [
  { href: instagram, label: "Instagram", Icon: IconInstagram },
  { href: facebook, label: "Facebook", Icon: IconFacebook },
  { href: youtube, label: "YouTube", Icon: IconYouTube },
  { href: linkedin, label: "LinkedIn", Icon: IconLinkedIn },
  {
    href: `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, "")}`,
    label: "WhatsApp",
    Icon: IconWhatsApp,
  },
];

function NavLink({ href, active, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center min-h-[48px] px-3 py-2 text-base font-medium rounded-[0.8rem] transition-colors duration-200 hover:bg-earth-brown/10 hover:text-earth-brown ${
        active ? "text-earth-brown bg-earth-brown/10" : "text-charcoal"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * Slide-in panel from the left, matching the reference's Sheet. Hand-rolled
 * because this project has no Sheet primitive: it traps nothing but does lock
 * background scroll, close on Escape, and close on backdrop click.
 */
export function MobileDrawer({ open, onOpenChange, pathname }) {
  const close = () => onOpenChange(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-charcoal/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-sm flex-col overflow-y-auto border-r border-border bg-cream outline-none transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-[0.8rem] text-charcoal transition-colors hover:bg-earth-brown/10"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <nav aria-label="Mobile primary" className="flex-1 pt-12 pb-4">
          <ul className="space-y-0.5 px-4">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  active={isLinkActive(pathname, item.href)}
                  onClick={close}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 px-4">
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </p>
            <ul className="space-y-0.5">
              {EXPLORE_NAV.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    active={isLinkActive(pathname, item.href)}
                    onClick={close}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-border px-4 py-6 space-y-4">
          <div className="space-y-3">
            <Link
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 text-sm text-charcoal hover:text-earth-brown transition-colors"
            >
              <Phone className="size-4 text-earth-brown shrink-0" aria-hidden="true" />
              <span>+91 97705 58419</span>
            </Link>
            <Link
              href={`mailto:${BUSINESS.email}`}
              className="flex items-center gap-2 text-sm text-charcoal hover:text-earth-brown transition-colors"
            >
              <Mail className="size-4 text-earth-brown shrink-0" aria-hidden="true" />
              <span>{BUSINESS.email}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-earth-brown hover:text-blush-dusk transition-colors"
              >
                <Icon className="size-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
