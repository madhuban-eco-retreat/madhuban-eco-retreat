"use client";

import Image from "next/image";
import React from "react";
// import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MountainSnow,
  ChevronLeft,
  CalendarDays,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StayWhyChooseUs from "@/components/stay/Stay-WhyChooseUs";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import { accommodationsData } from "./Stay.functions";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { STAY_PAGE_CTAS, ALL_ROOMS_URL } from "@/lib/rooms/booking-links";
import {
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  PEAK_SURCHARGE_RATE,
} from "@/lib/pricing/config.mjs";

const getAccommodation = (slug) => {
  return accommodationsData.find((acc) => acc.slug === slug);
};

// Derive the per-room GST slab and peak rate from the base price string, using
// the same rate card the booking engine prices with rather than a second copy
// of the threshold. Peak season applies only to per-night room rates.
//
// The slab shown here is the one for a bare double-occupancy regular night —
// what the room costs on its own. A guest adding a third adult or booking over
// Christmas is quoted the higher slab at checkout, because the slab follows
// the value of the night actually sold.
const parsePrice = (p) => Number(String(p).replace(/[^\d]/g, ""));
const formatINR = (n) => n.toLocaleString("en-IN");
const getGstRate = (priceNum) => (priceNum > GST_THRESHOLD ? GST_RATE_HIGH : GST_RATE_LOW);

