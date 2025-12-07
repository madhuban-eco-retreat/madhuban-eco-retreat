import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Helmet,
  // HelmetProvider
} from "react-helmet-async";
import { BedDouble, Users, Leaf, Wifi, Sun, MountainSnow } from "lucide-react";
import { motion } from "framer-motion";
import "./Stay.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// const cardHoverVariants = {
//   hover: {
//     y: -10,
//     transition: {
//       duration: 0.3,
//       ease: "easeOut",
//     },
//   },
// };

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

const buttonHoverVariants = {
  rest: { width: 0 },
  hover: { width: "100%" },
};

const accommodationsData = [
  {
    id: 1,
    name: "Safari Tent",
    slug: "safari-tent",
    image: "/images/accommodations/safari-tent.jpg",
    altText: "Exterior view of a charming safari tent nestled in greenery",
    shortDescription:
      "Perched on raised platforms beside a gentle stream and facing forested mountains, our classic safari-style tents offer a true wilderness experience. Each tent is tastefully furnished with elegant cane furniture and features a vanity and dressing area, separate toilet and shower, and even an open-to-sky shower with a private relaxation space..",
    keyFeatures: [
      {
        icon: <Leaf size={18} className="text-white" />,
        text: "Eco-Friendly Design",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Queen Bed",
      },
      { icon: <Sun size={18} className="text-white" />, text: "Solar Powered" },
      { icon: <Wifi size={18} className="text-white" />, text: "Wi-Fi Access" },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 2,
    name: "Mud Houses",
    slug: "mud-villa",
    image: "/images/accommodations/mud-villa.jpg",
    altText: "Exterior view of a charming mud villa nestled in greenery",
    shortDescription:
      "Our mud-based cottages, inspired by the vernacular architecture of the Gond tribes, are nestled in the heart of a 5-acre organic orchard. Each Mud House features a spacious air-conditioned room, an annexed lobby, front and backyard verandas, and a traditionally styled luxury bathroom. The rooftop seating area offers a 360-degree view of the entire resort perfect for quiet evenings or stargazing.",
    keyFeatures: [
      {
        icon: <Leaf size={18} className="text-white" />,
        text: "Eco-Friendly Design",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Queen Bed",
      },
      { icon: <Sun size={18} className="text-white" />, text: "Solar Powered" },
      { icon: <Wifi size={18} className="text-white" />, text: "Wi-Fi Access" },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 3,
    name: "Pool Side Villa",
    slug: "pool-side-room",
    image: "/images/accommodations/pool-side-room.jpeg",
    altText: "Poolside room with beautiful garden views",
    shortDescription:
      "Wake up to sunlight dancing on water and unwind to the soothing rhythm of nature in our elegant Pool Side Villa. Overlooking a tranquil eco-pool and surrounded by greenery, these rooms offer the perfect blend of modern living and serene outdoor beauty. Whether it’s a refreshing morning dip, sipping chai by the pool, or lounging in peaceful silence, this space invites you to slow down and truly relax.",
    keyFeatures: [
      {
        icon: <MountainSnow size={18} className="text-white" />,
        text: "Panoramic Forest Views",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Comfortable Double Bed",
      },
      {
        icon: <Leaf size={18} className="text-white" />,
        text: "Sustainably Built",
      },
      {
        icon: <Users size={18} className="text-white" />,
        text: "Cozy Reading Nook",
      },
    ],
    capacity: "Sleeps 4",
  },
  {
    id: 4,
    name: "Glamping Tents",
    slug: "glamping-tents",
    image: "/images/accommodations/glamping-tent1.jpg",
    altText: "Boutique glamping tent with deck and lush lawn",
    shortDescription:
      "Experience comfort in the wild with our rustic mini-safari glamping tents. Enjoy chic interiors, a private lawn sit-out, ensuite bathroom, and curated amenities that balance the charm of camping with boutique luxury.",
    keyFeatures: [
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "King Size Bed",
      },
      {
        icon: <Users size={18} className="text-white" />,
        text: "Double Occupancy",
      },
      {
        icon: <Leaf size={18} className="text-white" />,
        text: "Private Lawn Area",
      },
      { icon: <Wifi size={18} className="text-white" />, text: "Wi-Fi & Workspace" },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 5,
    name: "Camping Tent",
    slug: "camping-tent",
    image: "/images/accommodations/comping-tent11.jpeg",
    altText: "Scenic camping tent surrounded by nature",
    shortDescription:
      "For those craving simplicity with comfort, our eco-friendly Camping Tents offer an immersive outdoor experience in the heart of Ratapani’s lush wilderness. Ideal for solo travelers, couples, or families seeking a digital detox, each tent allows you to unplug, unwind, and reconnect with nature, all without disturbing the environment. Expect the charm of camping, with the thoughtful care of our hospitality.",
    keyFeatures: [
      {
        icon: <MountainSnow size={18} className="text-white" />,
        text: "Panoramic Forest Views",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Comfortable Double Bed",
      },
      {
        icon: <Leaf size={18} className="text-white" />,
        text: "Sustainably Built",
      },
      {
        icon: <Users size={18} className="text-white" />,
        text: "Cozy Reading Nook",
      },
    ],
    capacity: "Sleeps 2",
  },
];

const Stay = () => {
  const videoRef = useRef(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePlayWithSound = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play();
      setIsSoundPlaying(true);
    }
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPaused(false);
      } else {
        video.pause();
        setIsPaused(true);
      }
    }
  };
  return (
    <div className="stay-page bg-[#b4a681d8]">
      {/* -----------------Meta Tag start -------------------------------------------------------- */}
      <Helmet>
        <title>
          eco-friendly, cottages, nature stays, near Bhopal, sustainable, Madhya
          Pradesh
        </title>
        <meta
          name="description"
          content="Eco retreat in Ratapani wildlife sanctuary in Bhopal, eco-friendly accommodation near Bhopal, sustainable cottages, nature stay India, off-grid retreats, eco tourism Madhya Pradesh"
        />
      </Helmet>
      {/* -----------------Meta Tag End -------------------------------------------------------- */}

      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[90vh] overflow-hidden rounded-bl-[60px] rounded-br-[60px]"
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/instagram/insta-4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Text + Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10 bg-black/30 px-4 space-y-4">
          {!isSoundPlaying ? (
            <button
              onClick={handlePlayWithSound}
              className="px-6 py-3 bg-[rgb(110,97,70)] text-[#D1C8C1] font-semibold rounded-full shadow-md hover:scale-105 transition"
            >
              ▶ Play with Sound
            </button>
          ) : (
            <button
              onClick={togglePause}
              className="px-6 py-3 bg-[rgb(110,97,70)] text-[#D1C8C1] font-semibold rounded-full shadow-md hover:scale-105 transition"
            >
              {isPaused ? "⏵ Resume Video" : "⏸ Pause Video"}
            </button>
          )}

          <motion.h1
            className="font-sitka-banner font-medium text-4xl md:text-6xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover Your Ideal Retreat
          </motion.h1>
          <motion.p
            className="font-arial-narrow text-lg md:text-2xl mt-2 max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            At Madhuban, every stay offers a harmonious blend of natural
            serenity and modern comfort.
          </motion.p>
        </div>
      </motion.div>

      {/* Accommodations Section */}
      <section className="accommodations-section">
        <div className="flex justify-center -mt-8">
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-3">
              <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
                Our Accommodations
              </h2>
              <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
          </motion.div>
        </div>
        <motion.p
          className="section-description font-arial-narrow text-[rgb(110,97,70)] tracking-wider text-justify"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Experience soulful living through our thoughtfully designed
          eco-accommodation options at Madhuban Eco Retreat—from rustic Mud
          Villas and elegant Safari Tents to boutique Glamping Tents, cozy
          Camping Tents, and scenic Poolside Rooms. Each space is crafted to
          blend sustainability, comfort, and charm, providing a serene escape
          into nature without compromising on modern essentials. Perfect for
          eco-travelers, families, couples, and wellness seekers looking for a
          unique stay amidst the wild beauty of Madhya Pradesh.
        </motion.p>

        {accommodationsData.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
          >
            {accommodationsData.map((accommodation) => (
              <motion.div
                key={accommodation.id}
                className="accommodation-card w-full md:w-[350px] h-[100vh] flex flex-col max500:min-h-[820px] max-367:min-h-[967px]"
                variants={itemVariants}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                        <motion.div
                          className="image-wrapper"
                          variants={imageHoverVariants}
                        >
                          <motion.img
                            src={accommodation.image}
                            alt={accommodation.altText}
                            className="w-full h-full object-cover"
                            transition={{ duration: 0.5 }}
                          />
                        </motion.div>

                        <div className="p-6 flex flex-col flex-grow bg-[#D1C8C1]">
                          <h3 className="text-3xl font-sitka-banner font-semibold text-[rgb(110,97,70)] tracking-widest mb-2">
                            {accommodation.name}
                          </h3>
                          <p className="font-arial-narrow text-[rgb(110,97,70)] tracking-wider text-sm mb-4 flex-grow text-justify">
                            {accommodation.shortDescription}
                          </p>

                          <div className="mb-4">
                            <h4 className="text-base font-sitka-banner font-semibold tracking-widest text-[rgb(110,97,70)] mb-3">
                              Key Features:
                            </h4>
                            <ul className="font-openSans grid grid-cols-4 max-[496px]:grid-cols-2 gap-6 justify-between">
                              {accommodation.keyFeatures.map(
                                (feature, index) => (
                                  <motion.li
                                    key={index}
                                    className="flex flex-col items-center text-[#ada49e] text-xs"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(110,97,70)] group/icon mb-2">
                                      {feature.icon}
                                      <motion.span
                                        className="absolute inset-0 rounded-full bg-[rgb(110,97,70)] opacity-0 group-hover/icon:opacity-30"
                                        animate={{
                                          scale: [1, 1.5, 1],
                                          opacity: [0, 0.3, 0],
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Infinity,
                                          repeatDelay: 0.5,
                                        }}
                                      />
                                    </span>
                                    <span className="text-center font-medium leading-tight">
                                      {feature.text}
                                    </span>
                                  </motion.li>
                                )
                              )}
                            </ul>
                          </div>

                          <p className="text-base text-[rgb(110,97,70)] mb-4">
                            <strong className="font-sitka-banner font-medium">
                              Capacity:
                            </strong>{" "}
                            {accommodation.capacity}
                          </p>

                          <Link
                            to={`/stay/${accommodation.slug}`}
                            className="mt-auto relative inline-block w-full text-center bg-[rgb(110,97,70)] text-white font-medium py-3 px-6 rounded-md overflow-hidden"
                          >
                            <motion.span
                              className="absolute inset-0 bg-[rgb(117,105,83)] h-full"
                              variants={buttonHoverVariants}
                              transition={{ duration: 0.5 }}
                            />
                            <span className="relative z-10 font-sitka-banner tracking-widest font-medium">
                              View Details & Book
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-center text-gray-700 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            More details about our accommodations are coming soon. Please check
            back later!
          </motion.p>
        )}
      </section>
    </div>
  );
};

export default Stay;
