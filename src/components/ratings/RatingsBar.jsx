"use client";
import { useEffect } from "react";

const TRIPADVISOR_URL =
  "https://www.tripadvisor.co.uk/Hotel_Review-g19862956-d19859032-Reviews-Madhuban_Eco_Retreat-Dongri_Sehore_District_Madhya_Pradesh.html";
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/?q=place_id:ChIJ8aTzfCu1fTkRYfqcfX7vLLg";
const TRIPADVISOR_WIDGET_SRC =
  "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=351&locationId=19859032&lang=en_UK&border=true&display_version=2";

export default function RatingsBar() {
  // Injected after mount rather than rendered as markup: the widget script
  // looks for its container the moment it executes, so it has to run after
  // that node exists. Guarded so a re-mount does not append it twice.
  useEffect(() => {
    const EXISTING = document.querySelector(
      `script[src="${TRIPADVISOR_WIDGET_SRC}"]`,
    );
    if (EXISTING) return;

    const script = document.createElement("script");
    script.src = TRIPADVISOR_WIDGET_SRC;
    script.async = true;
    script.setAttribute("data-loadtrk", "");
    document.body.appendChild(script);
  }, []);

  return (
    <section className="bg-[#F5F0E8] border-t border-[#C8B99A] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-sm font-medium text-charcoal/60 uppercase tracking-widest mb-6">
          Rated by Our Guests
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {/* TripAdvisor.
              The widget script rewrites #TA_cdsratingsonlynarrow351 in place
              once it runs, swapping this lockup for the live rating and review
              count. It is injected from an effect after mount so the container
              is guaranteed to exist first - loading it through next/script
              could fire before the node was in the DOM, which left the
              placeholder logo showing and no rating. */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">
              TripAdvisor
            </p>
            <div
              id="TA_cdsratingsonlynarrow351"
              className="TA_cdsratingsonlynarrow"
            >
              <ul id="KKpRG73CbUYj" className="TA_links 4xo0Wl">
                <li id="xd36h8rA4" className="NnLYwGogV4b">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={TRIPADVISOR_URL}
                    className="inline-flex items-center justify-center min-h-11"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://www.tripadvisor.co.uk/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
                      alt="TripAdvisor"
                      width={160}
                      height={40}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-[#C8B99A]" />

          {/* Google Reviews Widget */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-charcoal/50 uppercase tracking-wider">
              Google Reviews
            </p>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-[#FBBC04]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal">
                4.8 / 5
              </span>
              <span className="text-xs text-charcoal/50">
                View on Google Maps
              </span>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs text-charcoal/50">Google</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
