/** @type {import('tailwindcss').Config} */

export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/landingpage/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      "2xl": { max: "1635px" },
      // => @media (max-width: 1279px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      mdd: { max: "810px" },

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

      // @media for Calendar
      clg: { max: "1181px" },
    },

    // fontSize: {
    //   textPar: [
    //     "1.25rem",
    //     {
    //       fontSize: "14px",
    //       fontWeigt: "400",
    //       lineHeight: "20px",
    //     },
    //   ],
    // },

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
      light: "#f2f4f7",
      subCon: "#f0f2f5",
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
    },
  },
  plugins: [],
};
