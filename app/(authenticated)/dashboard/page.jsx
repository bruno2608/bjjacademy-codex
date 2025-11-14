'use client';

/**
 * Dashboard exibe métricas principais em cards e um resumo rápido.
 */
import { useEffect, useState } from 'react';
import { Users, Award, Calendar } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { getAlunos } from '../../../services/alunosService';

export default function DashboardPage() {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    getAlunos().then(setAlunos);
  }, []);

  const ativos = alunos.filter((aluno) => aluno.status === 'Ativo').length;
  const matriculasMes = Math.round(alunos.length * 0.3 + 3);
  const avaliacoes = Math.round(alunos.length * 0.5 + 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Alunos ativos" value={ativos} icon={Users} />
        <Card title="Matrículas do mês" value={matriculasMes} icon={Calendar} />
        <Card title="Avaliações realizadas" value={avaliacoes} icon={Award} />
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Resumo do time</h2>
        <p className="text-bjj-gray-200/80 text-sm">
          Mantenha suas métricas atualizadas para garantir a evolução dos alunos.
          Este painel fornece um panorama rápido com foco no que importa.
        </p>
      </div>
    </div>
  );
}
