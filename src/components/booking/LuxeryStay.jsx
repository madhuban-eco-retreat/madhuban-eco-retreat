import React from "react";
import { BookingBanner } from "./BookingBanner";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import Image from "next/image";

const StayCard = ({ title, subtitle, imageUrl, className = "" }) => (
  <div
    className={`group relative overflow-hidden rounded-3xl aspect-[3/4] md:aspect-auto ${className}`}
  >
    <Image
      width={700}
      height={400}
      src={imageUrl}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
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
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771839088/mud-house-madhuban-eco-retreat-bhopal-3.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Glamping Tent"
          subtitle="Luxury Jungle Camp Glamping"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843593/glamping-tent-madhuban-eco-retreat-bhopal.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Pool Side Villa"
          subtitle=" Resort with Swimming Pool Villa"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590030/pool-side-madhuban-eco-retreat-best-pool-resort-near-bhopal.avif"
          className=" md:h-[400px]"
        />

        <StayCard
          title="Safari Tent"
          subtitle="Ratapani Resort Safari Stay"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771590126/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Camping Tent"
          subtitle="Nature Forest Resort Camping"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843592/new-camping-tent-madhuban-eco-retreat-bhopal.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Jungle Lodge"
          subtitle="Jungle Lodge near Ratapani Sanctuary"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843589/Guest-stay-madhuban-eco-retreat-bhopal.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Eco Luxury Room"
          subtitle="Eco Luxury Resort Stay Bhopal"
           imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843588/safari-tent-stay-madhuban-eco-retreat-bhopal.avif"
          className="md:h-[400px]"
        />
        <StayCard
          title="Group Stays"
          subtitle="Best Resort Near Bhopal for family Getaways"
          imageUrl="https://res.cloudinary.com/dx3aj7a40/image/upload/v1771843590/madhuban-eco-retreat-bhopal-restaurant.avif"
          className="md:h-[400px]"
        />
      </div>
      <BookingBanner />
    </main>
  );
};

export default LuxeryStay;
