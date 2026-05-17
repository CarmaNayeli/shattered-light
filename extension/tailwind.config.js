/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sl: {
          bg:        '#0d1a1a',
          surface:   '#142222',
          border:    '#264040',
          text:      '#eef4f0',
          muted:     '#7aaa9a',
          accent:    'rgb(var(--sl-accent) / <alpha-value>)',
          'accent-fg': 'rgb(var(--sl-accent-fg) / <alpha-value>)',
          bond:      '#F4A0C0',
          harmony:   '#F5E06B',
          indigo:    '#3A3A5C',
          success:   '#4ade80',
          partial:   '#fbbf24',
          miss:      '#f87171',
          danger:    '#f87171',
        },
      },
    },
  },
  plugins: [],
}
