import ThankYouClient from "./thank-you-client";

// Server component so the route can own its metadata: the interactive markup
// moved to thank-you-client.jsx because a "use client" module cannot export
// `metadata`. Without this the page inherited the root layout defaults.
export const metadata = {
  title: "Thank You | Madhuban Eco Retreat",
  description:
    "Thank you for contacting Madhuban Eco Retreat. We will get back to you shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYouClient />;
}
