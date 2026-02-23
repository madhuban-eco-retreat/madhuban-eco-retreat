"use client";
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
    <section
      className="h-[90vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dx3aj7a40/image/upload/v1771839089/mud-house-image-madhuban-eco-retreat-bhopal.avif')",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-white text-center px-4"
      >
        <p className=" bannerHeading mb-4 font-primary">
          Experience Life at Nature’s Rhythm
        </p>
        <p className="max-w-2xl mx-auto bannerSubHeading">
          Explore mindful, eco-friendly experiences designed around forests,
          wildlife, and peaceful living near Bhopal
        </p>
      </motion.div>
    </section>
  );
};

export default ExperiencesBanner;
