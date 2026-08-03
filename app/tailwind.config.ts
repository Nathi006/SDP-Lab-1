import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#E5DDD5',
        teal: '#075E54',
        wagreen: '#25D366',
        progress: '#FFD23F',
        alert: '#FF5C39',
        ink: '#111111',
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0 0 #111111',
        'brutal-sm': '2px 2px 0 0 #111111',
        'brutal-lg': '6px 6px 0 0 #111111',
      },
    },
  },
  plugins: [],
};

export default config;