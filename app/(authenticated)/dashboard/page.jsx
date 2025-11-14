'use client';

/**
 * Dashboard exibe métricas principais em cards e um resumo rápido
 * das áreas de alunos, presenças e graduações.
 */
import { useEffect, useState } from 'react';
import { Users, Award, Calendar, CalendarCheck, Medal } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { getAlunos } from '../../../services/alunosService';
import { getPresencas } from '../../../services/presencasService';
import { getGraduacoes } from '../../../services/graduacoesService';

export default function DashboardPage() {
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [graduacoes, setGraduacoes] = useState([]);

  useEffect(() => {
    getAlunos().then(setAlunos);
    getPresencas().then(setPresencas);
    getGraduacoes().then(setGraduacoes);
  }, []);

  const ativos = alunos.filter((aluno) => aluno.status === 'Ativo').length;
  const matriculasMes = Math.round(alunos.length * 0.3 + 3);
  const avaliacoes = Math.round(alunos.length * 0.5 + 5);
  const presencasSemana = presencas.filter((item) => {
    const data = new Date(item.data);
    const hoje = new Date();
    const diff = Math.abs(data - hoje) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const graduacoesPlanejadas = graduacoes.filter((item) => item.status !== 'Concluído').length;

  const proximasCerimonias = graduacoes
    .filter((item) => item.status !== 'Concluído')
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Alunos ativos" value={ativos} icon={Users} />
        <Card title="Matrículas do mês" value={matriculasMes} icon={Calendar} />
        <Card title="Presenças semana" value={presencasSemana} icon={CalendarCheck} />
        <Card title="Graduações planejadas" value={graduacoesPlanejadas} icon={Medal} />
      </div>
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Resumo do time</h2>
        <p className="text-bjj-gray-200/80 text-sm">
          Mantenha suas métricas atualizadas para garantir a evolução dos alunos. Este painel fornece um
          panorama rápido com foco no que importa.
        </p>
        <p className="text-bjj-gray-200/70 text-sm">
          Já foram registradas <span className="text-bjj-red font-semibold">{presencas.length}</span> presenças
          este mês e <span className="text-bjj-red font-semibold">{avaliacoes}</span> avaliações concluídas.
        </p>
      </div>
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award size={20} className="text-bjj-red" /> Próximas graduações
        </h2>
        {proximasCerimonias.length === 0 ? (
          <p className="text-sm text-bjj-gray-200/70">Nenhuma cerimônia planejada para os próximos meses.</p>
        ) : (
          <ul className="space-y-3">
            {proximasCerimonias.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{item.alunoNome}</p>
                  <span className="text-bjj-gray-200/70">
                    {item.faixaAtual} → {item.proximaFaixa}
                  </span>
                </div>
                <span className="text-bjj-red font-semibold">
                  {new Date(item.previsao).toLocaleDateString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
