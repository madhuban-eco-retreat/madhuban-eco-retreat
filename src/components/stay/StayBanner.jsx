import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "/images/stay/banner/madhuban-eco-retreat-bhopal-restaurant.webp",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "/images/stay/banner/Guest-stay-madhuban-eco-retreat-bhopal.webp",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "/images/stay/banner/mud-house-stay-madhuban-eco-retreat-bhopal-1.webp",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "/images/stay/banner/pool-side-stay-rooms-madhuban-eco-retreat-bhopal.webp",
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
