'use client';

/**
 * Tela de presenças com identidade visual alinhada à experiência gamificada
 * do restante do painel. Registro e listagem permanecem em uma única página.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Trophy, Clock3 } from 'lucide-react';
import AttendanceTable from '../../../components/ui/AttendanceTable';
import PresenceForm from '../../../components/ui/PresenceForm';
import PageHero from '../../../components/ui/PageHero';
import Card from '../../../components/ui/Card';
import LoadingState from '../../../components/ui/LoadingState';
import {
  createPresenca,
  deletePresenca,
  getPresencas,
  togglePresenca
} from '../../../services/presencasService';

const formatPercent = (value) => `${Math.round(value)}%`;

export default function PresencasPage() {
  const [presencas, setPresencas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    async function carregar() {
      try {
        const lista = await getPresencas();
        if (!active) return;
        setPresencas(lista);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    carregar();
    return () => {
      active = false;
    };
  }, []);

  const atualizarLista = useCallback(async () => {
    setIsRefreshing(true);
    const lista = await getPresencas();
    setPresencas(lista);
    setIsRefreshing(false);
  }, []);

  const presentes = presencas.filter((item) => item.status === 'Presente').length;
  const ausentes = presencas.filter((item) => item.status !== 'Presente').length;
  const total = presencas.length || 1;
  const taxaPresenca = (presentes / total) * 100;

  const diasAtivos = useMemo(() => {
    const conjunto = new Set(presencas.map((item) => item.data));
    return conjunto.size;
  }, [presencas]);

  const ranking = useMemo(() => {
    const mapa = new Map();
    presencas.forEach((presenca) => {
      const atual = mapa.get(presenca.alunoId) || {
        id: presenca.alunoId,
        nome: presenca.alunoNome,
        faixa: presenca.faixa,
        graus: presenca.graus,
        presencas: 0,
        faltas: 0
      };
      if (presenca.status === 'Presente') {
        atual.presencas += 1;
      } else {
        atual.faltas += 1;
      }
      mapa.set(presenca.alunoId, atual);
    });
    return Array.from(mapa.values())
      .sort((a, b) => b.presencas - a.presencas)
      .slice(0, 4);
  }, [presencas]);

  const handleCreate = async (payload) => {
    const novoRegistro = await createPresenca(payload);
    setPresencas((prev) => [...prev, novoRegistro]);
  };

  const handleToggle = async (registro) => {
    const atualizado = await togglePresenca(registro.id);
    setPresencas((prev) => prev.map((item) => (item.id === atualizado.id ? atualizado : item)));
  };

  const handleDelete = async (registro) => {
    await deletePresenca(registro.id);
    await atualizarLista();
  };

  const heroStats = [
    {
      label: 'Taxa de presença',
      value: formatPercent(taxaPresenca),
      helper: `${presentes} confirmações · ${ausentes} faltas`
    },
    {
      label: 'Dias monitorados',
      value: diasAtivos,
      helper: 'Quantidade de dias com registros recentes'
    },
    {
      label: 'Top presença',
      value: ranking[0]?.nome || 'Sem ranking',
      helper: ranking[0] ? `${ranking[0].presencas} presenças registradas` : 'Aguardando novos registros'
    }
  ];

  if (isLoading) {
    return <LoadingState title="Sincronizando presenças" message="Carregando histórico recente de treinos." />;
  }

  return (
    <div className="space-y-6">
      <PageHero
        badge="Rotina diária"
        title="Controle de presenças em tempo real"
        subtitle="Cadastre, acompanhe e celebre o engajamento dos alunos em cada treino."
        stats={heroStats}
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr,1fr]">
        <section className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card
              title="Presenças confirmadas"
              value={presentes}
              icon={CalendarPlus}
              description="Contagem acumulada dos registros marcados como presentes."
            />
            <Card
              title="Faltas registradas"
              value={ausentes}
              icon={Clock3}
              description="Ajuste rapidamente alternando status nos registros abaixo."
            />
            <Card
              title="Dias acompanhados"
              value={diasAtivos}
              icon={Trophy}
              description="Período recente com monitoramento ativo."
            />
          </div>

          <article className="card space-y-3">
            <header>
              <h2 className="text-lg font-semibold text-bjj-white">Registrar nova presença</h2>
              <p className="text-sm text-bjj-gray-200/70">
                Escolha o aluno, defina a data e marque presença ou falta em segundos.
              </p>
            </header>
            <PresenceForm onSubmit={handleCreate} />
          </article>

          <AttendanceTable
            records={presencas}
            onToggle={handleToggle}
            onDelete={handleDelete}
            isLoading={isRefreshing}
          />
        </section>

        <aside className="card space-y-4">
          <header className="space-y-1.5">
            <h2 className="text-lg font-semibold text-bjj-white">Ranking de engajamento</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Reconheça quem mais comparece e incentive quem está oscilando nas presenças.
            </p>
          </header>
          {ranking.length === 0 ? (
            <p className="text-sm text-bjj-gray-200/70">Nenhum registro recente para exibir o ranking.</p>
          ) : (
            <ul className="space-y-2.5">
              {ranking.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{item.nome}</p>
                    <p className="text-xs text-bjj-gray-200/70">
                      {item.faixa} · {item.graus}º grau
                    </p>
                  </div>
                  <div className="text-right text-xs text-bjj-gray-200/70">
                    <p className="font-semibold text-bjj-white">{item.presencas} presenças</p>
                    <p>{item.faltas} falta(s)</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
