import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import RatapaniJungleSafariPage, { SCHEMAS } from "@/components/jungleSafari/RatapaniJungleSafariPage";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Ratapani Jungle Safari Packages: 1, 2 & 3-Day Tiger Safari",
  description:
    "Ratapani jungle safari packages: day safari with lunch at ₹3,500, 2 days / 1 night and 3 days / 2 nights tiger safari stays. Permit and gypsy included.",
  path: "/experiences/ratapani-jungle-safari",
  ogImage:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/New%20Experiences%20page/Hero%20imgs/experiences%20page%20hero%20img%201.png",
  ogImageAlt: "Bengal tiger in Ratapani Tiger Reserve, Madhya Pradesh",
  keywords: [
    "ratapani tiger safari",
    "ratapani jungle safari",
    "ratapani jungle safari packages",
    "ratapani tiger safari booking",
    "ratapani tiger reserve safari package",
    "ratapani day safari",
    "2 day tiger safari ratapani",
    "3 day tiger safari package ratapani",
    "tiger safari package madhya pradesh",
  ],
});

export default function Page() {
  return (
    <>
      <SEO schemas={SCHEMAS} />
      <RatapaniJungleSafariPage />
    </>
  );
}
