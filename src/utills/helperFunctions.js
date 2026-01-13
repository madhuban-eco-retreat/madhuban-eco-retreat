export const generateMataDataForSEO = ({
  title = "",
  description = "",
  keywords = [],
  canonicalEndpoint = "/",
  ogImages = [],
  robots = {},
}) => {
  const baseUrl = "https://www.madhubanecoretreat.com";

  const generateOGImage = (urls = []) => {
    if (!urls || !urls.length) return [];
    return urls.map((url) => {
      return { url };
    });
  };

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}${canonicalEndpoint}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}${canonicalEndpoint}`,
      images: generateOGImage(ogImages),
    },
    robots: robots,
  };
};
