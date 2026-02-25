"use client";
import Link from "next/link";
import { motion } from "framer-motion";
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
const ReadyForEcoRetreat = () => {
  return (
    <section
      className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[#FAFAFA]"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dx3aj7a40/image/upload/v1771839088/mud-house-madhuban-eco-retreat-bhopal.avif')",
      }}
    >
      {" "}
      <div className="backdrop w-full h-full"></div>
      <div className="container mx-auto">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            text={"Ready for Your Eco Retreat in Madhya Pradesh?"}
            color="#fff"
            textClasses={"w-[80%] md:w-fit"}
          />

          <p className="mt-4 max-w-2xl mx-auto text-lg text-white px-4 tracking-wide font-arial-narrow">
           Escape to nature without leaving comfort behind.
          </p>
          <p className="mt-4 max-w-2xl mx-auto p-text text-white px-4 tracking-wide font-arial-narrow">
           Book your stay at Madhuban Eco Retreat — the perfect jungle resort in Ratapani for peaceful getaways, wellness travel, and nature exploration. Your best weekend getaway near Bhopal starts here.
          </p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/booking"
                className="px-8 py-3 bg-[#D1C8C1]  hover:font-bold  text-[rgb(110,97,70)] transition rounded-md font-primary font-extrabold text-lg tracking-wider"
              >
                Book Your Stay
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyForEcoRetreat;
