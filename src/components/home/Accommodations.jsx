"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading.jsx";
import Image from "next/image";

// The reveal animates position only, never opacity. Gating opacity on
// whileInView means the server ships the cards at opacity:0 and nothing but
// client JS can bring them back, so a hydration failure or slow/blocked
// bundle leaves the section blank. BlogListWithPagination carries a note
// about hitting exactly that. Animating `y` alone keeps the motion while the
// markup stays legible with no JS at all.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20 },
  visible: {
    y: 0,
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

// `slug` points each card at its detail page. Only the five slugs that exist
// in accommodationsData are used - mud-house-premium has no marketing page yet
// and would 404, so Mud Houses points at mud-house-standard.
const accommodations = [
  {
    title: "Safari Tent",
    slug: "safari-tent",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.webp",
    alt: "Nature Tent",
    description:
      "Experience one of the most unique jungle stays near Bhopal with our eco-luxury safari tents featuring open-to-sky showers, forest views, and crafted cane interiors.",
  },
  {
    title: "Mud Houses",
    slug: "mud-house-standard",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Mud_House_Image_2_-_Madhuban_Eco_Retreat_Bhopal_lbzlrg.webp",
    alt: "Mud Houses",
    description:
      "Inspired by the Gond tribes, these mud cottages offer rustic charm and sustainable comfort — making them one of the most loved eco stays in Madhya Pradesh.",
  },
  {
    title: "Pool Side Villa",
    slug: "pool-side-villa",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Pool_Image_3_Madhuban_Eco_Retreat.webp",
    alt: "Pool Side Villa - Madhuban Eco Retreat Bhopal",
    description:
      "For travelers seeking leisure and calm, our poolside villas combine scenic views, wellness-friendly spaces, and forest-side luxury.",
  },
  {
    title: "Glamping Tents",
    slug: "glamping-tents",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-glamping-tent-image-2.jpg",
    alt: "Glamping Tents - Madhuban Eco Retreat Bhopal",
    description:
      "Enjoy boutique-style glamping with chic décor, ensuite bathrooms, and private sit-outs — perfect for a stylish forest experience.",
  },
  {
    title: "Camping Tents",
    slug: "camping-tent",
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
          className="text-center mb-6 md:mb-8"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {accommodations.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              {/* The whole card is the link. "View details" is a styled span
                  rather than a second <Link>, since an anchor inside an anchor
                  is invalid and breaks keyboard navigation. */}
              <Link
                href={`/stay-in-ratapani-tiger-reserve/${item.slug}`}
                aria-label={`View details for ${item.title}`}
                className="group relative h-full overflow-hidden rounded-xl bg-[#D1C8C1] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col isolate"
              >
                {/* Image - fixed height so the picture is the dominant element */}
                <div className="relative h-48 md:h-56 w-full overflow-hidden">
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
                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <h3 className="font-primary text-primary-gray2 text-base md:text-lg font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#3a3d45]/70 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <span className="mt-3 text-xs text-primary-gray2 underline-offset-2 group-hover:underline">
                    View details →
                  </span>
                </div>
              </Link>
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
