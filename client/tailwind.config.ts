/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'animate-scroll'
  ],
  theme: {
    extend: {
      colors: {
        'background': '#ffffff', // background utama
        'foreground': '#0f172a', // text utama
        'primary': {
          'DEFAULT': '#162B60', // utama
          'dark': '#203A7A', // hover
          'light': '#3b82f6', // aksen
        },
        'muted': {
          'DEFAULT': '#f1f5f9', // background sekunder
          'foreground': '#94a3b8'
        },
        'success': '#22c55e', // notif sukses
        'danger': '#ef4444', // notif error
      },

      // ANIMASI REVIEW
      animation: {
        scroll: 'scroll 40s linear infinite',
      },
      
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}