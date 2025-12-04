/**
 * Tailwind CSS configuration defining the brand palette and
 * typography for the BJJ Academy design system (Zenko Focus).
 */
const daisyui = require('daisyui');

const zDark = {
  'color-scheme': 'dark',
  'base-100': 'oklch(25.33% 0.016 252.42)',
  'base-200': 'oklch(23.26% 0.014 253.1)',
  'base-300': 'oklch(21.15% 0.012 254.09)',
  'base-content': 'oklch(97.807% 0.029 256.847)',

  primary: 'oklch(98% 0.003 247.858)',
  'primary-content': 'oklch(14% 0.004 49.25)',

  secondary: 'oklch(64% 0.246 16.439)',
  'secondary-content': 'oklch(97.807% 0.029 256.847)',

  accent: 'oklch(0% 0 0)',
  'accent-content': 'oklch(100% 0 0)',

  neutral: 'oklch(37% 0.034 259.733)',
  'neutral-content': 'oklch(97.807% 0.029 256.847)',

  info: 'oklch(74% 0.16 232.661)',
  'info-content': 'oklch(29% 0.066 243.157)',

  success: 'oklch(76% 0.177 163.223)',
  'success-content': 'oklch(26% 0.065 152.934)',

  warning: 'oklch(85% 0.199 91.936)',
  'warning-content': 'oklch(42% 0.095 57.708)',

  error: 'oklch(70% 0.191 22.216)',
  'error-content': 'oklch(26% 0.079 36.259)'
};

const zLight = {
  'color-scheme': 'light',
  'base-100': 'oklch(100% 0 0)',
  'base-200': 'oklch(98% 0 0)',
  'base-300': 'oklch(95% 0 0)',
  'base-content': 'oklch(21% 0.006 285.885)',

  primary: 'oklch(12% 0.042 264.695)',
  'primary-content': 'oklch(98% 0 0)',

  secondary: 'oklch(63% 0.237 25.331)',
  'secondary-content': 'oklch(97% 0.013 17.38)',

  accent: 'oklch(12% 0.042 264.695)',
  'accent-content': 'oklch(98% 0 0)',

  neutral: 'oklch(27% 0.041 260.031)',
  'neutral-content': 'oklch(95% 0 0)',

  info: 'oklch(12% 0.042 264.695)',
  'info-content': 'oklch(98% 0 0)',

  success: 'oklch(76% 0.177 163.223)',
  'success-content': 'oklch(37% 0.077 168.94)',

  warning: 'oklch(82% 0.189 84.429)',
  'warning-content': 'oklch(47% 0.114 61.907)',

  error: 'oklch(57% 0.245 27.325)',
  'error-content': 'oklch(93% 0.032 17.717)'
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
        'Z-Dark': zDark
      },
      {
        'Z-Light': zLight
      }
    ],
    darkTheme: 'Z-Dark',
    logs: false
  }
};
