import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          DEFAULT: '#0D0F14',
          2: '#13161E',
          3: '#1A1E28',
        },
        // Brand accents
        mint: '#00E5A0',
        orange: '#FF7840',
        blue: '#508CFF',
        // Text
        t1: '#F0F2F8',
        t2: '#8B909E',
        t3: '#555A6B',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
        2: 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
