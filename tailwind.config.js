/**
 * Tailwind CSS configuration defining the brand palette and
 * typography for the BJJ Academy design system (Zenko Focus).
 */
const daisyui = require('daisyui');

const zdark = {
  "color-scheme": "dark",
  "base-100": "oklch(25.33% 0.016 252.42)",
  "base-200": "oklch(23.26% 0.014 253.1)",
  "base-300": "oklch(55% 0.027 264.364)",
  "base-content": "oklch(100.0% 0.000 360.000)",

  primary: "oklch(98% 0.003 247.858)",
  "primary-content": "oklch(14% 0.004 49.25)",

  secondary: "oklch(44% 0.017 285.786)",
  "secondary-content": "oklch(100% 0 0)",

  accent: "oklch(58% 0.253 17.585)",
  "accent-content": "oklch(100% 0 0)",

  neutral: "oklch(37% 0.034 259.733)",
  "neutral-content": "oklch(100% 0 0)",

  info: "oklch(74% 0.16 232.661)",
  "info-content": "oklch(29% 0.066 243.157)",

  success: "oklch(79% 0.209 151.711)",
  "success-content": "oklch(26% 0.065 152.934)",

  warning: "oklch(85% 0.199 91.936)",
  "warning-content": "oklch(41% 0.112 45.904)",

  error: "oklch(64% 0.246 16.439)",
  "error-content": "oklch(89% 0.058 10.001)",

  "--radius-selector": "0.5rem",
  "--radius-field": "0.25rem",
  "--radius-box": "0.5rem",
  "--size-selector": "0.25rem",
  "--size-field": "0.25rem",
  "--border": "1px",
  "--depth": "1",
  "--noise": "0",
};

const zlight = {
  "color-scheme": "light",
  "base-100": "oklch(92% 0.003 48.717)",
  "base-200": "oklch(95% 0 0)",
  "base-300": "oklch(95% 0 0)",
  "base-content": "oklch(21% 0.006 285.885)",

  primary: "oklch(37% 0.034 259.733)",
  "primary-content": "oklch(100% 0 0)",

  secondary: "oklch(27% 0.006 286.033)",
  "secondary-content": "oklch(100% 0 0)",

  accent: "oklch(58% 0.253 17.585)",
  "accent-content": "oklch(100% 0 0)",

  neutral: "oklch(44% 0.03 256.802)",
  "neutral-content": "oklch(92% 0.004 286.32)",

  info: "oklch(58% 0.158 241.966)",
  "info-content": "oklch(97% 0.013 236.62)",

  success: "oklch(62% 0.194 149.214)",
  "success-content": "oklch(98% 0.018 155.826)",

  warning: "oklch(82% 0.189 84.429)",
  "warning-content": "oklch(27% 0.077 45.635)",

  error: "oklch(64% 0.246 16.439)",
  "error-content": "oklch(100% 0 0)",

  "--radius-selector": "0.5rem",
  "--radius-field": "0.25rem",
  "--radius-box": "0.5rem",
  "--size-selector": "0.21875rem",
  "--size-field": "0.21875rem",
  "--border": "1px",
  "--depth": "1",
  "--noise": "0",
};

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{js,jsx,ts,tsx}',
    './mocks/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.css'
  ],
  theme: {
    extend: {
      colors: {
        'bjj-black': '#000000',
        'bjj-white': '#FFFFFF',
        'bjj-red': '#E10600',
        'bjj-gray-900': '#1A1A1A',
        'bjj-gray-950': '#0D0D0D',
        'bjj-gray-800': '#2E2E2E',
        'bjj-gray-500': '#6B6B6B',
        'bjj-gray-700': '#3A3A3A',
        'bjj-gray-200': '#D9D9D9'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        focus: '0 10px 25px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        zdark,
      },
      {
        zlight,
      },
    ],
    darkTheme: 'zdark',
    logs: false
  }
};
