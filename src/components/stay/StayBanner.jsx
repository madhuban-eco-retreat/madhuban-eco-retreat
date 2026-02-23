import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843590/madhuban-eco-retreat-bhopal-restaurant.avif",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843589/Guest-stay-madhuban-eco-retreat-bhopal.avif",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843588/mud-house-stay-madhuban-eco-retreat-bhopal-1.avif",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843588/pool-side-stay-rooms-madhuban-eco-retreat-bhopal.webp",
    alt: "The retreat as it looks today",
  },
];
const StayBanner = () => {
  return (
    <Slidingbanner
      images={storyImages}
      heading={"Discover Your Ideal Eco Stay Near Bhopal & Ratapani"}
      subHeading={"A journey into forests, wildlife, and mindful living"}
    />
  );
};

export default StayBanner;
