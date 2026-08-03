import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1E17",
        paper: "#F6F3E9",
        panel: "#FFFFFF",
        wa: {
          DEFAULT: "#25D366",
          dark: "#128C4A",
          teal: "#075E54",
          mint: "#DCF8C6",
        },
        status: {
          todo: "#FFD23F",
          progress: "#3FA7FF",
          complete: "#25D366",
          overdue: "#FF4B4B",
        },
      },
      fontFamily: {
        display: [
          "'Avenir Next'",
          "'Segoe UI'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        body: ["'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'SF Mono'", "'Cascadia Code'", "'Consolas'", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0 0 #0B1E17",
        "brutal-sm": "2px 2px 0 0 #0B1E17",
        "brutal-lg": "8px 8px 0 0 #0B1E17",
        "brutal-press": "1px 1px 0 0 #0B1E17",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
