export const dynamic = "force-static";
import { buildMetadata } from "@/lib/seo";
import Gallery from "@/components/gallery/Gallery";
import SEO from "@/components/seo/Seo";

const GallerySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Madhuban Eco Retreat Gallery",
  url: "https://www.madhubanecoretreat.com/gallery",
  description:
    "Explore the eco gallery of Madhuban Eco Retreat, showcasing nature, tribal culture, forest views, heritage sites and scenic experiences from Ratapani.",
  mainEntity: {
    "@type": "ImageGallery",
    name: "Eco Gallery",
    image: [
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal.jpg",
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal2.jpg",
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal3.jpg",
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal4.jpg",
    ],
  },
};

const GalleryPage = () => {
  return (
    <>
      <SEO schemas={[GallerySchema]} />
      <Gallery />
    </>
  );
};

export default GalleryPage;

export const metadata = buildMetadata({
  title: "Madhuban Eco Gallery | Nature & Retreat Photos",
  description:
    "Explore the eco gallery of Madhuban Eco Retreat-forest views, tribal culture, Bhimbetka, Saru Maru, Ginnorgarh Fort, and nature moments in Ratapani.",
  path: "/gallery",
  ogImage: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-og-social-1200x630.jpg",
  keywords: [
    "madhuban eco retreat gallery",
    "ratapani nature gallery",
    "bhimbetka photos",
    "tribal culture madhya pradesh",
    "eco retreat images",
    "ratapani forest images",
  ],
});
