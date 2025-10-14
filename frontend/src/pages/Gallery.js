import React, { useState, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import styled from "styled-components";
import "./PhotoGallery.css";
import { FaPlayCircle } from "react-icons/fa";

const tabs = [
  "Madhuban Eco Retreat",
  "Tribal Culture At Madhuban",
  "Forest & Nature",
  "Bhim Bettika",
  "Saru Maru Caves",
  "Ginnorgarh Fort",
];

const mediaContent = {
  "Madhuban Eco Retreat": [
    { type: "image", src: "/images/Gallery/gallery17.jpg" },
    { type: "video", src: "/images/bird/gallery-video.mp4" },
    { type: "image", src: "/images/Gallery/gallery5.jpg" },
    { type: "video", src: "/images/Gallery/gallery-video5.mp4" },
    { type: "image", src: "/images/Gallery/gallery15.jpg" },
    { type: "video", src: "/images/Gallery/gallery-video4.mp4" },
    { type: "video", src: "/images/Gallery/gallery-video-7.mp4" },
    { type: "image", src: "/images/Gallery/gallery-18.jpg" },
    { type: "image", src: "/images/Gallery/gallery-19.jpg" },
    { type: "image", src: "/images/Gallery/gallery-20.jpg" },
    { type: "image", src: "/images/Gallery/gallery-21.jpg" },
    { type: "image", src: "/images/Gallery/gallery-22.jpg" },
    { type: "image", src: "/images/Gallery/gallery-23.jpg" },
    { type: "video", src: "/images/Gallery/gallery-video-6.mp4" },
    { type: "image", src: "/images/Gallery/gallery-25.jpg" },
  ],
  "Tribal Culture At Madhuban": [
    { type: "image", src: "/images/Gallery/gallery3.heic" },
    { type: "image", src: "/images/Gallery/gallery4.heic" },
    { type: "image", src: "/images/TribalCulture/culture-3.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-4.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-2.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-7.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-1.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-5.jpg" },
    { type: "image", src: "/images/TribalCulture/culture-6.jpg" },
  ],
  "Forest & Nature": [
    { type: "image", src: "/images/Nature/nature7.jpg" },
    { type: "video", src: "/images/Nature/nature-trails.mp4" },
    { type: "image", src: "/images/Nature/nature6.jpg" },
    { type: "video", src: "/images/Nature/nature-video.mp4" },
    { type: "image", src: "/images/bird/bird3.jpg" },
    { type: "video", src: "/images/Nature/nature-video1.mp4" },
    { type: "image", src: "/images/Nature/nature3.jpg" },
    { type: "video", src: "/images/Nature/nature-video2.mp4" },
    { type: "image", src: "/images/bird/bird11.jpg" },
    { type: "image", src: "/images/Nature/nature5.jpg" },
    { type: "image", src: "/images/bird/bird2.jpg" },
    { type: "image", src: "/images/bird/bird6.jpg" },
    { type: "image", src: "/images/Nature/nature10.jpg" },
    { type: "image", src: "/images/Nature/nature11.jpg" },
    { type: "image", src: "/images/Nature/nature12.jpg" },
    { type: "image", src: "/images/Nature/nature13.jpg" },
    { type: "image", src: "/images/Nature/nature14.jpg" },
    { type: "image", src: "/images/Nature/nature15.jpg" },
    { type: "image", src: "/images/Nature/nature16.jpg" },
    { type: "image", src: "/images/Nature/nature17.jpg" },
    { type: "image", src: "/images/Nature/nature18.jpg" },
    { type: "image", src: "/images/Nature/nature19.jpg" },
    { type: "image", src: "/images/Nature/nature20.jpg" },
    { type: "image", src: "/images/bird/bird7.jpeg" },
  ],
  "Bhim Bettika": [
    { type: "image", src: "/images/BhimBetika/bhim1.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim2.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim3.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim4.jpeg" },
    { type: "image", src: "/images/BhimBetika/bhim5.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim6.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim15.jpeg" },
    { type: "image", src: "/images/BhimBetika/bhim14.jpeg" },
    { type: "image", src: "/images/BhimBetika/bhim13.jpeg" },
    { type: "image", src: "/images/BhimBetika/bhim10.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim11.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim12.jpg" },
  ],
  "Saru Maru Caves": [
    { type: "image", src: "/images/SaruMaruCaves/smCaves1.jpg" },
    { type: "video", src: "/images/SaruMaruCaves/smCaves.mp4" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves2.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves3.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves4.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves5.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves7.jpg" },
    { type: "video", src: "/images/SaruMaruCaves/smCaves1.mp4" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves8.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves9.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves12.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves11.jpg" },
  ],
  "Ginnorgarh Fort": [
    { type: "image", src: "images/GinnorgarhFort/GF.jpg" },
    { type: "image", src: "images/GinnorgarhFort/GF1.jpg" },
    { type: "image", src: "images/GinnorgarhFort/GF2.jpg" },
    { type: "image", src: "images/GinnorgarhFort/GF3.jpg" },
    { type: "image", src: "images/GinnorgarhFort/GF4.jpg" },
    { type: "image", src: "images/GinnorgarhFort/GF5.jpg" },
  ],
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  useEffect(() => {
    NativeFancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      NativeFancybox.destroy();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen  pt-[104px] bg-[#D1C8C1]">
      <section className="relative h-[85vh] m-0 p-0">
        <div className="absolute inset-0 overflow-hidden h-[70vh] rounded-bl-[60px] rounded-br-[60px]">
          <video
            src="/images/bird/gallery-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-6xl font-sitka-banner tracking-widest font-medium">
              Eco Gallery
            </h1>
            <p className="font-arial-narrow tracking-wider text-lg md:text-2xl mt-2">
              Discover the beauty of nature through our lens
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 -mt-24 rounded-bl-[60px] rounded-br-[60px] ">
        <div className="max-w-[86rem] mx-auto">
          <div className="flex items-center justify-center mb-5">
            <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
            <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
              Our Gallery
            </h2>
            <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4 " />
          </div>
          <TabWrapper>
            {tabs.map((tab) => (
              <StyledButton
                key={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </StyledButton>
            ))}
          </TabWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaContent[activeTab].map((item, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl shadow-lg max-w-sm w-full mx-auto"
              >
                {item.type === "image" ? (
                  <>
                    <img
                      src={item.src}
                      alt="gallery"
                      className="h-80 w-full object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                    <a
                      href={item.src}
                      data-fancybox="gallery"
                      className="absolute inset-0 z-10"
                      aria-label="Visit Site"
                    ></a>
                  </>
                ) : playingVideoIndex === index ? (
                  <video
                    controls
                    autoPlay
                    className="w-full h-80 object-cover rounded-2xl"
                  >
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    className="relative w-full h-80 bg-black rounded-2xl cursor-pointer group overflow-hidden"
                    onClick={() => setPlayingVideoIndex(index)}
                  >
                    <video
                      src={item.src}
                      className="w-full h-full object-cover rounded-2xl"
                      poster={item.poster}
                      preload="metadata"
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaPlayCircle className="text-white text-6xl group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

// Styled Components
// Styled Components
const TabWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StyledButton = styled.button`
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ isActive }) => (isActive ? "#000000" : "#000000")};
  border-radius: 9999px;
  background-color: ${({ isActive }) => (isActive ? "#d1c8c1" : "#6E6146")};
  color: ${({ isActive }) => (isActive ? "black" : "white")};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #b3a69d;
    color: black;
    border-color: #000000;
  }
`;
