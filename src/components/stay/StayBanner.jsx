import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288839/stay_i40y0f.jpg",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768292702/stay2_wbqh0z.jpg",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768292703/stay3_rakqxv.jpg",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288842/stay-4_x1k7le.jpg",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288843/story-image-7_oh2vtu.jpg",
    alt: "Community involvement event",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/djxgpbncu/image/upload/v1768288839/stay-5_uizl1n.jpg",
    alt: "Community involvement event",
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
