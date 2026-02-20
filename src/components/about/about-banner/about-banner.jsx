import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 2,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589796/Guest_Stay_Madhuban_Eco_Retreat_Bhopal_syxrnm.avif",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771583365/Dinning_Area_Image_-_Madhuban_Eco_Retreat_yze8zg.avif",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590030/Pool_Side_Image_-_Madhuban_Eco_Retreat_gqprnd.avif",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dx3aj7a40/image/upload/v1771589962/Mud_House_Image_3_-_Madhuban_Eco_Retreat_Bhopal_ajdzet.avif",
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
