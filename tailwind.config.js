/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.{vue,js}",
    "./pages/**/*.{vue,js}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],

  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    extend: {
      fontFamily: {
        sans: ["Onest", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "white-o2": "rgba(255, 255, 255, 0.20)",
        black: "#1F1F1F",
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
      fluid: {
        min: "350px",
        max: "1920px",
        convertUnit: true,
        rootFontSize: "16px",
      },
    },
  },

  plugins: [require("tailwind-smart-fluid")],
};
