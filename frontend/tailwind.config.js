/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    height: {
      s60: "60vh",
      s70: "70vh",
      s80: "80vh",
      s90: "90vh",
      s100: "100vh",
      hfull: "100%",
    },
    colors: {
      light: "#f0f2f5",
      white: "#fff",
      greens: "#2ec4b6",
      lgreens: "#3cd5c5",
      oranges: "#ff9f1c",
      loranges: "#fdac3a",
      facebook: "#1877f2",
    },
    backgroundImage: {
      pouch:
        "url('https://images.pexels.com/videos/5197762/autumn-calm-cosy-drops-5197762.jpeg')",
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
