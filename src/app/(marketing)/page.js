export const dynamic = "force-static";
import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import Home from "./home/home";

const HomeSchema = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Madhuban Eco Retreat",
  alternateName: "Madhuban Eco Retreat Bhopal",
  url: "https://www.madhubanecoretreat.com/",
  description:
    "Madhuban Eco Retreat is an eco-luxury resort near Ratapani Wildlife Sanctuary in Bhopal, offering sustainable stays, nature walks, bird watching, and farm-to-table dining.",
  image: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/madhuban-eco-retreat-forest-view-hero-section-1.avif",
  telephone: "+91 9770 558 419",
  email: "madhubanresort@somaiya.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    postalCode: "466446",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.88,
    longitude: 77.52,
  },
  priceRange: "₹7,500 - ₹12,000 per night",
  checkinTime: "14:00",
  checkoutTime: "11:30",
  numberOfRooms: 6,
  amenityFeature: [
    "Eco-Friendly Stays",
    "Farm-to-Table Dining",
    "Forest Walks",
    "Bird Watching",
    "Wildlife Safari",
    "Nature Walks",
    "Birdwatching",
    "Yoga",
    "Pottery",
    "Swimming Pool",
    "Organic Food",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: "true",
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
    bestRating: "5",
  },
  sameAs: [
    "https://www.instagram.com/madhubanecoretreat",
    "https://www.facebook.com/madhubanecoretreat",
    "https://wa.me/919770558419",
  ],
};

// Answers the questions people actually put to search engines and AI
// assistants. Kept as a separate FAQPage node rather than nested inside the
// Resort so each can be picked up independently.
const HomeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far is Madhuban Eco Retreat from Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Madhuban Eco Retreat is located 60 km from Bhopal via NH-46, approximately 1.5 hours drive.",
      },
    },
    {
      "@type": "Question",
      name: "What is the price of staying at Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Room rates start from ₹7,500 per night for Glamping Tent to ₹12,000 per night for Safari Tent and Pool Side Villa. GST extra as applicable.",
      },
    },
    {
      "@type": "Question",
      name: "What rooms are available at Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Madhuban offers Safari Tents, Glamping Tents, Mud House Standard, Mud House Premium, Pool Side Villa, and Camping Tents.",
      },
    },
    {
      "@type": "Question",
      name: "What activities are available at Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Activities include Ratapani wildlife safari, guided nature walks, birdwatching, yoga, meditation, pottery, bush dining, and forest treks.",
      },
    },
  ],
};

export default function main() {
  return (
    <>
      <SEO schemas={[HomeSchema, HomeFaqSchema]} />
      <Home />
    </>
  );
}

export const metadata = buildMetadata({
  title: "Nature Resort Near Ratapani Tiger Reserve | Madhuban Eco Retreat",
  description:
    "Madhuban Eco Retreat — jungle resort near Ratapani Tiger Reserve, Bhopal. Safari tents, mud houses, glamping & poolside villas. Book direct for best rates.",
  path: "",
  ogImage:
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-og-social-1200x630.jpg",
  keywords: [
    "eco resort near Bhopal",
    "forest resort Ratapani",
    "nature resort Madhya Pradesh",
    "Ratapani eco lodge",
    "best weekend getaway near Bhopal",
  ],
});
