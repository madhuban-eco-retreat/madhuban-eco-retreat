"use client";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { facebook, instagram, phone } from "@/utills/constants";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { getAltFromUrl } from "@/utills/helperFunctions";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const instagramPosts = [
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/beyondyourexpectation-customer-review-for-madhuban-eco-retreat.webp",
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/charlies12ways-customer-review-for-madhuban-eco-retreat.webp",
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/pre-wedding-shoot-at-madhuban-eco-retreat-bhopal.webp",
];

const OurJourney = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-12 md:py-16 px-4 md:px-1 bg-[#D1C8C1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto -mt-10 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text={"Follow Our Journey"} />
          <motion.div
            className="flex justify-center items-center space-x-4 mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { name: "Instagram", href: instagram, Icon: FaInstagram },
              { name: "Facebook", href: facebook, Icon: FaFacebookF },
              { name: "WhatsApp", href: `https://wa.me/${phone}`, Icon: FaWhatsapp },
            ].map(({ name, href, Icon }) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.2 }}
                aria-label={name}
                title={name}
                className="inline-flex items-center justify-center w-11 h-11 text-[rgb(110,97,70)] hover:text-[rgb(132,116,85)] transition-colors"
              >
                <Icon className="w-7 h-7" aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          {/* Main Large Image */}
          <motion.div className="mb-4 flex justify-center items-center">
            <div className="relative xl:w-[50vw] xl:h-[50vh] w-full h-[40vh] overflow-hidden rounded-md">
              <Image
                src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/vidhya-balan-stay-review-at-madhuban-eco-retreat-bhopal.webp"
                alt="Vidya Balan Review"
                fill
                className="object-cover"
                // Large image, but below the fold, so lazy load with specific sizes
                sizes="(max-width: 1280px) 100vw, 50vw"
                quality={85}
              />
            </div>
          </motion.div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {instagramPosts.map((url, index) => (
              <motion.div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(url)}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={url}
                  alt={getAltFromUrl(url)}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={75}
                />
              </motion.div>
            ))}
          </div>

          {/* Video Thumbnail Section */}
          <div className="flex justify-center items-center relative mt-4">
            <div
              className="relative cursor-pointer xl:w-[25vw] xl:h-[50vh] w-full h-[40vh]"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/radhika-goyal-customer-review-for-madhuban-eco-retreat.webp"
                alt="Video Thumbnail"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 1280px) 100vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-4 hover:scale-105 transition shadow-lg">
                  <PlayIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Modal with AnimatePresence for smooth fade */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              >
                <div className="relative w-full max-w-4xl max-h-[90vh]">
                  <button
                    className="absolute -top-12 right-0 inline-flex items-center justify-center w-11 h-11 text-white text-3xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                  <video
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full max-h-[80vh] rounded-md shadow-2xl"
                    preload="auto" // Load only when modal opens
                  >
                    <source
                      src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/journey/insta-video.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-[#29561F]"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M6.271 11.653l4.5-3.5a.5.5 0 000-.806l-4.5-3.5A.5.5 0 006 4.5v7a.5.5 0 00.271.153z" />
  </svg>
);

export default OurJourney;
