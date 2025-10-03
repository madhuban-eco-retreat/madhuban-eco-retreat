import React from "react";
import { Helmet } from "react-helmet-async";

const EcoPhilosophy = () => {
  return (
    <div className="w-full bg-[rgb(173,168,159)]">
      {/* -----------------Meta Tag start -------------------------------------------------------- */}
      <Helmet>
        <title>
          "Sustainable Eco Retreat Near Bhopal, Zero-Waste Hospitality & Organic
          Farm Stay in India"
        </title>
        <meta
          name="description"
          content="Sustainable Eco Retreat Near Bhopal – Zero-Waste Hospitality & Organic Farm Stay in India"
        />
      </Helmet>
      {/* -----------------Meta Tag End -------------------------------------------------------- */}

      {/* Banner Image */}
      <div className="w-full h-[80vh] relative">
        <img
          src="/images/newImages/image.jpg"
          alt="Madhuban Eco Retreat"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-10 text-lg text-gray-800">
        <div className="flex items-center justify-center mb-6">
          <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
          <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider text-center">
            Eco Philosophy
          </h2>
          <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
        </div>
        <div className="text-[rgb(110,97,70)] font-arial-narrow">
          <p className="mb-6  text-justify">
            At Madhuban Eco Retreat, we believe that a well-maintained and
            sustainable environment is the cornerstone of a harmonious and
            fulfilling life. Our eco philosophy is rooted in the belief that
            nature is our greatest gift, and we are committed to preserving and
            protecting it for future generations.
          </p>
          <p className="mb-6 text-justify">
            We take great care in nurturing our surroundings, ensuring that the
            retreat is not only a place of relaxation and rejuvenation, but also
            a space where we can actively contribute to the preservation of the
            natural world.
          </p>
          <p className="mb-6 text-justify">
            Our eco-friendly practices include regular maintenance of buildings,
            efficient waste management, and the use of sustainable materials and
            products. We also work to minimize our environmental impact by
            reducing our carbon footprint and promoting conscious, low-impact
            living.
          </p>
          <p className="mb-6 text-justify">
            Our commitment to sustainability goes beyond the retreat. We
            actively participate in community initiatives and volunteer our time
            to support those in need. Through these efforts, we aim to create a
            ripple effect of positive change enhancing the well-being of our
            community and inspiring responsible living.
          </p>
          <p className="mb-6 text-justify">
            At Madhuban, eco philosophy isn’t just a statement on our website,
            it’s a living, breathing principle that guides everything we do. It
            reflects our deep commitment to the well-being of our guests, our
            environment, and our community. We don’t just talk about the problem,
            we strive to be part of the solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoPhilosophy;
