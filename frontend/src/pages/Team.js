import React from "react";
import { motion } from "framer-motion";

const members = [
  {
    id: 1,
    name: "John Doe",
    role: "Project Manager",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Developer",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    role: "Designer",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 4,
    name: "Bob Brown",
    role: "QA Engineer",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 5,
    name: "Charlie Black",
    role: "DevOps",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 6,
    name: "Sara White",
    role: "Marketing",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 7,
    name: "Tom Hardy",
    role: "Support",
    img: "/images/story/story-image-7.jpg",
  },
  {
    id: 8,
    name: "Lisa Green",
    role: "Business Analyst",
    img: "/images/story/story-image-7.jpg",
  },
];

const Team = () => {
  return (
    <>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[85vh] overflow-hidden rounded-bl-[60px] rounded-br-[60px]"
      >
        <motion.img
          src="/images/newImages/image2.jpg"
          alt="Accommodations Banner"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
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

      {/* Content */}
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        {/* Section title */}
        <div className="flex justify-center mb-6 lg:-mt-[3rem] md:mt-8 sm:mt-4 max640:mt-4">
          <motion.div
            className="mx-auto flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
                Discover Our Team
              </h2>
              <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[#D1C8C1]"
            >
              <img
                className="object-cover w-full h-56"
                src={member.img}
                alt={member.name}
              />
              <div className="py-5 text-center">
                <a
                  href="/team"
                  className="block text-xl font-bold text-[rgb(110,97,70)]"
                >
                  {member.name}
                </a>
                <span className="text-sm text-[rgb(110,97,70)]">
                  {member.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Team;
