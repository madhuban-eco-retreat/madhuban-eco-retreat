module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        max640: { max: "640px" },
        max500: { max: "500px" },
        "max-sm": { max: "640px" },
        "max-Xsm": { max: "400px" },
        "max-340": { max: "340px" },
        "max-367": { max: "367px" },
      },
      colors: {
        green: {
          800: "#2D5F2D",
          700: "#3A6B35",
          600: "#4A8B40",
          500: "#5BA84C",
          400: "#79B86B",
          300: "#99CB8F",
          200: "#BBDDB4",
          100: "#DDEED9",
          50: "#F2F8F0",
        },
        brown: {
          800: "#8B5A2B",
          700: "#9C6A3C",
          600: "#AD7B4D",
          500: "#BD8C5E",
          400: "#CA9F77",
          300: "#D7B291",
          200: "#E4C6B0",
          100: "#F1D9CA",
          50: "#F8ECE4",
        },
        stone: {
          900: "#28241F",
          800: "#3C3730",
          700: "#504A41",
          600: "#655D52",
          500: "#7A7063",
          400: "#8F8474",
          300: "#A59985",
          200: "#BAAD97",
          100: "#D0C2A8",
          50: "#F5F0E8",
        },
        title: "rgb(154, 136, 100)",
        // Official stationery palette.
        brand: {
          light: "#E0D1BC", // rgb(224, 209, 188) - warm beige
          dark: "#9A8864", // rgb(154, 136, 100) - golden brown
          // Derived. brand.dark is a mid-tone: it cannot carry small text on
          // either brand.light (2.3:1) or white (3.5:1), so it is used for
          // fills, rules and borders only. These two carry the text.
          ink: "#2C2416", // dark ground - 10.2:1 against brand.light
          deep: "#241C10", // on brand.dark fills - 4.9:1
          muted: "#C4B49A", // secondary text on brand.ink - 7.5:1
        },
      },
      fontFamily: {
        // Brand stacks. Sitka Banner and Arial Narrow are the stationery faces
        // and are picked up on Windows where they are installed; everywhere
        // else the browser falls through to the next/font webfonts, whose
        // families are exposed as --font-heading-family / --font-body-family
        // by src/app/layout.js.
        heading: [
          "Sitka Banner",
          "var(--font-heading-family)",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        display: [
          "Sitka Banner",
          "var(--font-heading-family)",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        body: [
          "Arial Narrow",
          "var(--font-body-family)",
          "Barlow Condensed",
          "Arial",
          "sans-serif",
        ],
        // Legacy aliases. These classes are still scattered through the pages;
        // pointing them at the brand stacks stops them rendering as unstyled
        // fallbacks now that the config is actually being loaded.
        poppins: ["var(--font-body-family)", "Barlow Condensed", "Arial", "sans-serif"],
        openSans: ["var(--font-body-family)", "Barlow Condensed", "Arial", "sans-serif"],
        inter: ["var(--font-body-family)", "Barlow Condensed", "Arial", "sans-serif"],
        "arial-narrow": [
          "Arial Narrow",
          "var(--font-body-family)",
          "Barlow Condensed",
          "Arial",
          "sans-serif",
        ],
      },

      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  // strategy:"class" keeps @tailwindcss/forms opt-in via form-input/form-select
  // rather than restyling every input on the site. Nothing currently uses those
  // classes, so turning the config on does not touch the booking engine or the
  // admin panel.
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
