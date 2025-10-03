// src/App.js
import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import Footer from "./components/Footer";
import BookNowButton from "./components/BookNowButton";
import LoadingSpinner from "./components/LoadingSpinner";
import BookingModal from "./components/BookingModal";
import ScrollToTop from "./utils/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";

// Lazy loaded pages
const Home = lazy(() =>
  import("./pages/Home").then((module) => ({
    default: module.default || module,
  }))
);
const About = lazy(() =>
  import("./pages/About").then((module) => ({
    default: module.default || module,
  }))
);
const Story = lazy(() =>
  import("./pages/Story").then((module) => ({
    default: module.default || module,
  }))
);
const EcoPhilosophy = lazy(() =>
  import("./pages/EcoPhilosophy").then((module) => ({
    default: module.default || module,
  }))
);
const VisionMission = lazy(() =>
  import("./pages/VisionMission").then((module) => ({
    default: module.default || module,
  }))
);

const Team = lazy(() =>
  import("./pages/Team").then((module) => ({
    default: module.default || module,
  }))
);

const Blog = lazy(() =>
  import("./pages/Blog").then((module) => ({
    default: module.default || module,
  }))
);
const BlogPost = lazy(() =>
  import("./pages/BlogPost").then((module) => ({
    default: module.default || module,
  }))
);

const Stay = lazy(() =>
  import("./pages/Stay").then((module) => ({
    default: module.default || module,
  }))
);
const AccommodationDetail = lazy(() =>
  import("./pages/AccommodationDetail").then((module) => ({
    default: module.default || module,
  }))
);
const Cottages = lazy(() =>
  import("./pages/SafariTent").then((module) => ({
    default: module.default || module,
  }))
);
const Tents = lazy(() =>
  import("./pages/Tents").then((module) => ({
    default: module.default || module,
  }))
);
// const Treehouses = lazy(() =>
//   import("./pages/Treehouses").then((module) => ({
//     default: module.default || module,
//   }))
// );
const GuestGuidelines = lazy(() =>
  import("./pages/GuestGuidelines").then((module) => ({
    default: module.default || module,
  }))
);

const Experiences = lazy(() =>
  import("./pages/Experiences").then((module) => ({
    default: module.default || module,
  }))
);
const NatureTrails = lazy(() =>
  import("./pages/NatureTrails").then((module) => ({
    default: module.default || module,
  }))
);
const OrganicFarming = lazy(() =>
  import("./pages/OrganicFarming").then((module) => ({
    default: module.default || module,
  }))
);
const BirdWatching = lazy(() =>
  import("./pages/BirdWatching").then((module) => ({
    default: module.default || module,
  }))
);
const LocalCulture = lazy(() =>
  import("./pages/LocalCulture").then((module) => ({
    default: module.default || module,
  }))
);
const Yoga = lazy(() =>
  import("./pages/Yoga").then((module) => ({
    default: module.default || module,
  }))
);

const Dining = lazy(() =>
  import("./pages/Dining").then((module) => ({
    default: module.default || module,
  }))
);
const FarmToTable = lazy(() =>
  import("./pages/FarmToTable").then((module) => ({
    default: module.default || module,
  }))
);
const Menus = lazy(() =>
  import("./pages/Menus").then((module) => ({
    default: module.default || module,
  }))
);
const SpecialDiets = lazy(() =>
  import("./pages/SpecialDiets").then((module) => ({
    default: module.default || module,
  }))
);

const NearbyAttractions = lazy(() =>
  import("./pages/NearbyAttractions").then((module) => ({
    default: module.default || module,
  }))
);

const Gallery = lazy(() =>
  import("./pages/Gallery").then((module) => ({
    default: module.default || module,
  }))
);
const PhotoGallery = lazy(() =>
  import("./pages/PhotoGallery").then((module) => ({
    default: module.default || module,
  }))
);
const VideoGallery = lazy(() =>
  import("./pages/VideoGallery").then((module) => ({
    default: module.default || module,
  }))
);
const GuestExperiences = lazy(() =>
  import("./pages/GuestExperiences").then((module) => ({
    default: module.default || module,
  }))
);

const Events = lazy(() =>
  import("./pages/Events").then((module) => ({
    default: module.default || module,
  }))
);
const YogaRetreats = lazy(() =>
  import("./pages/YogaRetreats").then((module) => ({
    default: module.default || module,
  }))
);
const Corporate = lazy(() =>
  import("./pages/Corporate").then((module) => ({
    default: module.default || module,
  }))
);
const Family = lazy(() =>
  import("./pages/Family").then((module) => ({
    default: module.default || module,
  }))
);
const CustomPackages = lazy(() =>
  import("./pages/CustomPackages").then((module) => ({
    default: module.default || module,
  }))
);

const Sustainability = lazy(() =>
  import("./pages/Sustainability").then((module) => ({
    default: module.default || module,
  }))
);
const Initiatives = lazy(() =>
  import("./pages/Initiatives").then((module) => ({
    default: module.default || module,
  }))
);
const WaterWaste = lazy(() =>
  import("./pages/WaterWaste").then((module) => ({
    default: module.default || module,
  }))
);
const Carbon = lazy(() =>
  import("./pages/Carbon").then((module) => ({
    default: module.default || module,
  }))
);

