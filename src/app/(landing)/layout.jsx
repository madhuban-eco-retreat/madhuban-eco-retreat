import Script from "next/script";

const PLACEHOLDER_RE = /^AW-X+$/i;
const VALID_RE = /^AW-\d{9,11}$/;

// Returns the Google Ads account ID only if it is a real, well-formed value.
// Anything missing, still on the AW-XXXXXXXXX placeholder, or otherwise malformed
// returns null so the gtag script is never rendered — the placeholder shipping to
// production is exactly the bug that wasted six months of ad spend.
function getValidAdsId() {
  const id = (process.env.NEXT_PUBLIC_GADS_ID || "").trim();

  if (!id || PLACEHOLDER_RE.test(id) || !VALID_RE.test(id)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[google-ads] NEXT_PUBLIC_GADS_ID is missing or invalid (${
          id ? `"${id}"` : "unset"
        }). Expected format AW-000000000. The gtag script will NOT be rendered ` +
          "and no conversions will fire."
      );
    }
    return null;
  }

  return id;
}

export default function LandingLayout({ children }) {
  const adsId = getValidAdsId();

  return (
    <>
      {adsId ? (
        <>
          <Script
            id="google-ads-gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
          />
          <Script id="google-ads-gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${adsId}', { allow_enhanced_conversions: true });`}
          </Script>
        </>
      ) : null}
      {children}
    </>
  );
}
