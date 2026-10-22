import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import RatapaniHikePage, { SCHEMAS } from "@/components/hike/RatapaniHikePage";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Ratapani Hike Experience: Hiking Near Bhopal, 12 km Forest Trail",
  description:
    "Guided 12 km Ratapani hike from the Saru Maru caves to Madhuban: valley, seasonal streams and teak forest. Breakfast and lunch included, ₹2,000 per person.",
  path: "/experiences/ratapani-hike-experience",
  ogImage:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/forest-walk/Ratapani%20Forest%20Walk%20With%20Madhuban%20Eco%20Retreat%20Team.avif",
  ogImageAlt: "Guided forest hike near Ratapani Tiger Reserve with Madhuban Eco Retreat",
  keywords: [
    "hiking near bhopal",
    "ratapani hike",
    "ratapani trekking",
    "saru maru to madhuban hike",
    "forest hike near bhopal",
    "day hike near bhopal",
    "ratapani hike experience",
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
