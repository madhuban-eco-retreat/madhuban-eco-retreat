"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { getAltFromUrl } from "@/utills/helperFunctions";

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

const Slidingbanner = ({ images = [], heading, subHeading, buttonLink }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={false} //prevents blank cloned slide
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id || index}>
            <div className="relative w-full h-full">
              <Image quality={90}
                src={image.src}
                alt={getAltFromUrl(image.src)}
                fill
                sizes="100vw"
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      {(heading || subHeading) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black/40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center px-4"
          >
            <div className="max-w-7xl">
              {heading && (
                <h1 className="bannerHeading font-primary">{heading}</h1>
              )}

              {subHeading && (
                <h2 className="bannerSubHeading mt-4">{subHeading}</h2>
              )}

              {buttonLink && (
                <Link
                  href={buttonLink}
                  className="inline-block mt-6 px-6 py-3 bg-moss-green text-white rounded-lg hover:bg-moss-green transition"
                >
                  Explore More
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Swiper Pagination Styling */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background: #D1C8C1;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #6E6146;
        }
      `}</style>
    </div>
  );
};

export default Slidingbanner;
