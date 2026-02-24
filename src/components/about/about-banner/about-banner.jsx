import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
   {
    id: 1,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771841749/outdoor-adventure-obstacles-madhuban-eco-retreat-bhopal.avif",
    alt: "Early construction phase",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771839088/mud-house-madhuban-eco-retreat-bhopal.avif",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771583365/madhuban-eco-retreat-best-restaurant-near-bhopal.avif",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590126/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.avif",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590030/pool-side-madhuban-eco-retreat-best-pool-resort-near-bhopal.avif",
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
