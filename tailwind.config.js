/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "iblups-blue": {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd8ff",
          300: "#8ec0ff",
          400: "#599dff",
          500: "#2c73ff",
          600: "#1b56f5",
          700: "#1441e1",
          800: "#1735b6",
          900: "#19328f",
          950: "#142057",
        },
        "iblups-green": {
          50: "#ebfef6",
          100: "#cffce6",
          200: "#a4f6d3",
          300: "#4ce8af",
          400: "#2ed9a0",
          500: "#09c089",
          600: "#009c70",
          700: "#007d5d",
          800: "#03624b",
          900: "#03513e",
          950: "#002e24",
        },
        "iblups-grey": {
          50: "#f4f6f7",
          100: "#e3e7ea",
          200: "#cbd3d6",
          300: "#a6b4ba",
          400: "#7a8c96",
          500: "#5f717b",
          600: "#515f69",
          700: "#465058",
          800: "#373d42",
          900: "#212529",
          950: "#0D0E0F",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [
  ],
};