export const generateMataDataForSEO = ({
  title = "",
  description = "",
  keywords = [],
  canonicalEndpoint = "/",
  ogImages = [],
  robots = {},
}) => {
  const baseUrl = "https://www.madhubanecoretreat.com";

  const generateOGImage = (urls = []) => {
    if (!urls || !urls.length) return [];
    return urls.map((url) => {
      return { url };
    });
  };

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}${canonicalEndpoint}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}${canonicalEndpoint}`,
      images: generateOGImage(ogImages),
    },
    robots: robots,
  };
};

// Normalise a raw phone input to E.164 for Google Ads Enhanced Conversions.
// Returns e.g. "+919876543210" for a valid Indian mobile, or null if the input
// isn't one. Return value is passed UNHASHED to gtag, which applies SHA-256
// itself before transmission — do not hash here.
export function normalisePhoneE164(raw) {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "");

  // Bare 10-digit Indian mobile (starts 6-9).
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;

  // Already carries the 91 country code (e.g. user typed +91 / 91 prefix).
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;

  return null;
}

export function getAltFromUrl(url) {
  if (!url) return "";

  const fileName = url.split("/").pop();
  let name = fileName.replace(/\.[^/.]+$/, "");

  // remove last random cloudinary hash (like _lbzlrg)
  name = name.replace(/_[a-z0-9]+$/i, "");

  return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}
