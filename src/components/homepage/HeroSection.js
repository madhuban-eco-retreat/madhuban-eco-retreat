"use client";

import React from "react";
import Link from "next/link";
import { MdOutlineDateRange } from "react-icons/md";

import { motion } from "framer-motion";

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

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const getSuffix = (d) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${month} ${day}${getSuffix(day)}, ${year}`;
}

export default function HeroSection({
  breadcom = [],
  title = ``,
  createdAt = ``,
  image = "",
}) {
  return (
    <>
      <section
        className="h-[90vh] bg-cover bg-center "
        style={{ backgroundImage: `url(${image})` }}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center relative"
          style={{
            background:
              "linear-gradient(180deg,rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.4) 80%)",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-white flex gap-2 mb-4"
          >
            <MdOutlineDateRange size={22} />{" "}
            <span className=" mr-2">{formatDate(createdAt)}</span>
          </motion.div>
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-white text-center px-4 max-w-5xl"
            >
              <h1
                className="bannerHeading  mb-4 font-primary"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </motion.div>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="absolute bottom-6"
          >
            {breadcom?.length > 0 && (
              <div className="max-w-7xl mx-auto flex justify-center w-screen    ">
                <div className="flex items-center text-white text-md max-w-[90%]   ">
                  <Link href="/" className="hover:underline ">
                    {` Home`}
                  </Link>
                  {breadcom.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="px-1 ">/</span>
                      {item?.url ? (
                        <Link href={item.url} className="hover:underline px-1">
                          {item.title}
                        </Link>
                      ) : (
                        <span className="px-1 text-white truncate">
                          {item.title}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
