"use client";

import { motion } from "framer-motion";
import ExperienceCard from "@/components/ExperienceCard";
import Link from "next/link";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

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

const experiences = [
  {
    title: "Forest Walks & Nature Trails",
    path: "forest-walks-and-nature-trails",
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624814/nature-trail_s7xyd3.jpg",
    description:
      "Reconnect with the wilderness through guided forest walks and nature trails inside the Ratapani region. Learn about native plants, medicinal herbs, butterflies, and eco-systems while enjoying peaceful, device-free moments in the forest.",
    idealFor: "Nature lovers, wellness travelers, families, photographers",
    learnMoreBtn: "Explore Forest Walks",
  },
  {
    title: "Bird Watching & Wilderness",
    path: "bird-watching-and-wilderness",
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624794/bird-watching_ydrpde.jpg",
    description:
      "Witness over 70+ species of birds across pristine landscapes — from paradise flycatchers to orioles and kingfishers. Our guided birding sessions offer a serene wilderness experience ideal for enthusiasts and researchers.",
    learnMoreBtn: "Explore Bird Watching",
    idealFor:
      "Bird watchers, wildlife photographers, students, silent nature seekers",
  },
  {
    title: "Recreational Facilities",
    path: "recreational-facilities",
    image:
      "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770626146/Recreational-Facilities_10mb_hydgrj.jpg",
    description:
      "Relax and unwind with eco-friendly recreation — from indoor games and cycling tracks to hammocks, swings, open-air seating, children zones, and quiet reading corners.",
    learnMoreBtn: "Explore Recreational Activities",
    idealFor: " Families, corporate retreats, wellness travelers, group",
  },
];
const ImmersiveExperiences = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-[#D1C8C1]">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            text={"Immersive Experiences in Ratapani’s Wilderness"}
            textClasses={"w-[80%] md:w-fit"}
          />

          <p className="mt-1 max-w-2xl mx-auto p-text p-text-black px-4 tracking-wide font-arial-narrow">
            Connect with nature, wildlife, and local culture through
            thoughtfully curated experiences that bring you closer to the soul
            of Madhya Pradesh.
          </p>
        </motion.div>
        {/* Adjusted grid columns for exactly 3 items */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-9 "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {experiences.map((experience, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ExperienceCard experience={experience} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Link
            href="/experiences"
            className="font-arial-narrow text-white px-8 py-3 bg-primary-gray2 hover:font-bold rounded-md font-medium p-text inline-block"
          >
            Explore All Experiences
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ImmersiveExperiences;
