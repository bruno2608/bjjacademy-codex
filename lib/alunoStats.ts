import type { Aluno } from '../types/aluno';
import type { GraduationHistoryEntry } from '../types/graduacao';
import type { Presenca } from '../types/presenca';

const getCurrentDateISO = () => new Date().toISOString().split('T')[0];

export const normalizeFaixaSlug = (valor?: string | null) => {
  if (!valor) return 'branca-adulto';
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const normalizeHistorico = (historico?: GraduationHistoryEntry[]): GraduationHistoryEntry[] => {
  if (!Array.isArray(historico)) {
    return [];
  }
  return historico.map((item) => ({
    ...item,
    grau: item.grau ?? null,
    faixaSlug: item.faixaSlug ?? normalizeFaixaSlug(item.faixa)
  }));
};

export const normalizeAluno = (aluno: Partial<Aluno>): Aluno => ({
  id: aluno.id ?? `aluno-${Date.now()}`,
  nome: aluno.nome ?? 'Aluno sem nome',
  telefone: aluno.telefone ?? '',
  plano: aluno.plano ?? 'Mensal',
  status: (aluno.status as Aluno['status']) ?? 'Ativo',
  faixa: aluno.faixa ?? aluno.faixaSlug ?? 'Branca',
  faixaSlug: normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa ?? undefined),
  graus: Number(aluno.graus ?? 0),
  mesesNaFaixa: Number(aluno.mesesNaFaixa ?? 0),
  avatarUrl: aluno.avatarUrl ?? null,
  dataInicio: aluno.dataInicio ?? getCurrentDateISO(),
  dataNascimento: aluno.dataNascimento ?? null,
  dataUltimaGraduacao: aluno.dataUltimaGraduacao ?? null,
  historicoGraduacoes: normalizeHistorico(aluno.historicoGraduacoes),
  aulasTotais: Number(aluno.aulasTotais ?? 0),
  aulasDesdeUltimaFaixa: Number(aluno.aulasDesdeUltimaFaixa ?? 0),
  aulasNoGrauAtual: Number(aluno.aulasNoGrauAtual ?? 0),
  proximaMeta: aluno.proximaMeta ?? null
});

const parseISODate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const countAttendancesFrom = (registros: Presenca[], inicio: Date | null): number => {
  if (!inicio) return registros.length;
  const referencia = inicio.getTime();
  return registros.filter((item) => {
    const data = parseISODate(item.data);
    return data && data.getTime() >= referencia;
  }).length;
};

const getLatestHistoryRecord = (
  historico: GraduationHistoryEntry[] | undefined,
  predicate: (item: GraduationHistoryEntry) => boolean
): GraduationHistoryEntry | null => {
  if (!Array.isArray(historico)) return null;
  return (
    historico
      .filter((item) => predicate(item) && parseISODate(item.data))
      .sort((a, b) => {
        const dataA = parseISODate(a.data)?.getTime() ?? 0;
        const dataB = parseISODate(b.data)?.getTime() ?? 0;
        return dataB - dataA;
      })[0] ?? null
  );
};

const buildAttendanceStatsForAluno = (aluno: Aluno, presencas: Presenca[] = []) => {
  const registrosAluno = presencas.filter(
    (item) => item.alunoId === aluno.id && item.status === 'CONFIRMADO'
  );

  const historico = Array.isArray(aluno.historicoGraduacoes)
    ? aluno.historicoGraduacoes
    : [];
  const faixaAtual = aluno.faixa;
  const faixaSlugAtual = aluno.faixaSlug;
  const grauAtual = Number(aluno.graus ?? 0);

  const ultimoRegistroFaixa = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Faixa' && (item.faixa === faixaAtual || item.faixaSlug === faixaSlugAtual)
  );
  const inicioFaixa =
    parseISODate(ultimoRegistroFaixa?.data) ||
    parseISODate(aluno.dataUltimaGraduacao) ||
    parseISODate(aluno.dataInicio);

  const aulasDesdeFaixa = countAttendancesFrom(registrosAluno, inicioFaixa);

  const ultimoRegistroGrau = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Grau' && item.faixa === faixaAtual && Number(item.grau) === grauAtual
  );
  const inicioGrau = grauAtual > 0 ? parseISODate(ultimoRegistroGrau?.data) || inicioFaixa : inicioFaixa;
  const aulasNoGrauAtual = countAttendancesFrom(registrosAluno, inicioGrau);

  return {
    totalAulas: registrosAluno.length,
    aulasDesdeUltimaFaixa: aulasDesdeFaixa,
    aulasNoGrauAtual
  };
};

export const applyAttendanceStats = (alunos: Aluno[], presencas: Presenca[]): Aluno[] =>
  alunos.map((aluno) => {
    const stats = buildAttendanceStatsForAluno(aluno, presencas);
    return {
      ...aluno,
      aulasTotais: stats.totalAulas,
      aulasDesdeUltimaFaixa: stats.aulasDesdeUltimaFaixa,
      aulasNoGrauAtual: stats.aulasNoGrauAtual
    };
  });

export const buildAttendanceSnapshot = buildAttendanceStatsForAluno;
