export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Relatórios</p>
        <h1 className="text-2xl font-semibold">Painel analítico</h1>
        <p className="text-sm text-bjj-gray-300/80">Resumo consolidado de alunos, presenças e graduações.</p>
      </header>
      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-6 text-sm text-bjj-gray-200">
        Os relatórios detalhados serão exibidos aqui. Utilize as páginas de alunos e presenças para manter os dados sempre atualizados.
      </div>
    </div>
  );
}
