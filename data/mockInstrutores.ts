export type InstrutorMock = {
  id: string;
  nome: string;
  faixa: string;
  graus: number;
  status: string;
  email?: string;
  avatarUrl?: string;
};

// Fonte única para simular dados de instrutores enquanto a API real não está pronta.
export const MOCK_INSTRUTORES: InstrutorMock[] = [
  {
    id: 'instrutor-vilmar',
    nome: 'Vilmar',
    faixa: 'Preta',
    graus: 1,
    status: 'Ativo',
    avatarUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=320&q=80'
  }
];
