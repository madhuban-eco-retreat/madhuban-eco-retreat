import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const VISION = {
  title: "Our Vision",
  description:
    "To be a leading eco-retreat in India where people rediscover the joy of simple living, deepen their connection with nature, and leave with a renewed sense of purpose. We envision a world where hospitality doesn't come at the cost of the environment, and travel helps heal the planet, one stay at a time.",
};

const MISSION = {
  title: "Our Mission",
  description:
    "At Madhuban ECO Retreat, our mission is to offer authentic, earth-friendly experiences that promote well-being, community engagement, and environmental responsibility. Through eco-conscious accommodation, organic farm-to-table food, nature-based activities, and local partnerships, we aim to create a retreat that nourishes both the guest and the land.",
};

const CORE_VALUES = [
  {
    title: "Sustainability",
    description:
      "Every decision we make, from construction to cuisine, puts the planet first.",
  },
  {
    title: "Community",
    description:
      "We work hand-in-hand with local artisans, farmers, and tribal communities to ensure everyone grows together.",
  },
  {
    title: "Simplicity",
    description:
      "We believe the most profound experiences often come from the simplest moments …a morning walk, a fresh meal, a quiet sunset.",
  },
  {
    title: "Authenticity",
    description:
      "Nothing here is artificial. Not the food, not the architecture, not the stories we share.",
  },
  {
    title: "Learning",
    description:
      "Every guest becomes a part of our learning ecosystem whether it's through organic farming, birdwatching, or cultural exchange.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const VisionMission = () => {
  return (
    <>
      {/* Banner Section */}
      <section
        className="h-[90vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero/hero-2.jpg')" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Smarter Living Starts Here
          </h1>
          <p className="text-lg md:text-xl">
            Experience eco-luxury designed for harmony with nature and holistic
            well-being. <br></br>Reconnect, recharge, and live better,
            naturally.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-[#D1C8C1]">
        {/* -----------------Meta Tag start -------------------------------------------------------- */}
        <Helmet>
          <title>
            Our Vision & Values, Eco-Retreat in India for Sustainable,
            Community-Led Travel
          </title>
          <meta
            name="description"
            content="eco-retreat in India, sustainable tourism vision, nature-based travel, eco-conscious accommodation, organic farm-to-table retreat, nature-based activities in Bhopal, sustainable hospitality, Our Vision & Values, Eco-Retreat in India for Sustainable, Community-Led Travel "
          />
        </Helmet>
        {/* -----------------Meta Tag End -------------------------------------------------------- */}
        <div className="py-8 md:py-16 w-11/12 lg:w-10/12 xl:w-1200 m-auto">
          <div className="space-y-16">
            {/* Vision */}
            <motion.div
              className="relative w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* Image Full Width */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src="/images/misionVison/ms13.jpg"
                  alt="Our Vision"
                  className="w-full h-[95vh] object-cover"
                />
              </motion.div>

              {/* Overlayed Text Content */}
              <div className="relative inset-0 flex flex-col justify-center items-center text-center px-4 md:px-16 bg-black/30">
                <div className="absolute xl:bottom-[20rem] xl:left-[2rem] lg:bottom-[28rem] lg:left-[20rem] md:bottom-[30rem] md:left-[10rem] sm:bottom-[29rem] sm:left-[4rem] max640:bottom-[27rem] max640:left-0 max500:bottom-[25rem] max-340:bottom-[7rem] max-Xsm:bottom-[15rem]">
                  {/* <h3 className="font-sitka-banner font-semibold text-4xl md:text-4xl text-[rgb(110,97,70)] tracking-wider mb-4">
                    Our Vision
                  </h3> */}
                  <div className="flex items-center justify-center">
                    <hr className="w-16 border-t border-[#a2790d] mr-4" />
                    <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#e9a907] font-semibold tracking-wider mb-4">
                      {VISION.title}
                    </h2>
                    <hr className="w-16 border-t border-[#a2790d] ml-4" />
                  </div>
                  <p className="font-arial-narrow text-white tracking-wide text-xl text-justify max-w-md font-bold">
                    {VISION.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              className="relative w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* Image Full Width */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src="/images/misionVison/ms12.jpg"
                  alt="Our Vision"
                  className="w-full h-[95vh] object-cover"
                />
              </motion.div>

              {/* Overlayed Text Content */}
              <div className="relative inset-0 flex flex-col justify-center items-center text-center px-4 md:px-16 bg-black/30">
                <div className="absolute xl:bottom-[20rem] xl:left-[10rem] lg:bottom-[28rem] lg:left-[20rem] md:bottom-[28rem] md:left-[6rem] sm:bottom-[28rem] sm:left-[3rem] max640:bottom-[25rem] max500:bottom-[23rem] max-Xsm:bottom-[16rem]">
                  <div className="flex items-center justify-center">
                    <hr className="w-16 border-t border-[#a2790d] mr-4" />
                    <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#e9a907] font-semibold tracking-widest mb-4">
                      {MISSION.title}
                    </h2>
                    <hr className="w-16 border-t border-[#a2790d] ml-4" />
                  </div>
                  <p className="font-arial-narrow text-white tracking-wide text-xl text-justify max-w-md font-bold">
                    {MISSION.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div
              className="relative w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* Image Full Width */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src="/images/misionVison/ms15.jpg"
                  alt="Our Vision"
                  className="w-full h-[95vh] max640:min-h-[1000px] object-cover"
                />
              </motion.div>

              {/* Overlayed Text Content */}
              <div className="relative inset-0 flex flex-col justify-center items-center text-center px-4 md:px-16 bg-black/30">
                <div className="absolute xl:bottom-[20rem] lg:bottom-24 md:bottom-24 sm:bottom-9 max640:bottom-[15rem] max500:bottom-[9rem] max-Xsm:bottom-20 max-340:bottom-0">
                  <div className="flex items-center justify-center">
                    <hr className="w-16 border-t border-[#a2790d] mr-4" />
                    <h2 className="text-4xl md:text-5xl font-sitka-banner text-[#a2790d] font-semibold tracking-wider mb-4">
                      Our Core Values
                    </h2>
                    <hr className="w-16 border-t border-[#a2790d] ml-4" />
                  </div>
                  {/* <ul className="space-y-6 text-center">
                    {CORE_VALUES.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex flex-col items-center justify-center gap-2 px-4"
                      >
                        <h4 className="text-pink-400 font-bold text-2xl">
                          {item.title}
                        </h4>
                        <p className="text-white text-lg font-bold">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul> */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-center">
                    {CORE_VALUES.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex flex-col items-center justify-center gap-2 px-4"
                      >
                        <h4 className="text-green-600 font-bold text-2xl">
                          {item.title}
                        </h4>
                        <p className="font-arial-narrow text-white tracking-wide text-xl font-bold">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisionMission;
