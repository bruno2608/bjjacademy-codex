import type { GraduacaoPlanejada } from '../types'

const formatOffsetDate = (daysFromToday: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

const diasAtras = (dias: number) => formatOffsetDate(-dias)
const diasFrente = (dias: number) => formatOffsetDate(dias)

export const MOCK_GRADUACOES: GraduacaoPlanejada[] = [
  {
    id: 'g1',
    alunoId: 'aluno_joao_silva',
    alunoNome: 'João Silva',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Marrom',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 18 meses na faixa roxa',
    mesesRestantes: 0,
    previsao: diasAtras(15),
    dataConclusao: diasAtras(15),
    status: 'Concluído',
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
    mesesRestantes: 0,
    previsao: diasAtras(45),
    dataConclusao: diasAtras(45),
    status: 'Concluído',
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
    mesesRestantes: 6,
    previsao: diasAtras(75),
    dataConclusao: diasAtras(75),
    status: 'Concluído',
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
    mesesRestantes: 1,
    previsao: diasFrente(20),
    dataConclusao: null,
    status: 'Em progresso',
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
    mesesRestantes: 4,
    previsao: diasFrente(55),
    dataConclusao: null,
    status: 'Planejado',
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
    previsao: diasFrente(12),
    dataConclusao: null,
    status: 'Em avaliação',
    instrutor: 'Prof. Bruno'
  },
  {
    id: 'g7',
    alunoId: '9',
    alunoNome: 'Thiago Santos',
    faixaAtual: 'Preta',
    proximaFaixa: 'Preta',
    tipo: 'Grau',
    grauAlvo: 2,
    criterioTempo: 'Tempo mínimo: 36 meses entre graus de faixa preta',
    mesesRestantes: 8,
    previsao: diasFrente(80),
    dataConclusao: null,
    status: 'Em progresso',
    instrutor: 'Prof. Mauro'
  },
  {
    id: 'g8',
    alunoId: '5',
    alunoNome: 'Pedro Lima',
    faixaAtual: 'Branca',
    proximaFaixa: 'Branca',
    tipo: 'Grau',
    grauAlvo: 1,
    criterioTempo: 'Novatos com 6 meses ganham 1º grau automático',
    mesesRestantes: 1,
    previsao: diasFrente(8),
    dataConclusao: null,
    status: 'Pronto para avaliar',
    instrutor: 'Prof. Ana'
  },
  {
    id: 'g9',
    alunoId: '4',
    alunoNome: 'Ana Martins',
    faixaAtual: 'Azul',
    proximaFaixa: 'Roxa',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Elegível após 20 meses e 3 graus completos',
    mesesRestantes: 3,
    previsao: diasFrente(95),
    dataConclusao: null,
    status: 'Em progresso',
    instrutor: 'Prof. Bruno'
  },
  {
    id: 'g10',
    alunoId: '11',
    alunoNome: 'Lucas Araújo',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Marrom',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Progresso acelerado após correção de faltas',
    mesesRestantes: 5,
    previsao: diasFrente(130),
    dataConclusao: null,
    status: 'Em progresso',
    instrutor: 'Prof. Carla'
  }
]
