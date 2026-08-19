import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import {
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconLinkedIn,
  IconWhatsApp,
} from "@/components/icons/SocialIcons";
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

/** Non-sticky: scrolls out of view naturally, leaving only the main bar pinned. */
export function TopBar() {
  return (
    <div className="hidden lg:block bg-earth-brown text-ivory">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-9">
        <div className="flex items-center gap-6 text-sm">
          <Link
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center gap-1.5 hover:text-warm-beige transition-colors duration-200"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            <span>+91 97705 58419</span>
          </Link>
          <Link
            href={`mailto:${BUSINESS.email}`}
            className="flex items-center gap-1.5 hover:text-warm-beige transition-colors duration-200"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            <span>{BUSINESS.email}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-warm-beige transition-colors duration-200"
            >
              <Icon className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
