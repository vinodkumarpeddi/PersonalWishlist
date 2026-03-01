/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6C5CE7',
          light: '#A29BFE',
          dark: '#4834D4',
        },
        accent: {
          DEFAULT: '#00D2D3',
          light: '#55E6C1',
          dark: '#01A3A4',
        },
        surface: {
          DEFAULT: '#12121A',
          light: '#1A1A25',
          dark: '#0A0A0F',
        },
        muted: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
        },
        success: '#00B894',
        warning: '#FDCB6E',
        danger: '#FF6B6B',
      },
      fontFamily: {
        sans: ['Inter'],
        mono: ['JetBrainsMono'],
      },
    },
  },
  plugins: [],
};
