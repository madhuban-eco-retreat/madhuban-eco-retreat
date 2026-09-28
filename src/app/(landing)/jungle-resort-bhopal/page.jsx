import MadhubanLandingPage from "@/components/landing/MadhubanLandingPage";

import { lowestRegularRate, formatInr } from "@/lib/pricing/rate-card.mjs";
export const metadata = {
  title: "Madhuban Eco Retreat | Jungle Stay Near Bhopal",
  description:
    `Eco-luxury jungle resort 1 hour from Bhopal. Glamping, mud houses, pool villa. From ${formatInr(lowestRegularRate())} per night (meals included) + GST.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MadhubanLandingPage variant="jungle" />;
}
