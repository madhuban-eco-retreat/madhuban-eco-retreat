import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
// import NatureTrails from "./BirdWatching";

const NatureTrails = () => {
  // Track active main accordion index
  const [activeAccordion, setActiveAccordion] = useState(0); // First expanded by default
  // Track active nested accordion index for the first accordion item
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);

  const forestImages = [
    {
      url: "/images/accommodations/pool-side-tent.jpeg",
      alt: "Forest View 1",
    },
    {
      url: "/images/accommodations/pool-side-tent.jpeg",
      alt: "Forest View 2",
    },
    {
      url: "/images/accommodations/pool-side-tent.jpeg",
      alt: "Forest View 3",
    },
  ];

  const accordionItems = [
    {
      title: "Forest Walks & Nature Trails",
      content: (
        <>
          <p className="mb-4">
            At Madhuban ECO Retreat, our guided Forest Walk and Nature Trail
            experience is more than a stroll. It's a soulful journey through the
            heart of Madhya Pradesh’s thriving wilderness...
          </p>

          {/* Nested Accordion inside first main accordion item */}
          <div className="divide-y divide-green-200 border border-green-300 rounded-lg bg-green-50 shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect",
                content: (
                  <ul className="list-disc list-inside text-green-700 space-y-2">
                    <li>
                      Guided eco-trails with naturalists to explore the flora
                      and local ecosystem
                    </li>
                    <li>
                      Observation of medicinal plants, native trees,
                      butterflies, and wild herbs
                    </li>
                    <li>
                      Mindful walking sessions promoting calmness and mental
                      clarity
                    </li>
                    <li>
                      A chance to disconnect from devices and reconnect with
                      nature
                    </li>
                    <li>
                      Safe, well-marked trails suitable for families, solo
                      travelers, and senior guests
                    </li>
                  </ul>
                ),
              },

              {
                title: "Ideal For",
                content: (
                  <ul className="list-disc list-inside text-green-700 space-y-2">
                    <li>Nature enthusiasts and eco-tourists in Bhopal</li>
                    <li>Travelers seeking wellness in nature</li>
                    <li>
                      Families and kids wanting a meaningful outdoor activity
                    </li>
                    <li>
                      Photographers and bird watchers looking for the perfect
                      shot
                    </li>
                  </ul>
                ),
              },
              {
                title: "Ready to Walk the Wild Side?",
                content: (
                  <>
                    Join us for a tranquil forest walk —{" "}
                    <Link
                      to="/booking"
                      className="text-green-700 underline hover:text-green-900"
                    >
                      Book Your Nature Trail Now
                    </Link>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <button
                  className="flex items-center justify-between w-full py-3 px-4 text-left text-green-900 font-medium hover:bg-green-100 transition duration-200"
                  onClick={() =>
                    setActiveNestedAccordion(
                      activeNestedAccordion === idx ? null : idx
                    )
                  }
                >
                  <span>{item.title}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      activeNestedAccordion === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`px-4 pb-3 text-green-700 transition-all duration-300 ease-in-out ${
                    activeNestedAccordion === idx ? "block" : "hidden"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    // {
    //   title: "Wildlife Habitat",
    //   content:
    //     "Discover the diverse wildlife that calls our forest home and how we protect their natural habitats.",
    // },
    // {
    //   title: "Eco-Tourism",
    //   content:
    //     "Experience sustainable tourism practices that help preserve our forest while providing memorable experiences.",
    // },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <img
          src="/images/experiences/nature-trail.jpg"
          alt="Forest Nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-4">
              Forest Walks & Nature Trails
            </h1>
            <p className="text-xl md:text-2xl font-light">
              Step into Serenity, Breathe with the Forest
            </p>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-10 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-serif text-green-900 text-center mb-8">
            Explore Our Forest
          </h2>

          <div className="divide-y divide-green-200 border border-green-300 rounded-xl bg-white shadow-md overflow-hidden">
            {accordionItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  className="flex items-center justify-between w-full py-5 px-4 text-left text-green-900 font-medium hover:bg-green-100 transition duration-200"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <span>{item.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      activeAccordion === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`px-4 pb-4 text-green-700 transition-all duration-300 ease-in-out ${
                    activeAccordion === index ? "block" : "hidden"
                  }`}
                >
                  {
                    typeof item.content === "string"
                      ? item.content
                      : item.content /* support nested JSX */
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="py-10 px-4 md:px-8 bg-green-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif text-green-900 text-center mb-8">
            Forest Gallery
          </h2>
          <div className="w-[90%] md:w-[80%] h-[50vh] mx-auto">
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true }}
              className="h-full"
            >
              {forestImages.map((image, index) => (
                <SwiperSlide key={index} className="h-full">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NatureTrails;
