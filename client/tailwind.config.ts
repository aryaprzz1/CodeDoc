/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{jsx,tsx}", "./*.html"],
    theme: {
        extend: {
            colors: {
                dark: "#0a0e27",
                darkHover: "#1a1f3a",
                darkLight: "#151b35",
                light: "#f8fafc",
                primary: "#6366f1",
                primaryDark: "#4f46e5",
                primaryLight: "#818cf8",
                secondary: "#8b5cf6",
                accent: "#ec4899",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
                gradient: {
                    start: "#667eea",
                    mid: "#764ba2",
                    end: "#f093fb",
                },
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            animation: {
                "up-down": "up-down 3s ease-in-out infinite alternate",
                "fade-in": "fade-in 0.5s ease-in-out",
                "slide-in": "slide-in 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "gradient": "gradient 8s ease infinite",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "gradient-secondary": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "gradient-dark": "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
            },
            boxShadow: {
                "glow": "0 0 20px rgba(99, 102, 241, 0.3)",
                "glow-lg": "0 0 40px rgba(99, 102, 241, 0.4)",
            },
        },
    },
    plugins: [],
}
