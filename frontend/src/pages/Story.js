import React from "react";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Helmet } from "react-helmet-async";

// Framer Motion import
import { motion } from "framer-motion";

const Story = () => {
  const storyImages = [
    {
      id: 1,
      src: "/images/story/story-image-5.jpg",
      alt: "Our founders planning the retreat",
    },
    {
      id: 2,
      src: "/images/story/story-image-2.jpg",
      alt: "Early construction phase",
    },
    {
      id: 3,
      src: "/images/story/story-image-6.jpg",
      alt: "First guests enjoying the eco-camp",
    },
    {
      id: 4,
      src: "/images/story/story-image-1.jpg",
      alt: "The retreat as it looks today",
    },
    {
      id: 5,
      src: "/images/story/story-image-7.jpg",
      alt: "Community involvement event",
    },
  ];

  return (
    <header className="w-full px-0 py-12 bg-[rgb(173,168,159)] ">
      {/* -----------------Meta Tag start -------------------------------------------------------- */}
      <Helmet>
        <title>
          Madhuban ECO Retreat, eco-friendly living in Madhya Pradesh, and
          sustainable travel experience in India
        </title>
        <meta
          name="description"
          content="Madhuban ECO Retreat, eco-friendly living in Madhya Pradesh, sustainable travel experience in India"
        />
      </Helmet>
      {/* -----------------Meta Tag End -------------------------------------------------------- */}

      {/* Image Carousel Section */}
      <motion.div
        className="w-full mb-12 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {storyImages.map((image) => (
            <SwiperSlide key={image.id}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full object-cover min-h-[70vh] lg:min-h-[85vh] md:min-h-[85vh] sm:min-h-[85vh] max640:min-h-[85vh] sm:mt-[41px] md:mt-[60px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] pt-[22px] max500:min-h-[65vh]"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx>{`
          .swiper-pagination-bullet {
            background: #d1fae5;
            opacity: 1;
          }

          .swiper-pagination-bullet-active {
            background: #22c55e;
          }

          .swiper-scrollbar-drag {
            background-color: #22c55e;
          }
        `}</style>
      </motion.div>

      {/* Story Text */}
      <section className="py-5">
        <div className="flex justify-center mb-6 -mt-10">
          <motion.div
            className="mx-auto flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center">
              <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
              <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
                About Madhuban Eco Retreat
              </h2>
              <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-12 px-4">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="/images/story/story-image-6.jpg"
              alt="Madhuban Eco Retreat"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 prose prose-lg text-justify font-arial-narrow tracking-wider text-[rgb(110,97,70)] text-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5">
              Just outside the vibrant city of Bhopal, lies a quiet corner where
              time slows down and nature takes the lead. This is where the
              vision for Madhuban Eco Retreat was born, not as a business plan,
              but as a heartfelt response to a world growing increasingly
              distant from nature.
            </p>
            <p className="mb-5">
              What was once dry, unused land has transformed into a lush,
              self-sustaining retreat, the result of years of dedication,
              community support, and a deep commitment to eco-friendly living in
              Madhya Pradesh.
            </p>
            <p className="mb-5">
              Madhuban is more than just a weekend getaway. It is a space for
              reflection, healing, and learning, a place where people from all
              walks of life come to reconnect with the natural rhythms of the
              earth. We welcome families, solo travellers, artists, researchers,
              and anyone seeking a meaningful, sustainable travel experience in
              India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Group Section */}
      <motion.section
        className="py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <img
                  src="/images/logo/group-logo.png"
                  alt="Madhuban Eco Retreat Logo"
                  className="w-64 h-auto object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              className="font-arial-narrow tracking-wider w-full md:w-1/2 prose prose-lg text-justify text-[rgb(110,97,70)] text-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-5">
                The Somaiya Group, an 80-year-old corporate house, is the force
                behind this vision. With a rich legacy in diverse fields such as
                Chemicals, Education, Healthcare, Social Development, and
                Agriculture,{" "}
                <span className="font-bold"> "Madhuban Eco Retreat"</span> marks
                their first foray into hospitality. Built on the principles of
                nature-based, responsible tourism, this project not only
                promotes sustainability but also supports livelihood generation
                for the local community.
              </p>
              <p>
                Guided by this vision, we make a conscious effort to employ
                local youth, source staff and materials locally, and ensure our
                retreat contributes positively to the surrounding ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </header>
  );
};

export default Story;
