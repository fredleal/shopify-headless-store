import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary-500, #3b82f6)",
          50: "var(--color-primary-50, #eff6ff)",
          100: "var(--color-primary-100, #dbeafe)",
          200: "var(--color-primary-200, #bfdbfe)",
          300: "var(--color-primary-300, #93c5fd)",
          400: "var(--color-primary-400, #60a5fa)",
          500: "var(--color-primary-500, #3b82f6)",
          600: "var(--color-primary-600, #2563eb)",
          700: "var(--color-primary-700, #1d4ed8)",
          800: "var(--color-primary-800, #1e40af)",
          900: "var(--color-primary-900, #1e3a8a)",
        },
        secondary: {
          DEFAULT: "var(--color-gray-500, #6b7280)",
          50: "var(--color-gray-50, #f9fafb)",
          100: "var(--color-gray-100, #f3f4f6)",
          200: "var(--color-gray-200, #e5e7eb)",
          300: "var(--color-gray-300, #d1d5db)",
          400: "var(--color-gray-400, #9ca3af)",
          500: "var(--color-gray-500, #6b7280)",
          600: "var(--color-gray-600, #4b5563)",
          700: "var(--color-gray-700, #374151)",
          800: "var(--color-gray-800, #1f2937)",
          900: "var(--color-gray-900, #111827)",
        },
        accent: {
          red: {
            DEFAULT: "var(--color-red-500, #ef4444)",
            500: "var(--color-red-500, #ef4444)",
            600: "var(--color-red-600, #dc2626)",
            700: "var(--color-red-700, #b91c1c)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
