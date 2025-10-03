import React, { useState } from "react";

const menuData = {
  Breakfast: [
    {
      name: "Green Smoothie Bowl",
      desc: "Topped with seeds, granola & berries",
      tags: ["🌱", "❄️"],
    },
    {
      name: "Farmhouse Omelette",
      desc: "Free-range eggs, veggies, herbs",
      tags: ["🥚"],
    },
  ],
  Lunch: [
    {
      name: "Grilled Veggie Wrap",
      desc: "Whole grain wrap, hummus, roasted vegetables",
      tags: ["🌱"],
    },
    { name: "Spicy Lentil Soup", desc: "With local bread", tags: ["🌱", "🔥"] },
  ],
  Dinner: [
    {
      name: "Herb-Crusted Tofu",
      desc: "Served with quinoa & roasted carrots",
      tags: ["🌱"],
    },
    {
      name: "Stuffed Bell Peppers",
      desc: "Brown rice, beans, herbs",
      tags: ["🌱", "🔥"],
    },
  ],
  Snacks: [
    {
      name: "Trail Mix Bites",
      desc: "Dates, oats, seeds, cacao nibs",
      tags: ["🌱"],
    },
    { name: "Zucchini Chips", desc: "Baked, lightly salted", tags: ["🌱"] },
  ],
  Drinks: [
    {
      name: "Herbal Garden Tea",
      desc: "Basil, lemongrass, mint",
      tags: ["🌱"],
    },
    { name: "Kombucha", desc: "Fermented and locally brewed", tags: [] },
  ],
};

const seasonalSpecials = [
  {
    name: "Pumpkin Spice Pancakes",
    desc: "Local pumpkin, cinnamon, maple syrup",
    tags: ["🌱", "❄️"],
  },
  {
    name: "Warm Beet Salad",
    desc: "Beets, walnuts, goat cheese, balsamic glaze",
    tags: ["❄️"],
  },
];

const Menus = () => {
  const [activeTab, setActiveTab] = useState("Breakfast");

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src="/images/accommodations/camping-tent.jpeg"
          alt="Menu Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Sample Menus
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 px-6">
        {Object.keys(menuData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="px-6 py-8 md:px-20">
        <h2 className="text-2xl font-semibold mb-4">{activeTab} Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuData[activeTab].map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.desc}</p>
              <div className="text-lg mt-2 space-x-2">
                {item.tags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Specials */}
      <section className="bg-gray-50 px-6 py-12 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">🌿 Seasonal Specials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {seasonalSpecials.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.desc}</p>
              <div className="text-lg mt-2 space-x-2">
                {item.tags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download PDF Menu */}
      <div className="text-center py-10">
        <a
          href="/menus/sample-menu.pdf" // Replace with your actual PDF path
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          download
        >
          📄 Download Full Menu (PDF)
        </a>
      </div>
    </div>
  );
};

export default Menus;
