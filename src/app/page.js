export const dynamic = "force-static";
import SEO from "@/components/seo/Seo";
import Home from "./home/home";

const HomeSchema = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Madhuban Eco Retreat",
  alternateName : "Madhuban Eco Retreat Bhopal",
  url: "https://www.madhubanecoretreat.com/",
  description:
    "Madhuban Eco Retreat is an eco-luxury resort near Ratapani Wildlife Sanctuary in Bhopal, offering sustainable stays, nature walks, bird watching, and farm-to-table dining.",
  image: "https://www.madhubanecoretreat.com/assets/images/hero.jpg",
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
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Eco-Friendly Stays",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Farm-to-Table Dining",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Forest Walks",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Bird Watching",
      value: "true",
    },
  ],
  sameAs: [
    "https://www.instagram.com/",
    "https://www.facebook.com/",
    "https://wa.me/919770558419",
  ],
};

export default function main() {
  return (
    <>
      <SEO schemas={[HomeSchema]} />
      <Home />
    </>
  );
}

export const metadata = {
  title: "Madhuban Eco Retreat | Eco-Luxury Resort Near Ratapani, Bhopal",

  description:
    "Experience eco-luxury at Madhuban Eco Retreat in Ratapani near Bhopal. Forest stays, nature trails, birdwatching, farm-to-table dining & sustainable travel.",

  keywords: [
    "eco retreat bhopal",
    "ratapani eco resort",
    "nature resort near bhopal",
    "forest stay madhya pradesh",
    "eco luxury resort mp",
    "sustainable tourism mp",
    "ratapani tiger reserve stay",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com",
  },

  robots: {
    index: true,
    follow: true,
  },
};
