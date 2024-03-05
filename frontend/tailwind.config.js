/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1da1f2",
        secondary: "#14171a",
        tertiary: "#657786",
        brightGray: "#aabbc2",
        veryLightGray: "#e1e8ed",
        extraLightGrey: "#f5f8fa",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
