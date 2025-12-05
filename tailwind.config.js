/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // DaisyUI continua sendo carregado por aqui
  plugins: [require("daisyui")],
  daisyui: {
    // Diz pro DaisyUI que existem esses dois temas custom
    // As cores MESMO vêm do tailwind.css (@plugin "daisyui/theme")
    themes: ["zdark", "zlight"],
  },
};
