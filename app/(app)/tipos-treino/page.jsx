'use client';

import { useMemo } from 'react';
import { ListChecks } from 'lucide-react';
import PageHero from '../../../components/ui/PageHero';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { useTiposTreinoStore } from '../../../store/tiposTreinoStore';

export default function TiposTreinoPage() {
  const tipos = useTiposTreinoStore((state) => state.tipos);

  const linhas = useMemo(
    () =>
      tipos.map((tipo) => ({
        nome: tipo.nome,
        foco: tipo.foco,
        ativo: tipo.ativo
      })),
    [tipos]
  );

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Tipos de treino"
        title="Catálogo de sessões"
        description="Lista mockada das categorias de treino disponíveis para uso em presenças e horários."
        icon={ListChecks}
      />
      <Table
        columns={[
          { key: 'nome', label: 'Nome' },
          { key: 'foco', label: 'Foco' },
          {
            key: 'ativo',
            label: 'Status',
            render: (value) => <Badge variant={value ? 'success' : 'neutral'}>{value ? 'Ativo' : 'Inativo'}</Badge>
          }
        ]}
        data={linhas}
        emptyMessage="Cadastre tipos de treino quando a API estiver disponível."
      />
    </div>
  );
}
