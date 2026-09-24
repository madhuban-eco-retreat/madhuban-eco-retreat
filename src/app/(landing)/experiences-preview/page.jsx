import ExperiencesPreview from "@/components/landing/ExperiencesPreview";

// Internal-only preview of the redesigned /experiences page, for client
// review before this replaces the live page. noindex/nofollow so it never
// shows up in search while it's just a design draft on a real client-facing
// domain — same pattern as the /escape-bhopal ad landing page.
export const metadata = {
  title: "Experiences Preview | Madhuban Eco Retreat",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ExperiencesPreview />;
}
