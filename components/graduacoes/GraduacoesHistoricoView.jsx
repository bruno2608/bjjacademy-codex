import GraduationTimeline from '@/components/graduacoes/GraduationTimeline';

// Visão de histórico recente isolada para espelhar o submenu de "Histórico recente"
export default function GraduacoesHistoricoView({ historico, periodoFiltro }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">Histórico recente</p>
        <p className="text-[11px] uppercase tracking-[0.12em] text-bjj-gray-200/60">
          Janela: {periodoFiltro === 0 ? 'todos os registros' : `últimos ${periodoFiltro} dias`}
        </p>
      </div>
      <GraduationTimeline itens={historico} />
    </div>
  );
}
