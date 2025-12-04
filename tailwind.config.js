/**
 * Tailwind CSS configuration defining the brand palette and
 * typography for the BJJ Academy design system (Zenko Focus).
 */
let daisyUIPlugin;

try {
  // eslint-disable-next-line global-require
  daisyUIPlugin = require('daisyui');
} catch (error) {
  // Ambiente offline: aplica fallback mínimo para manter as classes utilitárias personalizadas.
  daisyUIPlugin = () => {};
}

const daisyThemes = {
  'Z-Dark': {
    primary: '#E10600',
    'primary-content': '#fef2f2',
    secondary: '#3A3A3A',
    accent: '#9ca3af',
    neutral: '#1f1f1f',
    'base-100': '#0b0b0f',
    'base-200': '#111217',
    'base-300': '#1b1c22',
    'base-content': '#f4f4f5',
    info: '#38bdf8',
    success: '#4ade80',
    warning: '#facc15',
    error: '#f87171',
    '--rounded-box': '0.75rem',
    '--rounded-btn': '0.5rem',
    '--rounded-badge': '0.35rem',
    '--border': '1px',
    '--radius-card': '14px',
    '--depth': '18',
    '--noise': '0.02'
  },
  'Z-Light': {
    primary: '#D32F2F',
    'primary-content': '#fff1f2',
    secondary: '#4b5563',
    accent: '#1f2937',
    neutral: '#1f2937',
    'base-100': '#f7f7f7',
    'base-200': '#ececec',
    'base-300': '#dcdcdc',
    'base-content': '#111827',
    info: '#0ea5e9',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    '--rounded-box': '0.75rem',
    '--rounded-btn': '0.5rem',
    '--rounded-badge': '0.35rem',
    '--border': '1px',
    '--radius-card': '14px',
    '--depth': '10',
    '--noise': '0.01'
  },
  bjjacademy: {
    primary: '#D32F2F',
    secondary: '#424242',
    accent: '#ffffff',
    neutral: '#1f2937',
    'base-100': '#f5f5f5',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336'
  }
};

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{js,jsx,ts,tsx}',
    './mocks/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'],
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
  plugins: [daisyUIPlugin],
  daisyui: {
    themes: [
      { 'Z-Dark': daisyThemes['Z-Dark'] },
      { 'Z-Light': daisyThemes['Z-Light'] },
      { bjjacademy: daisyThemes.bjjacademy }
    ]
  }
};
