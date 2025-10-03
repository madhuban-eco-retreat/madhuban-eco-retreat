import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  BedDouble,
  Users,
  Leaf,
  // Wifi,
  // Sun,
  MountainSnow,
  ChevronLeft,
  CalendarDays,
  Star,
  Check,
} from "lucide-react";

const accommodationsData = [
  {
    id: 4,
    name: "Camping Tent",
    slug: "camping-tent",
    image: "/images/accommodations/camping-tent.jpeg",
    altText: "A beautiful treehouse offering panoramic views of the forest",
    shortDescription:
      "Madhuban’s Campsite is a MP Tourism certified campsite. We are located into wilds and gives u perfect jungle Camping experience under the perfect stary nights!!",
    longDescription:
      "Reconnect with nature in our cozy Camping Tents at Madhuban ECO Retreat ideal for adventure seekers craving a simple, off-grid experience with starry skies and serene forest surroundings.  ",
    galleryImages: [
      "/images/accommodations/comping-tent1.jpg",
      "/images/accommodations/comping-tent4.jpg",
      "/images/accommodations/comping-tent5.jpeg",
    ],
    capacity: "Sleeps 2",
    pricePerNight: "1,500",
    rating: 4.5,
  },
];

const AccommodationDetail = () => {
  const { slug } = useParams();
  const accommodation = accommodationsData.find((acc) => acc.slug === slug);

  if (!accommodation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-center px-4">
        <HelmetProvider>
          <Helmet>
            <title>Accommodation Not Found | Madhuban Eco Retreat</title>
          </Helmet>
        </HelmetProvider>
        <MountainSnow size={64} className="text-green-700 mb-4" />
        <h1 className="text-4xl font-inter font-medium text-green-800 mb-2">
          Oops! Accommodation Not Found
        </h1>
        <p className="font-openSans text-lg text-gray-600 mb-6">
          We couldn't find the accommodation you were looking for.
        </p>
        <Link
          to="/stay"
          className="mt-[30px] font-sitka-banner inline-flex items-center bg-green-700 text-gray-500 font-medium py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back to All Accommodations
        </Link>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${accommodation.name} | Madhuban Eco Retreat`}</title>
        <meta name="description" content={accommodation.shortDescription} />
      </Helmet>

      <div className="bg-stone-50 min-h-screen py-12 pt-24 md:pt-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              to="/stay"
              className="inline-flex items-center font-semibold text-[rgb(110,97,70)] tracking-widest mt-8 transition-colors duration-300 group"
            >
              <ChevronLeft
                size={20}
                className="font-sitka-banner  font-medium mr-1 group-hover:-translate-x-1 transition-transform duration-300"
              />
              Back to All Accommodations
            </Link>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex md:items-stretch">
              <div className="md:w-1/2 h-auto">
                {accommodation.image.toLowerCase().endsWith(".mp4") ? (
                  <video
                    style={{ width: "100%", height: "100vh" }}
                    src={accommodation.image}
                    controls
                    // autoPlay
                    // loop
                    className="w-full object-cover md:min-h-[80vh]"
                    onError={(e) => {
                      e.target.onerror = null;
                      console.error(
                        "Error loading video:",
                        accommodation.image
                      );
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={accommodation.image}
                    alt={accommodation.altText}
                    className="w-full h-full object-cover md:min-h-[400px]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                )}
              </div>

              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-auto md:min-h-[400px]">
                <div>
                  <h1 className="text-4xl md:text-4xl font-sitka-banner font-semibold text-[rgb(110,97,70)] mb-3">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(accommodation.rating)
                            ? "text-yellow-500 fill-current"
                            : i < accommodation.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">
                      ({accommodation.rating})
                    </span>
                  </div>

                  <p className="text-[rgb(110,97,70)] mb-6 leading-relaxed text-justify font-arial-narrow tracking-wider text-lg">
                    {accommodation.longDescription}
                  </p>
                  <div className="mb-6">
                    <h3 className="text-lg font-sitka-banner font-semibold text-[rgb(110,97,70)] tracking-widest mb-2">
                      Amenities:
                    </h3>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {accommodation.amenities.map((amenity, index) => (
                        <li
                          key={index}
                          className="flex items-center font-sitka-banner font-medium text-[rgb(110,97,70)] tracking-wider"
                        >
                          <Check
                            size={16}
                            className="text-[rgb(110,97,70)] mr-2"
                          />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-[rgb(110,97,70)] mb-2">
                      {accommodation.pricePerNight}{" "}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-[rgb(110,97,70)] mb-2">
                      {accommodation.pricePerNight1}{" "}
                      <span className="text-sm font-arial-narrow font-base tracking-wider font-bold text-[rgb(110,97,70)]"></span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-[rgb(110,97,70)] mb-2">
                      Extra Bedding - {accommodation.extraBedding}{" "}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-md text-[rgb(110,97,70)] mb-2">
                      <strong className="font-sitka-banner tracking-widest font-semibold">
                        Capacity:
                      </strong>{" "}
                      {accommodation.capacity}
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="font-inter w-full flex items-center justify-center bg-[rgb(110,97,70)] text-white font-medium py-3 px-6 rounded-md hover:bg-[rgb(123,108,80)] text-lg"
                  >
                    <CalendarDays size={20} className="mr-2" />
                    Book Your Stay
                  </Link>
                </div>
              </div>
            </div>

            {accommodation.galleryImages &&
              accommodation.galleryImages.length > 0 && (
                <div className="p-6 md:p-8 border-t border-gray-200">
                  <h2 className="text-3xl font-sitka-banner font-semibold text-[rgb(110,97,70)] mb-4">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {accommodation.galleryImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${accommodation.name} gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default AccommodationDetail;
