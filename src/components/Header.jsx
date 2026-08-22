// src/components/MainNavigation.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
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

// Desktop nav is deliberately short so the bar fits inside max-w-6xl without
// wrapping. Everything trimmed from the top level is reachable under Explore,
// and the mobile drawer still lists every destination flat.
const navigation = [
  { name: "Stay", path: "/stay-in-ratapani-tiger-reserve" },
  { name: "Dining", path: "/dining" },
  { name: "Day Outing", path: "/day-outing" },
];

const exploreLinks = [
  { name: "About", path: "/about-us" },
  { name: "Experiences", path: "/experiences" },
  { name: "Nearby Attractions", path: "/nearby-attractions" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blogs", path: "/blogs" },
  { name: "Contact", path: "/contact-us" },
];

// Flat list for the mobile drawer, which has room for all of it.
const mobileNavigation = [
  { name: "Home", path: "/" },
  ...navigation,
  ...exploreLinks,
];

// Vector icons rather than the previous raster brand logos: these inherit
// currentColor, so the bar's contrast colour actually applies to them. A
// colour class on an <img> does nothing.
const socialLinks = [
  { name: "Instagram", href: instagram, Icon: FaInstagram },
  { name: "Facebook", href: facebook, Icon: FaFacebookF },
  { name: "YouTube", href: youtube, Icon: FaYoutube },
  { name: "LinkedIn", href: linkedin, Icon: FaLinkedinIn },
  { name: "WhatsApp", href: `https://wa.me/${phone}`, Icon: FaWhatsapp },
];

const isNavActive = (pathname, itemPath) => {
  if (itemPath === "/") return pathname === "/";
  return pathname.startsWith(itemPath);
};

const MainNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (isLandingRoute(pathname)) return null;

  return (
    <>
      {/* Top Info Bar - normal flow, so it scrolls away with the page. It is a
          sibling of the sticky nav rather than its child: a sticky element is
          confined to its parent's box, so nesting both inside one wrapper
          would stop the nav sticking as soon as that wrapper scrolled past. */}
      <div className="hidden lg:block bg-primary-gray2 text-white py-1 px-4">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <a
              href="tel:+917895432160"
              className="flex items-center hover:text-[#D1C8C1]"
            >
              <Phone className="w-4 h-4 mr-1" />
              <span>+{phone}</span>
            </a>
            <a
              href={`mailto:${gmail}`}
              aria-label="send us a message on this email"
              className="hover:text-[#D1C8C1]"
            >
              {gmail}
            </a>
          </div>
          <div className="flex items-center space-x-1">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="inline-flex items-center justify-center w-9 h-9 text-[#E0D1BC] hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar - stays visible while scrolling */}
      <header className="sticky top-0 z-50 w-full bg-primary-gray shadow-lg">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full py-3 flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-20">
            <Image
              src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-tree-logo-transparent-512.png"
              width={40}
              height={40}
              alt="Madhuban Eco Retreat Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col justify-center">
              <div className="font-primary tracking-wide text-base font-bold text-[rgb(110,97,70)] leading-tight whitespace-nowrap">
                Madhuban Eco Retreat
              </div>
              <p className="font-primary tracking-wider text-xs text-[rgb(110,97,70)] leading-tight whitespace-nowrap">
                Ratapani Tiger Reserve, Bhopal
              </p>
            </div>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="xl:hidden z-20 inline-flex items-center justify-center w-11 h-11 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[rgb(110,97,70)]" />
            ) : (
              <Menu className="w-6 h-6 text-[rgb(110,97,70)]" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex xl:justify-center xl:flex-1 xl:mx-4 items-center font-inter">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.path}
                  className={`
                              block px-4 py-2 text-sm font-medium
                              font-primary text-[rgb(120,100,60)]
                              relative tracking-wide cursor-pointer whitespace-nowrap
                              after:content-[''] after:absolute after:w-[calc(100%-2rem)]  ${
                                isNavActive(pathname, item.path)
                                  ? "after:scale-x-100"
                                  : "after:scale-x-0"
                              } after:h-[2px] after:bottom-0 after:left-4
                              after:bg-[rgb(120,100,60)] after:origin-bottom-right after:transition-transform after:duration-300
                             hover:after:scale-x-100
                             hover:after:origin-bottom-left`}
                >
                  {item.name}
                </Link>
              </div>
            ))}

            {/* Explore dropdown - holds everything trimmed from the top level.
              Opens on hover and on keyboard focus, so it stays reachable
              without a pointer. */}
            <div className="relative group">
              <button
                type="button"
                aria-haspopup="true"
                className={`
                          inline-flex items-center gap-1 px-4 py-2 text-sm font-medium
                          font-primary text-[rgb(120,100,60)]
                          relative tracking-wide cursor-pointer whitespace-nowrap
                          after:content-[''] after:absolute after:w-[calc(100%-2rem)] ${
                            exploreLinks.some((l) =>
                              isNavActive(pathname, l.path),
                            )
                              ? "after:scale-x-100"
                              : "after:scale-x-0"
                          } after:h-[2px] after:bottom-0 after:left-4
                          after:bg-[rgb(120,100,60)] after:origin-bottom-right after:transition-transform after:duration-300
                         hover:after:scale-x-100
                         hover:after:origin-bottom-left`}
              >
                Explore
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-200">
                <ul className="bg-white rounded-2xl shadow-lg py-2 w-56">
                  {exploreLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.path}
                        className="block px-4 py-2 text-sm font-medium font-primary text-[rgb(110,97,70)] hover:bg-[rgb(110,97,70)]/10 tracking-wide"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          {/* Book Now Button - Desktop */}
          <Link
            href="/stay-in-ratapani-tiger-reserve"
            className="hidden xl:inline-flex items-center justify-center rounded-full px-6 py-2.5 font-primary text-sm font-medium text-[#D1C8C1] bg-[rgb(110,97,70)] hover:bg-[rgb(132,116,85)] transition-colors whitespace-nowrap"
          >
            Book Now
          </Link>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out min-h-screen pt-20 px-6 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 text-[rgb(110,97,70)] hover:text-[rgb(110,97,70)]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col space-y-4">
              <div className="border-l-3 border-l-[rgb(110,97,70)] ">
                {mobileNavigation.map((item) => {
                  return (
                    <div key={item.name}>
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block  text-lg px-4 py-2  p-text border-b-1 border-b-gray-200 ml-4 ${
                          pathname === item.path
                            ? "text-white bg-primary-gray2 rounded-lg"
                            : "text-gray-800 hover:text-[rgb(110,97,70)]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Book Now Button - Mobile */}
              <Link
                href="/stay-in-ratapani-tiger-reserve"
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full py-3 text-center rounded-full font-semibold  text-[#D1C8C1] bg-[rgb(110,97,70)] hover:bg-[rgb(132,116,85)] transition"
              >
                Book Now
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
