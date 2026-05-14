import MadhubanLandingPage from "@/components/landing/MadhubanLandingPage";

export const metadata = {
  title: "Madhuban Eco Retreat | Jungle Stay Near Bhopal",
  description:
    "Eco-luxury jungle resort 1 hour from Bhopal. Glamping, mud houses, pool villa. From ₹7,500 per night.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MadhubanLandingPage variant="jungle" />;
}
