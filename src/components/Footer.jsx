// src/components/Footer.jsx
"use client";
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

// Inline SVG, matching the header. Replaces the raster PNGs and the two marks
// that were hotlinked from upload.wikimedia.org.
const socialLinks = [
  { name: "Instagram", href: instagram, Icon: Instagram },
  { name: "Facebook", href: facebook, Icon: Facebook },
  { name: "YouTube", href: youtube, Icon: Youtube },
  { name: "LinkedIn", href: linkedin, Icon: Linkedin },
];

const quickLinks = [
  { name: "About Us", href: "/about-us" },
  { name: "Accommodations", href: "/stay-in-ratapani-tiger-reserve" },
];

const experienceLinks = [
  {
    name: "Forest Walks & Nature Trails",
    href: "/experiences/forest-walks-and-nature-trails",
  },
  {
    name: "Bird Watching & Wilderness",
    href: "/experiences/bird-watching-and-wilderness",
  },
  { name: "Recreational Facilities", href: "/experiences/recreational-facilities" },
];

const quickLinksTail = [
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Blogs", href: "/blogs" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-condition" },
  { name: "Cookie Policy", href: "/cookies-and-consent-policy" },
  { name: "Disclaimer", href: "/disclaimer" },
];

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center font-body text-sm tracking-wider text-brand-light transition-colors hover:text-white"
      >
        <ChevronRight className="mr-1 h-4 w-4 shrink-0 text-brand-dark" aria-hidden="true" />
        {children}
      </Link>
    </li>
  );
}

function FooterHeading({ children }) {
  return (
    <h2 className="mb-4 border-b border-white/15 pb-2 font-heading text-lg font-medium tracking-widest text-white">
      {children}
    </h2>
  );
}

const Footer = () => {
  const [open, setOpen] = useState(false); // experiences disclosure
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (isLandingRoute(pathname)) return null;

  // NOTE: there is no newsletter endpoint yet — /api/leads requires a name and
  // a 10-digit phone, so an email-only POST would be rejected. This validates
  // and confirms in the UI; wiring it to a real list still needs a route.
  const handleSubscribe = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-brand-ink text-brand-light footer-section">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        {/* Footer Top Section */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              {/* The gold lockup, not the black one: the footer ground is dark
                  now, and black-madhuban-...png is solid black on transparent,
                  so it would disappear. 1978x1452 source (1.362), height-driven
                  with width auto and object-contain to keep its proportions. */}
              <Image
                width={272}
                height={200}
                src="/images/logo/madhuban-eco-retreat-bhopal-logo.png"
                alt="Madhuban Eco Retreat"
                className="h-14 w-auto object-contain"
              />
              <span className="flex flex-col justify-center">
                <span className="font-heading text-base font-bold leading-tight text-white">
                  Madhuban Eco Retreat
                </span>
                <span className="font-body text-sm leading-tight tracking-wider text-brand-muted">
                  Ratapani Tiger Reserve,
                </span>
                <span className="font-body text-sm leading-tight tracking-wider text-brand-muted">
                  Bhopal, Madhya Pradesh, India
                </span>
              </span>
            </Link>

            <p className="mb-6 font-body text-sm leading-relaxed tracking-wide text-brand-light">
              An eco-luxury retreat nestled near Ratapani Wildlife Sanctuary,
              offering sustainable luxury and immersive nature experiences.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-brand-light transition-colors hover:text-white"
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>

            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-md border border-brand-dark px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-widest text-brand-light transition-colors hover:bg-brand-dark hover:text-brand-deep"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.name}
                </FooterLink>
              ))}

              {/* Experiences disclosure */}
              <li>
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  className="flex items-center font-body text-sm tracking-wider text-brand-light transition-colors hover:text-white"
                >
                  {open ? (
                    <ChevronDown className="mr-1 h-4 w-4 shrink-0 text-brand-dark" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="mr-1 h-4 w-4 shrink-0 text-brand-dark" aria-hidden="true" />
                  )}
                  Experiences
                </button>

                {open && (
                  <ul className="mt-2 space-y-2 border-l border-white/15 pl-4">
                    {experienceLinks.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block font-body text-sm tracking-wide text-brand-muted transition-colors hover:text-white"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {quickLinksTail.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-brand-dark" aria-hidden="true" />
                <address className="font-body text-sm not-italic leading-relaxed tracking-wider text-brand-light">
                  Near Ratapani Wildlife Sanctuary, Bhopal, Madhya Pradesh, India
                </address>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 shrink-0 text-brand-dark" aria-hidden="true" />
                <a
                  href={`tel:+${phone}`}
                  className="font-body text-sm tracking-wider text-brand-light transition-colors hover:text-white"
                >
                  +{phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 shrink-0 text-brand-dark" aria-hidden="true" />
                <a
                  href={`mailto:${gmail}`}
                  className="font-body text-sm tracking-wider text-brand-light transition-colors hover:text-white"
                >
                  {gmail}
                </a>
              </li>
              <li className="font-body text-sm leading-relaxed tracking-wider text-brand-muted">
                Subscribe to receive updates on special offers, new experiences,
                and sustainability initiatives.
              </li>
            </ul>
          </div>

          {/* Somaiya + Newsletter */}
          <div>
            {/* 151x112 source (1.348) — was forced into a 70x70 square. The
                partner mark is fixed-colour (blue block, black "GROUP"), so it
                sits on a light plate rather than directly on the dark ground. */}
            <div className="mx-auto mb-4 mt-3 w-fit rounded-md bg-white px-3 py-2">
              <Image
                src="/images/logo/somaiya-group-logo.png"
                alt="Somaiya Group"
                width={151}
                height={112}
                className="h-[60px] w-auto object-contain"
              />
            </div>
            <p className="mb-6 text-center font-heading text-lg leading-snug text-white">
              A Somaiya Group Initiative <br /> Where Sustainability Meets
              Hospitality.
            </p>

            <form className="mb-4" onSubmit={handleSubscribe} noValidate>
              <label htmlFor="footer-email" className="sr-only">
                Your email
              </label>
              <div className="footer-input-con">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Your email"
                  aria-invalid={error ? "true" : undefined}
                  aria-describedby={error ? "footer-email-error" : undefined}
                  className="w-full flex-grow border border-white/20 bg-white/10 px-4 py-2 font-body tracking-wider text-white placeholder-brand-muted focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark md:py-4"
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-brand-dark px-4 py-4 font-body font-semibold uppercase tracking-widest text-brand-deep transition-colors hover:bg-[#8A7856]"
                >
                  Subscribe
                </button>
              </div>

              {error && (
                <p
                  id="footer-email-error"
                  role="alert"
                  className="mt-2 font-body text-sm text-[#F0B4AC]"
                >
                  {error}
                </p>
              )}
              {subscribed && !error && (
                <p
                  role="status"
                  className="mt-2 flex items-center gap-1.5 font-body text-sm text-white"
                >
                  <Check className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden="true" />
                  Thanks — we&apos;ll be in touch.
                </p>
              )}
            </form>

            <p className="font-body text-sm leading-relaxed tracking-wider text-brand-muted">
              By subscribing, you agree to our Privacy Policy. You can
              unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-white/15 pt-6 md:flex-row">
          <p className="text-center font-body text-sm tracking-wider text-brand-muted">
            &copy; {currentYear} Madhuban Eco Retreat. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row"
          >
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-sm tracking-wider text-brand-muted transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
