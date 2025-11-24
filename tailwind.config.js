/** @type {import('tailwindcss').Config} */

import themeColors from '@/styles/theme.js';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        accent: themeColors.accent,
        neutral: themeColors.neutral,
        primaryAdmin: themeColors.primaryAdmin,
        wellBlue: themeColors.wellBlue
      },
    },
  },
  plugins: [],
};
