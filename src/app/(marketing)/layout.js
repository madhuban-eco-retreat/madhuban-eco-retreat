import MainNavigation from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/modals/ContactModal";
import CookiesPopup from "@/common-components/cookies/cookies";

// Owns the public-site chrome that used to sit in the root layout. Keeping it
// here scopes it to marketing routes only, so the booking flow (/book) and the
// admin panel (/admin) render without a site header, footer or contact modal.
export default function MarketingLayout({ children }) {
  return (
    <>
      <MainNavigation />
      <main id="main-content">{children}</main>
      <Footer />
      <ContactModal />
      <CookiesPopup />
    </>
  );
}
