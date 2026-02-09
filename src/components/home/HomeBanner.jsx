"use client";
import React, { useEffect, useState } from "react";
import BookingWidget from "../BookingWidget";
import { motion } from "framer-motion";

const heroSlides = [
  {
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770637014/hero-4_jbtjxw.jpg",
    title: "Madhuban Eco Retreat: Eco-Luxury Forest Resort",
    subtitle:
      "Experience eco-luxury living amid the serene wilderness of Ratapani Tiger Reserve at Madhuban Eco Retreat — a peaceful forest stay offering sustainable comfort and mindful escapes.",
  },
  {
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624814/nature-trail_s7xyd3.jpg",
    title: "Sustainable Travel in India: An Eco-Luxury Retreat",
    subtitle:
      "Reconnect with nature through immersive experiences like birdwatching in Madhya Pradesh, all without compromising on comfort.",
  },
  {
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624801/hero-3_hibx9q.jpg",
    title: "Connect With Wildlife & Nature",
    subtitle:
      "Located next to the Ratapani Wildlife Sanctuary, Madhuban is ideal for serene forest walks and birdwatching adventures.",
  },
];

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section className="relative min-h-screen m-0 p-0 lg:min-h-[50vh] md:-mt-[166px] sm:-mt-[116px] max640:-mt-[116px]">
      <div className="absolute inset-0 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative min-h-screen   flex flex-col items-center justify-center text-white px-4 z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          key={currentSlide}
          className="text-center max-w-3xl"
        >
          <motion.h1
            className="font-primary   bannerHeading mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p
            className="font-arial-narrow  bannerSubHeading mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <BookingWidget />
      </motion.div>
    </section>
  );
};

export default HomeBanner;
