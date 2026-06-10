import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7D33FF",
          50: "#f3ebff",
          100: "#e0caff",
          200: "#c49bff",
          300: "#a86cff",
          400: "#9148ff",
          500: "#7D33FF",
          600: "#6a1fef",
          700: "#5613d4",
          800: "#430fab",
          900: "#310b82",
        },
        dark: {
          DEFAULT: "#141223",
          50: "#1e1b35",
          100: "#1a1830",
          200: "#16142a",
          300: "#141223",
          400: "#0f0d1a",
          500: "#0a0912",
        },
        "dark-card": "#1e1b35",
        "dark-border": "#2a2750",
        "purple-glow": "rgba(125, 51, 255, 0.15)",
      },
      backgroundImage: {
        "purple-gradient": "linear-gradient(135deg, #7D33FF 0%, #4A1FAD 100%)",
        "dark-gradient": "linear-gradient(135deg, #1e1b35 0%, #141223 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(125, 51, 255, 0.1) 0%, rgba(20, 18, 35, 0.8) 100%)",
      },
      boxShadow: {
        "purple": "0 4px 24px rgba(125, 51, 255, 0.25)",
        "card": "0 4px 16px rgba(0, 0, 0, 0.3)",
        "glow": "0 0 20px rgba(125, 51, 255, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
