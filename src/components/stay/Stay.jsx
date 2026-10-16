import "./Stay.css";
import WhyStayMadhuban from "./WhyStayMadhuban";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import StayBanner from "./StayBanner";
import Accommodations from "./Accommodations";
import DiscoverIdeal from "./DiscoverIdeal";
import TariffSection from "@/components/tariff/TariffSection";

const stayFaqs = [
  {
    question:
      "Which is the best eco-friendly resort near Bhopal for a weekend stay?",
    answer:
      "Madhuban Eco Retreat is one of the top-rated eco-stays near Bhopal, offering safari tents, mud houses, glamping tents, and poolside villas surrounded by Ratapani’s natural beauty.",
  },
  {
    question: "Do you offer safari tent stays near Bhopal?",
    answer:
      "Yes. Our Safari Tents near Ratapani give you a classic wilderness stay with modern comforts: a king bed, Wi-Fi, a vanity area, and an open-to-sky shower.",
  },
  {
    question: "Are mud houses available for booking in Ratapani?",
    answer:
      "Absolutely. Our traditional Gond-inspired Mud Houses offer authentic rural architecture with modern amenities and are among the best mud house stays near Bhopal.",
  },
  {
    question: "Do you have private poolside villas?",
    answer:
      "Yes. Our Pool Side Villas near Bhopal offer tranquil water views, sustainable architecture, and a peaceful ambiance ideal for families and couples.",
  },
  {
    question: "Is camping allowed inside the Ratapani Wildlife area?",
    answer:
      "Camping inside the protected sanctuary is not allowed. Our camping tents are set up in a secure camping area at Madhuban, on the edge of the forest, so you get the outdoor experience with staff support nearby.",
  },
  {
    question: "Are your stays suitable for families?",
    answer:
      "Yes. Pool Side Villas, Glamping Tents and Mud Houses all suit families. Safari Tents and Glamping Tents sleep 2, and the Pool Side Villa sleeps 4.",
  },
  {
    question: "What activities can guests enjoy during their stay?",
    answer:
      "Guests can enjoy forest walks, bird watching, nature trails, village experiences, stargazing, eco-farm visits, and wellness-centric retreats.",
  },
  {
    question: "How far is Madhuban Eco Retreat from Bhopal city?",
    answer:
      "Madhuban Eco Retreat is about an hour's drive from Bhopal, on the edge of Ratapani Tiger Reserve.",
  },
];

const Stay = () => {
  return (
    <div className="stay-page bg-cream">
      <StayBanner />
      <DiscoverIdeal />
      <Accommodations />
      <TariffSection />
      <WhyStayMadhuban />
      <CommonFaqs faqs={stayFaqs} />
    </div>
  );
};

export default Stay;
