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
    themes: ['Z-Dark', 'Z-Light'],
    darkTheme: 'Z-Dark'
  }
};
