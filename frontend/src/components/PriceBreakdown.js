// src/components/PriceBreakdown.js
import React from 'react';

const PriceBreakdown = ({ accommodation, nights, extras, adults, children }) => {
  // Calculate accommodation price
  const accommodationPrice = accommodation.price * nights;
  
  // Calculate extras price
  const calculateExtrasPrice = () => {
    return extras.reduce((total, extra) => {
      let extraPrice = extra.price;
      
      // Adjust price based on "per" parameter
      if (extra.per === 'person/day') {
        extraPrice = extra.price * (adults + children) * nights;
      } else if (extra.per === 'person') {
        extraPrice = extra.price * (adults + children);
      }
      
      return total + extraPrice;
    }, 0);
  };
  
  const extrasTotal = calculateExtrasPrice();
  
  // Calculate taxes (18% GST)
  const taxRate = 0.18;
  const taxAmount = (accommodationPrice + extrasTotal) * taxRate;
  
  // Calculate total price
  const totalPrice = accommodationPrice + extrasTotal + taxAmount;
  
  return (
    <div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Room ({nights} Night{nights > 1 ? 's' : ''})</span>
          <span>₹{accommodationPrice.toLocaleString()}</span>
        </div>
        
        {extras.length > 0 && (
          <div>
            {extras.map((extra) => {
              let extraPrice = extra.price;
              let displayText = '';
              
              // Adjust price and display text based on "per" parameter
              if (extra.per === 'person/day') {
                extraPrice = extra.price * (adults + children) * nights;
                displayText = `(₹${extra.price.toLocaleString()} × ${adults + children} guests × ${nights} nights)`;
              } else if (extra.per === 'person') {
                extraPrice = extra.price * (adults + children);
                displayText = `(₹${extra.price.toLocaleString()} × ${adults + children} guests)`;
              } else if (extra.per === 'room') {
                displayText = '(per room)';
              } else if (extra.per === 'group') {
                displayText = '(per group)';
              }
              
              return (
                <div key={extra.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {extra.name} 
                    <span className="text-xs text-gray-500 ml-1">{displayText}</span>
                  </span>
                  <span>₹{extraPrice.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes (18% GST)</span>
          <span>₹{taxAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t border-gray-200">
        <span>Total</span>
        <span>₹{totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;