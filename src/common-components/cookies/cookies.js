"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { isLandingRoute } from "@/utills/landingRoutes";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Slide,
  Switch,
} from "@mui/material";

const COOKIE_KEY = "madhuban_cookie_preferences";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CookiesPopup = () => {
  const pathname = usePathname();
  const onLandingRoute = isLandingRoute(pathname);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (onLandingRoute) return;
    const cookiePref = Cookies.get(COOKIE_KEY);
    if (cookiePref) {
      try {
        const parsed = JSON.parse(cookiePref);
        setPreferences({
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        });
      } catch (e) {
        // If parsing fails, show banner
        setShowBanner(true);
      }
    } else {
      // If no cookie preferences exist, show banner
      setTimeout(() => {
        setShowBanner(true);
      }, 10000);
    }
  }, []);

  useEffect(() => {
    if (!showBanner) setShowPreferences(false);
  }, [showBanner]);

  if (onLandingRoute) return null;
  if (!showBanner) return null;
  const savePreferencesToCookie = (prefs) => {
    Cookies.set(COOKIE_KEY, JSON.stringify(prefs), {
      expires: 365,
      sameSite: "Lax",
    });
  };
  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPrefs);
    savePreferencesToCookie(newPrefs);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPrefs);
    savePreferencesToCookie(newPrefs);
    setShowBanner(false);
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    setShowPreferences(false);
    savePreferencesToCookie(preferences);
    setShowBanner(false);
  };

  const handlePreferenceChange = (type) => (event) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: event.target.checked,
    }));
  };

  return (
    <>
      <div className="fixed bottom-3 md:bottom-5 left-0 right-0 mx-2 md:mx-5 lg:mx-12 z-30">
        <Box
          className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 items-center bg-primary-gray rounded-xl sm:rounded-full px-3 py-2"
          sx={{
            boxShadow: "0 0px 50px 4px #00000040",
          }}
        >
          <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
            <div className="w-[26px] h-[26px] md:w-[32px] md:h-[32px] relative shrink-0">
              <Image quality={90}
                src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/cookies.svg"
                alt="logo"
                fill
              />
            </div>
            <p className="text-xs md:text-sm leading-snug">{`We use cookies to improve your experience.`}</p>
          </div>
          <div className="flex flex-row gap-2 sm:gap-3 items-center justify-between sm:justify-end w-full sm:w-auto">
            <Link
              onClick={handleManagePreferences}
              href="/"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-medium hover:underline underline text-charcoal whitespace-nowrap shrink-0"
            >
              {`Settings`}
            </Link>
            <div className="flex flex-row gap-2 shrink-0">
              <button
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 text-xs md:text-sm rounded-md font-semibold border border-earth-brown transition cursor-pointer hover:text-warm-beige hover:bg-earth-brown whitespace-nowrap"
                type="submit"
              >
                {`Reject`}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-3 py-1.5 text-xs md:text-sm rounded-md font-semibold text-warm-beige bg-earth-brown transition cursor-pointer whitespace-nowrap"
                type="submit"
              >
                {`Accept All`}
              </button>
            </div>
          </div>
        </Box>
      </div>

      <Dialog
        open={showPreferences}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowPreferences(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            paddingTop: 2,
            position: "relative",
          },
        }}
      >
        <p className="dm_sans  responsive-text font-bold! ps-6 text-xl">
          {" "}
          {`Cookie Preferences`}{" "}
        </p>
        <IconButton
          aria-label="close"
          onClick={() => setShowPreferences(false)}
          className="text-earth-brown"
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="pt-4">
          {/* Necessary Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Necessary Cookies`}{" "}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-success font-bold dm_sans text-[15px]">
                  {" "}
                  {` Ã¢Å“â€ Always Active`}{" "}
                </p>
              </div>
            </div>
            <p className=" dm_sans text-[15px] text-charcoal">
              {`These are essential for the website to function properly (you can't turn these off).`}
            </p>
          </div>
          <Divider className="my-2" />
          {/* Analytics Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Analytics Cookies`}{" "}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={preferences.analytics}
                    onChange={handlePreferenceChange("analytics")}
                  />
                }
                label=""
                className="m-0!"
              />
            </div>
            <p className=" dm_sans text-[15px] text-charcoal">
              {` Help us understand how users interact with our site so we can improve the experience.`}
            </p>
          </div>
          <Divider className="my-2" />
          {/* Marketing Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Marketing Cookies`}{" "}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={preferences.marketing}
                    onChange={handlePreferenceChange("marketing")}
                  />
                }
                label=""
                className="m-0!"
              />
            </div>
            <p className=" dm_sans text-[15px] text-charcoal">
              {`Allow us to show you personalized ads and offers on platforms like Instagram, Google, and YouTube.`}
            </p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-2">
          <button
            onClick={handleSavePreferences}
            className="cursor-pointer mt-6 w-full py-3 text-center rounded-md font-semibold  text-warm-beige bg-earth-brown hover:bg-[rgb(132,116,85)] transition primary-font-family"
          >
            Save My Preferences
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookiesPopup;
