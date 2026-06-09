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
        "primary": "#1FC79B",
        "secondary": "#6B7280",
        "accent": "#7C3AED",
        "background": "#FFFFFF",
      },
      spacing: {
        "base": "8px",
        "margin": "32px",
        "xl": "80px",
        "gutter": "24px",
        "sm": "12px",
        "xs": "4px",
        "md": "24px",
        "lg": "48px"
      },
      fontFamily: {
        "label-sm": ["var(--font-dm-sans)"],
        "display-lg-mobile": ["var(--font-syne)"],
        "headline-md": ["var(--font-syne)"],
        "display-lg": ["var(--font-syne)"],
        "label-mono": ["var(--font-dm-sans)"],
        "body-lg": ["var(--font-dm-sans)"],
        "body-md": ["var(--font-dm-sans)"],
        sans: ["var(--font-dm-sans)"],
        heading: ["var(--font-syne)"],
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "1", fontWeight: "600" }],
        "display-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "800" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "0.01em", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "0.02em", fontWeight: "800" }],
        "label-mono": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }]
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
