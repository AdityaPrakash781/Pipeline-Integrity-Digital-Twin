/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Industrial dark theme - Pure neutral grayish-black palette (zero blue tint)
                'industrial': {
                    950: '#050505', // Ultra dark black carbon
                    900: '#0f0f10', // Pure grayish-black canvas
                    850: '#171718', // Dark charcoal panel background
                    800: '#202022', // Neutral dark card surface
                    750: '#2a2a2d', // Steel accent border
                    700: '#38383c', // Metallic border
                    600: '#4d4d52', // Neutral highlight border
                },
                // Status colors — muted zinc neutrals (no neon green)
                'healthy': {
                    DEFAULT: '#3b82f6', // blue-500
                    dark: '#2563eb',    // blue-600
                    light: '#60a5fa',   // blue-400
                },
                'warning': {
                    DEFAULT: '#f59e0b', // amber-500
                    dark: '#d97706',    // amber-600
                    light: '#fbbf24',   // amber-400
                },
                'critical': {
                    DEFAULT: '#ef4444', // red-500
                    dark: '#dc2626',    // red-600
                    light: '#f87171',   // red-400
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
