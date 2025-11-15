import type { GraduacaoPlanejada } from '../types';

export const MOCK_GRADUACOES: GraduacaoPlanejada[] = [
  {
    id: 'g1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Marrom',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 18 meses na faixa roxa',
    mesesRestantes: 4,
    previsao: '2024-10-15',
    status: 'Em progresso',
    instrutor: 'Prof. Bruno'
  },
  {
    id: 'g2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    faixaAtual: 'Azul',
    proximaFaixa: 'Azul',
    tipo: 'Grau',
    grauAlvo: 4,
    criterioTempo: 'Tempo mínimo: 24 meses para o 4º grau',
    mesesRestantes: 4,
    previsao: '2024-09-01',
    status: 'Planejado',
    instrutor: 'Prof. Carla'
  },
  {
    id: 'g3',
    alunoId: '6',
    alunoNome: 'Fernanda Alves',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Preta',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 36 meses na faixa roxa',
    mesesRestantes: 10,
    previsao: '2025-02-20',
    status: 'Em progresso',
    instrutor: 'Prof. Ana'
  },
  {
    id: 'g4',
    alunoId: '8',
    alunoNome: 'Beatriz Ramos',
    faixaAtual: 'Azul',
    proximaFaixa: 'Azul',
    tipo: 'Grau',
    grauAlvo: 1,
    criterioTempo: 'Tempo mínimo: 6 meses para o 1º grau',
    mesesRestantes: 0,
    previsao: '2024-06-10',
    status: 'Pronto para avaliar',
    instrutor: 'Prof. Carla'
  },
  {
    id: 'g5',
    alunoId: '13',
    alunoNome: 'Bruno Rocha',
    faixaAtual: 'Branca',
    proximaFaixa: 'Azul',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 24 meses e 4 graus para faixa azul',
    mesesRestantes: 6,
    previsao: '2024-12-01',
    status: 'Em progresso',
    instrutor: 'Prof. Ana'
  },
  {
    id: 'g6',
    alunoId: '17',
    alunoNome: 'Marcelo Dias',
    faixaAtual: 'Azul',
    proximaFaixa: 'Roxa',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 24 meses com 4 graus completos',
    mesesRestantes: 2,
    previsao: '2024-07-22',
    status: 'Em avaliação',
    instrutor: 'Prof. Bruno'
  }
];
