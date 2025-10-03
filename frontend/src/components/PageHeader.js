// src/components/PageHeader.js
import React from 'react';

const PageHeader = ({ title, subtitle, backgroundImage }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="font-serif text-4xl md:text-5xl text-green-800 mb-3">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;