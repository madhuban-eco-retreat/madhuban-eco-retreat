import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import RatapaniSafariPage, { SCHEMAS } from "@/components/safari/RatapaniSafariPage";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Ratapani Tiger Safari: Gates, Timings & Stay Near Bhopal",
  description:
    "Plan a Ratapani tiger safari near Bhopal: safari gates, timings, best time to visit, wildlife, Bhimbetka and where to stay on the edge of the reserve.",
  path: "/ratapani-tiger-safari",
  ogImage:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-home-page-banner-tiger-image(1).jpg",
  ogImageAlt: "Bengal tiger in Ratapani Tiger Reserve near Bhopal",
  keywords: [
    "ratapani tiger safari",
    "ratapani tiger reserve",
    "tiger safari near bhopal",
    "ratapani jungle safari",
    "ratapani safari booking",
    "ratapani tiger reserve safari timings",
    "best time to visit ratapani",
    "ratapani tiger reserve gates",
    "jhiri gate ratapani",
    "resort near ratapani tiger reserve",
  ],
});

export default function Page() {
  return (
    <>
      <SEO schemas={SCHEMAS} />
      <RatapaniSafariPage />
    </>
  );
}
