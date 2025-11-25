import type { Aluno } from '@/types/aluno';

import { MOCK_ALUNOS as LEGACY_ALUNOS } from '../mockAlunos';

const toSlug = (faixa?: string | null) =>
  (faixa || 'Branca')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-');

export const MOCK_ALUNOS: Aluno[] = LEGACY_ALUNOS.map((aluno) => ({
  ...aluno,
  id: aluno.id === '1' ? 'aluno_joao_silva' : aluno.id,
  nome: aluno.nome,
  faixaSlug: toSlug(aluno.faixa || aluno.faixaSlug || 'Branca'),
  graus: aluno.graus ?? 0,
  plano: aluno.plano ?? 'Mensal',
  status: aluno.status === 'Inativo' || aluno.status === 'INATIVO' ? 'INATIVO' : 'ATIVO',
  avatarUrl: aluno.avatarUrl ?? null,
  telefone: aluno.telefone ?? null,
  email: aluno.email ?? null,
  academiaId: aluno.academiaId ?? null
}));
