'use client';

export default function ShellFooter() {
  return (
    <footer className="footer footer-center mt-auto w-full border-t border-bjj-gray-900 bg-bjj-gray-950/80 px-4 py-6 text-sm text-bjj-gray-300">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
        <span className="font-semibold text-white">BJJ Academy</span>
        <span className="text-bjj-gray-400">PWA pronto para instalar</span>
        <span className="text-bjj-gray-400">Built with Next.js 14 + Tailwind + DaisyUI</span>
        <span className="text-bjj-gray-400">Suporte: suporte@bjj.academy</span>
      </div>
    </footer>
  );
}
