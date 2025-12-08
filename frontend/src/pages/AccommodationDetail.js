import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MountainSnow,
  ChevronLeft,
  CalendarDays,
  Star,
  Check,
} from "lucide-react";

const accommodationsData = [
  {
    id: 1,
    name: "Safari Tent",
    slug: "safari-tent",
    image: "/videos/safari-tent.mp4",
    altText: "Exterior view of a charming safari tent nestled in greenery",
    shortDescription:
      "Experience rustic charm and modern comforts in our safari tents, perfect for a peaceful retreat.",
    longDescription:
      "Classic safari style tents on raised platforms perched at the age of a stream that runs through the property overlooking a vast expanse of forested mountains. Each tent is tastefully appointed with exquisite safari style cane furniture, in-situ vanity and change area, separate toilet and shower area and even an open to sky shower with relaxation area.",
    galleryImages: [
      "/images/accommodations/safari-tent2.jpeg",
      "/images/accommodations/safari-tent3.jpeg",
      "/images/accommodations/safari-tent4.jpeg",
    ],
    amenities: [
      "King Size Bed",
      "Double Occupancy",
      "Infinity Pool",
      "Open shower",
      "WiFi",
      "Breakfast Included",
      "Free Slippers",
      "Pet Friendly",
      "Room Service",
      "Fan",
      "AC",
      "Table",
      "Gyser",
      "Tea/Coffee Maker",
      "Work-Space",
    ],

    capacity: "Sleeps 2",
    pricePerNightSefari: "Rs. 12,000 per night",
    extraBedding: "₹ 1500 per extra person",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Mud House",
    slug: "mud-villa",
    image: "/videos/mud-villa.mp4",
    altText: "Exterior view of a charming safari tent nestled in greenery",
    shortDescription:
      "Experience rustic charm and modern comforts in our safari tents, perfect for a peaceful retreat.",
    longDescription:
      "Mud-based cottages are the country style room addition to our room segments. Built on the vernacular architecture of Gond Tribes, these cottages are built in the middle of our 5-acre organic orchard. Every mud cottage has a spacious AC room, annexed lobby, front and backyard veranda, and an ethic look luxurious washroom. The roof top sitting area adds to the attraction of these mud cottages and gives a 360-degree view of the whole resort.",
    galleryImages: [
      "/images/accommodations/mud-villa1.jpg",
      "/images/accommodations/mud-villa2.jpg",
      "/images/accommodations/mud-villa.jpg",
    ],
    amenities: [
      "King Size Bed",
      "Double Occupancy",
      "Infinity Pool",
      "Bathtub",
      "WiFi",
      "Breakfast Included",
      "Free Slippers",
      "Pet Friendly",
      "Room Service",
      "Fan",
      "AC",
      "Table",
      "Gyser",
      "Tea/Coffee Maker",
      "Work-Space",
    ],
    capacity: "Sleeps 2",
    pricePerNightMud: "Mud House 1 ( Without Bathtub ): ₹ 9,000 per night",
    pricePerNightMud1: "Mud House 2 ( With Bathtub ): ₹ 10,000 per night",
    extraBedding: "₹ 1500 per extra person",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Pool Side Villa",
    slug: "pool-side-room",
    image: "/videos/pool-side.mp4",
    altText: "A beautiful treehouse offering panoramic views of the forest",
    shortDescription:
      "Designed on the rural theme, poolside rooms have mud textured walls and teak textured ceilings. The center of the room is adorned with king size bamboo bed. The attached washrooms have a hot/ cold water facility.",
    longDescription:
      "Wake up to soft sunlight shimmering on the water and unwind to the peaceful rhythm of nature in our elegant Pool Side Villa. With a view of the tranquil eco-pool and surrounded by greenery, your stay promises wellness, privacy, and rejuvenation. Whether you wish to enjoy a morning dip, sip chai by the poolside, or simply lounge in nature's silence, this space invites you to slow down and breathe easy.",
    galleryImages: [
      "/images/accommodations/pool-side-room1.jpg",
      "/images/accommodations/pool-side-room2.jpg",
      "/images/accommodations/pool-side-room3.jpg",
    ],
    amenities: [
      "King Size Bed",
      "Double Occupancy",
      "Infinity Pool",
      "Bathtub",
      "WiFi",
      "Breakfast Included",
      "Free Slippers",
      "Pet Friendly",
      "Room Service",
      "Fan",
      "AC",
      "Table",
      "Gyser",
      "Tea/Coffee Maker",
      "Work-Space",
    ],
    capacity: "Sleeps 4",
    pricePerNightPool: "Pool Side Villa ( 2 Rooms ) : Rs. 12,000 per night",
    extraBedding: "₹ 1500 per extra person",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Glamping Tents",
    slug: "glamping-tents",
    image: "/images/accommodations/glamping-tent1.JPG",
    altText: "Luxury glamping tent with deck overlooking greenery",
    shortDescription:
      "Experience comfort in the wild with rustic mini-safari glamping tents, cozy interiors, a personal lawn, and the perfect blend of nature and boutique luxury.",
    longDescription:
      "Our Glamping Tents are crafted for travelers who crave the raw beauty of Ratapani’s forest while enjoying refined comforts. Each tent hosts a plush king-size bed, curated décor inspired by safari chic, ensuite shower, and a private sit-out that opens into your own lawn. Wake up to golden mornings, sip freshly brewed tea on the verandah, and enjoy personalized hospitality that keeps every modern convenience within reach.",
    galleryImages: [
      "/images/accommodations/glamping-tent2.JPG",
      "/images/accommodations/glamping-tent3.JPG",
      "/images/accommodations/glamping-tent4.JPG",
    ],
    amenities: [
      "King Size Bed",
      "Double Occupancy",
      "Infinity Pool",
      "Shower",
      "WiFi",
      "Breakfast Included",
      "Free Slippers",
      "Pet Friendly",
      "Room Service",
      "Fan",
      "AC",
      "Table",
      "Gyser",
      "Tea/Coffee Maker",
      "Work-Space",
    ],
    capacity: "Sleeps 2",
    pricePerNightGlamping: "Rs. 7,500",
    extraBedding: "Rs. 1,500 per person",
    rating: 4.6,
  },
  {
    id: 5,
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
    pricePerNight111: "One Night Comping: 2500/person",
    pricePerNight22: "Day Package: 1100/person",

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
                  {accommodation.amenities &&
                    accommodation.amenities.length > 0 && (
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
                    )}
                </div>

                <div className="mt-auto">
                  {accommodation.slug === "safari-tent" && (
                    <div className="flex flex-col items-center space-y-2">
                      {/* Heading */}
                      <h3 className="text-2xl font-bold text-[rgb(110,97,70)] tracking-wide">
                        BOOK YOUR STAY
                      </h3>

                      {/* Price Pill */}
                      <div className="bg-[rgb(110,97,70)] text-white rounded-full px-6 py-3 flex flex-col items-center">
                        <span className="text-xl font-bold">
                          {accommodation.pricePerNightSefari}
                        </span>
                      </div>
                    </div>
                  )}

                  {accommodation.slug === "mud-villa" && (
                    <div className="flex flex-col items-center space-y-4">
                      {/* Heading */}
                      <h3 className="text-2xl font-extrabold text-[#1a1d18] tracking-wide mb-2">
                        BOOK YOUR STAY
                      </h3>

                      {/* Mud House 1 */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base font-bold text-[#1a1d18]">
                          • MUD HOUSE 1: <br />
                          <span className="font-normal">(WITHOUT BATHTUB)</span>
                        </p>
                        <div className="bg-[rgb(110,97,70)] text-white rounded-full px-16 py-3 flex flex-col items-center">
                          <span className="text-lg font-bold">Rs. 9,000</span>
                          <span className="text-sm">Per night</span>
                        </div>
                      </div>

                      {/* Mud House 2 */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base font-bold text-[#1a1d18]">
                          • MUD HOUSE 2: <br />
                          <span className="font-normal">(WITH BATHTUB)</span>
                        </p>
                        <div className="bg-[rgb(110,97,70)] text-white rounded-full px-16 py-3 flex flex-col items-center">
                          <span className="text-lg font-bold">Rs. 10,000</span>
                          <span className="text-sm">Per night</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {accommodation.slug === "pool-side-room" && (
                    <div className="flex flex-col items-center space-y-4">
                      {/* Heading */}
                      <h3 className="text-2xl font-extrabold text-[#1a1d18] tracking-wide mb-2">
                        BOOK YOUR STAY
                      </h3>

                      {/* Poolside Villa */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-sm font-bold text-[#374151]">
                          • POOLSIDE VILLA: <br />
                          <span className="font-normal">(2 ROOMS)</span>
                        </p>
                        <div className="bg-[rgb(110,97,70)] mt-2 text-white rounded-full px-16 py-3 flex flex-col items-center">
                          <span className="text-lg font-bold">Rs. 12,000</span>
                          <span className="text-sm">Per night</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Show Camping Tent Packages Only if slug === 'camping-tent' */}
                  {accommodation.slug === "camping-tent" && (
                    <>
                      {/* ONE NIGHT CAMPING */}
                      <div className="flex flex-col mb-20">
                        <div className="flex justify-between items-center ">
                          {/* Title */}
                          <h3 className="text-2xl font-extrabold text-[#1a1d18] tracking-wide">
                            ONE NIGHT CAMPING
                          </h3>
                          {/* Price Pill */}
                          <span className="bg-[rgb(110,97,70)] text-white font-bold text-lg px-4 py-2 rounded-full">
                            ₹2500/person
                          </span>
                        </div>
                        {/* Details */}
                        <p className="text-sm font-bold text-[#1a1d18] mt-1">
                          Breakfast, Dinner, Pool, Obstacle course, Nature Walk
                        </p>
                        {/* Separator */}
                        <div className="border-b-4 border-black mt-3 w-full"></div>
                      </div>

                      {/* Day Package */}
                      {/* <div className="flex flex-col mb-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-extrabold text-[#1a1d18] tracking-wide">
                            Day Package
                          </h3>
                          <span className="bg-[rgb(110,97,70)] text-white font-bold text-lg px-4 py-2 rounded-full">
                            ₹ 1100/person
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#1a1d18] mt-1">
                          Breakfast, Lunch, Pool, Obstacle course, Nature Walk
                        </p>
                        <div className="border-b-4 border-black mt-3 w-full"></div>
                      </div> */}

                      {/* Trekking */}
                      {/* <div className="flex flex-col mb-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-extrabold text-[#1a1d18] tracking-wide">
                            Trekking
                          </h3>
                          <span className="bg-[rgb(110,97,70)] text-white font-bold text-lg px-4 py-2 rounded-full">
                            ₹ 1300/person
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#1a1d18] mt-1">
                          Breakfast, Lunch, Trekking
                        </p>
                        <div className="border-b-4 border-black mt-3 w-full"></div>
                      </div> */}
                    </>
                  )}

                  {accommodation.slug === "glamping-tents" && (
                    <div className="flex flex-col items-center space-y-2 mb-6">
                      <h3 className="text-2xl font-bold text-[rgb(110,97,70)] tracking-wide">
                        BOOK YOUR STAY
                      </h3>
                      <div className="bg-[rgb(110,97,70)] text-white rounded-full px-8 py-3 flex flex-col items-center">
                        <span className="text-xl font-bold">
                          {accommodation.pricePerNightGlamping}
                        </span>
                        <span className="text-sm">Per night</span>
                      </div>
                    </div>
                  )}

                  {/* <div className="flex justify-between items-center">
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
                  </div> */}
                  {/* Extra Bedding Section */}
                  {accommodation.extraBedding && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-[rgb(110,97,70)] mb-2">
                        Extra Bedding - {accommodation.extraBedding}
                      </p>
                    </div>
                  )}

                  {/* Capacity Section */}
                  {accommodation.capacity && (
                    <div className="flex justify-between items-center">
                      <p className="text-md text-[rgb(110,97,70)] mb-2">
                        <strong className="font-sitka-banner tracking-widest font-semibold">
                          Capacity:
                        </strong>{" "}
                        {accommodation.capacity}
                      </p>
                    </div>
                  )}
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
