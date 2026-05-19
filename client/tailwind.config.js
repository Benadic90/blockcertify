/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        card: "0 12px 30px rgba(2, 6, 23, 0.08)"
      }
    }
  },
  plugins: []
};
