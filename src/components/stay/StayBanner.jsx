import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770627152/stay-4_mmlf4y.jpg",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770637997/stay-9_pepjbw.jpg",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624783/mud-villa1_qvn4zz.jpg",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1770637799/stay-6_xcoqjd.jpg",
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
