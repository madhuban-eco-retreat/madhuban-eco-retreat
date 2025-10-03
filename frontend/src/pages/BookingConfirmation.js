// src/pages/BookingConfirmation.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, Calendar, Users, MapPin, Phone, 
  // Mail, 
  ArrowRight, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PriceBreakdown from '../components/PriceBreakdown';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;
  
  // Generate a random booking reference
  const generateBookingReference = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'MDH-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  const bookingReference = generateBookingReference();
  
  // If no booking details are present, redirect to booking page
  useEffect(() => {
    if (!bookingDetails) {
      navigate('/booking');
    }
  }, [bookingDetails, navigate]);
  
  // Return early if no booking details
  if (!bookingDetails) return null;
  
  const { accommodation, checkIn, checkOut, nights, adults, children, extras, guestInfo, paymentMethod } = bookingDetails;
  
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <PageHeader 
              title="Booking Confirmed!" 
              subtitle="Your eco-luxury experience at Madhuban Retreat is confirmed. We look forward to welcoming you soon."
            />
          </div>
          
          {/* Booking Reference */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <h2 className="text-xl font-medium mb-2">Booking Reference</h2>
            <p className="text-3xl font-bold text-green-800">{bookingReference}</p>
            <p className="text-gray-600 mt-2">
              Use this reference for all communication regarding your booking
            </p>
          </div>
          
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium mb-6">Stay Details</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex">
                  <Calendar className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Dates</h3>
                    <p className="text-gray-600">
                      {checkIn.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} 
                      {' to '}
                      {checkOut.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-gray-600">{nights} Night{nights > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <Users className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Guests</h3>
                    <p className="text-gray-600">
                      {adults} Adult{adults > 1 ? 's' : ''}
                      {children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <MapPin className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-600">
                      Madhuban Eco Retreat, Near Ratapani Wildlife Sanctuary, 
                      <br />Bhopal, Madhya Pradesh
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <Phone className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Contact</h3>
                    <p className="text-gray-600">+91 7895 432 160</p>
                    <p className="text-gray-600">info@madhubanecoretreat.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Accommodation Details */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium mb-4">Accommodation</h2>
              
              <div className="flex items-start">
                <img 
                  src={accommodation.images[0]} 
                  alt={accommodation.name} 
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-medium">{accommodation.name}</h3>
                  <p className="text-gray-600 mt-1">{accommodation.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {accommodation.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Guest Information */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium mb-4">Guest Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600">Guest Name</h3>
                  <p className="font-medium">{guestInfo.firstName} {guestInfo.lastName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-600">Contact</h3>
                  <p className="font-medium">{guestInfo.email}</p>
                  <p className="font-medium">{guestInfo.phone}</p>
                </div>
                
                {guestInfo.specialRequests && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm text-gray-600">Special Requests</h3>
                    <p className="font-medium">{guestInfo.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium mb-4">Payment Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600">Payment Method</h3>
                  <p className="font-medium">
                    {paymentMethod === 'card' && 'Credit/Debit Card'}
                    {paymentMethod === 'upi' && 'UPI'}
                    {paymentMethod === 'pay-at-property' && 'Pay at Property'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-600">Payment Status</h3>
                  <p className="font-medium text-green-600">
                    {paymentMethod === 'pay-at-property' ? 'Due at Check-in' : 'Paid'}
                  </p>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <PriceBreakdown 
                  accommodation={accommodation}
                  nights={nights}
                  extras={extras}
                  adults={adults}
                  children={children}
                />
              </div>
            </div>
            
            {/* Extras / Add-ons */}
            {extras.length > 0 && (
              <div className="p-6">
                <h2 className="text-xl font-medium mb-4">Your Extras</h2>
                
                <div className="space-y-4">
                  {extras.map(extra => (
                    <div key={extra.id} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">{extra.name}</h3>
                        <p className="text-gray-600 text-sm">{extra.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">Next Steps</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Check your email</h3>
                  <p className="text-gray-600">
                    We've sent a booking confirmation to {guestInfo.email}. Please check your inbox (and spam folder).
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Prepare for your stay</h3>
                  <p className="text-gray-600">
                    Review our <Link to="/stay/guidelines" className="text-green-700 hover:text-green-600">Guest Guidelines</Link> to prepare for your eco-retreat experience.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Plan your activities</h3>
                  <p className="text-gray-600">
                    Explore the <Link to="/experiences" className="text-green-700 hover:text-green-600">Experiences</Link> available during your stay and plan your itinerary.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-800 text-white rounded-md shadow-md hover:bg-green-700 transition"
            >
              Return to Homepage <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-green-800 text-green-800 rounded-md hover:bg-green-50 transition"
            >
              Contact Us <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;