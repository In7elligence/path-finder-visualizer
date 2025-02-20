import type { Config } from "tailwindcss";

export default {
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
      },
      screens: {
        '4k': '3840px', // Custom breakpoint for 4K screens
        'slt': '1279px', // Custom breakpoint for small laptop screens
        'llt': '1540px', // Custom breakpoint for large laptop screens
      },
    },
  },
  plugins: [],
} satisfies Config;
