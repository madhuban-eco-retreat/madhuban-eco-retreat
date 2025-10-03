import React, { useState } from 'react';

// ⚠️ IMPORTANT: Replace this with YOUR WhatsApp number
// Format: Country code + number, NO + sign, NO spaces, NO leading zeros
// Example for India: 919876543210
const ADMIN_WHATSAPP = "919770558419";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: 'Standard',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Please select check-in date';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Please select check-out date';
    }

    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      if (checkOut <= checkIn) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build WhatsApp URL
  const buildWhatsAppUrl = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('🚀 Form submitted! Starting WhatsApp process...');
    setDebugInfo('Form submitted! Validating...');

    if (!validateForm()) {
      console.log('❌ Validation failed');
      setDebugInfo('Validation failed. Please check the form.');
      return;
    }

    console.log('✅ Validation passed');
    setDebugInfo('Validation passed! Building WhatsApp message...');
    setIsSubmitting(true);

    // Format the message for WhatsApp
    const message = `*🏨 New Booking Request - Madhuban Resort*

👤 *Guest Details:*
Name: ${formData.name.trim()}
Contact: ${formData.phone.trim()}
Email: ${formData.email.trim()}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Room Type: ${formData.roomType}
Number of Guests: ${formData.guests}

💬 *Special Requests:*
${formData.message.trim() || "None"}

---
Sent via Madhuban Resort Website`;

    console.log('📱 Message created:', message);
    setDebugInfo('Message created! Opening WhatsApp...');

    // Build and open WhatsApp URL
    const whatsappUrl = buildWhatsAppUrl(ADMIN_WHATSAPP, message);
    console.log('🔗 WhatsApp URL:', whatsappUrl);

    // Open WhatsApp in new tab
    try {
      const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      console.log('🪟 Window opened:', whatsappWindow);

      // Check if popup was blocked
      setTimeout(() => {
        if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
          console.log('❌ Popup blocked!');
          setDebugInfo('Popup blocked! See the link below to open WhatsApp manually.');
          alert('Popup blocked! Please allow popups for this site, or use the link that appeared below the form.');
          
          // Create fallback link
          const linkContainer = document.createElement('div');
          linkContainer.id = 'whatsapp-fallback';
          linkContainer.style.cssText = 'margin: 20px 0; padding: 15px; background: #dcfce7; border: 2px solid #25D366; border-radius: 8px; text-align: center;';
          linkContainer.innerHTML = `
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">
              WhatsApp didn't open automatically? Click below:
            </p>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" 
               style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; 
                      border-radius: 8px; text-decoration: none; font-weight: 600;">
              📱 Open WhatsApp Now
            </a>
          `;
          
          // Remove old fallback if exists
          const oldFallback = document.getElementById('whatsapp-fallback');
          if (oldFallback) oldFallback.remove();
          
          // Add fallback link after form
          const form = document.querySelector('.booking-form');
          if (form && form.parentElement) {
            form.parentElement.appendChild(linkContainer);
          }
        } else {
          console.log('✅ WhatsApp opened successfully!');
          setDebugInfo('WhatsApp opened successfully! ✅');
        }
        setIsSubmitting(false);
      }, 1000);

    } catch (error) {
      console.error('❌ Error opening WhatsApp:', error);
      setDebugInfo(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Stay</h1>
          <p>Fill out the form below and we'll confirm your booking via WhatsApp</p>
        </div>

        {/* Debug Info Banner */}
        {debugInfo && (
          <div style={{
            padding: '12px',
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            color: '#0369a1'
          }}>
            ℹ️ {debugInfo}
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Guest Details Section */}
          <div className="form-section">
            <h2>Guest Details</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div className="form-section">
            <h2>Booking Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkIn">Check-in Date *</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={today}
                  className={errors.checkIn ? 'error' : ''}
                />
                {errors.checkIn && <span className="error-message">{errors.checkIn}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="checkOut">Check-out Date *</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={formData.checkIn || today}
                  className={errors.checkOut ? 'error' : ''}
                />
                {errors.checkOut && <span className="error-message">{errors.checkOut}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="Standard">Standard Room</option>
                  <option value="Deluxe">Deluxe Room</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family Room</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Special Requests (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requirements or requests?"
                rows="4"
              />
            </div>
          </div>

          {/* Privacy Consent */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>
                I agree that my information will be sent via WhatsApp to Madhuban Resort. 
                View our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </span>
            </label>
            {errors.terms && <span className="error-message">{errors.terms}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Opening WhatsApp...' : '📱 Send Booking via WhatsApp'}
          </button>

          <p className="help-text">
            Clicking this button will open WhatsApp with your booking details pre-filled. 
            Simply review and send the message to complete your booking.
          </p>
        </form>
      </div>

      <style jsx>{`
        .booking-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }

        .booking-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .booking-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .booking-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .booking-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 30px;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h2 {
          font-size: 1.5rem;
          color: #667eea;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        input,
        select,
        textarea {
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input.error,
        select.error,
        textarea.error {
          border-color: #ff4444;
        }

        .error-message {
          color: #ff4444;
          font-size: 0.85rem;
          margin-top: 5px;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-group {
          margin: 20px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          font-weight: normal;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 3px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-label span {
          flex: 1;
          color: #666;
          line-height: 1.5;
        }

        .checkbox-label a {
          color: #667eea;
          text-decoration: underline;
        }

        .submit-btn {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .help-text {
          text-align: center;
          color: #999;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .booking-container {
            padding: 30px 20px;
          }

          .booking-header h1 {
            font-size: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .submit-btn {
            font-size: 1rem;
            padding: 14px 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default Booking;