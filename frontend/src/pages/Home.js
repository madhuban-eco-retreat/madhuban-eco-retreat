// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BookingWidget from "../components/BookingWidget";
import TestimonialSlider from "../components/TestimonialSlider";
import ExperienceCard from "../components/ExperienceCard";
import SustainabilityFeature from "../components/SustainabilityFeature";
import { motion } from "framer-motion";

// Animation variants
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

// const scaleUp = {
//   hidden: { scale: 0.95, opacity: 0 },
//   visible: {
//     scale: 1,
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   },
// };

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "/images/hero/hero-1.jpg",
      title: "Madhuban: Your Eco Retreat in Bhopal",
      subtitle:
        "Experience sustainable luxury and serene forest walks in the heart of Madhya Pradesh.",
    },
    {
      image: "/images/hero/hero-2.jpg",
      title: "Sustainable Travel in India: An Eco-Luxury Retreat",
      subtitle:
        "Reconnect with nature through immersive experiences like birdwatching in Madhya Pradesh, all without compromising on comfort.",
    },
    {
      image: "/images/hero/hero-3.jpg",
      title: "Connect With Wildlife & Nature",
      subtitle:
        "Located next to the Ratapani Wildlife Sanctuary, Madhuban is ideal for serene forest walks and birdwatching adventures.",
    },
  ];

  const experiences = [
    {
      title: "Forest Walks & Nature Trails",
      image: "/images/experiences/nature-trail.jpg",
      description:
        "Explore the wild beauty of Madhuban ECO Retreat through our guided Forest Walks and Nature Trail, immerse yourself in bird songs, fresh air, and the healing calm of untouched greenery.",
    },
    {
      title: "Bird Watching & Wilderness",
      image: "/images/experiences/bird-watching.jpg",
      description:
        "Discover the joy of Bird Watching and Wilderness at Madhuban ECO Retreat and spot rare species, enjoy peaceful moments, and reconnect with nature in a truly untouched forest ecosystem.",
    },
    {
      title: "Recreational Facilities",
      image: "/images/experiences/Recreational-Facilities.jpg",
      description:
        "Unwind with our eco-friendly Recreational Facilities at Madhuban ECO Retreat and enjoy indoor games, open-air seating, cycling trails, and peaceful spaces. all are thoughtfully designed to refresh your body, mind, and spirit, naturally.",
    },
  ];

  const sustainabilityFeatures = [
    {
      icon: "water-drop",
      title: "Water Conservation",
      description: "Rainwater harvesting and water recycling systems",
    },
    {
      icon: "sun",
      title: "Solar Energy",
      description: "80% of our energy needs met by solar power",
    },
    {
      icon: "leaf",
      title: "On-site farm providing fresh produce",
      description: "Comprehensive recycling and composting program",
    },
    // {
    //   icon: "recycle",
    //   title: "Zero Waste",
    //   description: "Comprehensive recycling and composting program",
    // },
  ];

  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-stone-50 pt-[220px]">
      {/* -----------------Meta Tag start -------------------------------------------------------- */}
      <Helmet>
        <title>
          Eco Retreat Bhopal | Sustainable Travel India | Madhuban Resort
        </title>
        <meta
          name="description"
          content="Eco retreat in Ratapani wildlife sanctuary in Bhopal, birdwatching Madhya Pradesh, organic farming experience, sustainable travel in India, forest walks"
        />
        <link rel="canonical" href="/home" />
      </Helmet>
      {/* -----------------Meta Tag End -------------------------------------------------------- */}
      {/* Hero Section */}
      <section className="relative min-h-screen m-0 p-0 lg:min-h-[50vh] md:-mt-[166px] sm:-mt-[116px] max640:-mt-[116px]">
        {/* Hero Image Slider */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative min-h-screen   flex flex-col items-center justify-center text-white px-4 z-10 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            key={currentSlide}
            className="text-center max-w-3xl"
          >
            <motion.h1
              className="font-sitka-banner tracking-widest font-medium  text-5xl md:text-6xl mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              className="font-arial-narrow tracking-wider text-xl md:text-2xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/booking"
                  className="font-arial-narrow tracking-wider px-8 py-3 text-[#D1C8C1] bg-[rgb(110,97,70)] transition rounded-md font-semibold text-lg inline-block"
                >
                  Book Now
                </Link>
              </motion.div> */}

              {/* <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/experiences"
                  className="px-8 py-3 tracking-wider text-[#D1C8C1] bg-[rgb(110,97,70)] transition rounded-md font-arial-narrow font-semibold text-lg inline-block"
                >
                  Explore Experiences
                </Link>
              </motion.div> */}
            </motion.div>
          </motion.div>
        </div>

        {/* Booking Widget */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <BookingWidget />
        </motion.div>
      </section>
      {/* About Section  bg-[rgb(190,175,145)]*/}
      <section className="pt-20 pb-8 md:px-8 bg-[#D1C8C1] min-h-[60vh] max640:pt-0 max640:text-center">
        <div className="max-w-7xl mx-auto px-2 py-7 md:px-6">
          <motion.div
            className="grid md:grid-cols-2 xl:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Text Section text-[rgb(110,97,70)] */}
            <motion.div className="h-full" variants={itemVariants}>
              <h2 className="font-sitka-banner tracking-widest font-bold md:text-[30px] text-2xl text-[rgb(110,97,70)] mb-6 text-center">
                Welcome to "Madhuban Eco Retreat"
              </h2>

              <p className="font-arial-narrow text-lg mb-6 text-[rgb(110,97,70)] tracking-wider text-justify">
                Nestled near the pristine Ratapani Wildlife Sanctuary,
                <span className="font-bold"> Madhuban Eco Retreat</span> offers
                a harmonious blend of luxury and sustainability. Our retreat is
                designed to offer an immersive nature experience from serene
                forest walks to hands-on farming activities all while ensuring
                minimal environmental impact. We are a premier destination for
                sustainable travel in India
              </p>
              <p className="text-lg font-arial-narrow  text-[rgb(110,97,70)] tracking-wider text-justify">
                From eco-friendly accommodations to farm-to-fork dining sourced
                from our on-site farm, every detail at Madhuban Eco Retreat is
                thoughtfully curated to celebrate and protect the natural beauty
                that surrounds us. Enjoy exceptional birdwatching in Madhya
                Pradesh, right from our grounds.
              </p>
            </motion.div>

            {/* Video Section */}
            <motion.div
              className="h-full"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <video
                id="about-video"
                ref={videoRef}
                src="/videos/retreat-intro.mp4"
                className="rounded-lg shadow-xl w-full h-full object-cover"
                loop
                muted
                playsInline
                style={{ background: "#000", minHeight: "300px" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Accommodations Preview */}
      <section className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[rgb(110,97,70)]">
        <div className="container mx-auto">
          {/* --- THE WORLD AWAITS Section --- */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-gray-400 mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-gray-400 font-semibold tracking-wider">
                Our Accommodations
              </h2>
              <hr className="w-16 border-t border-gray-400 ml-4" />
            </div>
            <p className="mt-1 max-w-2xl mx-auto text-lg text-gray-400 px-4 tracking-wide font-arial-narrow">
              From earthy Mud Houses to elegant Safari Tents, cozy Camping Tents
              to tranquil Poolside Rooms, every stay at Madhuban ECO Retreat is
              crafted to blend comfort, sustainability, and the soothing charm
              of nature.
            </p>
          </motion.div>

          {/* --- Cards Section --- */}
          <motion.div
            className="flex flex-wrap xl:flex-nowrap xl:space-x-8 xl:overflow-x-auto justify-center xl:justify-start gap-y-8 pb-4 -mt-10 lg:space-x-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Card 1 */}
            <motion.div
              className="w-full lg:w-[46%] xl:w-[calc(25%-16px)] 2xl:w-[300px] bg-[#D1C8C1] rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl h-[450px] flex flex-col justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-64 xl:h-[200px] overflow-hidden">
                <img
                  src="/images/accommodations/safari-tend1.jpeg"
                  alt="Nature Tent"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sitka-banner tracking-widest text-[rgb(110,97,70)] mb-2 font-semibold text-2xl">
                  Safari Tent
                </h3>
                <p className="text-[rgb(110,97,70)] font-arial-narrow text-base tracking-wide mb-4 text-justify">
                  Stay in eco-luxury Safari Tents at Madhuban ECO Retreat
                  offering comfort, nature views, and a true glimpsing
                  experience for sustainable travelers seeking peace in Ratapani
                  or Madhya Pradesh's wilderness.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-full lg:w-[46%] xl:w-[calc(25%-16px)] 2xl:w-[300px] bg-[#D1C8C1] rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl h-[450px] flex flex-col justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-64 xl:h-[200px] overflow-hidden">
                <img
                  src="/images/accommodations/mud-villa.jpg"
                  alt="Mud Houses"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sitka-banner tracking-widest text-[rgb(110,97,70)] mb-3 font-semibold text-2xl">
                  Mud Houses
                </h3>
                <p className="text-[rgb(110,97,70)] font-arial-narrow text-base tracking-wide mb-10 text-justify">
                  Experience rustic charm in our eco-friendly Mud Houses,
                  crafted with natural materials to keep interiors cool and
                  inviting. With earthy aesthetics and serene surroundings,
                  these villas offer a sustainable stay close to nature.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="w-full lg:w-[46%] xl:w-[calc(25%-16px)] 2xl:w-[300px] bg-[#D1C8C1] rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl h-[450px] flex flex-col justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-64 xl:h-[200px] overflow-hidden">
                <img
                  src="/images/accommodations/pool-side-tent.jpeg"
                  alt="Pool Side Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sitka-banner tracking-widest text-[rgb(110,97,70)] mb-2 font-semibold text-2xl">
                  Pool Side Villa
                </h3>
                <p className="text-[rgb(110,97,70)] font-arial-narrow text-base tracking-wide mb-4 text-justify">
                  Relax in our Pool Side Villa, where comfort meets scenic views.
                  These refreshing retreats are perfect for leisure, wellness,
                  and eco-conscious travelers looking to unwind in nature’s
                  embrace.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              className="w-full lg:w-[46%] xl:w-[calc(25%-16px)] 2xl:w-[300px] bg-[#D1C8C1] rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl h-[450px] flex flex-col justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-64 xl:h-[200px] overflow-hidden">
                <img
                  src="/images/accommodations/comping-tent11.jpeg"
                  alt="Camping Tent"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sitka-banner tracking-widest text-[rgb(110,97,70)] mb-2 font-semibold text-2xl">
                  Camping Tents
                </h3>
                <p className="text-[rgb(110,97,70)] font-arial-narrow text-base tracking-wide mb-4 text-justify">
                  Reconnect with nature in our cozy Camping Tents ideal for
                  adventure seekers craving a simple, off-grid escape under
                  starry skies and surrounded by tranquil forest landscapes.
                </p>
              </div>
            </motion.div>
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
              to="/stay"
              className="font-arial-narrow text-[rgb(110,97,70)] px-8 py-3 bg-[#D1C8C1] hover:font-bold rounded-md font-medium tracking-wider inline-block"
            >
              Explore All Accommodations
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Immersive Experiences Section */}
      <section className="py-8 px-4 md:px-8 bg-[#D1C8C1]">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider">
                Immersive Experiences
              </h2>
              <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
            <p className="mt-1 max-w-2xl mx-auto text-lg text-[rgb(110,97,70)] px-4 tracking-wide font-arial-narrow">
              Connect with nature, wildlife, and local culture through
              thoughtfully curated experiences that bring you closer to the soul
              of Madhya Pradesh.
            </p>
          </motion.div>
          {/* Adjusted grid columns for exactly 3 items */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-9 font-sitka-banner"
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

          {/* <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              to="/experiences"
              className="font-arial-narrow text-[#D1C8C1] px-8 py-3 bg-[rgb(110,97,70)] hover:font-bold rounded-md font-medium rounded-mdtracking-wider inline-block"
            >
              View All Experiences
            </Link>
          </motion.div> */}
        </div>
      </section>
      {/* Sustainability Section */}
      <section className="py-8 px-4 md:px-8 bg-[rgb(110,97,70)] text-white">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[#D1C8C1] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#D1C8C1] font-semibold tracking-wider">
                Our Commitment to Sustainability
              </h2>
              <hr className="w-16 border-t border-[#D1C8C1] ml-4" />
            </div>
            <p className="mt-1 max-w-2xl mx-auto text-lg font-arial-narrow text-[#D1C8C1] px-4 tracking-wide">
              We are dedicated to preserving the natural environment while
              providing an exceptional experience.
            </p>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 -mt-9 font-poppins"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {sustainabilityFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <SustainabilityFeature feature={feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Esteemed Guests Section */}
      <section className="py-8 px-4 md:px-8 bg-[#D1C8C1]">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-10 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="2xl:text-4xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wide sm:text-3xl max-Xsm:text-2xl">
                Esteemed Guests @ Madhuban Eco Retreat
              </h2>
              <hr className="w-10 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Card 1 */}
            <motion.div
              className="relative h-80 rounded-lg overflow-hidden shadow-lg group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/images/Guest/vidya1.jpg"
                alt="Guest Experience"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute  inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <div className="ml-5">
                  <h5 className="font-sitka-banner font-medium text-[rgb(190,175,145)] tracking-widest text-xl">
                    Vidya Balan
                  </h5>
                  <p className="text-[rgb(204,180,120)] text-sm tracking-wider font-arial-narrow">
                    Indian Actress
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="relative h-80 rounded-lg overflow-hidden shadow-lg group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/images/Guest/vijay1.jpg"
                alt="Guest Experience"
                className="w-[80%] h-full object-cover mx-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <div className="ml-10">
                  <h5 className="font-sitka-banner font-medium text-[rgb(190,175,145)] tracking-widest text-xl">
                    Vijay Raaz
                  </h5>
                  <p className="text-[rgb(204,180,120)] text-sm tracking-wider font-arial-narrow">
                    Indian Actor
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative h-80 rounded-lg overflow-hidden shadow-lg group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/images/Guest/samir1.png"
                alt="Guest Experience"
                className="w-[90%] h-full object-cover mx-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <div className="ml-10">
                  <h5 className="font-sitka-banner font-medium text-[rgb(190,175,145)] tracking-widest text-xl">
                    Samir Somaiya
                  </h5>
                  <p className="text-[rgb(204,180,120)] text-sm tracking-wider font-arial-narrow">
                    President, Somaiya Group
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Testimonials Section */}
      {/* <section className="py-8 px-4 md:px-8 bg-stone-200"> */}
      <section
        className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[#FAFAFA]"
        style={{
          backgroundImage: "url('/images/experiences/ex-bg.jpg')",
        }}
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-gray-400 mr-4" />
              <h2 className="text-4xl sm:text-4xl max640:text-4xl max500:text-3xl max-Xsm:text-3xl md:text-5xl font-sitka-banner text-gray-400 tracking-wider font-semibold">
                Guest Experiences
              </h2>
              <hr className="w-16 border-t border-gray-400 ml-4" />
            </div>
            <p className="mt-1 max-w-2xl mx-auto text-lg text-gray-400 px-4 tracking-wide font-arial-narrow">
              What our guests say about their stay at Madhuban Eco Retreat
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <TestimonialSlider />
          </motion.div>
        </div>
      </section>
      {/* Instagram Feed Section */}
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
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider mb-3 max500:text-3xl">
                Follow Our Journey
              </h2>
              <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
            <motion.div
              className="flex justify-center items-center space-x-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.a
                href="https://www.instagram.com/madhubanresortsomaiya"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="/images/socials/instagram.png"
                  alt="Instagram"
                  className="w-8 h-8"
                />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/share/1LHQF9QhuJ/"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-8 h-8"
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
                src="/images/instagram/vidya.jpg"
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
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="aspect-square min-h-[200px] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() =>
                    setSelectedImage(`/images/instagram/insta-${index + 1}.jpg`)
                  }
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={`/images/instagram/insta-${index + 1}.jpg`}
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
                <img
                  src="/images/instagram/insta-4-thumbanil.png"
                  alt="Video Thumbnail"
                  className="xl:w-[25vw] xl:h-[50vh] object-cover rounded-md sm:w-[100vw] max640:w-[100vw]"
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
                      src="/images/instagram/insta-4.mp4"
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
      {/* CTA Section */}
      {/* <section className="py-20 px-4 md:px-8 md:py-12 bg-stone-800 text-white"> */}
      <section
        className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[#FAFAFA]"
        style={{
          backgroundImage: "url('/images/Arts/art4.jpg')",
        }}
      >
        <div className="container mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[#D1C8C1] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#D1C8C1] font-extrabold tracking-wider">
                Ready for Your Eco Retreat?
              </h2>
              <hr className="w-16 border-t border-[#D1C8C1] ml-4" />
            </div>

            <p className="mt-1 max-w-2xl mx-auto text-lg text-[#D1C8C1] font-extrabold px-4 tracking-wide font-arial-narrow">
              Escape to nature without leaving luxury behind. Book your stay at
              Madhuban Eco Retreat and create memories that last a lifetime.
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
                  to="/booking"
                  className="px-8 py-3 bg-[#D1C8C1]  hover:font-bold  text-[rgb(110,97,70)] transition rounded-md font-sitka-banner font-extrabold text-lg tracking-wider"
                >
                  Book Your Stay
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  to="/contact"
                  className="px-8 py-3  text-[rgb(110,97,70)] bg-[#D1C8C1]  hover:font-bold transition rounded-md font-extrabold text-lg font-sitka-banner tracking-wider"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