const AccommodationDetail = () => {
  const params = useParams();
  const { slug } = params;
  const accommodation = getAccommodation(slug);
  const randomImgUrl =
    accommodation?.galleryImages[
      Math.floor(Math.random() * accommodation.galleryImages.length)
    ];
  // Falls back to the room index rather than a dead /book/[slug] if a page is
  // ever added to the data array before it exists in the booking engine.
  const ctas = STAY_PAGE_CTAS[slug] ?? [
    { label: "Book Your Stay", href: ALL_ROOMS_URL },
  ];

  if (!accommodation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-center px-4">
        <MountainSnow size={64} className="text-moss-green mb-4" />
        <h1 className="text-3xl md:text-4xl font-inter font-bold text-forest-green mb-2">
          Oops! Accommodation Not Found
        </h1>
        <p className="font-openSans text-lg text-earth-brown mb-6">
          We couldn't find the accommodation you were looking for.
        </p>
        <Link
          href="/stay-in-ratapani-tiger-reserve"
          className="mt-[30px] font-primary inline-flex items-center bg-moss-green text-cream font-medium py-3 px-6 rounded-md hover:bg-forest-green transition-colors duration-300"
        >
          <ChevronLeft size={20} className="mr-2" aria-label="Left" />
          Back to All Accommodations
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-stone-50 min-h-screen py-12 pt-20 md:pt-24 md:pt-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/stay-in-ratapani-tiger-reserve"
              className="inline-flex items-center font-semibold text-earth-brown mt-8 transition-colors duration-300 group"
            >
              <ChevronLeft
                aria-label="left"
                size={20}
                className="font-primary  font-medium mr-1 group-hover:-translate-x-1 transition-transform duration-300"
              />
              Back to All Accommodations
            </Link>
          </div>

          <div className="bg-[#FAF7F2] rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex md:items-stretch">
              <div className="md:w-1/2 h-auto">
                {accommodation.image.toLowerCase().endsWith(".mp4") ? (
                  <video
                    style={{ width: "100%", height: "100vh" }}
                    src={accommodation.image}
                    controls
                    // autoPlay
                    // loop
                    className="w-full object-cover md:min-h-[80vh]"
                    onError={(e) => {
                      e.target.onerror = null;
                      console.error(
                        "Error loading video:",
                        accommodation.image,
                      );
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={accommodation.image}
                    alt={accommodation.altText}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    quality={90} className="w-full h-full object-cover md:min-h-[400px]"
                    quality={90}/>
                )}
              </div>

              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-auto md:min-h-[400px]">
                <div>
                  <h1 className="heading1 font-primary  text-earth-brown mb-3">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(accommodation.rating)
                            ? "text-gold-accent fill-current"
                            : i < accommodation.rating
                              ? "text-gold-accent"
                              : "text-warm-beige"
                        }
                      />
                    ))}
                    <span className="ml-2 text-earth-brown text-sm">
                      ({accommodation.rating})
                    </span>
                  </div>

                  {accommodation?.descriptions?.map((des, i) => {
                    return (
                      <p
                        key={i}
                        className="text-earth-brown mb-6  text-justify font-arial-narrow p-text"
                      >
                        {des}
                      </p>
                    );
                  })}

                  {accommodation.amenities &&
                    accommodation.amenities.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-semibold font-primary text-primary-gray2 mb-2">
                          Amenities:
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-base md:text-lg">
                          {accommodation.amenities.map((amenity, index) => (
                            <li
                              key={index}
                              className="flex items-start font-primary  text-primary-gray2 p-text "
                            >
                              <Check
                                aria-label="check"
                                size={16}
                                className="text-primary-gray2 mr-2 mt-1"
                              />
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="mt-auto">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Heading */}
                    <h3 className="text-base font-semibold  text-primary-gray2  mb-2">
                      BOOK YOUR STAY
                    </h3>

                    {accommodation.bookingOptions.map((bookOpt, i) => {
                      const priceNum = parsePrice(bookOpt.price);
                      const gstRate = getGstRate(priceNum);
                      const isPerNight = /night/i.test(bookOpt.rateUnit || "");
                      const peak = isPerNight
                        ? Math.round(priceNum * PEAK_SURCHARGE_RATE)
                        : null;
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center w-full"
                        >
                          <p className=" text-sm  md:text-base font-bold text-primary-gray2">
                            • {bookOpt.optionName}: <br />
                            <span className="font-normal text-xs md:text-sm">
                              {bookOpt.optionDetail}
                            </span>
                          </p>
                          <div className="flex flex-col items-end gap-1">
                            <div className="bg-earth-brown text-white rounded-full  px-8 px-4 md:px-6 lg:px-8 py-3 flex flex-col items-center">
                              <span className="text-sm font-bold">
                                Rs. {bookOpt.price}
                              </span>
                              <span className="text-xs">{bookOpt.rateUnit}</span>
                            </div>
                            <p className="text-xs font-medium text-earth-brown text-right">
                              + {gstRate}% GST
                              {peak
                                ? ` | Peak Season: Rs. ${formatINR(peak)}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {accommodation.extraBedding && (
                    <div className="mt-4 space-y-4">
                      <div className="rounded-lg border border-earth-brown/20 bg-earth-brown/5 p-4 space-y-2">
                        <p className="flex items-start gap-2 text-sm text-earth-brown">
                          <span className="font-semibold">✓</span>
                          Double occupancy basis
                        </p>
                        <p className="flex items-start gap-2 text-sm text-earth-brown">
                          <span className="font-semibold">✓</span>
                          <span>
                            <strong>2+ nights stay — flat 20% off on room rent</strong>
                            <br />
                            <span className="text-xs">
                              (excludes peak season, Christmas/New Year &amp; long
                              weekends)
                            </span>
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-earth-brown mb-2">
                          Extra Guest Charges:
                        </p>
                        <ul className="text-sm text-earth-brown">
                          <li className="flex justify-between border-b border-earth-brown/10 py-1">
                            <span>Infant (up to 5 yrs)</span>
                            <span className="font-medium">Free</span>
                          </li>
                          <li className="flex justify-between border-b border-earth-brown/10 py-1">
                            <span>Child (5–12 yrs)</span>
                            <span className="font-medium">₹1,500 / night</span>
                          </li>
                          <li className="flex justify-between border-b border-earth-brown/10 py-1">
                            <span>Adult (above 12 yrs)</span>
                            <span className="font-medium">₹2,000 / night</span>
                          </li>
                        </ul>
                        <p className="text-xs text-earth-brown/80 mt-1">
                          GST extra on above charges
                        </p>
                      </div>
                    </div>
                  )}

                  {accommodation.inclusions && (
                    <>
                      <div className="mb-4">
                        <div className="text-lg md:text-xl font-semibold text-primary-gray2 mb-2">
                          Inclusions
                        </div>
                        {accommodation.inclusions.map((inc, i) => {
                          return (
                            <p key={i} className="text-primary-gray2">
                              • {inc}
                            </p>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {accommodation.capacity && (
                    <div className="flex justify-between items-center">
                      <p className="text-base text-earth-brown mb-2">
                        <strong className="  font-semibold">Capacity:</strong>{" "}
                        {accommodation.capacity}
                      </p>
                    </div>
                  )}

                  {/* Each room books its own inventory. The mud house page
                      sells two room types, so it renders two CTAs side by side;
                      camping is enquiry-only and leaves for WhatsApp. */}
                  <div
                    className={`flex flex-col gap-3 ${
                      ctas.length > 1 ? "sm:flex-row" : ""
                    }`}
                  >
                    {ctas.map((cta) =>
                      cta.external ? (
                        <a
                          key={cta.href}
                          href={cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-inter w-full flex items-center justify-center bg-earth-brown text-white font-medium py-3 px-6 rounded-md hover:bg-[rgb(123,108,80)] p-text"
                        >
                          <CalendarDays
                            size={20}
                            className="mr-2"
                            aria-label="calender"
                          />
                          {cta.label}
                        </a>
                      ) : (
                        <Link
                          key={cta.href}
                          href={cta.href}
                          className="font-inter w-full flex items-center justify-center bg-earth-brown text-white font-medium py-3 px-6 rounded-md hover:bg-[rgb(123,108,80)] p-text"
                        >
                          <CalendarDays
                            size={20}
                            className="mr-2"
                            aria-label="calender"
                          />
                          {cta.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {accommodation.galleryImages &&
              accommodation.galleryImages.length > 0 && (
                <div className="p-6 md:p-8 border-t border-warm-beige">
                  <DecorativeHeading
                    text={"Gallery"}
                    as="h2"
                    textClasses={"w-60"}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {accommodation.galleryImages.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`${accommodation.name} gallery ${index + 1}`}
                        width={600}
                        height={400}
                        sizes="(max-width: 640px) 50vw, 33vw"
                        quality={90} className="w-full h-48 object-cover rounded-lg shadow-sm"
                        quality={90}/>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      <StayWhyChooseUs
        points={accommodation?.whyChoosePoints}
        title={accommodation.whyChooseTitle}
        imageUrl={randomImgUrl}
      />
      <CommonFaqs faqs={accommodation.faqs} heading={accommodation.faqsTitle} />
    </>
  );
};

export default AccommodationDetail;
