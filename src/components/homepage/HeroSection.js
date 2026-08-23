"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MdOutlineDateRange } from "react-icons/md";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [day, month, year] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const d = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });
  const y = date.getFullYear();
  const getSuffix = (d) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  return `${monthName} ${d}${getSuffix(d)}, ${y}`;
}

export default function HeroSection({
  breadcom = [],
  title = "",
  createdAt = "",
  image = "",
}) {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <section className="h-[60vh] md:h-[90vh] relative">
      {/* Background Image */}
      <Image
        src={imgSrc}
        alt={title || "Madhuban Eco Retreat Banner"}
        fill
        priority
        quality={90}
        sizes="(max-width: 768px) 100vw, 100vw"
        className="object-cover object-center"
        onError={() =>
          setImgSrc(
            "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image-banner.png"
          )
        }
      />

      {/* Overlay */}
      <div
        className="w-full h-full flex flex-col items-center justify-center relative z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 80%)",
        }}
      >
        {/* Date */}
        {createdAt && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-white flex gap-2 mb-4"
          >
            <MdOutlineDateRange size={22} />
            <span>{formatDate(createdAt)}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-white text-center px-4 max-w-4xl"
        >
          <h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold font-primary mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </motion.div>

        {/* Breadcrumb */}
        {breadcom?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="absolute bottom-6 w-full"
          >
            <div className="max-w-6xl mx-auto px-4 flex justify-center">
              <div className="flex items-center flex-wrap gap-1 text-white text-sm">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                {breadcom.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="px-1">/</span>
                    {item?.url ? (
                      <Link href={item.url} className="hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      <span className="text-white/80 truncate max-w-[200px]">
                        {item.title}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}