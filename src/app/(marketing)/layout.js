import MainNavigation from "@/components/Header";
import Footer from "@/components/Footer";
import RatingsBar from "@/components/ratings/RatingsBar";
import CookiesPopup from "@/common-components/cookies/cookies";
import FloatingContactButtons from "@/common-components/floating-contact/FloatingContactButtons";

// Owns the public-site chrome that used to sit in the root layout. Keeping it
// here scopes it to marketing routes only, so the booking flow (/book) and the
// admin panel (/admin) render without a site header, footer or contact modal.
//
// ContactModal (the auto-popping WhatsApp lead-capture modal) was removed
// from here on the owner's request — it was firing 10s after load on nearly
// every page and only stayed dismissed for 1 day, so returning visitors saw
// it daily. FloatingContactButtons is the "less intrusive version" that
// comment anticipated: two small persistent buttons, not a popup.
export default function MarketingLayout({ children }) {
  return (
    <>
      <MainNavigation />
      {children}
      <RatingsBar />
      <Footer />
      <CookiesPopup />
      <FloatingContactButtons />
    </>
  );
}
