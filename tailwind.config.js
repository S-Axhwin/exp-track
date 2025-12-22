/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        /* ======================
           BASE
        ====================== */
        background: 'rgb(255, 255, 255)',
        foreground: 'rgb(24, 24, 27)', // strong readable text

        /* ======================
           CARD / POPOVER
        ====================== */
        card: {
          DEFAULT: 'rgb(255, 255, 255)',
          foreground: 'rgb(24, 24, 27)',
        },

        popover: {
          DEFAULT: 'rgb(255, 255, 255)',
          foreground: 'rgb(24, 24, 27)',
        },

        /* ======================
           PRIMARY (Brand Yellow)
           Darkened for contrast
        ====================== */
        primary: {
          DEFAULT: 'rgb(234, 179, 8)', // accessible yellow
          foreground: 'rgb(66, 32, 6)', // readable on yellow
        },

        /* ======================
           SECONDARY
        ====================== */
        secondary: {
          DEFAULT: 'rgb(245, 245, 245)',
          foreground: 'rgb(39, 39, 42)',
        },

        /* ======================
           MUTED (Helper text)
        ====================== */
        muted: {
          DEFAULT: 'rgb(244, 244, 245)',
          foreground: 'rgb(113, 113, 122)', // readable muted text
        },

        /* ======================
           ACCENT (Hover / Focus)
        ====================== */
        accent: {
          DEFAULT: 'rgb(250, 250, 250)',
          foreground: 'rgb(39, 39, 42)',
        },

        /* ======================
           DESTRUCTIVE
        ====================== */
        destructive: {
          DEFAULT: 'rgb(220, 38, 38)', // clearer error red
          foreground: 'rgb(255, 255, 255)',
        },

        /* ======================
           BORDERS / INPUTS
        ====================== */
        border: 'rgb(228, 228, 231)',
        input: 'rgb(228, 228, 231)',
        ring: 'rgb(161, 161, 170)',

        /* ======================
           CHART (Contrast-safe)
        ====================== */
        chart: {
          1: 'rgb(234, 179, 8)',
          2: 'rgb(202, 138, 4)',
          3: 'rgb(161, 98, 7)',
          4: 'rgb(133, 77, 14)',
          5: 'rgb(113, 63, 18)',
        },

        /* ======================
           SIDEBAR
        ====================== */
        sidebar: {
          DEFAULT: 'rgb(250, 250, 250)',
          foreground: 'rgb(24, 24, 27)',
          primary: 'rgb(234, 179, 8)',
          'primary-foreground': 'rgb(66, 32, 6)',
          accent: 'rgb(244, 244, 245)',
          'accent-foreground': 'rgb(39, 39, 42)',
          border: 'rgb(228, 228, 231)',
          ring: 'rgb(161, 161, 170)',
        },
      },

      /* ======================
         RADIUS SYSTEM (Clean)
      ====================== */
      rounded: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },

  plugins: [],
};
