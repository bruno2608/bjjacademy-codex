import type { Usuario } from '@/types';

const DEFAULT_ACADEMIA_ID = 'academia_bjj_central';

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'user_prof_vilmar',
    nome: 'Professor Piloto',
    nomeCompleto: 'Professor Piloto',
    email: 'professor@bjjacademy.com',
    username: 'professor1',
    ativo: true,
    telefone: '5511955551122',
    genero: 'Masculino',
    dataNascimento: '1980-06-15',
    fotoUrl:
      'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=320&q=80',
    avatarUrl:
      'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=320&q=80',
    alunoId: 'aluno_joao_silva',
    staffId: 'staff_prof_vilmar',
    faixaAtualSlug: 'preta-professor',
    grauAtual: 4,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['PROFESSOR']
  },
  {
    id: 'user_instrutora_ana',
    nome: 'Instrutora Piloto',
    nomeCompleto: 'Instrutora Piloto',
    email: 'instrutor@bjjacademy.com',
    username: 'instrutor1',
    ativo: true,
    telefone: '5511977772211',
    genero: 'Feminino',
    dataNascimento: '1990-03-22',
    fotoUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=320&q=80',
    avatarUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=320&q=80',
    alunoId: '4',
    staffId: 'staff_instrutora_ana',
    faixaAtualSlug: 'marrom-adulto',
    grauAtual: 2,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['INSTRUTOR']
  },
  {
    id: 'user_admin_academia',
    nome: 'Admin Piloto',
    nomeCompleto: 'Admin Piloto',
    email: 'admin@bjjacademy.com',
    username: 'admin1',
    ativo: true,
    telefone: '5511988883344',
    genero: 'Masculino',
    dataNascimento: '1985-09-20',
    fotoUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=320&q=80',
    avatarUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=320&q=80',
    alunoId: null,
    staffId: 'staff_admin',
    faixaAtualSlug: 'preta-adulto',
    grauAtual: 0,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['ADMIN']
  },
  {
    id: 'user_admin_ti',
    nome: 'Admin TI',
    nomeCompleto: 'Admin TI',
    email: 'ti@bjjacademy.com',
    username: 'adminti',
    ativo: true,
    telefone: '5511988887788',
    genero: 'Masculino',
    dataNascimento: '1988-01-15',
    fotoUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80',
    avatarUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80',
    alunoId: null,
    staffId: 'staff_admin_ti',
    faixaAtualSlug: 'preta-professor',
    grauAtual: 4,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['ADMIN_TI']
  },
  {
    id: 'user_maria_souza',
    nome: 'Aluno Piloto 1',
    nomeCompleto: 'Aluno Piloto 1',
    email: 'aluno1@bjjacademy.com',
    username: 'aluno1',
    ativo: true,
    telefone: '5521977776655',
    genero: 'Feminino',
    dataNascimento: '1992-02-14',
    fotoUrl: null,
    alunoId: '2',
    faixaAtualSlug: 'azul-adulto',
    grauAtual: 1,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['ALUNO']
  },
  {
    id: 'user_pedro_lima',
    nome: 'Aluno Piloto 2',
    nomeCompleto: 'Aluno Piloto 2',
    email: 'aluno2@bjjacademy.com',
    username: 'aluno2',
    ativo: true,
    telefone: '5521934568899',
    genero: 'Masculino',
    dataNascimento: '1995-05-18',
    fotoUrl: null,
    alunoId: '5',
    faixaAtualSlug: 'branca-adulto',
    grauAtual: 0,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['ALUNO']
  },
  {
    id: 'user_carla_pires',
    nome: 'Aluno Piloto 3',
    nomeCompleto: 'Aluno Piloto 3',
    email: 'aluno3@bjjacademy.com',
    username: 'aluno3',
    ativo: true,
    telefone: '5534988881122',
    genero: 'Feminino',
    dataNascimento: '1997-11-02',
    fotoUrl: null,
    alunoId: 'aluno_carla_pires',
    faixaAtualSlug: 'roxa-adulto',
    grauAtual: 2,
    status: 'active',
    academiaId: DEFAULT_ACADEMIA_ID,
    roles: ['ALUNO']
  }
];
