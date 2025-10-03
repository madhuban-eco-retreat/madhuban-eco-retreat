import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const RecreationalFacilities = () => {
  // Track active main accordion index
  const [activeAccordion, setActiveAccordion] = useState(0); // First expanded by default
  // Track active nested accordion index for the first accordion item
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);

  const forestImages = [
    {
      url: "/images/RecreationalFacilities/RF1.jpg",
      alt: "Forest View 1",
    },
    {
      url: "/images/RecreationalFacilities/RF2.jpg",
      alt: "Forest View 2",
    },
    {
      url: "/images/RecreationalFacilities/RF3.jpg",
      alt: "Forest View 3",
    },
    {
      url: "/images/RecreationalFacilities/RF4.jpg",
      alt: "Forest View 4",
    },
    {
      url: "/images/RecreationalFacilities/RF5.jpg",
      alt: "Forest View 5",
    },
    {
      url: "/images/RecreationalFacilities/RF6.jpg",
      alt: "Forest View 6",
    },
    {
      url: "/images/RecreationalFacilities/RF7.jpg",
      alt: "Forest View 7",
    },
  ];

  const accordionItems = [
    {
      title: "Recreational Facilities",
      content: (
        <>
          <p className="mb-4 font-arial-narrow text-[rgb(110,97,70)] tracking-wider">
            At Madhuban ECO Retreat, recreation blends beautifully with nature.
            We offer thoughtfully designed eco-conscious recreational spaces
            that refresh the body, calm the mind, and spark joy. Whether you're
            looking to engage in indoor fun, enjoy a quiet corner with a book,
            or cycle through forested trails our sustainable leisure options
            cater to all age groups and energy levels.
          </p>

          {/* Nested Accordion inside first main accordion item */}
          <div className="font-sitka-banner divide-y rounded-lg bg-[rgb(110,97,70)] shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect",
                content: (
                  <ul className="list-disc list-inside text-[#D1C8C1] tracking-widest font-sitka-banner space-y-2">
                    <li>
                      Indoor games like chess, carrom, and board games in an
                      airy common room
                    </li>
                    <li>
                      Cycling trails through scenic eco-paths surrounded by
                      greenery
                    </li>
                    <li>
                      Hammocks, swings, and open-air seating areas for peaceful
                      relaxation
                    </li>
                    <li>
                      Nature-inspired activity zones for children and families
                    </li>
                    <li>
                      Campfire zones and storytelling corners for soulful
                      evenings
                    </li>
                  </ul>
                ),
              },

              {
                title: "Ideal For",
                content: (
                  <ul className="list-disc list-inside text-[#D1C8C1] tracking-widest font-sitka-banner space-y-2">
                    <li>
                      Families looking for safe and nature-friendly activities
                    </li>
                    <li>
                      Guests seeking relaxing downtime in a forest retreat
                    </li>
                    <li>
                      Groups and solo travelers wanting to unwind in a green
                      space
                    </li>
                    <li>
                      Corporate retreats and wellness groups needing mindful
                      recreation
                    </li>
                  </ul>
                ),
              },
              {
                title: "It’s Your Time to Enjoy",
                content: (
                  <>
                    Explore our eco-friendly activities—{" "}
                    <Link
                      to="/booking"
                      className="list-disc list-inside underline text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2"
                    >
                      Plan Your Stay Now
                    </Link>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <button
                  className="flex items-center justify-between w-full py-3 px-4 text-left text-[#D1C8C1] font-medium transition duration-200"
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
                  className={`px-4 pb-3 text-[#D1C8C1] transition-all duration-300 ease-in-out ${
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
  ];

  return (
    <div className="min-h-screen bg-[#b4a681d8]">
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/PF.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0  bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-sitka-banner tracking-widest font-medium mb-4">
              Recreational Activities
            </h1>
            <p className="text-xl md:text-2xl font-arial-narrow tracking-wider">
             Explore the Madhuban
            </p>
          </div>
          <button
            onClick={() =>
              document
                .getElementById("accordion-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-sitka-banner font-semibold tracking-wider mt-10 text-white border border-white px-4 py-2 rounded-full hover:bg-white hover:text-[rgb(110,97,70)] transition duration-300"
          >
            ↓ Scroll Down
          </button>
        </div>
      </section>

      {/* Accordion Section */}
      <section
        id="accordion-section"
        className="py-10 px-4 md:px-8 bg-[rgb(110,97,70)]"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center mb-5">
            <hr className="w-16 border-t border-[#D1C8C1] mr-4" />
            <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#D1C8C1] font-semibold tracking-wider text-center">
              Explore The Madhuban
            </h2>
            <hr className="w-16 border-t border-[#D1C8C1] ml-4" />
          </div>
          <div className="divide-y rounded-xl bg-[#D1C8C1] shadow-md overflow-hidden">
            {accordionItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  className="font-sitka-banner font-bold tracking-widest flex items-center justify-between w-full py-5 px-4 text-left text-[rgb(110,97,70)] transition duration-200"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <span className="font-sitka-banner font-bold">
                    {item.title}
                  </span>
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
                  className={`px-4 pb-4 text-[rgb(110,97,70)] transition-all duration-300 ease-in-out ${
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
      <section className="py-10 px-4 md:px-8 bg-[#D1C8C1]">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-5">
            <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
            <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-bold tracking-wider text-center">
              Activity Gallery
            </h2>
            <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
          </div>
          <div className="w-[90%] md:w-[100%] h-[70vh] mx-auto">
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

export default RecreationalFacilities;
