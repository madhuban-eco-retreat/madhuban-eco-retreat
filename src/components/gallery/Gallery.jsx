"use client";

import React, { useState, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import styled from "styled-components";
import "../../components/photoGallery.css";
import { FaPlayCircle } from "react-icons/fa";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";

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
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624799/gallery17_kh3tko.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624886/gallery-video_rjwe0f.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624820/gallery5_fk1vgr.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624881/gallery-video5_nesutp.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624810/gallery15_e23krk.jpg",
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
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624802/gallery-18_d0pmsc.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624812/gallery-19_girrc2.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624812/gallery-20_a7ovva.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624797/gallery-21_kndrsa.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624802/gallery-22_znmyae.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624797/gallery-23_kiijvi.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624825/gallery-video-6_a8qjzz.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624803/gallery-25_gl6yav.jpg",
    },
  ],
  "Tribal Culture At Madhuban": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624805/gallery3_cfrfp1.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624806/gallery4_qytdib.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624856/culture-3_ndnmsk.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624856/culture-4_rvexfh.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624856/culture-2_ju6n04.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624858/culture-7_md0xir.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624855/culture-1_mriq5z.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624857/culture-5_hojn2l.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624857/culture-6_jp7rgp.jpg",
    },
  ],
  "Forest & Nature": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624861/nature7_mepmzx.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624869/nature-trails_xaywm7.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624853/nature6_pmw8sl.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624874/nature-video_sqxi5u.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624791/bird3_cx8rtl.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624860/nature-video1_hrklzp.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624852/nature3_vdzdtc.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624841/nature5_iylaqz.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624790/bird11_lts1c3.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624841/nature5_iylaqz.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624793/bird2_m5u4oj.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624791/bird6_aarwud.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624835/nature10_sdmtoh.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624835/nature11_jhjjox.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624836/nature12_ysvp1o.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624836/nature13_blcmzq.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624837/nature14_hpdniw.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624838/nature15_op4oeb.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624838/nature16_kjmsf0.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624838/nature17_iulp1m.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624839/nature18_zmcbrp.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624839/nature19_d0fuyn.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624840/nature20_o65qii.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624872/bird7_twnhyw.jpg",
    },
  ],
  "Bhim Bettika": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624815/bhim1_rpsz0l.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624817/bhim2_nw9nyq.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624817/bhim3_etg5lb.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624844/bhim4_v6o2cw.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624817/bhim5_p6azrq.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624818/bhim6_nz6fck.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624847/bhim15_tndgvc.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624847/bhim14_gyrcmk.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624834/bhim13_koksbc.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624816/bhim10_hm99re.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624816/bhim11_spjjln.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624816/bhim12_akvyi2.jpg",
    },
  ],
  "Saru Maru Caves": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624848/smCaves1_bhuzvj.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624866/smCaves_b0zadq.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624849/smCaves2_hxnq0o.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624852/smCaves3_eprm7p.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624850/smCaves4_c5smsa.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624851/smCaves5_x8t1is.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624868/smCaves7_yfhzz3.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624876/smCaves1_i0impx.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624869/smCaves8_nz56zw.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624867/smCaves9_obhtqq.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624861/smCaves12_dugzkm.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624867/smCaves11_umqv3l.jpg",
    },
  ],
  "Ginnorgarh Fort": [
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624810/GF_vijdqs.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624813/GF1_pe2rra.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624811/GF2_epsyrb.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624807/GF3_rbqlmo.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624813/GF4_fkn5mj.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624795/GF5_zfbe8q.jpg",
    },
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
      <section className="relative h-[85vh] m-0 p-0">
        <div className="absolute inset-0 overflow-hidden h-[70vh] ">
          <video
            src={
              "https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624901/gallery-bg-video_cdwjew.mp4"
            }
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />

          <div
            className="absolute top-0 z-10 h-full w-full text-white flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(180deg,rgba(0, 0, 0, 0.4 ) 100%)",
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-white text-center px-4"
            >
              <div className="text-center max-w-7xl">
                <h1 className="bannerHeading font-primary">Eco Gallery</h1>
                <h2 className="bannerSubHeading">
                  Discover the beauty of nature through our lens
                </h2>
              </div>
            </motion.div>
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
