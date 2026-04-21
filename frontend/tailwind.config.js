/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        card: "var(--card)", // Assuming card should also be a variable for consistency
        border: "var(--border)",
        accent: {
          blue: "#1a73e8",
          purple: "#7c3aed",
          green: "#10b981",
          amber: "#f59e0b", // Kept original amber
          red: "#ef4444", // Added red to accent, replacing top-level danger
        },
        danger: '#ef4444', // Kept for backward compatibility if needed, but 'red' in accent is new
        text: "var(--foreground)",
        muted: "var(--muted)",
        dark: {
          bg: "#080c14",
          surface: "#111827",
          border: "rgba(255, 255, 255, 0.08)",
          text: "#f8f9fb",
          muted: "#94a3b8",
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
