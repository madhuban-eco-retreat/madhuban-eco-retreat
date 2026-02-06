import React from "react";
import { BookingBanner } from "./BookingBanner";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const StayCard = ({ title, subtitle, imageUrl, className = "" }) => (
  <div
    className={`group relative overflow-hidden rounded-3xl aspect-[3/4] md:aspect-auto ${className}`}
  >
    <img
      src={imageUrl}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <h3 className="text-xl text-white primary-font-family mb-1">{title}</h3>
      <p className="text-gray-300 text-sm font-medium">{subtitle}</p>
    </div>
  </div>
);

const LuxeryStay = () => {
  return (
    <main className="max-w-7xl mx-auto px-6  pb-12">
      <section className="mt-12 mb-12">
        <DecorativeHeading
          as="p"
          text={"Luxury Stays"}
          subheading="Experience the Eco-friendly Accommodations at Madhuban Eco Retreat"
          subheadingAs="H2"
        />
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {/* Row 1 */}
        <StayCard
          title="Mud House"
          subtitle="Traditional Jungle Resort Mud House"
          imageUrl="/mud-house.jpeg"
          className="md:h-[400px]"
        />
        <StayCard
          title="Glamping Tent"
          subtitle="Luxury Jungle Camp Glamping"
          imageUrl="/glamping-tent.JPG"
          className="md:h-[400px]"
        />
        <StayCard
          title="Pool Side Villa"
          subtitle=" Resort with Swimming Pool Villa"
          imageUrl="pool-side-villa.jpg"
          className=" md:h-[400px]"
        />

        {/* Row 2 */}
        <StayCard
          title="Safari Tent"
          subtitle="Ratapani Resort Safari Stay"
          imageUrl="Safari-Stay.jpeg"
          className="md:h-[400px]"
        />
        <StayCard
          title="Camping Tent"
          subtitle="Nature Forest Resort Camping"
          imageUrl="/camping-tent.jpg"
          className="md:h-[400px]"
        />
        <StayCard
          title="Jungle Lodge"
          subtitle="Jungle Lodge near Ratapani Sanctuary"
          imageUrl="Jungle-Lodge.jpg"
          className="md:h-[400px]"
        />
        <StayCard
          title="Eco Luxury Room"
          subtitle="Eco Luxury Resort Stay Bhopal"
          imageUrl="/Eco-Luxury.jpg"
          className="md:h-[400px]"
        />
        <StayCard
          title="Group Stays"
          subtitle="Best Resort Near Bhopal for family Getaways"
          imageUrl="/group-stay.jpg"
          className="md:h-[400px]"
        />
      </div>
      <BookingBanner />
    </main>
  );
};

export default LuxeryStay;
