/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wine: {
                    500: '#7B1E28', // Updated Branding Red
                    600: '#5E161E',
                    700: '#420F15',
                    900: '#2A0609', // Deepest background
                },
                ocean: {
                    500: '#2563EB', // Royal Blue
                    600: '#1D4ED8', // Darker Blue
                    700: '#1E40AF', // Navy
                    900: '#1e3a8a', // Deepest sea
                },
                wood: {
                    500: '#3E2723', // Dark Brown
                    600: '#36221F',
                    700: '#2E1D1A',
                    800: '#261715', // Input background
                    900: '#1A110D', // Very dark wood
                },
                gold: {
                    400: '#E5C568',
                    500: '#D4AF37', // Standard Gold
                    600: '#B5942E',
                },
                cream: {
                    100: '#FDFBF7',
                    200: '#F5F5DC', // Beige
                },
            },
            fontFamily: {
                serif: ['"Oswald"', 'sans-serif'], // Updated to match logo style
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Playfair Display"', 'serif'], // Keeping Playfair for elegant subtitles if needed
            },
            backgroundImage: {
                'wood-pattern': "url('https://images.unsplash.com/photo-1587313627042-42da65063065?q=80&w=2072&auto=format&fit=crop')", // Dark wood texture
                'hero-main': "url('https://images.unsplash.com/photo-1544025162-d76690b609caaef52?q=80&w=2070&auto=format&fit=crop')", // Steak/Food background
            },
        },
    },
    plugins: [],
}
