/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#e1ecff",
          500: "#1d4ed8",
          600: "#1b45c2",
          700: "#173a9f",
        },
      },
    },
  },
  plugins: [],
};
