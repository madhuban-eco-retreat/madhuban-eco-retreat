import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="max-w-3xl mx-auto prose prose-lg">
        <p>
          Welcome to Madhuban Eco Retreat, a place where nature, comfort, and sustainability meet.
          Learn more about our mission, our team, and our commitment to providing an unforgettable experience.
        </p>
        {/* Add more content sections as needed */}
      </div>
    </div>
  );
};

export default About;