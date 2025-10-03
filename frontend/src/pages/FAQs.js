import React from "react";
import {
  FaLeaf,
  FaBoxOpen,
  FaUtensils,
  FaWifi,
  FaMapMarkedAlt,
  FaTv,
  FaDog,
} from "react-icons/fa";
import { motion } from "framer-motion";

const faqs = [
  {
    icon: <FaLeaf className="text-green-600 text-xl" />,
    question: "1. Is Madhuban a purely veg property?",
    answer:
      "Yes, Madhuban is a pure veg property and we do not allow any non-veg items inside the campus.",
  },
  {
    icon: <FaBoxOpen className="text-purple-600 text-xl" />,
    question: "2. What are the inclusions in my package?",
    answer:
      "Your stay, chef’s choice breakfast, filtered water, housekeeping service, swimming pool access, adventure rope obstacle course, nature walk/ bird watching, small open-air library, games are included in the package.",
  },
  {
    icon: <FaUtensils className="text-yellow-600 text-xl" />,
    question: "3. Are meals included in the stay package?",
    answer:
      "Meals are not included in the stay package. Our plan includes chef’s choice breakfast. For meals we serve a-la-carte. You can choose from our purely vegetarian menu and bills will be generated according to your consumption. Also, you can ask our reservation team to include your meals in the package with an additional charge.",
  },
  {
    icon: <FaWifi className="text-blue-500 text-xl" />,
    question: "4. Is there Wi-Fi available for the guests?",
    answer:
      "Yes, we have Wi-Fi available for the in-house guests in some selective rooms and in the reception area.",
  },
  {
    icon: <FaMapMarkedAlt className="text-pink-600 text-xl" />,
    question: "5. What we can see in and around Madhuban?",
    answer:
      "You can visit, Salkanpur Temple (A famous Durga temple on the top of the plateau) , Narmada River (Aulighat is the nearest location), Sethani Ghat on Narmada River (One of the largest ghat of Asia), Saru-Maru Buddhist Monastery complex, Bhimbetika Rock Shelter (An UNESCO world heritage site), Jungle Safari of Ratapani Tiger Reserve, etc",
  },
  {
    icon: <FaTv className="text-red-600 text-xl" />,
    question: "6. Is there TV available in the guest rooms?",
    answer:
      "No! There is no TV in the guest rooms because we want our guests to feel the essence of the forests/mother nature.",
  },
  {
    icon: <FaDog className="text-orange-500 text-xl" />,
    question: "7. Are pets allowed in Madhuban?",
    answer:
      "Yes, we are a pet-friendly property. You can bring your pets along with you by adhering our policies. The policy is available in our website and with our reservation team both",
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
};

export default function FAQsBoxLayout() {
  return (
    <div className="bg-[#D1C8C1]">
      {/* Full height Banner Image with overlay and text */}
      <div className="w-full h-[90vh] relative">
        <img
          src="/images/Gallery/gallery-21.jpg" // Replace with your image path
          alt="Madhuban Retreat Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sitka-banner tracking-widest">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl font-arial-narrow tracking-wider">
              Everything you need to know before your visit to Madhuban
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-5">
        <div className="flex items-center justify-center">
          <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
          <h2 className="text-4xl md:text-5xl font-sitka-banner border-[rgb(110,97,70)] font-semibold tracking-widest">
            FAQ
          </h2>
          <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
        </div>
        <p className="text-center text-[rgb(110,97,70)] mb-6 font-arial-narrow tracking-wider">
          Find the answers for the most frequently asked questions below
        </p>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 shadow-lg rounded-xl p-6 bg-[rgb(110,97,70)] cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.15 }}
              whileHover="hover"
            >
              <div className="flex items-center gap-3 mb-2">
                {faq.icon}
                <h3 className="text-lg font-semibold text-[#D1C8C1] font-sitka-banner tracking-widest">
                  {faq.question}
                </h3>
              </div>
              <p className="text-[#D1C8C1] font-arial-narrow tracking-wider">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
