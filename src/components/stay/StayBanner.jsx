import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771583365/Dinning_Area_Image_-_Madhuban_Eco_Retreat_yze8zg.avif",
    alt: "Our founders planning the retreat",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590096/Rooms_Interior_Image_Madhubuan_Eco_Retreat_Bhopal_lkzxgw.avif",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771591454/Stay_At_Safari_Tent_Madhuban_Eco_Retreat_f829pt.avif",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590065/Reception_Area_Image_-_Madhuban_Eco_Retreat_Bhopal_pj5jwi.avif",
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
