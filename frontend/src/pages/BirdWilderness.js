import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const BirdWilderness = () => {
  // Track active main accordion index
  const [activeAccordion, setActiveAccordion] = useState(0); // First expanded by default
  // Track active nested accordion index for the first accordion item
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);

  const forestImages = [
    {
      url: "/images/bird/bird14.jpeg",
      alt: "Forest View 1",
    },
    {
      url: "/images/bird/bird1.jpg",
      alt: "Forest View 1",
    },
    {
      url: "/images/bird/bird2.jpg",
      alt: "Forest View 2",
    },
    {
      url: "/images/bird/bird4.jpg",
      alt: "Forest View 3",
    },
    {
      url: "/images/bird/bird5.jpg",
      alt: "Forest View 4",
    },
    {
      url: "/images/bird/bird6.jpg",
      alt: "Forest View 5",
    },
    {
      url: "/images/bird/bird7.jpeg",
      alt: "Forest View 6",
    },
    {
      url: "/images/bird/bird9.jpg",
      alt: "Forest View 7",
    },
    {
      url: "/images/bird/bird11.jpg",
      alt: "Forest View 8",
    },
    {
      url: "/images/bird/bird14.jpg",
      alt: "Forest View 10",
    },
    {
      url: "/images/bird/bird13.jpg",
      alt: "Forest View 11",
    },
  ];

  const accordionItems = [
    {
      title: "Bird Watching & Wilderness",
      content: (
        <>
          <p className="mb-4 font-arial-narrow text-[rgb(110,97,70)] tracking-wider">
            Madhuban ECO Retreat is a haven for bird lovers and wildlife
            enthusiasts. Nestled amidst untouched forests of Madhya Pradesh, our
            retreat offers a rare chance to witness the vibrant life of over 70
            species of native and migratory birds in their natural habitat. With
            no urban noise, just the call of the wild and rustling leaves,
            you’ll be immersed in a pure wilderness experience like no other.
          </p>

          {/* Nested Accordion inside first main accordion item */}
          <div className="font-sitka-banner divide-y rounded-lg bg-[rgb(110,97,70)] shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect ",
                content: (
                  <ul className="list-disc list-inside text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2">
                    <li>
                      Early morning and sunset bird watching sessions with
                      expert guides
                    </li>
                    <li>
                      Spot species like the Indian paradise flycatcher, golden
                      oriole, kingfisher, and peacockss
                    </li>
                    <li>
                      Explore the wild with low-impact nature exploration
                      practices
                    </li>
                    <li>
                      Photography-friendly zones with minimal disturbance to
                      wildlife
                    </li>
                    <li>
                      Learn about bird calls, behaviors, and seasonal migrations
                    </li>
                  </ul>
                ),
              },

              {
                title: "Ideal For",
                content: (
                  <ul className="list-disc list-inside text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2">
                    <li>
                      Bird watchers and ornithologists seeking new species
                    </li>
                    <li>Wildlife photographers and researchers</li>
                    <li>
                      Families and students learning about bio-diversity in
                      Bhopal
                    </li>
                    <li>
                      Travelers seeking silent nature experiences and forest
                      immersion
                    </li>
                  </ul>
                ),
              },
              {
                title: "Let Nature Surprise You",
                content: (
                  <>
                    Let Nature Surprise You Join us for a peaceful wilderness
                    session—{" "}
                    <Link
                      to="/booking"
                      className="list-disc list-inside underline text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2"
                    >
                      Book Your Bird Watching Trail Now
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
      <section className="relative h-[100vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/wilderness.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-sitka-banner tracking-widest font-medium mb-4">
            Bird Watching & Wilderness
          </h1>
          <p className="text-xl md:text-2xl font-arial-narrow tracking-wider">
            Listen to Wings, Watch the Wild, Feel the Silence
          </p>
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
              Explore The Nature
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
      <section className="py-10 px-4 md:px-8 	bg-[#D1C8C1]">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-5">
            <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
            <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-bold tracking-wider text-center">
              Birds Gallery
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

export default BirdWilderness;
