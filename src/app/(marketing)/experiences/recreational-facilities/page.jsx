export const dynamic = "force-static";
import { buildMetadata } from "@/lib/seo";
import RecreationalFacilities from "@/components/experiences/recreational-facilities/RecreationalFacilities";
import SEO from "@/components/seo/Seo";

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Recreational Activities at Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/experiences/recreational-facilities",
  description:
    "Eco-friendly recreational activities near Bhopal at Madhuban Eco Retreat. Indoor games, cycling, hammocks, campfires and nature-inspired leisure in Ratapani.",
  image: [
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/activities/Adventure_Activities_3_At_madhuban-eco-retreat.jpg",
    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/activities/adventure-hurdles-madhuban-eco-retreat-bhopal.jpg",
  ],
  provider: {
    "@type": "Resort",
    name: "Madhuban Eco Retreat",
    telephone: "+91 9770 558 419",
    email: "madhubanresort@somaiya.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Village Bori, Salkanpur Road, Rehti, Sehore",
      addressLocality: "Bhopal",
      addressRegion: "Madhya Pradesh",
      postalCode: "466446",
      addressCountry: "IN",
    },
  },
  offers: {
    "@type": "Offer",
    name: "Recreational Activities",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://www.madhubanecoretreat.com/experiences/recreational-facilities",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What recreational activities are available at Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guests can enjoy cycling, indoor games, hammocks, nature seating areas, campfire zones, and peaceful reading corners.",
      },
    },
    {
      "@type": "Question",
      name: "Are the activities suitable for families?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all recreational activities are family-friendly, safe and suitable for children and seniors.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to pay extra for recreational activities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most activities are included in the stay. Some special sessions may require pre-booking.",
      },
    },
    {
      "@type": "Question",
      name: "Is this the best nature recreation option near Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Madhuban Eco Retreat offers one of the most eco-friendly and peaceful recreational experiences near Bhopal.",
      },
    },
    {
      "@type": "Question",
      name: "Is cycling included in the stay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, guests can use cycles to explore scenic forest paths and eco-trails.",
      },
    },
  ],
};

const RecreationalFacilitiesPage = () => {
  return (
    <>
      <SEO schemas={[pageSchema, faqSchema]} />
      <RecreationalFacilities />
    </>
  );
};

export default RecreationalFacilitiesPage;

export const metadata = buildMetadata({
  title: "Recreational Activities Ratapani | Near Bhopal",
  description:
    "Enjoy eco-friendly recreational activities near Bhopal. Cycling, indoor games, hammocks, campfires & nature-friendly relaxation at Madhuban Eco Retreat.",
  path: "/experiences/recreational-facilities",
  ogImage: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/activities/Adventure_Activities_3_At_madhuban-eco-retreat.jpg",
  keywords: [
    "recreational activities near bhopal",
    "ratapani recreation",
    "outdoor activities bhopal",
    "eco resort recreation mp",
    "family activities bhopal",
    "nature recreation ratapani",
  ],
});
