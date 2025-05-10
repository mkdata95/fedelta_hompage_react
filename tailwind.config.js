/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-[#393E46]',
    'bg-[#948979]',
    'bg-[#DFD0B8]',
    'text-[#DFD0B8]',
    'text-[#222831]'
  ],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 