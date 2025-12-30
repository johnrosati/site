/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Design tokens (use these across the app)
      colors: {
        ink: '#5C4B51',
        paper: '#ffffff',
        accent: '#A2D5F2',
        accent2: '#8BBEB2',
        accent3: '#F9E07F',

        // Legacy palette (keep for backwards-compat)
        'ghibli-blue': '#A2D5F2',
        'ghibli-green': '#8BBEB2',
        'ghibli-yellow': '#F9E07F',
        'ghibli-brown': '#5C4B51',
      },
      fontFamily: {
        // Make this the default "sans" so `font-sans` uses your brand font
        sans: ['"Ghibli"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ghibli: ['"Ghibli"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};