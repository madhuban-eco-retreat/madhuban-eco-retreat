import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import RatapaniHikePage, { SCHEMAS } from "@/components/hike/RatapaniHikePage";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Ratapani Hike Experience | Hiking Near Bhopal, 12 km Trail",
  description:
    "Guided 12 km hike near Bhopal from the Saru Maru caves to Madhuban, through valley, streams and teak forest. Breakfast and lunch included, ₹2,000 per person.",
  path: "/experiences/ratapani-hike-experience",
  ogImage:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal.jpg",
  ogImageAlt: "Saru Maru caves, the start of the Ratapani hike near Bhopal",
  keywords: [
    "hiking near bhopal",
    "ratapani hike",
    "ratapani trekking",
    "saru maru to madhuban hike",
    "forest hike near bhopal",
    "day hike near bhopal",
    "ratapani hike experience",
    "hiking in bhopal",
    "trekking near bhopal",
    "ratapani trek",
    "saru maru caves hike",
    "ratapani nature trail",
  ],
});

export default function Page() {
  return (
    <>
      <SEO schemas={SCHEMAS} />
      <RatapaniHikePage />
    </>
  );
}
