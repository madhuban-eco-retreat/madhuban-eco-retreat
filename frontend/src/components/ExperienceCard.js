// src/components/ExperienceCard.js
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ExperienceCard = ({ experience }) => {
  const { title, image, description } = experience;
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className=" group relative rounded-lg overflow-hidden shadow-lg h-96 hover:shadow-xl transition-all duration-300">
      {/* Background Image with zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay with hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      </div>

      {/* Content with slide-up effect on hover  text-[rgb(110,97,70)]*/}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white  transition-all duration-500 transform translate-y-0 group-hover:-translate-y-2">
        <h3 className="text-white font-sitka-banner tracking-wider font-semibold text-2xl mb-2 lg:text-[21px]">
          {title}
        </h3>
        <p className="font-arial-narrow tracking-wide font-medium text-lg text-[#f1f8e9] md:mb-[200px] sm:mb-24 lg:mb-32 mb-20 group-hover:opacity-100 max-h-0 max500:mb-28">
          {description}
        </p>
        <Link
          to={`/experiences/${slug}`}
          // className="inline-flex items-center text-[#9d7b2b] font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 hover:text-[#b89335]"
          className="inline-flex items-center max-340:mt-40 max-Xsm:mt-36 max-sm:mt-24 xl:mt-14 lg:mt-24 text-white font-arial-narrow font-semibold tracking-wider group-hover:opacity-100 hover:text-[#033A06]"
        >
          Learn More{" "}
          <ChevronRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ExperienceCard;
