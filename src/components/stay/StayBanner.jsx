import Image from "next/image";

/**
 * Single still hero for the Stay page: the lodge at dusk (the last picture of
 * the home page slider). One image, no carousel.
 */
const HERO_SRC =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/banner/desktop/Madhuban_Eco_Retreat_3000x1688.jpg";

const StayBanner = () => {
  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-earth-brown md:h-[85vh]">
      <Image
        src={HERO_SRC}
        alt="Madhuban Eco Retreat lodge at dusk on the edge of Ratapani Tiger Reserve"
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#3A3123]/45">
        <div className="max-w-7xl px-4 text-center text-cream">
          <h1 className="bannerHeading font-primary">
            Discover Your Ideal Eco Stay Near Bhopal &amp; Ratapani
          </h1>
          <h2 className="bannerSubHeading mt-4">
            A journey into forests, wildlife, and mindful living
          </h2>
        </div>
      </div>
    </section>
  );
};

export default StayBanner;
