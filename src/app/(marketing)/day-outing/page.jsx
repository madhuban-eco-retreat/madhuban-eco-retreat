import { buildMetadata } from "@/lib/seo";
import OneDayPackage from "@/components/one-day-package/OneDayPackage";
import SEO from "@/components/seo/Seo";
import React from "react";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Madhuban suitable for a one-day picnic near Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Madhuban Eco Retreat is ideal for one-day outings with food, pool access, and nature activities included.",
      },
    },
    {
      "@type": "Question",
      name: "Does the day outing package include pool access?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the package includes access to our eco-friendly swimming pool.",
      },
    },
    {
      "@type": "Question",
      name: "Is this a family-friendly day outing resort?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The environment is safe, peaceful, and suitable for families and children.",
      },
    },
    {
      "@type": "Question",
      name: "Do you serve non-vegetarian food or alcohol?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We serve only pure vegetarian food and maintain an alcohol-free environment.",
      },
    },
    {
      "@type": "Question",
      name: "Is advance booking required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Advance booking is recommended, especially for weekends and group visits.",
      },
    },
  ],
};

const OneDayPackagePage = () => {
  return (
    <>
      <SEO schemas={[faqSchema]} />
      <OneDayPackage />
    </>
  );
};

export default OneDayPackagePage;

export const metadata = buildMetadata({
  title: "Resort Near Bhopal for Day Outing | Pool & Lunch Package",
  description:
    "Book a resort near Bhopal for a day outing — pool access, breakfast, lunch, nature walks and games, all in one day. From ₹1,500 per person.",
  path: "/day-outing",
  keywords: [
    "resorts near bhopal for day outing",
    "one day picnic near bhopal",
    "day visit resort near bhopal",
    "pool day package near bhopal",
    "nature resort day outing",
  ],
});
