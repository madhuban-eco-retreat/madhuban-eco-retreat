// src/components/SustainabilityFeature.js
import React from "react";
import { Droplet, Sun, Leaf, RefreshCw } from "lucide-react";

const SustainabilityFeature = ({ feature }) => {
  const { icon, title, description } = feature;

  // Map icon names to Lucide React components
  const iconMap = {
    "water-drop": Droplet,
    sun: Sun,
    leaf: Leaf,
    recycle: RefreshCw,
  };

  // Get the appropriate icon component
  const IconComponent = iconMap[icon] || Leaf;

  return (
    <div className="bg-[#1aa321] bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
      <div className="mb-4">
        <IconComponent className="w-10 h-10" />
      </div>
      <h3 className="font-sitka-banner tracking-widest text-white font-medium  text-xl mb-2">
        {title}
      </h3>
      <p className="font-sitka-banner tracking-wider text-white text-opacity-90">
        {description}
      </p>
    </div>
  );
};

export default SustainabilityFeature;
