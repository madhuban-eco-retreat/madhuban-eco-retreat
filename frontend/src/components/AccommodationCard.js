// src/components/AccommodationCard.js
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Users } from 'lucide-react';

const AccommodationCard = ({ accommodation, nights, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { name, description, price, maxGuests, amenities, images } = accommodation;
  
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const totalPrice = price * nights;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg"
      onClick={onSelect}
    >
      {/* Image Carousel */}
      <div className="relative h-64">
        <img 
          src={images[currentImageIndex]} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md hover:bg-opacity-100 transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md hover:bg-opacity-100 transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-medium text-gray-800">{name}</h3>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">Up to {maxGuests}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((amenity, index) => (
            <span 
              key={index}
              className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-md"
            >
              {amenity}
            </span>
          ))}
        </div>
        
        {/* Price and Select Button */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-800">₹{totalPrice.toLocaleString()}</span>
            <span className="text-gray-600 text-sm ml-1">for {nights} night{nights > 1 ? 's' : ''}</span>
          </div>
          <button 
            className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            onClick={onSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;