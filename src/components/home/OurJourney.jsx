"use client";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { facebook, instagram } from "@/utills/constants";
import { motion } from "framer-motion";
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
  "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771574124/beyondyourexpectation-customer-review-for-madhuban-eco-retreat.avif",
  "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771574122/charlies12ways-customer-review-for-madhuban-eco-retreat.webp",
  "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624809/pre-wedding-shoot-at-madhuban-eco-retreat-bhopal.jpg",
];

const OurJourney = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-20 px-4 md:px-1 bg-[#D1C8C1]">
      <div className="container mx-auto">
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
            <motion.a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.2 }}
            >
              <Image
                width={32}
                height={32}
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="w-8 h-8"
                aria-label="instagram"
              />
            </motion.a>
            <motion.a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.2 }}
            >
              <Image
                width={32}
                height={32}
                src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
                alt="Facebook"
                className="w-8 h-8"
                aria-label="facebook"
              />
            </motion.a>
            <motion.a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.2 }}
            >
              <Image
                width={32}
                height={32}
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-8 h-8"
                aria-label="whatsapp"
              />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          {/* Manual image on top */}
          <motion.div
            className="mb-4 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771574136/vidhya-balan-stay-review-at-madhuban-eco-retreat-bhopal.webp"
              alt="Manual"
              className="xl:w-[50vw] xl:h-[50vh] object-cover rounded-md sm:w-[100vw] max640:w-[100vw]"
            // className="w-[50vw] h-[50vh]  object-cover rounded-md sm:w-screen max640:w-screen "
            />
          </motion.div>

          {/* Grid of 4 Instagram images */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {instagramPosts.map((url, index) => (
              <motion.div
                key={index}
                className="aspect-square min-h-[200px] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(url)}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  width={500}
                  height={500}
                  src={url}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  aria-label="instagram"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center items-center relative mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                width={500}
                height={500}
                src="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771574132/radhika-goyal-customer-review-for-madhuban-eco-retreat.avif"
                alt="Video Thumbnail"
                className="xl:w-[25vw] xl:h-[50vh] object-cover rounded-md sm:w-[100vw] max640:w-[100vw]"
                aria-label="thumbnail"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-4 hover:scale-105 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-[#29561F]"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.271 11.653l4.5-3.5a.5.5 0 000-.806l-4.5-3.5A.5.5 0 006 4.5v7a.5.5 0 00.271.153z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modal Popup */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
              <div className="relative w-full max-w-4xl px-4">
                <button
                  className="absolute top-2 right-4 text-white text-3xl font-bold z-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
                <video
                  autoPlay
                  playsInline
                  className="w-full h-[100vh] rounded-md"
                >
                  <source
                    src="https://res.cloudinary.com/dx3aj7a40/video/upload/v1770624880/insta-4_dncg3z.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </motion.div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurJourney;
