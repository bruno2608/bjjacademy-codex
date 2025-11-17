'use client';

import { useMemo } from 'react';
import { Medal } from 'lucide-react';
import PageHero from '../../../components/ui/PageHero';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { GRADUATION_RULES } from '../../../config/graduationRules';

export default function RegrasPage() {
  const regras = useMemo(
    () =>
      Object.entries(GRADUATION_RULES).map(([faixa, regra]) => ({
        faixa,
        categoria: regra.categoria,
        proxima: regra.proximaFaixa || '—',
        tempo: `${regra.tempoFaixaMeses} meses`,
        graus: regra.graus.length
      })),
    []
  );

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Regras"
        title="Regras de graduação"
        description="Tabela mockada derivada das referências IBJJF para adultos e infantil/juvenil."
        icon={Medal}
      />
      <Table
        columns={[
          { key: 'faixa', label: 'Faixa' },
          { key: 'categoria', label: 'Categoria' },
          { key: 'proxima', label: 'Próxima faixa' },
          { key: 'tempo', label: 'Tempo mínimo' },
          {
            key: 'graus',
            label: 'Graus',
            render: (value) => <Badge variant="neutral">{value}</Badge>
          }
        ]}
        data={regras}
        emptyMessage="Cadastre novas regras quando a API estiver ativa."
      />
    </div>
  );
}