const Contact = lazy(() =>
  import("./pages/Contact").then((module) => ({
    default: module.default || module,
  }))
);
const BookingConfirmation = lazy(() =>
  import("./pages/BookingConfirmation").then((module) => ({
    default: module.default || module,
  }))
);
const FAQs = lazy(() =>
  import("./pages/FAQs").then((module) => ({
    default: module.default || module,
  }))
);
const Testimonials = lazy(() =>
  import("./pages/Testimonials").then((module) => ({
    default: module.default || module,
  }))
);
const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy").then((module) => ({
    default: module.default || module,
  }))
);
const TermsConditions = lazy(() =>
  import("./pages/TermsConditions").then((module) => ({
    default: module.default || module,
  }))
);
const CancellationPolicy = lazy(() =>
  import("./pages/CancellationPolicy").then((module) => ({
    default: module.default || module,
  }))
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.default || module,
  }))
);

const ForestNature = lazy(() =>
  import("./pages/ForestNature").then((module) => ({
    default: module.default || module,
  }))
);

const BirdWilderness = lazy(() =>
  import("./pages/BirdWilderness").then((module) => ({
    default: module.default || module,
  }))
);

const RecreationalFacilities = lazy(() =>
  import("./pages/RecreationalFacilities").then((module) => ({
    default: module.default || module,
  }))
);

// Page wrapper for consistent layouts
const PageWrapper = ({ children }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Determine if current route is home page
  const isHomePage = location.pathname === "/";

  return (
    <>
      {children}
      {!isHomePage && <BookNowButton />}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <MainNavigation />
        <Suspense fallback={<LoadingSpinner />}>
          <PageWrapper>
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* About Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/about/story" element={<Story />} />
              <Route path="/about/eco-philosophy" element={<EcoPhilosophy />} />
              <Route
                path="/about/Vision-&-Mission"
                element={<VisionMission />}
              />
              <Route path="/about/Our-Team" element={<Team />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Stay Pages */}
              <Route path="/stay" element={<Stay />} />
              <Route path="/stay/cottages" element={<Cottages />} />
              <Route path="/stay/tents" element={<Tents />} />
              {/* <Route path="/stay/treehouses" element={<Treehouses />} /> */}
              <Route path="/stay/guidelines" element={<GuestGuidelines />} />
              <Route path="/stay/:slug" element={<AccommodationDetail />} />

              {/* Experiences Pages */}
              <Route path="/experiences" element={<Experiences />} />
              <Route
                path="/experiences/nature-trails"
                element={<NatureTrails />}
              />
              <Route
                path="/experiences/organic-farming"
                element={<OrganicFarming />}
              />
              <Route
                path="/experiences/bird-watching"
                element={<BirdWatching />}
              />
              <Route
                path="/experiences/local-culture"
                element={<LocalCulture />}
              />
              <Route path="/experiences/yoga" element={<Yoga />} />
              <Route
                path="/experiences/forest-walks-&-nature-trails"
                element={<ForestNature />}
              />

              <Route
                path="/experiences/bird-watching-&-wilderness"
                element={<BirdWilderness />}
              />

              <Route
                path="/experiences/recreational-facilities"
                element={<RecreationalFacilities />}
              />

              {/* Dining Pages */}
              <Route path="/dining" element={<Dining />} />
              <Route path="/dining/farm-to-table" element={<FarmToTable />} />
              <Route path="/dining/menus" element={<Menus />} />
              <Route path="/dining/special-diets" element={<SpecialDiets />} />

              <Route
                path="/nearby-attractions"
                element={<NearbyAttractions />}
              />

              {/* Gallery Pages */}
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/photos" element={<PhotoGallery />} />
              <Route path="/gallery/videos" element={<VideoGallery />} />
              <Route
                path="/gallery/guest-experiences"
                element={<GuestExperiences />}
              />

              {/* Events Pages */}
              <Route path="/events" element={<Events />} />
              <Route path="/events/yoga-retreats" element={<YogaRetreats />} />
              <Route path="/events/corporate" element={<Corporate />} />
              <Route path="/events/family" element={<Family />} />
              <Route
                path="/events/custom-packages"
                element={<CustomPackages />}
              />

              {/* Sustainability Pages */}
              <Route path="/sustainability" element={<Sustainability />} />
              <Route
                path="/sustainability/initiatives"
                element={<Initiatives />}
              />
              <Route
                path="/sustainability/water-waste"
                element={<WaterWaste />}
              />
              <Route path="/sustainability/carbon" element={<Carbon />} />

              {/* Contact & Booking */}
              <Route path="/contact" element={<Contact />} />
              {/* <Route path="/booking" element={<Booking />} /> */}

              <Route path="/booking" element={<BookingModal />} />

              <Route
                path="/booking/confirmation"
                element={<BookingConfirmation />}
              />

              {/* Other Pages */}
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route
                path="/cancellation-policy"
                element={<CancellationPolicy />}
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageWrapper>
        </Suspense>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
