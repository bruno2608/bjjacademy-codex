import type { Usuario } from '@/types';

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'user_prof_vilmar',
    nome: 'Prof. Vilmar Costa',
    email: 'vilmar@bjjacademy.com',
    ativo: true,
    telefone: '(11) 95555-1122',
    genero: 'Masculino',
    dataNascimento: '1980-06-15',
    fotoUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=320&q=80',
    alunoId: 'aluno_joao_silva'
  },
  {
    id: 'user_instrutora_ana',
    nome: 'Instrutora Ana Martins',
    email: 'ana.martins@bjjacademy.com',
    ativo: true,
    telefone: '(11) 97777-2211',
    genero: 'Feminino',
    dataNascimento: '1990-03-22',
    fotoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=320&q=80',
    alunoId: '4'
  },
  {
    id: 'user_maria_souza',
    nome: 'Maria Souza',
    email: 'maria.souza@exemplo.com',
    ativo: true,
    telefone: '(21) 97777-6655',
    genero: 'Feminino',
    dataNascimento: '1992-02-14',
    alunoId: '2'
  },
  {
    id: 'user_pedro_lima',
    nome: 'Pedro Lima',
    email: 'pedro.lima@exemplo.com',
    ativo: true,
    telefone: '(21) 93456-8899',
    genero: 'Masculino',
    dataNascimento: '1995-05-18',
    alunoId: '5'
  }
];
