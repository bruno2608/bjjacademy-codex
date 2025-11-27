import type { Turma } from '@/types';

export const MOCK_TURMAS: Turma[] = [
  {
    id: 'turma_kids_fundamental',
    academiaId: 'academia_bjj_central',
    nome: 'Kids - Fundamental 18:00',
    slug: 'kids-fundamental-18h',
    tipo: 'Kids',
    diasSemana: ['SEG', 'QUA'],
    horaInicio: '18:00',
    horaFim: '19:00',
    faixaMinSlug: 'branca',
    faixaMaxSlug: 'amarela',
    responsavelUsuarioId: 'user_instrutora_ana',
    ativa: true
  },
  {
    id: 'turma_adulto_gi',
    academiaId: 'academia_bjj_central',
    nome: 'Adulto - Gi 19:00',
    slug: 'adulto-gi-19h',
    tipo: 'Adulto',
    diasSemana: ['SEG', 'QUA', 'SEX'],
    horaInicio: '19:00',
    horaFim: '20:30',
    faixaMinSlug: 'branca',
    faixaMaxSlug: 'preta',
    responsavelUsuarioId: 'user_prof_vilmar',
    ativa: true
  },
  {
    id: 'turma_competicao_noite',
    academiaId: 'academia_bjj_central',
    nome: 'Competição - Noite',
    slug: 'competicao-noite',
    tipo: 'Competição',
    diasSemana: ['TER', 'QUI'],
    horaInicio: '20:30',
    horaFim: '22:00',
    faixaMinSlug: 'azul',
    faixaMaxSlug: 'preta',
    responsavelUsuarioId: 'user_prof_vilmar',
    ativa: true
  }
];
