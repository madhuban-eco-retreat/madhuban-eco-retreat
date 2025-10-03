// src/components/TestimonialSlider.js
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Apoorva Ugarkar",
      location: "Indore, Madhya Pradesh",
      rating: 5,
      text: "The stay at Madhuban resort was very comfortable and relaxing. The staff was very friendly and caring. The food was too good. The star gazing activity was the most beautiful experience. The morning forest walk was refreshing. The overall experience at Madhuban resort was awesome. I would definitely like to visit this place again.",
    },
    {
      id: 2,
      name: "Alok Shrivastava",
      location: "Bhopal, Madhya Pradesh",
      rating: 5,
      text: "We all from defence service came to Madhuban for a picnic today. The property is ideally suited for large gatherings of 150-200 persons. They have attractions for all age groups. The staff were very courteous and prompt in service. We had a great day outing. Food was awesome, and the place was offered in a spic and span condition. Must-visit place for nature lovers.",
    },
    {
      id: 3,
      name: "Poonam Acharekar",
      location: "Mumbai, Maharashtra ",
      rating: 4,
      text: "I recently stayed at “Madhuban Resort by Somaiya”, and it was truly a magical experience! Nestled in the heart of the jungle (specifically surrounded by Ratapani Wildlife Sanctuary & Tiger Reserve), the resort offers an incredible blend of adventure and tranquility. From the moment we arrived, the Manager Mr. Shibaji and the rest of the staff were warm, welcoming, and attentive, making us feel right at home.",
    },
    {
      id: 4,
      name: "Nikhil Acharya",
      location: "Madhya Pradesh",
      rating: 5,
      text: "Overall a good experience of calm & peaceful stay. Nice staff, services are prompt. Food freshly cooked and served. Blend of modern & forest stay amenities. Away from city's chaos yet connected with it. Staff is well trained and their behavior was welcoming. They gave guided tour to property as well. Taking care of small needs during stay was well handled. Pool was clean and maintained.Best part is - Fully vegetarian & no alcohol zone.,",
    },
    {
      id: 5,
      name: "Shubhobroto Ghosh",
      location: "New Delhi",
      rating: 5,
      text: "Grand experience. Resort staff are polite and helpful. Surroundings are beautiful. Thoroughly enjoyable. We saw many animals, including a variety of birds. Among birds, Ashy Prinias and Paradise Flycatchers were mesmerizing to observe. We were also able to observe a baby Fan-Throated Lizard, an animal we saw for the first time. There were wild fishes and crabs to see. We enjoyed watching dragonflies hovering like helicopters.",
    },
    {
      id: 6,
      name: "Gaura Joshi",
      location: "Bhopal, Madhya Pradesh",
      rating: 5,
      text: "What a wonderful place! The location, the room, view, food, staff - everything was excellent! Would be back soon. Special thanks to Shibaji da for making the stay all the more beautiful.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-0 -mt-10">
      {/* Testimonial Slides */}
      <div className="overflow-hidden relative rounded-xl bg-[#46520b] shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <div className="p-8 flex flex-col justify-center items-center text-center h-full">
                <div className="flex items-center mb-4 justify-center">
                  {/* Star Rating */}
                  <div className="flex text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5"
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="italic text-white tracking-wider text-lg mb-6 font-arial-narrow max-w-3xl">
                  <span className="text-4xl text-gray-400 mr-1">“</span>
                  <span className="text-gray-400">{testimonial.text}</span>
                  <span className="text-4xl text-gray-400 ml-1">”</span>
                </blockquote>

                <div>
                  <p className="font-medium text-gray-400 tracking-widest font-sitka-banner">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 font-arial-narrow tracking-wider font-medium">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-gray-400" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-[#033A06]" : "bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
