"use client";

import Image from "next/image";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";

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

const celebrities = [
  {
    img: "https://res.cloudinary.com/dx3aj7a40/image/upload/f_auto,q_auto,w_600/v1771574233/vidhya-balan-at-madhuban-eco-retreat-bhopal.avif",
    name: "Vidya Balan",
    details: " Indian Actress",
  },
  {
    img: "https://res.cloudinary.com/dx3aj7a40/image/upload/f_auto,q_auto,w_600/v1771580207/vijay-raaz-indian-actor-at-madhuban-eco-retreat.webp",
    name: " Vijay Raaz",
    details: "Indian Actor",
  },
  {
    img: "https://res.cloudinary.com/dx3aj7a40/image/upload/f_auto,q_auto,w_600/v1771574230/samir-somaiya-madhuban-eco-retreat-bhopal.avif",
    name: "Samir Somaiya",
    details: "President, Somaiya Group",
  },
];

const GuestsSection = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-[#D1C8C1]">
      <div className="container mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text={"Loved by Guests Across India"} />

          <div className="p-text-black p-text text-sm  md:text-xl ">
            Recognized as one of the most peaceful retreats near Bhopal,
            Madhuban Eco Retreat is cherished by families, nature lovers,
            celebrities, and wellness travelers.
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {celebrities.map((celeb, i) => (
            <motion.div
              key={i}
              className="relative h-80 rounded-lg overflow-hidden shadow-lg group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={celeb.img}
                alt={`${celeb.name} at Madhuban Eco Retreat`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className=" object-cover transition-transform duration-300 group-hover:scale-105"
                aria-label={`${celeb.name} at Madhuban Eco Retreat`}
              />
              <div className="absolute  inset-0 bg-black/50 flex flex-col justify-end p-4">
                <div className="ml-5">
                  <h3 className="font-primary  text-[rgb(190,175,145)] tracking-widest text-lg md:text-xl">
                    {celeb.name}
                  </h3>
                  <p className="text-[rgb(204,180,120)] text-sm tracking-wider font-arial-narrow">
                    {celeb.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GuestsSection;