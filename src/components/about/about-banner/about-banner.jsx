import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770626840/story-image-5_10mb_ievd5b.jpg",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770627040/Stay3.jpg_deyrex.jpg",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770627152/stay-4_mmlf4y.jpg",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770627269/pool2_rd5pjw.jpg",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624855/story-image-7_jafac5.jpg",
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
