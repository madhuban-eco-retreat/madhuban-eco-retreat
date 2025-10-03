// src/components/BookingWidget.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingWidget = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [accommodationType, setAccommodationType] = useState("all");

  const handleCheckAvailability = (e) => {
    e.preventDefault();

    // Format dates for URL parameters
    const checkInStr = checkIn ? checkIn.toISOString().split("T")[0] : "";
    const checkOutStr = checkOut ? checkOut.toISOString().split("T")[0] : "";

    // Navigate to booking page with search parameters
    navigate(
      `/booking?checkIn=${checkInStr}&checkOut=${checkOutStr}&adults=${adults}&children=${children}&type=${accommodationType}`
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-[rgb(110,97,70)] rounded-lg shadow-xl p-4 sm:p-6 relative sm:-bottom-16 mx-auto max-w-[1000px]">
        <form onSubmit={handleCheckAvailability}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 justify-center">
            {/* Check-in Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow tracking-wider font-semibold text-[#D1C8C1] text-center mb-1">
                  Check-in
                </label>
                <div className="relative text-black">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-black" />
                  </div>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] border-black text-white placeholder-[rgb(110,97,70)] hover:border-black outline-none rounded-md py-2 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Check-out Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow tracking-wider font-semibold text-[#D1C8C1] text-center mb-1">
                  Check-out
                </label>
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
                    minDate={checkIn || new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] text-white placeholder-[rgb(110,97,70)] hover:border-black focus:border-black outline-none rounded-md py-2 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow tracking-wider font-semibold text-[#D1C8C1] text-center mb-1">
                  Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 -left-5 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-[#D1C8C1]" />
                  </div>
                  <div className="w-44 flex space-x-2">
                    <select
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className="w-3/4 bg-[#D1C8C1] font-arial-narrow tracking-wider font-medium rounded-md py-2 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                      <option value="5">5 Adults</option>
                      <option value="6">6 Adults</option>
                    </select>
                    <select
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className="w-3/4 bg-[#D1C8C1] font-arial-narrow tracking-wider font-medium rounded-md py-2 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option value="0">0 Child</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                      <option value="4">4 Children</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow tracking-wider font-semibold text-[#D1C8C1] text-center mb-1">
                  Accommodation
                </label>
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-40 rounded-md bg-[#D1C8C1] font-arial-narrow tracking-wider font-medium text-[rgb(110,97,70)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="cottage">Safari Tent</option>
                  <option value="tent">Mud Houses</option>
                  <option value="treehouse">Pool Side Villa</option>
                  <option value="camping">Camping Tent</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-1 flex justify-center items-end">
              <div className="w-full">
                <label className="invisible block text-sm font-medium text-[#D1C8C1] mb-1">
                  Check
                </label>
                <button
                  type="submit"
                  className="w-full font-arial-narrow tracking-wider font-semibold flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-[rgb(110,97,70)] bg-[#D1C8C1]"
                >
                  Check Availability <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingWidget;
