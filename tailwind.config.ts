import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          turquoise: "#43b5a9",
          mustard: "#dfa135",
          magenta: "#ce4a7e",
          dark: "#3b3f46",
        },
      },
    },
  },
  plugins: [],
};
export default config;
