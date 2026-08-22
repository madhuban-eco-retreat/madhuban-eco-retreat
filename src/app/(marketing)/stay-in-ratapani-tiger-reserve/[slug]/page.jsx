export const dynamic = "force-static";
import { notFound } from "next/navigation";
import SEO from "@/components/seo/Seo";
import AccommodationDetail from "@/components/stay/AccommodationsDetails";
import { accommodationsData } from "@/components/stay/Stay.functions";
import { buildMetadata } from "@/lib/seo";

const R2 = "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev";

// Still images for social cards. The accommodation `image` field is a video for
// several rooms, which Open Graph cannot render, so share images are pinned here.
const OG_IMAGES = {
  "safari-tent": `${R2}/stay/safari-tent/stay-at-safari-tent-madhuban-eco-retreat.avif`,
  "mud-house-standard": `${R2}/stay/mud-house/mud-house-image-madhuban-eco-retreat-bhopal.avif`,
  "pool-side-villa": `${R2}/stay/pool/pool-side-vila-madhuban-eco-retreat-bhopal.avif`,
  "glamping-tents": `${R2}/stay/glamping-tent/glamping-tent-madhuban-eco-retreat-bhopal.avif`,
  "camping-tent": `${R2}/stay/camping-tent/camping-tent-new-madhuban-eco-retreat-bhopal.avif`,
};

const getAccommodation = (slug) => {
  return accommodationsData.find((acc) => acc.slug === slug);
};

export function generateStaticParams() {
  return accommodationsData.map((acc) => ({ slug: acc.slug }));
}

const AccommodationDetailPage = async ({ params }) => {
  const { slug } = await params;
  const accommodation = getAccommodation(slug);
  // An unknown slug used to fall through and throw on `accommodation.schemas`,
  // which surfaced to visitors and crawlers as a 500. A slug that does not
  // exist is a 404.
  if (!accommodation) notFound();
  return (
    <>
      <SEO schemas={accommodation.schemas} />
      <AccommodationDetail accommodationDetail={accommodation} />
    </>
  );
};

export default AccommodationDetailPage;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const accommodation = getAccommodation(slug);
  if (!accommodation) return {};

  const meta = accommodation.metadata ?? {};
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: `/stay-in-ratapani-tiger-reserve/${slug}`,
    keywords: meta.keywords,
    ogImage: OG_IMAGES[slug],
    ogImageAlt: accommodation.altText,
  });
}
