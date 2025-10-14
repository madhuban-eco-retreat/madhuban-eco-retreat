import React, { useState } from "react";
import "./Contact.css";

// ⚠️ CHANGE THIS TO YOUR WHATSAPP NUMBER
// Format: Country code + number (no + sign, no spaces)
// Example: 919876543210
const ADMIN_WHATSAPP = "919770558419";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create WhatsApp message
    const message = `New Contact Form Message

Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Subject: ${formData.subject.trim()}

Message:
${formData.message.trim()}`;

    // Build WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    try {
      const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Check if popup was blocked
      setTimeout(() => {
        if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
          alert("Popup blocked! Please allow popups, or copy this link and open manually: " + whatsappUrl);
        } else {
          // Success - reset form
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
          alert('WhatsApp opened successfully! Please send the pre-filled message.');
        }
      }, 1000);

    } catch (err) {
      console.error('Error opening WhatsApp:', err);
      alert("Failed to open WhatsApp. Please try again or check your browser settings.");
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
                />
              </div>
              <div className="form-group font-inter">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="submit-btn font-arial-narrow text-[rgb(110,97,70)]"
              >
                Send Message
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
