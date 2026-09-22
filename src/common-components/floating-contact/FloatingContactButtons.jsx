"use client";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

/**
 * Persistent Call + WhatsApp buttons, fixed to the right edge on every
 * marketing page. Deliberately NOT a popup/modal — just two small buttons
 * that sit quietly in the corner and are always available, replacing the
 * old auto-popping WhatsApp modal that was removed for firing on every page
 * load (see the note in (marketing)/layout.js).
 *
 * Same phone number used site-wide (header top bar, footer).
 */
export default function FloatingContactButtons() {
  return (
    <div className="fixed right-4 md:right-6 bottom-24 md:bottom-28 z-40 flex flex-col gap-3">
      <a
        href="tel:+919770558419"
        aria-label="Call Madhuban Eco Retreat"
        title="Call Us"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-earth-brown text-warm-beige shadow-lg hover:bg-[rgb(132,116,85)] hover:scale-105 transition-all duration-200"
      >
        <FaPhone size={20} />
      </a>
      <a
        href="https://wa.me/919770558419"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Madhuban Eco Retreat on WhatsApp"
        title="WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1da851] hover:scale-105 transition-all duration-200"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
}
