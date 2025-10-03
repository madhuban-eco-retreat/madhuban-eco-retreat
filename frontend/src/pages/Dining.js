import React, { useState } from "react";
import "./Dining.css";
import { Helmet } from "react-helmet-async";

const Dining = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const photos = [
    { id: 1, url: "/images/dining/dining1.jpeg" },
    { id: 2, url: "/images/dining/dining2.jpg" },
    { id: 3, url: "/images/dining/dining3.jpg" },
    { id: 4, url: "/images/dining/dining8.jpg" },
    { id: 5, url: "/images/dining/dining5.jpg" },
    { id: 6, url: "/images/dining/dining6.jpg" },
    { id: 7, url: "/images/dining/dining7.jpg" },
    { id: 8, url: "/images/dining/dining9.jpg" },
  ];

  const videos = [
    { id: 1, url: "/images/dining/dining.mp4" },
    { id: 1, url: "/images/dining/dining1.mp4" },
    // Add more if needed
  ];

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="farm-to-table bg-[#D1C8C1]">
      {/* -----------------Meta Tag start -------------------------------------------------------- */}
      <Helmet>
        <title>
          farm to table dining Bhopal, organic food retreat, and sustainable
          cuisine India
        </title>
        <meta
          name="description"
          content="farm to table dining Bhopal, organic food retreat, sustainable cuisine India, local tribal produce, clean eating"
        />
      </Helmet>
      {/* -----------------Meta Tag End -------------------------------------------------------- */}
      <div className="relative w-full h-[85vh] overflow-hidden rounded-bl-[60px] rounded-br-[60px]">
        <img
          loading="lazy"
          src="/images/dining/dining10.jpg"
          alt="Farm Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-inter font-medium">
            Farm-To-Fork Experience
          </h1>
          <p className="font-inter text-lg md:text-2xl mt-2">
            Fresh ingredients from our farm to your plate
          </p>
        </div>
      </div>

      <section className="gallery-section ">
        <div className="flex items-center justify-center mb-8">
          <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
          <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
            Photo Gallery
          </h2>
          <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
        </div>
        {/* <h2 className="text-green-900 text-3xl font-inter font-bold text-center -mt-4 mb-4">
          Photo Gallery
        </h2> */}
        <div className="media-grid">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="media-item"
              onClick={() => setSelectedMedia(photo)}
            >
              <img src={photo.url} alt={photo.title || "Photo"} />
              <div className="media-title">{photo.title}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-5 -mt-7">
          <div className="flex items-center justify-center">
            <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
            <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
              Video Gallery
            </h2>
            <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
          </div>
        </div>

        <div
          className={`media-grid ${videos.length === 1 ? "single-media" : ""}`}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="media-item"
              onClick={() => setSelectedMedia(video)}
            >
              <video>
                <source src={video.url} type="video/mp4" />
              </video>
              <div className="media-title">{video.title}</div>
            </div>
          ))}
        </div>
      </section>

      {selectedMedia && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {selectedMedia.url.includes(".mp4") ? (
              <video controls autoPlay>
                <source src={selectedMedia.url} type="video/mp4" />
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || "Media"}
              />
            )}
            <h3>{selectedMedia.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dining;
