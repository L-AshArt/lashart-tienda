/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-black':      '#0d0d0d',
        'brand-rose':       '#c97b84',
        'brand-rose-light': '#f0c4c9',
        'brand-nude':       '#f5ede8',
        'brand-cream':      '#faf6f4',
        'brand-gold':       '#c9a260',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
