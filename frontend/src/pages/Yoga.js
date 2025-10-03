import React, { useEffect } from 'react';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const NatureTrails = () => {
    useEffect(() => {
        // Initialize Fancybox
        NativeFancybox.bind("[data-fancybox=\"gallery\"]", {
            // Your custom options
        });

        // Cleanup on component unmount
        return () => {
            NativeFancybox.destroy();
        };
    }, []);

    const images = [
        { src: "/images/accommodations/camping-tent.jpeg", thumb: "/images/accommodations/camping-tent.jpeg", caption: "Beautiful Forest Path" },
        { src: "/images/accommodations/pool-side-room.jpeg", thumb: "/images/accommodations/pool-side-room.jpeg", caption: "Beautiful Forest Path" },
        { src: "/images/accommodations/mud-villa.jpg", thumb: "/images/accommodations/mud-villa.jpg", caption: "Beautiful Forest Path" },
        { src: "/images/accommodations/safari-tent.jpeg", thumb: "/images/accommodations/safari-tent.jpeg", caption: "Beautiful Forest Path" },
        { src: "/images/accommodations/safari-tent1.jpeg", thumb: "/images/accommodations/safari-tent1.jpeg", caption: "Beautiful Forest Path" },
        { src: "/images/accommodations/comping-tent3.jpg", thumb: "/images/accommodations/comping-tent3.jpg", caption: "Beautiful Forest Path" },
    ];

    const containerStyle = {
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const pageTitleStyle = {
        textAlign: 'center',
        fontSize: '2em',
        marginBottom: '20px',
        marginTop: '10%',
        color: '#444',
    };

    const descriptionStyle = {
        fontSize: '1.2em',
        lineHeight: '1.6',
        marginBottom: '15px',
        textAlign: 'left',
    };

    const captionStyle = {
        textAlign: 'center',
        fontSize: '0.9em',
        fontStyle: 'italic',
        color: '#777',
        marginBottom: '30px',
    };

    const galleryStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        justifyContent: 'center',
    };

    const imageContainerStyle = {
        width: '100%',
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
    };

    return (
        <div style={containerStyle}>
            <h2 style={pageTitleStyle}>Explore Our Yog</h2>
            <p style={descriptionStyle}>
                Discover the serene beauty of winding paths, lush greenery, and breathtaking vistas. Our nature trails offer an escape into the wilderness, perfect for hiking, bird watching, or simply enjoying a peaceful walk. Each trail is carefully maintained and provides unique encounters with local flora and fauna.
            </p>
            <p style={captionStyle}>Click on any image to view it in a larger size.</p>

            <div style={galleryStyle}>
                {images.map((image, index) => (
                    <a
                        key={index}
                        data-fancybox="gallery"
                        href={image.src}
                        data-caption={image.caption}
                        style={imageContainerStyle}
                    >
                        <img
                            src={image.thumb}
                            alt={image.caption}
                            style={imageStyle}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default NatureTrails;
