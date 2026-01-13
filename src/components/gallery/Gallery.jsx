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
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288937/gallery17_gddpm8.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288900/gallery-video_lxgi5u.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288939/gallery5_vcmqdv.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288935/gallery-video5_oqmnfe.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288935/gallery15_pi78aq.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288930/gallery-video4_fgufwe.mp4",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288930/gallery-video-7_rzrvzt.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288919/gallery-18_gncakv.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288920/gallery-19_ttjjcd.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288920/gallery-20_r5ou58.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288922/gallery-21_iy3p9q.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288922/gallery-22_lcwwmq.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288923/gallery-23_i3xqvy.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288926/gallery-video-6_ull4os.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288925/gallery-25_hoigtj.jpg",
    },
  ],
  "Tribal Culture At Madhuban": [
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288938/gallery3_ftanlw.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288939/gallery4_zygz59.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288845/culture-3_svlsce.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288846/culture-4_ylmslo.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288844/culture-2_xjkyoo.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288848/culture-7_cidelh.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288844/culture-1_tkbppn.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288847/culture-5_mfbqww.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288847/culture-6_d2x1ix.jpg",
    },
  ],
  "Forest & Nature": [
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288818/nature7_ixb8so.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288809/nature-trails_ctdm7m.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288816/nature6_j5mqzr.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288807/nature-video_sqffoq.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288891/bird3_gbzwca.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288806/nature-video1_cyqrsr.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288814/nature3_ucohza.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288808/nature-video2_emsvei.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288886/bird11_rzi05w.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288816/nature5_yajyuo.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288890/bird2_iulmns.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288893/bird6_domeru.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288808/nature10_omicfx.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288808/nature11_pjhnv0.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288809/nature12_pfhmy3.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288809/nature13_ym99wl.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288810/nature14_flm4h3.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288810/nature15_u32n8p.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288811/nature16_dozutp.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288812/nature17_gsp9x7.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288812/nature18_ujttwn.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288813/nature19_cxtdme.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288814/nature20_bmtca0.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288896/bird7_enkzkv.jpg",
    },
  ],
  "Bhim Bettika": [
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288876/bhim1_txawpc.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288880/bhim2_io8aa3.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288881/bhim3_jgeaz1.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288882/bhim4_nzgvnx.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288883/bhim5_thvrkb.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288883/bhim6_qckvtg.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288880/bhim15_qzihcf.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288880/bhim14_cahcdm.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288879/bhim13_exasqh.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288876/bhim10_lyupkc.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288877/bhim11_hyb58e.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288878/bhim12_xogwqp.jpg",
    },
  ],
  "Saru Maru Caves": [
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288828/smCaves1_xq7gmn.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288829/smCaves_wvdefc.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288831/smCaves2_drzodl.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288832/smCaves3_ozcyiu.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288832/smCaves4_f9q4ql.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288833/smCaves5_hcqodp.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288836/smCaves7_olaf2a.jpg",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/djxgpbncu/video/upload/v1768288831/smCaves1_upcwfe.mp4",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288838/smCaves8_f9adfo.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288837/smCaves9_fxwlqp.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288832/smCaves12_pi6fdp.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288832/smCaves11_hbqa8g.jpg",
    },
  ],
  "Ginnorgarh Fort": [
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288944/GF_l7iqap.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288945/GF1_nk4opu.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288946/GF2_sspav2.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288947/GF3_jbjaln.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288947/GF4_gxn1k7.jpg",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288948/GF5_ybake4.jpg",
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
              "https://res.cloudinary.com/djxgpbncu/video/upload/v1768294865/gallery-bg-video_ox5a5e.mp4"
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
