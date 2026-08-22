// src/components/Footer.js
"use client";
import React from "react";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
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

const socialLinks = [
  { name: "Instagram", href: instagram, Icon: FaInstagram },
  { name: "Facebook", href: facebook, Icon: FaFacebookF },
  { name: "YouTube", href: youtube, Icon: FaYoutube },
  { name: "LinkedIn", href: linkedin, Icon: FaLinkedinIn },
];

const exploreLinks = [
  { name: "About Us", path: "/about-us" },
  { name: "Experiences", path: "/experiences" },
  { name: "Nearby Attractions", path: "/nearby-attractions" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blogs", path: "/blogs" },
];

const visitLinks = [
  { name: "Accommodations", path: "/stay-in-ratapani-tiger-reserve" },
  { name: "Dining", path: "/dining" },
  { name: "Day Outing", path: "/day-outing" },
  { name: "Booking", path: "/booking" },
  { name: "Contact Us", path: "/contact-us" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms-and-condition" },
  { name: "Cookie Policy", path: "/cookies-and-consent-policy" },
  { name: "Disclaimer", path: "/disclaimer" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (isLandingRoute(pathname)) return null;

  return (
    <footer className="bg-[#F5F0E8] text-charcoal footer-section">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - identity, address, social, WhatsApp */}
          <div>
            <Link href="/" className="inline-flex flex-col items-start gap-2">
              <Image
                width={160}
                height={80}
                src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-footer-logo-200.png"
                alt="Madhuban Eco Retreat Logo"
                className="w-40 h-20 object-contain object-left"
              />
            </Link>

            <div className="mt-4 flex items-start text-sm text-charcoal/70 font-primary tracking-wide">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <address className="not-italic leading-relaxed">
                Ratapani Tiger Reserve, Salkanpur Road, Bori, Rehti, Madhya
                Pradesh — 466446
              </address>
            </div>

            <div className="mt-3 space-y-2 text-sm font-primary tracking-wide">
              <a
                href={`tel:+${phone}`}
                className="flex items-center text-charcoal/70 hover:text-earth-brown transition-colors duration-200"
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />+{phone}
              </a>
              <a
                href={`mailto:${gmail}`}
                className="flex items-center text-charcoal/70 hover:text-earth-brown transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                {gmail}
              </a>
            </div>

            {/* Vector icons inheriting currentColor, so the colour class below
                actually applies. Tap targets are 44x44. */}
            <div className="mt-3 flex items-center -ml-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="inline-flex items-center justify-center w-11 h-11 text-charcoal/70 hover:text-earth-brown transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>

            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 border border-charcoal/30 rounded-full px-4 py-2 text-sm text-charcoal hover:bg-charcoal/5 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current text-[#25D366]"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Column 2 - Explore */}
          <div>
            <div className="footer-heading text-charcoal tracking-widest font-primary font-medium mb-4 pb-2 border-b border-charcoal/15 uppercase">
              Explore
            </div>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="font-primary text-charcoal/70 hover:text-earth-brown transition-colors duration-200 footer-text flex items-center tracking-wider"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Visit */}
          <div>
            <div className="footer-heading text-charcoal tracking-widest font-primary font-medium mb-4 pb-2 border-b border-charcoal/15 uppercase">
              Visit
            </div>
            <ul className="space-y-2">
              {visitLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="font-primary text-charcoal/70 hover:text-earth-brown transition-colors duration-200 footer-text flex items-center tracking-wider"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Stay Updated */}
          <div>
            <div className="footer-heading text-charcoal tracking-widest font-primary font-medium mb-4 pb-2 border-b border-charcoal/15 uppercase">
              Stay Updated
            </div>
            <p className="text-charcoal/70 mb-4 font-primary tracking-wide footer-text">
              Subscribe to receive updates on special offers, new experiences,
              and sustainability initiatives.
            </p>
            <form className="mb-3">
              <div className="footer-input-con">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Your email"
                  className="font-primary tracking-wider flex-grow px-4 py-2 md:py-4 bg-white border border-charcoal/20 focus:outline-none focus:ring-2 focus:ring-earth-brown text-charcoal placeholder-charcoal/40"
                />
                <button
                  type="submit"
                  className="bg-[rgb(110,97,70)] hover:bg-[rgb(87,75,58)] text-[#F5F0E8] px-4 py-4 rounded-r-md font-primary font-medium cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="text-charcoal/50 font-primary tracking-wide text-xs">
              By subscribing, you agree to our Privacy Policy. You can
              unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[rgb(110,97,70)] text-[#D1C8C1]">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full py-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Image
              src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/somaiya-group-logo.png"
              alt="Somaiya Group"
              width={80}
              height={40}
              className="w-20 h-10 object-contain"
            />
            <p className="font-primary text-xs tracking-wide leading-tight">
              A Somaiya Group Initiative
              <br />
              Where Sustainability Meets Hospitality.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="font-primary text-xs tracking-wider flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="font-primary text-xs tracking-wider text-center md:text-right">
              &copy; {currentYear} Madhuban Eco Retreat. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
