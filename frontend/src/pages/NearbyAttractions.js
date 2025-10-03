import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

const NearbyAttractions = () => {
  const heroSlides = [
    { image: "/images/BhimBetika/bhim4.jpeg" },
    { image: "/images/SaruMaruCaves/smCaves5.jpg" },
    { image: "/images/SaruMaruCaves/smCaves1.jpg" },
    { image: "/images/nature/nature8.jpg" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const cardData = [
    {
      title: "Ratapani Widlife Sanctuary",
      image: "/images/NearbyAttractions/Ratapani_Widlife_Sanctuary.jpg",
      description:
        "The Ratapani Wildlife Sanctuary boasts a forest area of around 688 sq. km – mainly comprising a beautiful teak forest. Although the tiger holds the position of top predator in the park, leopards, striped hyenas, jackals, Indian foxes and wild dogs also inhabit its forested tracts.",
    },
    {
      title: "Ginnorgarh Tribal Fort",
      image: "/images/NearbyAttractions/Ginnorgarh_Tribal_Fort.jpg",
      description:
        "Ginnorgarh fort {Dated 1200 BC} in Sehore district {M.P.}. Located in the Ratapani Tiger reserve on a rocky summit rising to 700m, Ginnorgarh has two natural water bodies and a fortified enclosure with the remains of several palaces, gatehouses and cisterns.",
    },
    {
      title: "Bhimbetika Rock Shelter Site",
      image: "/images/NearbyAttractions/Bhimbetika_Rock_Shelter_Site.jpg",
      description:
        "The Bhimbetka rock shelters are an archaeological site in central India that spans the prehistoric Paleolithic and Mesolithic periods, as well as the historic period. It exhibits the earliest traces of human life in India and evidence of Stone Age starting at the site in Acheulian times.",
    },
    {
      title: "Satpura Tiger Reserve",
      image: "/images/NearbyAttractions/Satpura_Tiger_Reserve.jpg",
      description:
        "Satpura Tiger Reserve (STR) also known as Satpura National Park is located in the Hoshangabad, Madhya Pradesh in India. Its name is derived from the Satpura range.",
    },
    {
      title: "Saru Maru Caves",
      image: "/images/NearbyAttractions/Saru_Maru_Caves.jpg",
      description:
        "Saru Maru is the archaeological site of an ancient monastic complex and Buddhist caves. The site is located near the village of Pangoraria, Madhya Pradesh, India.",
    },
    {
      title: "Narmada River Darshan",
      image: "/images/NearbyAttractions/Narmada_River_Darshan.jpg",
      description:
        "Sethani Ghat is a 19th-century construction along the banks of the river Narmada at Narmadapuram in Madhya Pradesh in India. It is one of the largest ghats in India.",
    },
    {
      title: "Salkanpur Devi Temple",
      image: "/images/NearbyAttractions/Salkanpur_Devi_Temple.jpg",
      description:
        "This sacred siddhpeeth of Vindhyavasni Beejasan devi (one of the incarnation of the 'Hindu' goddess 'Durga' is on an 800 foot high hillrock, in the village Salkanpur near Rehti village.",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Nearby Attractions | Madhuban Eco Retreat</title>
        <meta
          name="description"
          content="Explore the best attractions near Madhuban Eco Retreat, including Ratapani Wildlife Sanctuary, ancient temples, and cultural sites in Bhopal."
        />
      </Helmet>

      <div className="min-h-screen bg-[#D1C8C1] pt-[104px] ">
        {/* Hero Section */}
        <section className="relative h-[85vh] m-0 p-0 ">
          <div className="absolute inset-0 overflow-hidden h-[70vh] rounded-bl-[60px] rounded-br-[60px]  mt-7">
            <AnimatePresence>
              {heroSlides.map(
                (slide, index) =>
                  index === currentSlide && (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </section>
        <section className=" px-4 rounded-bl-[60px] rounded-br-[60px]">
          <div className="text-center mb-12 -mt-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[rgb(110,97,70)] tracking-widest leading-tight">
              Beyond the Retreat !.. <br></br>Experience the Soul of Madhya
              Pradesh!!
            </h1>
          </div>
          <motion.div
            className="flex flex-wrap justify-center gap-8 max-w-[86rem] mx-auto"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {cardData.map((card, index) => (
              <motion.div
                key={index}
                className="w-80 bg-[rgb(110,97,70)] rounded-lg shadow-lg overflow-hidden"
                variants={item}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.img
                  className="w-full h-40 object-cover"
                  src={card.image}
                  alt={card.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
                <div className="px-6 py-4">
                  <div className="font-arial-narrow text-[#D1C8C1] font-bold tracking-wider text-xl text-center mb-2">
                    {card.title}
                  </div>
                  <p className="font-arial-narrow text-[#D1C8C1] text-base tracking-wide text-justify">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default NearbyAttractions;
