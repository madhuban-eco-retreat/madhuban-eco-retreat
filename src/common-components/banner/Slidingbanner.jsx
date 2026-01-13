"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { motion } from "framer-motion";

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

const Slidingbanner = ({ images, heading, subHeading }) => {
  return (
    <motion.div className="w-full  relative">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full object-cover min-h-[70vh] lg:min-h-[85vh] md:min-h-[85vh] sm:min-h-[85vh] max640:min-h-[85vh] sm:mt-[41px] md:mt-[60px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] pt-[22px] max500:min-h-[65vh]"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {heading || subHeading ? (
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
              <h1 className="bannerHeading font-primary">{heading}</h1>
              {subHeading && <h2 className="bannerSubHeading">{subHeading}</h2>}
            </div>
          </motion.div>
        </div>
      ) : null}

      <style jsx>{`
        .swiper-pagination-bullet {
          background: #d1fae5;
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background: #22c55e;
        }

        .swiper-scrollbar-drag {
          background-color: #22c55e;
        }
      `}</style>
    </motion.div>
  );
};

export default Slidingbanner;
