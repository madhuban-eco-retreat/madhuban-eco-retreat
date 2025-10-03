import React from "react";
import { Helmet } from "react-helmet";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Madhuban Eco Retreat | Blog</title>
        <meta
          name="description"
          content="Explore Madhya Pradesh, Ratapani forest, wilderness, forest walk, eco retreat in Bhopal, eco retreat in india, explore forest, wildlife in Bhopal, Ratapani tiger santury"
        />
        <meta
          name="keywords"
          content="eco retreat near Ratanapni, Bhopal, sustainable travel India, eco resort near Ratapani, Bhopal, Mud Houses in India, farm to table dining, nature stay Madhya Pradesh, peaceful gateway for seniors, wildlife and eco experience in India"
        />
        <meta property="og:title" content="Madhuban Eco Retreat" />
        <meta
          property="og:description"
          content="Nature-inspired living and travel at its best."
        />
        <link rel="canonical" href="https://www.madhubanecoretreat.com/" />
      </Helmet>

      <div className="min-h-screen bg-[rgb(135,121,92)]">
        {/* Hero Section with Split Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left Side - Image */}
          <div className="relative h-[50vh] lg:h-auto">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src="/images/hero/hero-1.jpg"
              alt="Madhuban Resort"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br bg-[#D1C8C1]">
            <div className="max-w-xl">
              <span className="inline-block mt-4 px-6 py-2 font-arial-narrow tracking-wider bg-[rgb(110,97,70)] text-[#D1C8C1] rounded-full text-sm font-medium mb-6">
                Madhuban Eco Retreat
              </span>
              <h1 className="text-[rgb(110,97,70)] lg:text-5xl font-bold mb-6 leading-tight tracking-wider font-sitka-banner">
                Reconnect with Nature at Madhuban Eco Retreat
              </h1>
              <p className="text-xl text-[rgb(110,97,70)] tracking-wider font-arial-narrow mb-8">
                A Pure Vegetarian Retreat in the Heart of Ratapani Wilderness
              </p>
              <div className="flex items-center">
                <img
                  src="/images/blog/blog.jpeg"
                  alt="Mike Sullivan"
                  className="h-12 w-12 rounded-full object-cover  shadow-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold text-[rgb(110,97,70)] font-arial-narrow tracking-wider">
                    Sanika Shaha
                  </p>
                  <p className="text-sm text-[rgb(110,97,70)] font-arial-narrow tracking-wider">
                    June 18, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">
                <p className="lead text-xl text-[rgb(110,97,70)] font-arial-narrow tracking-wider mb-8 bg-[#D1C8C1] p-6 rounded-lg ">
                  If you want to get away from the hustle and bustle of daily
                  life and reconnect with nature, "Madhuban Eco Retreat"
                  provides a genuinely unique experience. Madhuban Eco Retreat
                  is more than just a resort; it's a haven for peace-seekers,
                  nature enthusiasts, and environmentally aware visitors.
                </p>

                <div className="my-12 relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#D1C8C1] rounded-full"></div>
                  <h2 className="text-3xl font-extrabold text-[#D1C8C1] tracking-widest font-sitka-banner mb-6 pl-4">
                    A Pure Vegetarian Paradise
                  </h2>
                  <p className="text-[#D1C8C1] tracking-wider font-arial-narrow mb-8 pl-4">
                    Madhuban Eco Retreat is a vegetarian-only restaurant that
                    promotes all comprehensive wellness and mindful living.
                    Visitors are asked not to bring any non-vegetarian food on
                    campus, and the entire Eco Retreat is meatless. This
                    commitment to a purely vegetarian lifestyle adds to the
                    serene and spiritual atmosphere that defines Madhuban Eco
                    Retreat.
                  </p>
                </div>

                <div className="my-12">
                  <img
                    src="/images/Gallery/gallery-25.jpg"
                    alt="Madhuban Resort"
                    className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                  />
                </div>

                <div className="bg-[#D1C8C1] rounded-2xl shadow-lg p-8 my-12">
                  <h2 className="text-3xl font-extrabold text-[rgb(110,97,70)] tracking-widest font-sitka-banner mb-6">
                    Your Stay at Madhuban Eco Retreat
                  </h2>
                  <p className="text-[rgb(110,97,70)] tracking-wider font-arial-narrow mb-8">
                    Your stay at Madhuban Eco Retreat is thoughtfully curated to
                    offer comfort, adventure, and tranquility. The package
                    includes:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Cozy and eco-friendly accommodation",
                      "Chef's choice breakfast",
                      "Access to filtered drinking water",
                      "Housekeeping services",
                      "Swimming pool access",
                      "Adventure rope obstacle course",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[rgb(110,97,70)] p-4 rounded-lg"
                      >
                        <svg
                          className="w-6 h-6 text-[#D1C8C1] mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-[#D1C8C1] tracking-wider font-arial-narrow">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-12">
                  <h2 className="text-3xl font-extrabold text-[#D1C8C1] tracking-widest font-sitka-banner mb-6">
                    Dining Experience at Madhuban Eco Retreat
                  </h2>
                  <div className="bg-[#D1C8C1] rounded-2xl p-8">
                    <p className="text-[rgb(110,97,70)] tracking-wider font-arial-narrow text-justify">
                      While breakfast is included in your package, other meals
                      are served as Farm to Fork. You can explore a diverse and
                      delectable range of dishes from pure vegetarian menu,
                      prepared with love and locally sourced ingredients. Prefer
                      a more inclusive experience? Simply connect with the
                      reservation team to customize your package with meals
                      included at an additional cost.
                    </p>
                  </div>
                </div>

                <div className="my-12">
                  <img
                    src="/images/dining/dining1.jpeg"
                    alt="Dining at Madhuban Eco Retreat"
                    className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                  />
                </div>

                <div className="my-12">
                  <h2 className="text-3xl font-extrabold tracking-widest text-[#D1C8C1] mb-6">
                    Explore the Beauty Around Madhuban Eco Retreat
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Salkanpur Devi Temple",
                        description: "A revered Durga temple atop a plateau",
                      },
                      {
                        title: "Narmada River Darshan",
                        description: "Ideal for peaceful river front moments",
                      },
                      {
                        title: "Satpura Tiger Reserve",
                        description: "One of the largest ghats in Asia",
                      },
                      {
                        title: "Bhimbetika Rock Shelter",
                        description: "UNESCO World Heritage Site",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#D1C8C1] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                      >
                        <h3 className="font-semibold text-xl mb-2 text-[rgb(110,97,70)] tracking-widest font-sitka-banner">
                          {item.title}
                        </h3>
                        <p className="text-[rgb(110,97,70)] tracking-wider font-arial-narrow">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-12 bg-gradient-to-r bg-[#D1C8C1] rounded-2xl p-8">
                  <p className="text-xl text-[rgb(110,97,70)] tracking-wider font-arial-narrow italic">
                    "Madhuban Eco Retreat isn't just a resort, it's a journey
                    into a simpler, more grounded way of life. Whether you're
                    planning a solo retreat, a romantic getaway, or a family
                    holiday, Madhuban Eco Retreat promises soulful experiences,
                    serene landscapes, and memories that last a lifetime."
                  </p>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-[#D1C8C1] rounded-2xl shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-extrabold text-[rgb(110,97,70)] tracking-widest font-sitka-banner mb-4 ">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/stay"
                        className="text-[rgb(110,97,70)] tracking-wider hover:text-[rgb(103,91,66)] transition-colors font-arial-narrow"
                      >
                        Your Stay
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dining"
                        className="text-[rgb(110,97,70)] tracking-wider hover:text-[rgb(103,91,66)] transition-colors font-arial-narrow"
                      >
                        Dining Experience
                      </a>
                    </li>
                    <li>
                      <a
                        href="/nearby-attractions"
                        className="text-[rgb(110,97,70)] tracking-wider hover:text-[rgb(103,91,66)] transition-colors font-arial-narrow"
                      >
                        Explore Around
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#D1C8C1] rounded-2xl p-6">
                  <h3 className="text-xl font-extrabold text-[rgb(110,97,70)] tracking-widest font-sitka-banner mb-4">
                    Contact Us
                  </h3>
                  <p className="text-[rgb(110,97,70)] tracking-wider font-arial-narrow mb-4">
                    Ready to experience Madhuban Eco Retreat? Get in touch with
                    us to plan your stay.
                  </p>
                  <a
                    href="/booking"
                    className="block w-full text-center bg-[rgb(110,97,70)] text-[#D1C8C1] py-3 px-6 rounded-lg hover:bg-[rgb(96,85,61)] transition-colors font-sitka-banner text-xl"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
