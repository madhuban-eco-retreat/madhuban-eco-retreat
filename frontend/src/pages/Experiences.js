// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// import { Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";

// const Experiences = () => {
//   const storyImages = [
//     {
//       id: 1,
//       src: "/images/story/story-image-5.jpg",
//       alt: "Our founders planning the retreat",
//     },
//     {
//       id: 2,
//       src: "/images/story/story-image-2.jpg",
//       alt: "Early construction phase",
//     },
//     {
//       id: 3,
//       src: "/images/story/story-image-6.jpg",
//       alt: "First guests enjoying the eco-camp",
//     },
//     {
//       id: 4,
//       src: "/images/story/story-image-4.jpg",
//       alt: "The retreat as it looks today",
//     },
//     {
//       id: 5,
//       src: "/images/story/story-image-7.jpg",
//       alt: "Community involvement event",
//     },
//   ];

//   const imageCategories = [
//     {
//       id: "machan",
//       name: "Machan Stay",
//       images: [
//         {
//           id: 1,
//           src: "/images/story/story-image-4.jpg",
//           alt: "Luxury Machan View",
//         },
//         {
//           id: 2,
//           src: "/images/story/story-image-4.jpg",
//           alt: "Inside the Machan",
//         },
//         {
//           id: 3,
//           src: "/images/story/story-image-4.jpg",
//           alt: "Machan Night View",
//         },
//       ],
//     },
//     {
//       id: "adventure",
//       name: "Adventure",
//       images: [
//         {
//           id: 1,
//           src: "/images/experiences/bird.jpg",
//           alt: "Adventure trail start",
//         },
//         {
//           id: 2,
//           src: "/images/experiences/bird1.jpg",
//           alt: "Forest hike view",
//         },
//         {
//           id: 3,
//           src: "/images/experiences/tiger.jpg",
//           alt: "Bird watching point",
//         },
//       ],
//     },
//     {
//       id: "wellness",
//       name: "Wellness",
//       images: [
//         {
//           id: 1,
//           src: "/images/story/story-image-5.jpg",
//           alt: "Morning Yoga Session",
//         },
//         {
//           id: 2,
//           src: "/images/story/story-image-5.jpg",
//           alt: "Spa and Wellness",
//         },
//         {
//           id: 3,
//           src: "/images/story/story-image-5.jpg",
//           alt: "Nature meditation",
//         },
//       ],
//     },
//   ];

//   const [activeCategory, setActiveCategory] = useState("machan");
//   const selectedImages =
//     imageCategories.find((cat) => cat.id === activeCategory)?.images || [];

//   const handleScrollDown = () => {
//     window.scrollBy({
//       top: window.innerHeight,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="w-full px-0 py-12 relative">
//       {/* Top Banner Swiper */}
//       <div className="w-full mb-12 mt-2 relative">
//         <Swiper
//           modules={[Pagination, Scrollbar, A11y, Autoplay]}
//           spaceBetween={0}
//           slidesPerView={1}
//           pagination={{ clickable: true }}
//           loop={true}
//           autoplay={{ delay: 4000, disableOnInteraction: false }}
//           className="w-full"
//         >
//           {storyImages.map((image) => (
//             <SwiperSlide key={image.id}>
//               <img
//                 src={image.src}
//                 alt={image.alt}
//                 className="w-full h-auto object-cover md:h-[91vh]"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <button
//           onClick={handleScrollDown}
//           className="absolute left-1/2 bottom-12 z-10 -translate-x-1/2 animate-bounce"
//           aria-label="Scroll down"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-12 h-12 md:w-14 md:h-14 text-green-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={3}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </button>

//         <style jsx>{`
//           .swiper-pagination-bullet {
//             background: #d1fae5;
//             opacity: 1;
//           }
//           .swiper-pagination-bullet-active {
//             background: #22c55e;
//           }
//         `}</style>
//       </div>

//       {/* Folder-Grid Section */}
//       <div className="w-full flex flex-col md:flex-row px-4 md:px-12 py-8 gap-6">
//         {/* Left Folders */}
//         <div className="w-full md:w-1/3 space-y-4">
//           {imageCategories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setActiveCategory(category.id)}
//               className={`w-full text-left px-4 py-3 border rounded-lg shadow-md hover:bg-green-100 transition ${
//                 activeCategory === category.id
//                   ? "bg-green-200 border-green-500"
//                   : "bg-white"
//               }`}
//             >
//               <h3 className="text-xl font-semibold">{category.name}</h3>
//             </button>
//           ))}
//         </div>

//         {/* Right Image Grid */}
//         <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {selectedImages.map((image) => (
//             <div
//               key={image.id}
//               className="rounded-lg overflow-hidden shadow-md"
//             >
//               <img
//                 src={image.src}
//                 alt={image.alt}
//                 className="w-full h-48 object-cover"
//               />
//               <p className="p-2 text-sm text-gray-700">{image.alt}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Experiences;
