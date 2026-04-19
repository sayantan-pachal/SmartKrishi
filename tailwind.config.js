/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "smartkrishi-light": "linear-gradient(180deg, #f8f7f4, #EAF3DE)",
        "smartkrishi-dark": "linear-gradient(0deg, #050a02, #000000)",
        'auth-bg1': "url('/bg_images/image2.png')",
        'auth-bg2': "url('/bg_images/image.png')",
        'profile': "url('/image.png')",
      },
      colors: {
        "smart-green": {
          50: "#EAF3DE",
          100: "#C0DD97",
          600: "#3B6D11",
          700: "#27500A",
          800: "#173404",
        },
      },
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      keyframes: {
        toastDrop: {
          '0%': { transform: 'translate(-50%, -50px)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
      animation: {
        toastDrop: 'toastDrop 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};