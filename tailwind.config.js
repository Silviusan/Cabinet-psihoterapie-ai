/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8B7CF6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        sage: {
          50: "#f0f7f1",
          100: "#dceddf",
          200: "#b8dbbf",
          300: "#87c093",
          400: "#6B9E78",
          500: "#4d8059",
          600: "#3a6344",
        },
        calm: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#5B8DB8",
          500: "#3b70a0",
          600: "#2c5a87",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
