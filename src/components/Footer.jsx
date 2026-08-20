// src/components/Footer.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconLinkedIn,
  IconWhatsApp,
} from "@/components/icons/SocialIcons";
import { BUSINESS } from "@/lib/content/business";
import {
  FOOTER_EXPLORE,
  FOOTER_VISIT,
  LEGAL_NAV,
} from "@/lib/content/navigation";
import { isLandingRoute } from "@/utills/landingRoutes";
import { facebook, instagram, linkedin, youtube } from "@/utills/constants";
import { NewsletterForm } from "@/components/footer/NewsletterForm";

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

function FooterHeading({ children }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-earth-brown mb-4">
      {children}
    </h2>
  );
}

function FooterLink({ href, external, children }) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <li>
      <Link
        href={href}
        {...externalProps}
        className="text-sm text-charcoal/80 hover:text-earth-brown transition-colors duration-200 flex items-center gap-1.5"
      >
        {external && (
          <MapPin className="size-3 shrink-0 text-earth-brown" aria-hidden="true" />
        )}
        {children}
      </Link>
    </li>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (isLandingRoute(pathname)) return null;

  return (
    <footer role="contentinfo" className="bg-cream border-t border-border">
      {/* Main columns */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Madhuban Eco Retreat — home"
            >
              <Image
                src="/images/logo/madhuban-mark.webp"
                alt=""
                width={36}
                height={36}
              />
              <span className="font-display text-2xl font-medium text-earth-brown leading-tight">
                Madhuban Eco Retreat
              </span>
            </Link>

            <address className="not-italic text-sm text-charcoal/80 leading-relaxed space-y-1">
              <p>Village Bori, Salkanpur Road</p>
              <p>Rehti, Sehore, Madhya Pradesh — 466446</p>
            </address>

            <p className="text-sm text-charcoal/70 leading-relaxed max-w-xs">
              Eco-luxury forest retreat adjacent to Ratapani Tiger Reserve, 60 km
              from Bhopal.
            </p>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-earth-brown hover:text-blush-dusk transition-colors duration-200"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </div>

            <Link
              href={`https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 h-12 px-4 rounded-[1rem] border border-earth-brown text-earth-brown text-sm font-medium whitespace-nowrap transition-all hover:bg-earth-brown hover:text-ivory active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown"
            >
              <IconWhatsApp className="size-4" />
              Chat on WhatsApp
            </Link>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5">
              {FOOTER_EXPLORE.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 3 — Visit */}
          <div>
            <FooterHeading>Visit</FooterHeading>
            <ul className="space-y-2.5">
              {FOOTER_VISIT.map((item) => (
                <FooterLink key={item.href} href={item.href} external={item.external}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div id="footer-newsletter">
            <FooterHeading>Stay Updated</FooterHeading>
            <p className="text-sm text-charcoal/70 mb-4 leading-relaxed">
              Get updates on offers, new experiences, and sustainability
              initiatives.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-earth-brown text-ivory">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium">{BUSINESS.parent}</p>
              <p className="text-xs text-ivory/70 mt-0.5">
                A Somaiya Group Initiative · Where Sustainability Meets
                Hospitality
              </p>
            </div>
            <p className="text-xs text-ivory/70 shrink-0">
              © {currentYear} {BUSINESS.name}. All rights reserved.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-ivory/20 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
