import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F3B5F",
        tertiary: "#82D361",
        hover: {
          primary: "#000000",
        },
        background: {
          primary: "#1F3B5F",
          secondary: "#F5F5F5",
        },
        text: {
          primary: "#1F3B5F",
          muted: "#4A4A4A",
          tertiary: "#82D361",
        },
      },
      screens: {
        // Target screens with max-height of 400px
        medium: { raw: "(max-height: 780px)" },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
