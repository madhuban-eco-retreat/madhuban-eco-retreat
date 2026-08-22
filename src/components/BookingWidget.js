// src/components/BookingWidget.js
import React, { useState } from "react";
import { Calendar, Users, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import {
  ALL_ROOMS_URL,
  CAMPING_WHATSAPP_URL,
  ROOM_SLUGS,
  bookUrl,
} from "@/lib/rooms/booking-links";

/**
 * The two accommodation values that are not room slugs. "all" names no
 * particular room, and camping is sold per person on request so it has no
 * /book/[slug] route at all.
 */
const ALL_TYPES = "all";
const CAMPING = "camping";

/**
 * DatePicker hands back a Date at local midnight. toISOString() would convert
 * that to UTC, which in IST (+5:30) rolls it back to the previous day and sends
 * the guest into the booking engine a night early, so format the local parts.
 */
function toDateParam(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const BookingWidget = () => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [accommodationType, setAccommodationType] = useState("");
  const router = useRouter();

  const handleCheckAvailability = (e) => {
    e.preventDefault();

    if (!checkIn) {
      alert("Please select a check-in date.");
      return;
    }

    if (!accommodationType) {
      alert("Please select an accommodation type.");
      return;
    }

    if (accommodationType === CAMPING) {
      window.open(CAMPING_WHATSAPP_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (accommodationType === ALL_TYPES) {
      router.push(ALL_ROOMS_URL);
      return;
    }

    // Anything else is a room slug, so it goes straight to the booking engine
    // with the search pre-filled. Check-out is optional here -- /book/[slug]
    // derives one from the room's minimum stay when it is missing.
    const params = new URLSearchParams({ checkIn: toDateParam(checkIn) });
    if (checkOut) params.set("checkOut", toDateParam(checkOut));
    params.set("adults", String(adults));
    params.set("children", String(children));

    router.push(`${bookUrl(accommodationType)}?${params}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-sm:py-4 bg-[#D1C8C1]">
      <div className="bg-[rgb(110,97,70)] rounded-lg shadow-xl p-3 sm:p-4 max-sm:my-6 z-10 relative sm:bottom-25 mx-auto max-w-4xl">
        <form onSubmit={handleCheckAvailability}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 justify-center">
            {/* Check-in Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-xs font-semibold text-primary-gray text-center mb-1">
                  Check-in
                </label>
                <div className="relative text-black">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      className="h-4 w-4 text-primary-gray2 z-1"
                      aria-label="calender"
                    />
                  </div>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 text-sm font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] border-black text-white placeholder-[rgb(110,97,70)] hover:border-black outline-none rounded-md py-1.5 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Check-out Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-xs font-arial-narrow tracking-wider font-semibold text-primary-gray text-center mb-1">
                  Check-out
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                    <Calendar
                      className="h-4 w-4 text-primary-gray2"
                      aria-label="calender"
                    />
                  </div>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 text-sm font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] text-white placeholder-[rgb(110,97,70)] hover:border-black focus:border-black outline-none rounded-md py-1.5 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-xs font-arial-narrow  font-semibold text-primary-gray text-center mb-1">
                  Guests
                </label>
                <div className="relative">
                  <div className="flex space-x-2">
                    <select
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className=" bg-[#D1C8C1] text-sm font-arial-narrow  font-medium rounded-md py-1.5 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option label="1 Adult" value="1"></option>
                      <option label="2 Adults" value="2"></option>
                      <option label="3 Adults" value="3"></option>
                      <option label="4 Adults" value="4"></option>
                      <option label="5 Adults" value="5"></option>
                      <option label="6 Adults" value="6"></option>
                    </select>
                    <select
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className=" bg-[#D1C8C1] text-sm font-arial-narrow  font-medium rounded-md py-1.5 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option label="0 Child" value="0"></option>
                      <option label="1 Child" value="1"></option>
                      <option label="2 Children" value="2"></option>
                      <option label="3 Children" value="3"></option>
                      <option label="4 Children" value="4"></option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-xs font-arial-narrow  font-semibold text-primary-gray text-center mb-1">
                  Accommodation
                </label>
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-40 rounded-md bg-[#D1C8C1] text-sm font-arial-narrow  font-medium text-[rgb(110,97,70)] py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option label="Select type" value=""></option>
                  <option label="All Types" value={ALL_TYPES}></option>
                  <option
                    label="Safari Tent"
                    value={ROOM_SLUGS.safariTent}
                  ></option>
                  <option
                    label="Mud Houses"
                    value={ROOM_SLUGS.mudHouseStandard}
                  ></option>
                  <option
                    label="Pool Side Villa"
                    value={ROOM_SLUGS.poolSideVilla}
                  ></option>
                  <option label="Camping Tent" value={CAMPING}></option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-4 flex justify-center items-end">
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full h-10 text-sm font-arial-narrow cursor-pointer  font-semibold flex items-center justify-center px-6 border border-transparent rounded-md shadow-sm text-[rgb(110,97,70)] bg-[#D1C8C1]"
                >
                  Check Availability{" "}
                  <ChevronRight className="ml-2 h-4 w-4" aria-label="arrow" />
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
