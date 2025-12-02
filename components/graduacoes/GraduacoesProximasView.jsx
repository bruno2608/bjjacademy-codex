import GraduationList from '@/components/graduacoes/GraduationList';

// Visão de "Próximas graduações" separada para professores
export default function GraduacoesProximasView({ graduacoesPendentes, alunoLookup, onStatusChange }) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">Próximas promoções</p>
      <GraduationList graduacoes={graduacoesPendentes} onStatusChange={onStatusChange} alunoLookup={alunoLookup} />
    </div>
  );
}
