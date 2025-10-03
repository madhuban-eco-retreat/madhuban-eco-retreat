// src/components/Footer.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ChevronRight, ChevronDown } from "lucide-react";

const Footer = () => {
  const [open, setOpen] = useState(false); // dropdown state
  const currentYear = new Date().getFullYear();

  const buttonStyle = {
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s, border 0.3s",
    marginTop: "25px",
  };

  return (
    <footer className="bg-[rgb(110,97,70)] text-[#D1C8C1] pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex items-center space-x-4 z-20">
                <img
                  src="/images/logo/logo7.png"
                  alt="Madhuban Eco Retreat Logo"
                  className="h-20 w-20 filter brightness-75"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="font-inter text-base font-bold text-black leading-tight">
                    Madhuban Eco Retreat
                  </h1>
                  <p className="font-inter text-xs text-black leading-tight">
                    Ratapani Tiger Reserve,
                  </p>
                  <p className="font-inter text-xs text-black leading-tight">
                    Bhopal, Madhya Pradesh, India
                  </p>
                </div>
              </Link>
            </div>
                  <p className="text-[#D1C8C1] mb-6 font-sitka-banner tracking-wider">
              An eco-luxury retreat nestled near Ratapani Wildlife Sanctuary,
              offering sustainable luxury and immersive nature experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/madhubanresortsomaiya"
                target="_blank"
                rel="noopener noreferrer"
                className="transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                  alt="Instagram"
                  className="w-10 h-10"
                />
              </a>
              <a
                href="https://www.facebook.com/share/1LHQF9QhuJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
                  alt="Facebook"
                  className="w-10 h-10"
                />
              </a>
            </div>
            <button
              style={buttonStyle}
              onClick={() => {
                window.open("https://wa.me/+919770558419", "_blank");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1DA851";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#25D366";
              }}
            >
              <span className="font-poppins font-medium">Chat On WhatsApp</span>
              <svg
                style={{ width: "20px", height: "20px" }}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                  fill="#fff"
                />
                <path
                  d="M24.014,7.5C14.93,7.5,7.518,14.912,7.517,23.996c0,3.087,0.833,6.109,2.412,8.751l-1.528,5.573l5.724-1.566c2.58,1.583,5.537,2.418,8.684,2.418h0.008c9.083,0,16.494-7.411,16.498-16.494c0.001-4.407-1.712-8.549-4.822-11.66C32.563,9.215,28.421,7.5,24.014,7.5z"
                  fill="#25D366"
                />
                <path
                  d="M34.231,28.32c-0.464-0.232-2.75-1.36-3.175-1.515c-0.426-0.157-0.738-0.232-1.05,0.232c-0.311,0.464-1.206,1.515-1.48,1.826c-0.272,0.311-0.546,0.35-1.01,0.117c-0.464-0.232-1.963-0.723-3.74-2.306c-1.381-1.232-2.313-2.754-2.586-3.218c-0.272-0.464-0.029-0.715,0.205-0.946c0.211-0.21,0.464-0.545,0.695-0.818c0.232-0.272,0.311-0.467,0.464-0.773c0.155-0.309,0.078-0.583-0.039-0.818c-0.117-0.232-1.05-2.515-1.441-3.443c-0.379-0.91-0.764-0.787-1.05-0.799c-0.272-0.013-0.583-0.016-0.895-0.016s-0.819,0.117-1.248,0.583c-0.426,0.464-1.631,1.594-1.631,3.887c0,2.294,1.671,4.512,1.902,4.824c0.232,0.309,3.285,5.013,7.957,7.023c1.111,0.48,1.977,0.767,2.652,0.979c1.115,0.355,2.13,0.305,2.935,0.186c0.896-0.135,2.75-1.123,3.137-2.209c0.389-1.086,0.389-2.014,0.272-2.209C35.031,28.662,34.695,28.55,34.231,28.32z"
                  fill="#fff"
                />
              </svg>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl text-[#D1C8C1] tracking-widest font-sitka-banner font-medium mb-4 pb-2 border-b border-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about/story"
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/stay"
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Accommodations
                </Link>
              </li>

              {/* Dropdown Experiences */}
              <li className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  {open ? (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  )}
                  Experiences
                </button>

                {open && (
                  <ul className="absolute left-0 mt-2 bg-white rounded-2xl shadow-lg py-2 w-56 z-50">
                    <li>
                      <Link
                        to="/experiences/forest-walks-&-nature-trails"
                        className="block px-4 py-2 text-[rgb(110,97,70)] hover:text-[rgb(190,175,145)] rounded-lg font-sitka-banner font-medium tracking-wide"
                      >
                        Forest Walks & Nature Trails
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/experiences/bird-watching-&-wilderness"
                        className="block px-4 py-2 text-[rgb(110,97,70)] hover:text-[rgb(190,175,145)] rounded-lg font-sitka-banner font-medium tracking-wide"
                      >
                        Bird Watching & Wilderness
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/experiences/recreational-facilities"
                        className="block px-4 py-2 text-[rgb(110,97,70)] hover:text-[rgb(190,175,145)] rounded-lg font-sitka-banner font-medium tracking-wide"
                      >
                        Recreational Facilities
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/gallery"
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="font-sitka-banner text-[#D1C8C1] tracking-wider text-lg flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl text-[#D1C8C1] tracking-widest font-sitka-banner font-medium mb-4 pb-2 border-b border-gray-700">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                <span className="text-[#D1C8C1] font-sitka-banner tracking-wider text-lg">
                  Near Ratapani Wildlife Sanctuary, Bhopal, Madhya Pradesh,
                  India
                </span>
              </li>
              <li className="flex">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                <a
                  href="tel:+917895432160"
                  className="text-[#D1C8C1] font-sitka-banner tracking-wider text-lg"
                >
                  +91 9770 558 419
                </a>
              </li>
              <li className="flex">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                <a
                  href="mailto:info@madhubanecoretreat.com"
                  className="text-[#D1C8C1] font-sitka-banner tracking-wider text-lg"
                >
                  madhubanresort@somaiya.com
                </a>
              </li>
              <p className="text-[#D1C8C1] mb-6 font-sitka-banner tracking-wider text-lg">
                Subscribe to recieve updates on special offers, new experiences,
                and sustainability initiatives.
              </p>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="">
            <img
              src="/images/logo/group-logo.png"
              alt="Newsletter"
              className="w-[70px] h-[70px] mt-3 mb-4 mx-auto filter brightness-75"
              style={{ filter: "brightness(0.75)" }}
            />
            <p className="text-[#D1C8C1] mb-6 font-sitka-banner tracking-wider text-center mx-auto">
              A Somaiya Group Initiative <br /> Where Sustainability Meets
              Hospitality.
            </p>
            <p className="text-[#D1C8C1] mb-6 font-sitka-banner tracking-wider text-xs">
              By subscribing, you agree to our Privacy Policy. You can
              unsubscribe at any time.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="font-sitka-banner tracking-wider flex-grow px-4 bg-[#D1C8C1] border border-stone-700 focus:outline-none focus:ring-2 focus:ring-brown-700 rounded-l-md text-[rgb(110,97,70)] placeholder-[rgb(110,97,70)]"
                />
                <button
                  type="submit"
                  className="bg-[rgb(106,95,80)] hover:bg-[rgb(87,75,58)] px-4 rounded-r-md font-sitka-banner font-medium"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 -mt-5 pt-2 flex flex-col md:flex-row items-center justify-center">
          <div className="font-sitka-banner text-sm text-[#D1C8C1] tracking-wider text-center">
            &copy; {currentYear} Madhuban Eco Retreat. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
