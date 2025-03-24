module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ghibli-blue': '#A2D5F2',
        'ghibli-green': '#8BBEB2',
        'ghibli-yellow': '#F9E07F',
        'ghibli-brown': '#5C4B51',
      },
      fontFamily: {
        'ghibli': ['"Ghibli"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}