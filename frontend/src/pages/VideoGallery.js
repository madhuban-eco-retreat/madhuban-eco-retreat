import React, { useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./VideoGallery.css";

const VideoGallery = () => {
  useEffect(() => {
    NativeFancybox.bind('[data-fancybox="gallery"]', {
      Html: {
        video: {
          autoplay: true,
        },
      },
      Carousel: {
        infinite: true,
      },
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  const videos = [
    {
      src: "/images/bird/gallery-video.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/videos/nature-trails.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/videos/nature-trails1.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/videos/PF.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/videos/safari-tent.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/images/Gallery/gallery-video.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/images/Gallery/gallery-video1.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/images/Gallery/gallery-video2.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/images/Gallery/gallery-video3.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/images/Gallery/gallery-video4.mp4",
      // caption: "PF Documentary",
    },
    {
      src: "/videos/retreat-intro.mp4",
      // caption: "PF Documentary",
    },
  ];

  return (
    <div className="video-gallery">
      {/* Banner Section */}
      <div className="relative w-full h-[85vh] overflow-hidden rounded-bl-[60px] rounded-br-[60px]">
        <video
          src="/videos/retreat-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Video Gallery</h1>
          <p className="text-lg md:text-2xl mt-2">
            Experience our resort through motion
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2>Video Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map(({ src, caption }, index) => (
            <div key={index} className="media-item">
              <a
                href={src}
                data-fancybox="gallery"
                data-caption={caption}
                data-type="html5video"
                data-html5video={JSON.stringify({
                  source: [{ src, type: "video/mp4" }],
                  autoplay: true,
                  controls: true,
                })}
                className="block relative aspect-video bg-black"
              >
                <video
                  src={src}
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="play-button">
                  <svg
                    className="w-8 h-8 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="media-title">{caption}</div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VideoGallery;
