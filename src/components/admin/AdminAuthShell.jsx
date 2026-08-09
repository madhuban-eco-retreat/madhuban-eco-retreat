import Image from "next/image";
import Link from "next/link";

/**
 * Split-screen frame shared by every unauthenticated admin screen.
 *
 * Login, forgot-password and reset-password were going to be three copies of
 * the same panel, and the last two would have drifted from the first the moment
 * anyone touched it. The hero, the logo and the estate marks live here once.
 *
 * The image and the logo are the same assets the public site serves — the hero
 * is the first homepage banner slide, the mark is the one in the site header —
 * so the panel cannot fall out of step with the brand by being maintained
 * separately.
 */
const HERO_IMAGE =
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-forest-view-hero-section-1.avif";
const SITE_LOGO =
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png";

export function AdminAuthShell({ title, subtitle, children, footer }) {
    return (<div className="flex min-h-screen">
      {/* Left — estate hero panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10">
        <Image src={HERO_IMAGE} alt="Aerial view of Madhuban Eco Retreat in the forest at Ratapani Tiger Reserve" fill priority sizes="50vw" className="object-cover"/>
        {/* Overlay — the photo is bright, and the marks below sit on top of it */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65"/>

        {/* Top-left logo. Backed by a light chip because the mark is a dark
            brown that disappears against foliage; the asset itself is the
            site's, unmodified. */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-xl bg-[var(--color-ivory)]/90 p-2 shadow-sm">
            <Image src={SITE_LOGO} width={120} height={120} alt="Madhuban Eco Retreat" className="h-11 w-11 object-contain"/>
          </span>
          <div>
            <p className="text-[var(--color-ivory)] font-body font-semibold tracking-widest text-xs uppercase">
              Madhuban
            </p>
            <p className="text-[var(--color-ivory)]/70 font-body text-xs tracking-widest uppercase">
              Eco Retreat Admin
            </p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center">
          <h1 className="font-display text-5xl text-[var(--color-ivory)] leading-tight">
            Welcome to Madhuban Eco Retreat
          </h1>
          <p className="mt-3 font-body text-lg tracking-wide text-[var(--color-ivory)]/85">
            Management Portal
          </p>
          <p className="mt-4 text-[var(--color-ivory)]/70 font-body text-base max-w-sm mx-auto leading-relaxed">
            Manage bookings, rooms and guest experiences with care and
            intention.
          </p>
        </div>

        {/* Bottom estate marks */}
        <div className="relative z-10 flex justify-between items-end">
          <p className="text-[var(--color-ivory)]/60 font-body text-xs tracking-widest uppercase">
            Est. 2023
          </p>
          <p className="text-[var(--color-ivory)]/60 font-body text-xs tracking-widest uppercase">
            Coordinates: 22.88°&nbsp;N, 77.52°&nbsp;E
          </p>
        </div>
      </div>

      {/* Right — form column */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[var(--color-cream)] px-6 py-12">
        <div className="w-full max-w-md">
          {/* The logo repeats here for the mobile layout, where the hero panel
              is hidden entirely and the page would otherwise carry no brand. */}
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src={SITE_LOGO} width={120} height={120} alt="Madhuban Eco Retreat" className="h-12 w-12 object-contain"/>
            <span className="font-body text-sm font-semibold tracking-wide text-[var(--color-earth-brown)]">
              Madhuban Eco Retreat
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="font-display text-4xl text-[var(--color-earth-brown)] mb-2">
              {title}
            </h2>
            {subtitle && (<p className="font-body text-[var(--color-charcoal)]/70 text-sm">
                {subtitle}
              </p>)}
          </div>

          {children}

          {footer && (<div className="mt-8 text-center font-body text-xs text-[var(--color-muted)]">
              {footer}
            </div>)}
        </div>
      </div>
    </div>);
}
