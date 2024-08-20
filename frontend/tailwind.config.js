/** @type {import('tailwindcss').Config} */

export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      mmd: { max: "658px" },
      // => @media (max-width: 658px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      ssm: { max: "560px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "480px" },
      // => @media (max-width: 480px) { ... }

      xxs: { max: "425px" },
      // => @media (max-width: 425px) { ... }
    },
    height: {
      s40: "40vh",
      s60: "60vh",
      s70: "70vh",
      s80: "80vh",
      s85: "85vh",
      s90: "90vh",
      s100: "100vh",
      hfull: "100%",
      h50: "50%",
      hfit: "fit-content",
    },
    colors: {
      light: "#f0f2f5",
      dark: "#1c1e21",
      white: "#fff",
      greens: "#2ec4b6",
      lgreens: "#3cd5c5",
      oranges: "#ff9f1c",
      loranges: "#fdac3a",
      facebook: "#1877f2",
    },
    extend: {
      fontFamily: {
        pops: ["Poppins", "sans-serif"],
      },
      colors: {
        inputLight: "#c9ccd1",
      },
      backgroundImage: {
        employee: "https://cdn-icons-png.flaticon.com/512/8327/8327833.png",
      },
    },
  },
  plugins: [],
};
