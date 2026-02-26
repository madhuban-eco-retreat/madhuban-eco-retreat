"use client";

import React, { useState, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import styled from "styled-components";
import "../../components/photoGallery.css";
import { FaPlayCircle } from "react-icons/fa";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAltFromUrl } from "@/utills/helperFunctions";

const tabs = [
  "Madhuban Eco Retreat",
  "Bhim Bettika",
  "Forest & Nature",
  "Ginnorgarh Fort",
  "Tribal Culture At Madhuban",
  "Saru Maru Caves",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const mediaContent = {
  "Madhuban Eco Retreat": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835637/madhuban-eco-retreat-best-resort-near-bhopal-1.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624886/gallery-video_rjwe0f.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771834915/glamping-tent-madhuban-eco-retreat-1.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624881/gallery-video5_nesutp.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835137/collage-image-madhuban-eco-retreat-best-resort-near-bhopal.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624835/gallery-video4_bdulew.mp4",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624864/gallery-video-7_lq72mu.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835534/glamping-tent-gallery-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835434/mud-house-sunset-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771834843/pool-view-image-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835763/madhuban-eco-retreat-image.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835368/madhuban-eco-retreat-image-best-resort-near-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771835708/mud-house-gallery-image-2-madhuban-eco-retreat.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624825/gallery-video-6_a8qjzz.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590129/guest-near-safari-tent-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771833362/dinning-area-image-7-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771583374/fine-dine-restaurant-in-ratapani-bhopal-madhuban-eco-retreat-2.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771583365/madhuban-eco-retreat-best-restaurant-near-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590079/fine-dine-restaurant-in-ratapani-bhopal-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771833360/dinning-area-image-8-madhuban-eco-retreat-bhopal.avif",
    },
  ],
  "Tribal Culture At Madhuban": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844179/ratapani-tribal-dance-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844128/traditional-tribal-dance-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844127/tribal-folk-dance-madhuban-eco-retreat-ratapani.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844127/cultural-tribal-dance-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844126/tribal-dance-performance-ratapani-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844126/local-tribal-dance-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844179/tribal-cultural-dance-madhuban-eco-retreat-ratapani.avif",
    },
  ],
  "Forest & Nature": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589990/nature-visit-ratapani-madhuban-eco-retreat-bhopal-2_ghxdvr.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624869/nature-trails_xaywm7.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589981/nature-visit-ratapani-madhuban-eco-retreat-bhopal_d74xco.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624874/nature-video_sqxi5u.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830642/hummingbird-hawk-moth-image-from-ratapani-by-madhuban-eco-retreat.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624860/nature-video1_hrklzp.mp4",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624841/nature5_iylaqz.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830630/indian-roller-image-from-ratapani-by-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830480/black-winged-kite-image-from-ratapani-by-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830467/long-tailed-shrike-image-from-ratapani-by-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830190/male-plum-headed-parakeet-image-from-ratapani-by-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840066/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-11.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771830131/indian-pitta-image-from-ratapani-by-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589977/nature-walk-madhuban-eco-retreat-ratapani-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771829898/unique-owl-image-ratapani-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771829849/experiences-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771834121/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594536/peacock-watching-experience-ratapani-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589741/bird-watching-ratapani-madhuban-eco-retreat_k2lmis.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840151/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-2.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840153/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-1.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840156/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840149/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-3.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840123/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-4.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840121/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-5.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840119/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-6.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840073/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-7.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840071/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-8.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840069/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-9.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771840067/nature-forest-view-ratapani-tiger-reserve-madhuban-eco-retreat-bhopal-10.avif",
    },
  ],
  "Bhim Bettika": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594918/bhimbetika-rock-shelter-images-by-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594825/bhimbetika-image-madhuban-eco-retreat-1.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594704/bhimbetika-images-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594596/bhimbetika-image-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594451/bhimbetika-image-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594333/bhimbetika-rock-shelter-madhuban-eco-retreat-1.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594243/bhimbetika-rock-shelter-image-2.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594188/bhimbetika-rock-shelter-image-1.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771594133/bhimbetika-rock-shelter-image.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771593922/bhimbetika-rock-shelter-image-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771593813/bhimbetika-image-2-madhuban-eco-retreat.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771593667/bhimbetika-image-1-madhuban-eco-retreat.avif",
    },
  ],
  "Saru Maru Caves": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843272/saru-maru-caves-madhuban-eco-retreat-bhopal-10.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624866/smCaves_b0zadq.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843269/saru-maru-caves-madhuban-eco-retreat-bhopal-9.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843193/saru-maru-caves-madhuban-eco-retreat-bhopal-8.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843128/saru-maru-caves-madhuban-eco-retreat-bhopal-7.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843069/saru-maru-caves-madhuban-eco-retreat-bhopal-6.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771842890/smCaves12_dugzkm_qbidai.avif",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624876/smCaves1_i0impx.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771842847/saru-maru-caves-madhuban-eco-retreat-bhopal-5.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771842618/saru-maru-caves-madhuban-eco-retreat-bhopal-2.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771842617/saru-maru-caves-madhuban-eco-retreat-bhopal-3.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771842371/saru-maru-caves-madhuban-eco-retreat-bhopal.avif",
    },
  ],
  "Ginnorgarh Fort": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771837413/ginnorgarh-fort-ratapani-mad-1huban-eco-retreat-bhopal-1.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771837411/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771837410/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal-2.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771837407/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal-3.avif",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771837404/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal-4.avif",
    },
    // {
    //   type: "image",
    //   src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624795/GF5_zfbe8q.jpg",
    // },
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
    <div className="min-h-screen bg-[#D1C8C1]">
      <section className="relative w-full h-[85vh] overflow-hidden mb-20 ">
        {/* Video Layer */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624901/gallery-bg-video_cdwjew.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content Layer */}
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
          <div className="max-w-7xl">
            <h1 className="bannerHeading font-primary">Eco Gallery</h1>

            <h2 className="bannerSubHeading">
              Discover the beauty of nature through our lens
            </h2>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 -mt-24 rounded-bl-[60px] rounded-br-[60px] ">
        <div className="max-w-[86rem] mx-auto">
          <DecorativeHeading
            text={" Experience Madhuban Through Nature & Culture"}
            as="h2"
            textClasses={"w-[80%] md:w-full"}
          />

          <div className="flex flex-col gap-4">
            <p className="p-text md:text-center p-text-black  text-justify ">
              Explore the natural beauty, earthy architecture, and cultural
              heritage that make Madhuban Eco Retreat unique. Our gallery
              showcases scenic forest landscapes, wildlife moments, tribal art,
              ancient sites like Bhimbetka and Ginnorgarh Fort, and peaceful
              corners of our eco-friendly retreat. From lush greenery to
              thoughtfully designed stays, these images capture the true essence
              of Ratapani’s wilderness. Dive in and experience the charm of
              Madhuban through our curated collection of photos and videos.
            </p>
            <p className="p-text md:text-center  text-justify p-text-black ">
              From lush greenery to thoughtfully designed stays, these images
              capture the true essence of Ratapani’s wilderness. Dive in and
              experience the charm of Madhuban through our curated collection of
              photos and videos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4   rounded-bl-[60px] rounded-br-[60px] ">
        <div className="max-w-[86rem] mx-auto">
          <DecorativeHeading
            text={" Our Gallery"}
            as="h2"
            textClasses={"w-50"}
          />

          <TabWrapper>
            {tabs.map((tab) => (
              <StyledButton
                key={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className="text-xs md:text-sm"
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
                    <Image
                      width={300}
                      height={300}
                      src={item.src}
                      alt={getAltFromUrl(item.src)}
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
                    <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
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
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #b3a69d;
    color: black;
    border-color: #000000;
  }
`;
