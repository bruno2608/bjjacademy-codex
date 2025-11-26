import type { Matricula } from '@/types';

export const MOCK_MATRICULAS: Matricula[] = [
  {
    id: 'matricula-001',
    numero: 1,
    status: 'ativo',
    alunoId: 'aluno_joao_silva',
    academiaId: 'academia_bjj_central',
    turmaId: 'turma_adulto_gi',
    dataInicio: '2018-02-12',
    observacoes: 'Aluno veterano e professor principal',
    matriculadoPor: 'user_admin_ti'
  },
  {
    id: 'matricula-002',
    numero: 2,
    status: 'ativo',
    alunoId: '2',
    academiaId: 'academia_bjj_central',
    turmaId: 'turma_adulto_gi',
    dataInicio: '2019-05-01',
    matriculadoPor: 'user_instrutora_ana'
  },
  {
    id: 'matricula-003',
    numero: 3,
    status: 'ativo',
    alunoId: '4',
    academiaId: 'academia_bjj_central',
    turmaId: 'turma_kids_fundamental',
    dataInicio: '2020-01-15',
    observacoes: 'Instrutora da turma Kids e aluna',
    matriculadoPor: 'user_prof_vilmar'
  },
  {
    id: 'matricula-004',
    numero: 4,
    status: 'ativo',
    alunoId: '5',
    academiaId: 'academia_bjj_central',
    turmaId: 'turma_competicao_noite',
    dataInicio: '2023-02-10',
    matriculadoPor: 'user_instrutora_ana'
  }
];
