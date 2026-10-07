import ExperiencesPreview from "@/components/landing/ExperiencesPreview";

// Internal test copy of the redesigned Experiences page, for client review before
// it replaces the live /experiences page.
//
// noindex + nofollow keeps it out of search results. It is also not in the sitemap
// and nothing on the site links to it. Do NOT block it in robots.txt: a crawler that
// is not allowed to fetch the page can never see the noindex tag.
export const metadata = {
  title: "Experiences (Testing) | Madhuban Eco Retreat",
  robots: { index: false, follow: false },
};

export default function ExperiencesTestingPage() {
  return <ExperiencesPreview />;
}
