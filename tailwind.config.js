/** @type {import('tailwindcss').Config} */

module.exports = {
  content: {
    files: [
      "./components/**/*.{vue,js}",
      "./layouts/**/*.{vue,js}",
      "./pages/**/*.{vue,js}",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
    ],
  },

  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    fontFamily: {
      sans: ["Onest", "sans-serif"],
    },
    // screens: {
    //   'sm': '640px',
    //   'md': '768px',
    //   'lg': '1024px',
    //   'xl': '1280px',
    //   '2xl': '1536px',
    // },

    fluid: {
      min: "350px",
      max: "1920px",
      convertUnit: true,
      rootFontSize: "16px",
    },

    colors: {
      black: "#1F1F1F",
      white: "#fff",
      transparent: "transparent",
      "white-o2": "rgba(255, 255, 255, 0.20)",
      gray: {
        100: "#C5C5C9",
        200: "#D2D2D2",
        300: "#AFB6C3",
        400: "#EEEFF4",
        500: "#A5A5A5",
        600: "#727274",
        700: "#BFC5D1",
        800: "#9B9C9F",
      },
      blue: {
        100: "#041B44",
        200: "#6483A9",
        300: "#A3B8D0",
        400: "#68768F",
        500: "#182F58",
        600: "#0F1D35",
      },
    },
  },
  plugins: [require("tailwind-smart-fluid")],
};
