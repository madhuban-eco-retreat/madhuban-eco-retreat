import React, { useState, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./PhotoGallery.css";

const tabs = [
  "Madhuban Eco Retreat",
  "Trible Culture At Madhuban",
  "Forest & Nature",
  "Bhim Bettika",
  "Saru Maru Caves",
];

const mediaContent = {
  "Madhuban Eco Retreat": [
    { type: "image", src: "/images/BhimBetika/bhim1.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim2.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim3.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim4.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim5.jpg" },
  ],
  "Trible Culture At Madhuban": [
    { type: "image", src: "/images/SaruMaruCaves/smCaves1.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves2.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves3.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves4.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves5.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves6.jpg" },
  ],
  "Forest & Nature": [
    { type: "image", src: "/images/BhimBetika/bhim1.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim2.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim3.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim4.jpg" },
    { type: "image", src: "/images/BhimBetika/bhim5.jpg" },
  ],
  "Bhim Bettika": [
    { type: "image", src: "/images/SaruMaruCaves/smCaves1.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves2.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves3.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves4.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves5.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves6.jpg" },
  ],
  "Saru Maru Caves": [
    { type: "image", src: "/images/SaruMaruCaves/smCaves1.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves2.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves3.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves4.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves5.jpg" },
    { type: "image", src: "/images/SaruMaruCaves/smCaves6.jpg" },
  ],
  Gallery: [{ type: "video", src: "/images/bird/gallery-video.mp4" }],
};

const PhotoGallery = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    NativeFancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      NativeFancybox.destroy();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-50 pt-[104px]">
      {/* Banner Section */}
      <section className="relative h-[85vh] m-0 p-0">
        <div className="absolute inset-0 overflow-hidden h-[70vh] rounded-bl-[60px] rounded-br-[60px]">
          <video
            src="/images/bird/gallery-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-6xl font-bold">Eco Gallery</h1>
            <p className="text-lg md:text-2xl mt-2">
              Discover the beauty of nature through our lens
            </p>
          </div>
        </div>
      </section>

      {/* Tab Section */}
      <section className="py-8 px-4 -mt-16 rounded-bl-[60px] rounded-br-[60px] bg-stone-50">
        <div className="max-w-[86rem] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Photo Gallery</h2>

          <div className="flex justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mx-2 px-4 py-2 font-semibold border-b-2 transition-all duration-300 text-lg ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaContent[activeTab].map((item, index) => (
              <div
                key={index}
                className="media-item bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {item.type === "image" ? (
                  <a href={item.src} data-fancybox="gallery" className="block">
                    <img
                      src={item.src}
                      alt="gallery"
                      className="w-full h-auto rounded-lg object-cover object-center"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <video controls className="w-full rounded-lg shadow-md">
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhotoGallery;
