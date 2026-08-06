/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  // @react-pdf/renderer stays a real Node dependency rather than being bundled.
  // It is not currently broken without this — the build succeeds either way —
  // but it is the documented handling for a server-only package that resolves
  // fonts and internal assets at runtime, and it removes a class of bundler
  // regression from a path that issues tax documents.
  serverExternalPackages: ["@react-pdf/renderer"],

  // InvoicePDF reads the Noto woff files with fs.readFileSync at module scope.
  // The tracer does currently follow path.join(process.cwd(), "public", "fonts")
  // and pulls all four files into the function on its own — verified against the
  // route's .nft.json with this entry removed. It is pinned anyway because that
  // inference is a heuristic rather than a guarantee, and if it ever stops
  // holding the failure is an ENOENT at import that takes invoicing down.
  outputFileTracingIncludes: {
    "/api/admin/invoices/[id]/pdf": ["./public/fonts/**"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev",
      },
      {
        // Booking engine bucket. Room hero/gallery images stored in Supabase
        // point at this host, so next/image rejects them without it.
        protocol: "https",
        hostname: "pub-988c0a6b938742458b908a7a49295f61.r2.dev",
      },
    ],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // ── Room slug renames ──────────────────────────────────────────────
      // The rooms table was re-slugged (mud-villa → mud-house-standard,
      // mud-house-2 → mud-house-premium, pool-side-room → pool-side-villa).
      // These keep old indexed URLs and any shared booking links alive.
      {
        source: "/book/mud-villa",
        destination: "/book/mud-house-standard",
        permanent: true,
      },
      {
        source: "/book/mud-house-2",
        destination: "/book/mud-house-premium",
        permanent: true,
      },
      {
        source: "/book/pool-side-room",
        destination: "/book/pool-side-villa",
        permanent: true,
      },
      {
        source: "/stay-in-ratapani-tiger-reserve/mud-villa",
        destination: "/stay-in-ratapani-tiger-reserve/mud-house-standard",
        permanent: true,
      },
      {
        source: "/stay-in-ratapani-tiger-reserve/pool-side-room",
        destination: "/stay-in-ratapani-tiger-reserve/pool-side-villa",
        permanent: true,
      },

      {
        source: "/stay",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/stay/:slug",
        destination: "/stay-in-ratapani-tiger-reserve/:slug",
        permanent: true,
      },
      {
        source: "/about/:path*",
        destination: "/about-us",
        permanent: true,
      },
      { source: "/about/story", destination: "/about-us", permanent: true },
      {
        source: "/about/eco-philosophy",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/hotels/madhuban-resort",
        destination: "/",
        permanent: true,
      },

      {
        source: "/about/Vision-&-Mission",
        destination: "/about-us",
        permanent: true,
      },

      { source: "/rooms", destination: "/stay-in-ratapani-tiger-reserve", permanent: true },
      { source: "/tag/charter", destination: "/experiences", permanent: true },
      { source: "/pricing-tables", destination: "/booking", permanent: true },
      { source: "/home-5", destination: "/", permanent: true },
      { source: "/tag/golf", destination: "/experiences", permanent: true },

      {
        source: "/activities/gym-fitness",
        destination: "/experiences",
        permanent: true,
      },
      {
        source: "/activities/massage-spa",
        destination: "/experiences",
        permanent: true,
      },

      {
        source: "/portfolio/luxury-suite",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/category/yacht-charter",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/rooms/swiss-cottages",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },

      { source: "/tag/madhuban-main-menu", destination: "/", permanent: true },
      {
        source: "/madhuban-bamboo-cafe-8",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },

      {
        source: "/whatsapp-image-2021-03-15-at-1-46-05-am-21",
        destination: "/booking",
        permanent: true,
      },

      { source: "/hotels", destination: "/about-us", permanent: true },
      { source: "/dsc_8879", destination: "/", permanent: true },
      { source: "/tag/island", destination: "/", permanent: true },
      { source: "/icon-boxes", destination: "/", permanent: true },

      { source: "/hotel-account", destination: "/booking", permanent: true },
      { source: "/help/contact", destination: "/contact-us", permanent: true },
      { source: "/hotel-search", destination: "/contact-us", permanent: true },

      { source: "/tabs-spa", destination: "/stay-in-ratapani-tiger-reserve", permanent: true },
      { source: "/siver-logo", destination: "/gallery", permanent: true },
      {
        source: "/hotel/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/rooms/camping-tents",
        destination: "/stay-in-ratapani-tiger-reserve/camping-tent",
        permanent: true,
      },
      {
        source: "/madhuban-camp-site",
        destination: "/stay-in-ratapani-tiger-reserve/camping-tent",
        permanent: true,
      },

      {
        // Retargeted to the new slug so this does not 301 into another 301.
        source: "/rooms/mud-house",
        destination: "/stay-in-ratapani-tiger-reserve/mud-house-standard",
        permanent: true,
      },

      {
        source: "/skydiving-in-dubai",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/portfolio/miami-beach",
        destination: "/nearby-attractions",
        permanent: true,
      },

      {
        source: "/about-section5-2",
        destination: "/about-us",
        permanent: true,
      },

      {
        source: "/gallery-restaurant-1",
        destination: "/gallery",
        permanent: true,
      },
      { source: "/forest/home-5", destination: "/gallery", permanent: true },

      {
        source: "/thailand-exclusive-holidays",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/tag/australia",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/safari/home-5",
        destination: "/experiences",
        permanent: true,
      },

      {
        source: "/gallery-restaurant-5",
        destination: "/gallery",
        permanent: true,
      },

      {
        source: "/hotel-term-condition",
        destination: "/terms-and-condition",
        permanent: true,
      },

      { source: "/quisque-velit-nisi", destination: "/", permanent: true },

      {
        source: "/maldives-resort-and-spa",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },

      { source: "/hotel-includes/wi-fi", destination: "/", permanent: true },

      {
        source: "/our-services/ipsum-dolor-sit",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/our-services/lorem-ipsum-dolor-sit-amet",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/our-services/etiam-sit-amet-lectus-quis-est-congue-mollis",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/madhuban-bamboo-cafe-8",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/pexels-pok-rie-144681",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/madhuban-camp-site-4",
        destination: "/stay-in-ratapani-tiger-reserve",
        permanent: true,
      },
      {
        source: "/cropped-madhuban-logo-e1726477323214-png",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/cropped-madhuban-logo-e1726477323214-1-png",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/cropped-cropped-madhuban-logo-e1726477323214-1-png",
        destination: "/gallery",
        permanent: true,
      },

      {
        source: "/faqs",
        destination: "/",
        permanent: true,
      },
      {
        source: "/our-services/phasellus-congue-lacus-eget",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/image/:path*",
        destination: "https://res.cloudinary.com/dx3aj7a40/image/upload/:path*",
      },
      {
        source: "/video/:path*",
        destination: "https://res.cloudinary.com/dx3aj7a40/video/upload/:path*",
      },
    ];
  },
  async headers() {
    return [
      // Static assets - 1 year
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Images - 1 year
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Event pages - 24 hours
      {
        source: "/events/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Gallery - 1 week
      {
        source: "/gallery/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      // Homepage - 12 hours
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=43200, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
