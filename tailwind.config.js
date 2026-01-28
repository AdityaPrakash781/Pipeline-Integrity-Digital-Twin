/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Industrial dark theme
                'industrial': {
                    900: '#0f172a', // slate-900
                    800: '#1e293b',
                    700: '#334155',
                },
                // Status colors
                'healthy': {
                    DEFAULT: '#22d3ee', // cyan-400
                    dark: '#06b6d4',    // cyan-500
                    light: '#67e8f9',   // cyan-300
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
