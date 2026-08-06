import Link from "next/link";
import Image from "next/image";
import { ALL_ROOMS_URL } from "@/lib/rooms/booking-links";
export default function BookingLayout({ children, }) {
    // booking-typography maps this subtree's font utilities onto the marketing
    // site's faces — see the matching block in styles/globals.css.
    return (<div className="booking-typography min-h-screen bg-cream">
      {/* Minimal booking header */}
      <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Same asset the site header uses. This previously pointed at
              NEXT_PUBLIC_R2_BASE + /logo/madhuban-logo.webp, which is a
              different bucket and a filename that does not exist there — the
              request 404d and the funnel showed a broken image. Hardcoded to
              match Header.jsx rather than rebuilt from an env var, so the two
              cannot drift apart again. */}
          <Link href="/" aria-label="Madhuban Eco Retreat — home" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
            <Image src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png" alt="Madhuban Eco Retreat" width={120} height={120} className="h-10 w-10 filter brightness-75" priority/>
            <span className="font-primary text-sm font-bold leading-tight tracking-wide text-earth-brown sm:text-base">
              Madhuban Eco Retreat
            </span>
          </Link>
          <Link href={ALL_ROOMS_URL} className="font-body text-sm text-earth-brown underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
            ← Back to Rooms
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center font-body text-xs text-muted-foreground">
        <p>
          Need help?{" "}
          <a href="tel:+919770558419" className="text-earth-brown underline-offset-4 hover:underline">
            +91 9770558419
          </a>{" "}
          ·{" "}
          <a href={`https://wa.me/919770558419?text=${encodeURIComponent("Hi, I need help with my booking at Madhuban Eco Retreat.")}`} target="_blank" rel="noopener noreferrer" className="text-earth-brown underline-offset-4 hover:underline">
            WhatsApp
          </a>
        </p>
      </footer>
    </div>);
}
