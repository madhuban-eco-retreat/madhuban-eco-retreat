import React, { useState } from "react";
// import { FaMapMarkedAlt, 
//   FaPhone, 
//   FaEnvelope 
// } from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        alert(data.message || "Thank you for your message! We'll get back to you soon.");
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error.message || "Sorry, there was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapClick = () => {
    const url =
      "https://www.google.com/maps/place/Madhuban+Resort+By+Somaiya/@22.794559,77.490283,16z/data=!4m9!3m8!1s0x397db52b7cf3a4f1:0xb82cef7e7d9cfa61!5m2!4m1!1i2!8m2!3d22.7945588!4d77.4902834!16s%2Fg%2F11fq_qbqmp?hl=en&entry=ttu";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contact-page bg-[#D1C8C1]">
      {/* Banner Section */}
      <div className="relative w-full h-[85vh] overflow-hidden rounded-bl-[60px] rounded-br-[60px]">
        <img
          src="/images/accommodations/contact-bg.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-sitka-banner tracking-widest font-medium">
            Get in Touch
          </h1>
          <p className="font-arial-narrow tracking-wider text-lg md:text-2xl mt-2 max-w-2xl">
            Have questions or want to make a reservation? We're here to help!
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="contact-section ">
        <div className="flex items-center justify-center">
          <hr className="w-16 border-t border-[rgb(110,97,70)] mr-4" />
          <h2 className="text-4xl md:text-5xl font-sitka-banner text-[rgb(110,97,70)] font-semibold tracking-wider">
            Contact Us
          </h2>
          <hr className="w-16 border-t border-[rgb(110,97,70)] ml-4" />
        </div>
        <p className="section-description text-[rgb(110,97,70)] font-arial-narrow tracking-wider">
          Fill out the form or use our contact information below to reach us.
        </p>

        <div className="contact-content">
          <div className="contact-form bg-[rgb(110,97,70)]">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group font-inter">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group font-inter">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group  font-inter">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group font-inter">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button
                type="submit"
                className="submit-btn font-arial-narrow text-[rgb(110,97,70)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="map-container" onClick={handleMapClick}>
            <iframe
              title="Madhuban Resort Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7356.4265978489275!2d77.490283!3d22.794559!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397db52b7cf3a4f1%3A0xb82cef7e7d9cfa61!2sMadhuban%20Resort%20By%20Somaiya!5e0!3m2!1sen!2sin!4v1747417125028!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
