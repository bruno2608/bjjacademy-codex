'use client';

import { useMemo } from 'react';
import { Clock3 } from 'lucide-react';
import PageHero from '../../../components/ui/PageHero';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { useTreinosStore } from '../../../store/treinosStore';

export default function HorariosPage() {
  const treinos = useTreinosStore((state) => state.treinos);

  const rows = useMemo(
    () =>
      treinos.map((treino) => ({
        nome: treino.nome,
        tipo: treino.tipo,
        dia: treino.diaSemana,
        hora: treino.hora,
        ativo: treino.ativo
      })),
    [treinos]
  );

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Horários"
        title="Grade semanal"
        description="Sessões mockadas carregadas da store local. Ajustes reais serão conectados ao backend futuramente."
        icon={Clock3}
      />
      <Table
        columns={[
          { key: 'nome', label: 'Treino' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'dia', label: 'Dia' },
          { key: 'hora', label: 'Horário' },
          {
            key: 'ativo',
            label: 'Status',
            render: (value) => (
              <Badge variant={value ? 'success' : 'neutral'}>{value ? 'Ativo' : 'Inativo'}</Badge>
            )
          }
        ]}
        data={rows}
        emptyMessage="Cadastre novos horários quando a API estiver disponível."
      />
    </div>
  );
}
