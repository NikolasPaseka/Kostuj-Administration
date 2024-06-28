import { nextui } from "@nextui-org/react";
import lightTheme from "./src/theme/lightTheme";
import darkTheme from "./src/theme/darkTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: lightTheme,
      },
      dark: {
        colors: darkTheme,
      }
    }
  })],
}

