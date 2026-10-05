/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
          border: "#BFDBFE",
        },
        roboflow: {
          purple: "#2563EB",
          "purple-hover": "#1D4ED8",
          "purple-light": "#EFF6FF",
          "purple-border": "#BFDBFE",
          dark: "#0F172A",
          slate: "#475569",
          border: "#E2E8F0",
          bg: "#FAFAFC"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
