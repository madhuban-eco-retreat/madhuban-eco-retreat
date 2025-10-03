import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, 
    // Scrollbar, 
    A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Lucide Icons (example, add more as needed)
import { BedDouble, Users, Leaf, Wifi, Sun, Wind, Bath, Coffee, Sofa, ParkingCircle } from 'lucide-react';

// Placeholder data for the Safari Tent (formerly Eco Cottage)
const safariTentData = {
    name: 'Luxury Safari Tent',
    slug: 'eco-cottage', // Matches the slug from Stay.js
    images: [
        { id: 1, src: '/images/accommodations/safari-tent/safari-tent-exterior.jpg', alt: 'Spacious exterior of the Luxury Safari Tent' },
        { id: 2, src: '/images/accommodations/safari-tent/safari-tent-interior-bed.jpg', alt: 'Comfortable king-size bed inside the Safari Tent' },
        { id: 3, src: '/images/accommodations/safari-tent/safari-tent-veranda.jpg', alt: 'Private veranda with seating overlooking nature' },
        { id: 4, src: '/images/accommodations/safari-tent/safari-tent-bathroom.jpg', alt: 'En-suite bathroom with modern amenities' },
    ],
    shortDescription: 'Experience rustic charm and modern comforts in our sustainably built eco-cottages, perfect for a peaceful retreat.',
    detailedDescription: [
        'Step into a world of adventure and comfort with our Luxury Safari Tents. Designed for those who love the outdoors but appreciate a touch of elegance, these tents offer an immersive glamping experience. Nestled in a secluded part of our retreat, each tent provides privacy and stunning views of the surrounding wilderness.',
        'The spacious interior features a comfortable king-size bed with premium linens, a cozy seating area, and ample storage. Large mesh windows allow for excellent ventilation and uninterrupted views, while ensuring protection from insects. The en-suite bathroom boasts a modern shower, eco-friendly toiletries, and fluffy towels.',
        'Your private veranda is the perfect spot to unwind with a book, enjoy a morning coffee, or simply soak in the tranquil sounds of nature. In the evening, the clear skies offer a spectacular stargazing opportunity.'
    ],
    keyFeatures: [
        { icon: <BedDouble size={20} className="text-green-700" />, text: 'Plush King-Size Bed' },
        { icon: <Users size={20} className="text-green-700" />, text: 'Spacious for 2-3 Guests' },
        { icon: <Leaf size={20} className="text-green-700" />, text: 'Eco-Friendly & Sustainable Materials' },
        { icon: <Wind size={20} className="text-green-700" />, text: 'Excellent Natural Ventilation' },
        { icon: <Sun size={20} className="text-green-700" />, text: 'Private Veranda with Seating' },
    ],
    amenities: [
        { icon: <Bath size={18} />, text: 'En-suite Bathroom' },
        { icon: <Wifi size={18} />, text: 'High-Speed Wi-Fi' },
        { icon: <Coffee size={18} />, text: 'Coffee/Tea Maker' },
        { icon: <Sofa size={18} />, text: 'Comfortable Seating Area' },
        { text: 'Premium Linens & Towels' },
        { text: 'Eco-Friendly Toiletries' },
        { text: 'Room Service Available' },
        { text: 'Daily Housekeeping' },
        { icon: <ParkingCircle size={18} />, text: 'Dedicated Parking Nearby' }
    ],
    capacity: 'Sleeps 2 adults + 1 child',
    priceIndication: 'Starting from ₹8,000 / night',
    bookingLink: '/booking?accommodation=eco-cottage', // Direct link to booking with this pre-selected
};

const SafariTent = () => {
    const {
        name,
        images,
        detailedDescription,
        keyFeatures,
        amenities,
        capacity,
        priceIndication,
        bookingLink
    } = safariTentData;

    return (
        <HelmetProvider>
            <Helmet>
                <title>{`${name} | Madhuban Eco Retreat`}</title>
                <meta name="description" content={`Detailed information about the ${name} at Madhuban Eco Retreat. ${safariTentData.shortDescription}`} />
            </Helmet>

            <div className="bg-stone-50 min-h-screen py-12 pt-24 md:pt-32 px-4">
                <div className="container mx-auto max-w-5xl">
                    {/* Image Gallery Swiper */}
                    <div className="mb-8 md:mb-12 shadow-lg rounded-lg overflow-hidden">
                        <Swiper
                            modules={[Navigation, Pagination, A11y, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            className="h-64 md:h-96 lg:h-[500px]"
                        >
                            {images.map((image) => (
                                <SwiperSlide key={image.id}>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
                        <h1 className="text-3xl md:text-5xl font-serif text-green-800 mb-6 text-center md:text-left">
                            {name}
                        </h1>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            {/* Left Column (Description & Key Features) */}
                            <div className="md:col-span-2">
                                <div className="prose prose-lg max-w-none text-gray-700 text-justify">
                                    {detailedDescription.map((paragraph, index) => (
                                        <p key={index} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>

                                <h2 className="text-2xl font-semibold text-green-700 mt-8 mb-4">Key Features</h2>
                                <ul className="space-y-3">
                                    {keyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            {feature.icon && <span className="mr-3 flex-shrink-0">{feature.icon}</span>}
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Column (Booking Info & Amenities) */}
                            <div className="md:col-span-1">
                                <div className="bg-green-50 p-6 rounded-lg shadow-md sticky top-24">
                                    <h2 className="text-2xl font-semibold text-green-800 mb-2">{priceIndication}</h2>
                                    <p className="text-gray-600 mb-1"><strong>Capacity:</strong> {capacity}</p>

                                    <Link
                                        to={bookingLink}
                                        className="mt-6 mb-4 w-full inline-block text-center bg-orange-500 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-400 transition-colors duration-300 text-lg"
                                    >
                                        Book Your Stay
                                    </Link>

                                    <h3 className="text-xl font-semibold text-green-700 mt-6 mb-3">Amenities Include:</h3>
                                    <ul className="space-y-2 text-sm">
                                        {amenities.map((amenity, index) => (
                                            <li key={index} className="flex items-center text-gray-600">
                                                {amenity.icon && <span className="mr-2 text-green-600 flex-shrink-0">{amenity.icon}</span>}
                                                <span>{amenity.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* You Might Also Like Section (Optional) */}
                    <div className="mt-16 pt-8 border-t border-gray-300">
                        <h2 className="text-2xl md:text-3xl font-serif text-green-800 mb-8 text-center">Explore Other Stays</h2>
                        {/* Add 2-3 cards here linking to other accommodation detail pages, similar to Stay.js but simplified */}
                        <p className="text-center text-gray-600">Placeholder for other accommodation previews.</p>
                    </div>

                </div>
            </div>
        </HelmetProvider>
    );
};

export default SafariTent;

