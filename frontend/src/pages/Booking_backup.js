// src/pages/Booking.js
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PageHeader from '../components/PageHeader';
import AccommodationCard from '../components/AccommodationCard';
import PriceBreakdown from '../components/PriceBreakdown';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get URL parameters
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const adultsParam = searchParams.get('adults');
  const childrenParam = searchParams.get('children');
  const typeParam = searchParams.get('type');
  
  // Form states
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(checkInParam ? new Date(checkInParam) : null);
  const [checkOut, setCheckOut] = useState(checkOutParam ? new Date(checkOutParam) : null);
  const [adults, setAdults] = useState(adultsParam ? parseInt(adultsParam) : 2);
  const [children, setChildren] = useState(childrenParam ? parseInt(childrenParam) : 0);
  const [accommodationType, setAccommodationType] = useState(typeParam || 'all');
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [extras, setExtras] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Sample accommodation data
  const accommodations = [
    {
      id: 'luxury-cottage-1',
      name: 'Luxury Eco Cottage',
      type: 'cottage',
      description: 'Spacious eco-friendly cottage with a private veranda overlooking the forest.',
      price: 12500,
      maxGuests: 3,
      amenities: ['King Bed', 'En-suite Bathroom', 'Private Veranda', 'Air Conditioning', 'Mini Fridge'],
      images: ['/images/accommodations/luxury-cottage-1.jpg', '/images/accommodations/luxury-cottage-2.jpg']
    },
    {
      id: 'forest-cottage-1',
      name: 'Forest View Cottage',
      type: 'cottage',
      description: 'Cozy cottage with panoramic views of the surrounding forest and wildlife.',
      price: 9500,
      maxGuests: 2,
      amenities: ['Queen Bed', 'En-suite Bathroom', 'Forest View', 'Air Conditioning'],
      images: ['/images/accommodations/forest-cottage-1.jpg', '/images/accommodations/forest-cottage-2.jpg']
    },
    {
      id: 'luxury-tent-1',
      name: 'Safari Luxury Tent',
      type: 'tent',
      description: 'Canvas luxury with wooden floors, en-suite bathrooms, and private deck.',
      price: 8500,
      maxGuests: 2,
      amenities: ['Queen Bed', 'En-suite Bathroom', 'Private Deck', 'Fan'],
      images: ['/images/accommodations/luxury-tent-1.jpg', '/images/accommodations/luxury-tent-2.jpg']
    },
    {
      id: 'treehouse-1',
      name: 'Canopy Treehouse',
      type: 'treehouse',
      description: 'Elevated experience with panoramic forest views, designed around existing trees.',
      price: 14500,
      maxGuests: 2,
      amenities: ['Queen Bed', 'En-suite Bathroom', 'Balcony', 'Mini Fridge', 'Forest View'],
      images: ['/images/accommodations/treehouse-1.jpg', '/images/accommodations/treehouse-2.jpg']
    }
  ];
  
  // Sample extras/add-ons
  const availableExtras = [
    {
      id: 'breakfast',
      name: 'Daily Organic Breakfast',
      description: 'Farm-to-table breakfast each morning of your stay',
      price: 750,
      per: 'person/day'
    },
    {
      id: 'yoga',
      name: 'Daily Yoga Session',
      description: 'Morning yoga sessions in our forest pavilion',
      price: 900,
      per: 'person'
    },
    {
      id: 'nature-walk',
      name: 'Guided Nature Walk',
      description: 'Explore the wilderness with our expert naturalist',
      price: 1200,
      per: 'group'
    },
    {
      id: 'birdwatching',
      name: 'Bird Watching Tour',
      description: '3-hour bird watching experience with a specialist guide',
      price: 1500,
      per: 'group'
    },
    {
      id: 'welcome-package',
      name: 'Welcome Package',
      description: 'Local organic snacks, fruit basket, and herbal tea selection',
      price: 950,
      per: 'room'
    }
  ];
  
  // Filter accommodations based on selected type and guest count
  const filteredAccommodations = accommodations.filter(acc => {
    const matchesType = accommodationType === 'all' || acc.type === accommodationType;
    const hasCapacity = acc.maxGuests >= (adults + children);
    return matchesType && hasCapacity;
  });
  
  // Calculate nights of stay
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights();
  
  // Handle accommodation selection
  const handleAccommodationSelect = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setStep(2);
  };
  
  // Handle add-on toggle
  const handleExtrasToggle = (extra) => {
    setExtras(prev => {
      const exists = prev.find(item => item.id === extra.id);
      if (exists) {
        return prev.filter(item => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };
  
  // Handle guest info change
  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form before proceeding to payment
  const validateGuestInfo = () => {
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    setError(null);
    return true;
  };
  
  // Handle step navigation
  const goToNext = () => {
    if (step === 2 && !validateGuestInfo()) return;
    setStep(prev => prev + 1);
  };
  
  const goToPrevious = () => {
    setStep(prev => prev - 1);
  };
  
  // Map frontend payment method to backend values
  const paymentMethodMap = {
    card: "credit_card",
    upi: "upi",
    netbanking: "net_banking",
    pay_at_property: "pay_at_property",
    debit_card: "debit_card",
    credit_card: "credit_card",
  };
  
  // Handle booking submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare booking data
    const bookingData = {
      accommodation_id: 1, // Hardcoded for testing; replace with real ID from backend in production
      check_in: checkIn ? checkIn.toISOString().split('T')[0] : null,
      check_out: checkOut ? checkOut.toISOString().split('T')[0] : null,
      adults,
      children,
      extras: extras.map(extra => extra.id), // adjust if backend expects different format
      guest_first_name: guestInfo.firstName,
      guest_last_name: guestInfo.lastName,
      guest_email: guestInfo.email,
      guest_phone: guestInfo.phone,
      special_requests: guestInfo.specialRequests,
      payment_method: paymentMethodMap[paymentMethod] || "credit_card", // Map to backend value
    };

    try {
      const response = await fetch('http://localhost:8000/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to confirmation page with booking details from backend
        navigate('/booking/confirmation', {
          state: {
            ...data, // Pass backend response to confirmation page
          }
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render booking steps
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-serif text-green-800 mb-6">Choose Your Accommodation</h2>
            
            {/* Date and Guest Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn}
                      placeholderText="Select date"
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="space-y-2">
                    <select
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                    <select
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="0">0 Children</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                    </select>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="cottage">Cottages</option>
                    <option value="tent">Luxury Tents</option>
                    <option value="treehouse">Treehouses</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Display Available Accommodations */}
            {checkIn && checkOut && nights > 0 ? (
              <div>
                <h3 className="text-xl text-gray-700 mb-4">Available Accommodations for {nights} night{nights > 1 ? 's' : ''}</h3>
                
                {filteredAccommodations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAccommodations.map(accommodation => (
                      <AccommodationCard
                        key={accommodation.id}
                        accommodation={accommodation}
                        nights={nights}
                        onSelect={() => handleAccommodationSelect(accommodation)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
                    <p className="text-yellow-700">No accommodations available for your selected criteria.</p>
                    <p className="text-yellow-600 mt-2">Try changing your dates or guest count.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-6 text-center">
                <p className="text-blue-700">Please select check-in and check-out dates to view available accommodations.</p>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-serif text-green-800 mb-6">Guest Information & Add-ons</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Guest Information Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-xl font-medium mb-4">Guest Information</h3>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={guestInfo.firstName}
                        onChange={handleGuestInfoChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={guestInfo.lastName}
                        onChange={handleGuestInfoChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={guestInfo.email}
                        onChange={handleGuestInfoChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={guestInfo.phone}
                        onChange={handleGuestInfoChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={guestInfo.specialRequests}
                      onChange={handleGuestInfoChange}
                      rows="4"
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Any special requests or requirements?"
                    />
                  </div>
                </div>
                
                {/* Add-ons Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-4">Enhance Your Stay</h3>
                  
                  <div className="space-y-4">
                    {availableExtras.map(extra => (
                      <div key={extra.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id={extra.id}
                            checked={extras.some(item => item.id === extra.id)}
                            onChange={() => handleExtrasToggle(extra)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor={extra.id} className="font-medium text-gray-700">
                            {extra.name}
                          </label>
                          <p className="text-sm text-gray-500">{extra.description}</p>
                          <p className="text-sm text-green-700 mt-1">
                            ₹{extra.price} per {extra.per}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="text-xl font-medium mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700">{selectedAccommodation.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="flex justify-between text-sm">
                          <span>Check-in</span>
                          <span className="font-medium">{checkIn.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Check-out</span>
                          <span className="font-medium">{checkOut.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Duration</span>
                          <span className="font-medium">{nights} Night{nights > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Breakdown */}
                    <PriceBreakdown 
                      accommodation={selectedAccommodation}
                      nights={nights}
                      extras={extras}
                      adults={adults}
                      children={children}
                    />
                    
                    {/* Confirm Booking Button */}
                    <button
                      type="button"
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                      className="w-full mt-6 bg-green-800 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>Confirm Booking <ArrowRight className="ml-2 w-5 h-5" /></>
                      )}
                    </button>
                    
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={goToPrevious}
                      disabled={isSubmitting}
                      className="w-full mt-3 text-green-800 hover:text-green-700 font-medium py-2 px-4 rounded-md transition flex items-center justify-center disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="mr-2 w-5 h-5" /> Back to Guest Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHeader 
          title="Book Your Stay" 
          subtitle="Secure your eco-luxury experience at Madhuban Retreat"
        />
        
        {/* Booking Progress */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <div 
                className={`flex-1 h-2 ${step >= 1 ? 'bg-green-600' : 'bg-gray-200'}`}
              ></div>
              <div 
                className={`flex-1 h-2 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}
              ></div>
              <div 
                className={`flex-1 h-2 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <div 
                className={`text-sm font-medium ${step >= 1 ? 'text-green-600' : 'text-gray-500'}`}
              >
                Choose Room
              </div>
              <div 
                className={`text-sm font-medium ${step >= 2 ? 'text-green-600' : 'text-gray-500'}`}
              >
                Guest Details
              </div>
              <div 
                className={`text-sm font-medium ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}
              >
                Payment
              </div>
            </div>
          </div>
        </div>
        
        {/* Render current step */}
        {renderStep()}
      </div>
    </div>
  );
};

export default Booking;