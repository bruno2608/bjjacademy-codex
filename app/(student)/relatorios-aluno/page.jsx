'use client';

import { Download, FileDown } from 'lucide-react';

export default function RelatoriosAlunoPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Relatórios</p>
        <h1 className="text-2xl font-semibold">Área do aluno</h1>
        <p className="text-sm text-bjj-gray-300/80">Download pessoal será habilitado futuramente.</p>
      </header>

      <div className="rounded-3xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/50 p-8 text-center text-sm text-bjj-gray-200">
        <FileDown size={28} className="mx-auto text-bjj-red" />
        <p className="mt-3 font-semibold text-white">Relatórios PDF pessoais</p>
        <p className="text-bjj-gray-300/80">Em breve você poderá gerar e baixar seu histórico consolidado.</p>
        <button
          type="button"
          className="btn btn-disabled mt-4 inline-flex items-center gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900 px-4 py-2 text-sm text-bjj-gray-400"
          disabled
        >
          <Download size={16} /> Em construção
        </button>
      </div>
    </div>
  );
}
