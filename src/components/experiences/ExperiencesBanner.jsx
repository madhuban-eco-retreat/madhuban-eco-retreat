"use client";

import Image from "next/image";
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

const ExperiencesBanner = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771844127/cultural-tribal-dance-madhuban-eco-retreat.avif"
        alt="Cultural tribal dance at Madhuban Eco Retreat near Bhopal"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-20 text-white text-center px-4 max-w-4xl"
      >
        <p className="bannerHeading mb-4 font-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Experience Life at Nature’s Rhythm
        </p>

        <p className="bannerSubHeading text-base sm:text-lg md:text-xl">
          Explore mindful, eco-friendly experiences designed around forests,
          wildlife, and peaceful living near Bhopal
        </p>
      </motion.div>
    </section>
  );
};

export default ExperiencesBanner;