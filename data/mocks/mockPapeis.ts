import type { Papel } from '@/types';

export const MOCK_PAPEIS: Papel[] = [
  {
    id: 1,
    codigo: 'ALUNO',
    nome: 'Aluno',
    descricao: 'Acesso básico às áreas do aluno',
    nivelAcesso: 1
  },
  {
    id: 2,
    codigo: 'INSTRUTOR',
    nome: 'Instrutor',
    descricao: 'Suporte às aulas e registros de presença',
    nivelAcesso: 2
  },
  {
    id: 3,
    codigo: 'PROFESSOR',
    nome: 'Professor',
    descricao: 'Responsável pedagógico pelas turmas e graduações',
    nivelAcesso: 3
  },
  {
    id: 4,
    codigo: 'ADMIN_TI',
    nome: 'Admin / TI',
    descricao: 'Administração e suporte técnico',
    nivelAcesso: 4
  }
];
