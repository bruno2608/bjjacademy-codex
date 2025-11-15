export const metadata = {
  title: 'Relatórios · BJJ Academy'
};

/**
 * Placeholder para relatórios consolidados até que o backend real esteja disponível.
 */

export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Relatórios consolidados</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Relatórios</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Área reservada para consultas de presença, graduações e tendências históricas. Em breve você poderá gerar relatórios completos direto do painel web.
        </p>
      </header>
      <section className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
        Estamos preparando esta seção para consolidar métricas e exportações oficiais. Continue usando as páginas de Presenças, Graduações e Dashboard para alimentar os dados até a integração final com a API.
      </section>
    </div>
  );
}
