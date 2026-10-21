/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2824",
        muted: "#727a74",
        canvas: "#f8f8f5",
        brand: "#285b49",
        "brand-dark": "#1d4638",
        "brand-soft": "#e8eee9",
        sand: "#f0eee8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: "0 12px 36px rgba(31, 40, 36, 0.08)",
      },
    },
  },
  plugins: [],
};
