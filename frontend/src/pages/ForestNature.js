import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const ForestNature = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // for fullscreen modal

  const forestImages = [
    {
      url: "/images/Nature/nature9.jpg",
      alt: "Forest View 1",
    },
    {
      url: "/images/Nature/nature3.jpeg",
      alt: "Forest View 2",
    },
    {
      url: "/images/Nature/nature6.jpg",
      alt: "Forest View 3",
    },
    {
      url: "/images/Nature/nature5.jpg",
      alt: "Forest View 4",
    },
    {
      url: "/images/Nature/nature7.jpg",
      alt: "Forest View 5",
    },
    {
      url: "/images/Nature/nature1.jpg",
      alt: "Forest View 6",
    },
  ];

  const accordionItems = [
    {
      title: "Forest Walks & Nature Trails",
      content: (
        <>
          <p className="mb-4 font-arial-narrow text-[rgb(110,97,70)] tracking-wider text-base font-medium">
            At Madhuban ECO Retreat, our guided Forest Walk and Nature Trail
            experience is more than a stroll. It's a soulful journey through the
            heart of Madhya Pradesh’s thriving wilderness...
          </p>
          <div className="font-sitka-banner divide-y rounded-lg bg-[rgb(110,97,70)] shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect",
                content: (
                  <ul className="list-disc list-inside text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2">
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
                  <ul className="list-disc list-inside text-[#D1C8C1] font-bold tracking-widest font-sitka-banner space-y-2">
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
                      className="text-[#D1C8C1] underline font-bold tracking-widest font-sitka-banner"
                    >
                      Book Your Nature Trail Now
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
    <div className="min-h-screen bg-[#908873d8]">
      {/* Hero Section with Scroll Down Button */}
      <section className="relative h-[100vh] w-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/nature-trails1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-sitka-banner tracking-widest font-medium mb-4">
              Forest Walks & Nature Trails
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wider font-arial-narrow">
              Step into Serenity, Breathe with the Forest
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
              Explore Our Forest
            </h2>
            <hr className="w-16 border-t border-[#D1C8C1] ml-4" />
          </div>
          <div className="divide-y  rounded-xl bg-[#D1C8C1] shadow-md overflow-hidden">
            {accordionItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  className="font-sitka-banner tracking-widest flex items-center justify-between w-full py-5 px-4 text-left text-[rgb(110,97,70)] transition duration-200"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <span className="font-sitka-banner tracking-widest font-bold text-xl">
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
                  className={`font-arial-narrow px-4 pb-4 text-[#D1C8C1] tracking-wider transition-all duration-300 ease-in-out ${
                    activeAccordion === index ? "block" : "hidden"
                  }`}
                >
                  {typeof item.content === "string"
                    ? item.content
                    : item.content}
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
              Forest Gallery
            </h2>
            <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
          </div>
          <div className="min-w-[80vw] md:w-[100%] h-[70vh] mx-auto">
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
                    className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForestNature;
