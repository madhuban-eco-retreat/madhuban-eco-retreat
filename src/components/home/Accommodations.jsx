"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading.jsx";
import Image from "next/image";

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

const accommodations = [
  {
    title: "Safari Tent",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.webp",
    alt: "Nature Tent",
    description:
      "Experience one of the most unique jungle stays near Bhopal with our eco-luxury safari tents featuring open-to-sky showers, forest views, and crafted cane interiors.",
  },
  {
    title: "Mud Houses",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Mud_House_Image_2_-_Madhuban_Eco_Retreat_Bhopal_lbzlrg.webp",
    alt: "Mud Houses",
    description:
      "Inspired by the Gond tribes, these mud cottages offer rustic charm and sustainable comfort — making them one of the most loved eco stays in Madhya Pradesh.",
  },
  {
    title: "Pool Side Villa",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Pool_Image_3_Madhuban_Eco_Retreat.webp",
    alt: "Pool Side Villa - Madhuban Eco Retreat Bhopal",
    description:
      "For travelers seeking leisure and calm, our poolside villas combine scenic views, wellness-friendly spaces, and forest-side luxury.",
  },
  {
    title: "Glamping Tents",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-glamping-tent-image-2.jpg",
    alt: "Glamping Tents - Madhuban Eco Retreat Bhopal",
    description:
      "Enjoy boutique-style glamping with chic décor, ensuite bathrooms, and private sit-outs — perfect for a stylish forest experience.",
  },
  {
    title: "Camping Tents",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/camping-tent-image-1-madhuban-eco-retreat-bhopal.webp",
    alt: "Camping Tent",
    description:
      "Ideal for adventure seekers looking for a pure nature experience, our camping tents offer a peaceful, off-grid stay under starry skies.",
  },
];

const Accommodations = () => {
  return (
    <section className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[rgb(110,97,70)]">
      <div className="max-w-6xl mx-auto">
        {/* --- Header Section --- */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            as="h2"
            text={"Our Accommodations"}
            color={"#fff"}
          />
          <h3 className="text-lg md:text-2xl font-primary text-white tracking-wider">
            Eco-Luxury Stays in the Heart of Ratapani
          </h3>
          <p className="mt-1 max-w-2xl text-justify md:text-center mx-auto text-sm md:text-lg text-white px-4 tracking-wide font-arial-narrow">
            Every stay at Madhuban Eco Retreat is designed...
          </p>
        </motion.div>

        {/* --- Cards Section --- */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 -mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {accommodations.map((item, index) => (
            <motion.div
              key={index}
              // Height is driven by content now rather than pinned at 450px,
              // which is what made these cards run so long.
              className="group relative overflow-hidden rounded-xl bg-[#D1C8C1] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col will-change-transform"
              variants={itemVariants}
            >
              {/* Image - fixed height so the picture is the dominant element */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={75}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-primary text-primary-gray2 text-sm md:text-base font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-[#3a3d45]/70 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-3">
                  <Link
                    href="/stay-in-ratapani-tiger-reserve"
                    className="text-xs text-primary-gray2 underline-offset-2 hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- Explore Button --- */}
        <motion.div
          className="text-center mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Link
            href="/stay-in-ratapani-tiger-reserve"
            className="font-arial-narrow text-primary-gray2 inline-flex items-center justify-center h-10 px-6 md:h-12 md:px-8 bg-[#D1C8C1] hover:font-bold rounded-md font-medium p-text transition-all"
          >
            Explore All Accommodations
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Accommodations;
