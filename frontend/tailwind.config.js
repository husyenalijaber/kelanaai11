/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kelana-blue':  '#0F4C81',
        'kelana-sky':   '#3B9DD2',
        'kelana-gold':  '#F0A500',
        'kelana-dark':  '#0B1F3A',
        'kelana-light': '#F0F6FF',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
