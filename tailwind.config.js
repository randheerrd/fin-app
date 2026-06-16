/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#101113',
          raise: '#17181b',
          card: '#1c1d21',
        },
        line: '#2a2b30',
        text: {
          primary: '#ece9e2',
          dim: '#9b988f',
          faint: '#605e57',
        },
        sage: {
          DEFAULT: '#9db89a',
          deep: '#46604a',
        },
        amber: '#d8a35c',
        rose: '#c98181',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateX(-50%) translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
