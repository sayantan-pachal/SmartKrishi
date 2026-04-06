/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "smartkrishi-light": "linear-gradient(180deg, #f8f7f4, #EAF3DE)", // Updated to match your new aesthetic
        "smartkrishi-dark": "linear-gradient(0deg, #050a02, #000000)",
      },
      colors: {
        // High-end brand colors from your HTML template
        "smart-green": {
          50: "#EAF3DE",
          100: "#C0DD97",
          600: "#3B6D11",
          700: "#27500A",
          800: "#173404",
        },
      },
      fontFamily: {
        // Essential for that professional look
        fraunces: ["Fraunces", "serif"],
        dm: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};