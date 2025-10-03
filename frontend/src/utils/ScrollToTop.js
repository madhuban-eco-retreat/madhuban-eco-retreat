// src/utils/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    if (hash) {
      // Delay to allow the target element to render
      const id = hash.replace('#', '');
      const scrollToAnchor = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      // Try immediately, then a few retries in case of delayed render
      if (!scrollToAnchor()) {
        const retries = [100, 200, 400];
        let handled = false;
        retries.forEach((delay) => {
          setTimeout(() => {
            if (!handled) handled = scrollToAnchor();
          }, delay);
        });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;