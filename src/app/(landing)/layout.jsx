import Script from "next/script";

const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || "";
const adsAccountId = conversionId.split("/")[0];

export default function LandingLayout({ children }) {
  return (
    <>
      {adsAccountId ? (
        <>
          <Script
            id="google-ads-gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${adsAccountId}`}
          />
          <Script id="google-ads-gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${adsAccountId}');`}
          </Script>
        </>
      ) : null}
      {children}
    </>
  );
}
