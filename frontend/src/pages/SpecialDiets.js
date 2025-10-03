import React from "react";

const diets = [
  {
    name: "Vegan & Vegetarian",
    icon: "🥦",
    description:
      "Our plant-powered dishes are crafted with seasonal vegetables, grains, and plant proteins to nourish your body and soul.",
  },
  {
    name: "Gluten-Free",
    icon: "🌾",
    description:
      "We offer a wide selection of gluten-free options, prepared safely to avoid cross-contamination.",
  },
  {
    name: "Keto & Paleo",
    icon: "🥩",
    description:
      "High-protein, low-carb meals using clean, whole ingredients for those following keto or paleo lifestyles.",
  },
  {
    name: "Allergies & Intolerances",
    icon: "⚠️",
    description:
      "Our kitchen is trained to accommodate nut, dairy, soy, and other common allergies. Let us know your concerns!",
  },
];

const SpecialDiets = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Banner */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src="/images/accommodations/camping-tent.jpeg"
          alt="Special Diets Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Special Diets Welcome
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-lg text-gray-700">
          We welcome all dietary preferences and restrictions. Whether you're
          vegan, gluten-free, keto, or managing food allergies, our team is here
          to ensure your dining experience is safe and delicious.
        </p>
      </div>

      {/* Diet Sections */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-10 pb-16">
        {diets.map((diet, idx) => (
          <div
            key={idx}
            className="border rounded-xl shadow-md p-6 bg-gray-50 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-3">{diet.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{diet.name}</h3>
            <p className="text-gray-600">{diet.description}</p>
          </div>
        ))}
      </div>

      {/* Contact/Request CTA */}
      <div className="bg-green-100 py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Tell Us About Your Needs
        </h2>
        <p className="mb-6 text-gray-700">
          Have dietary restrictions or allergies? Contact our kitchen ahead of
          your visit so we can prepare with care.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          📬 Contact Our Kitchen
        </a>
      </div>
    </div>
  );
};

export default SpecialDiets;
