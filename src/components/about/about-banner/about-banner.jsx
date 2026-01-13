import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768292392/story-image-5_udk4s0.jpg",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768292703/stay3_rakqxv.jpg",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288842/stay-4_x1k7le.jpg",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288826/pool2_sor23g.jpg",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288843/story-image-7_oh2vtu.jpg",
    alt: "Community involvement event",
  },
];

const AboutBanner = () => {
  return (
    <Slidingbanner
      images={storyImages}
      heading={"About Madhuban Eco Retreat"}
      subHeading={
        "A serene eco-retreat where nature, comfort, and conscious travel come together"
      }
    />
  );
};

export default AboutBanner;
