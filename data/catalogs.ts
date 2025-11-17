export const PLANOS_MOCK = ['Mensal', 'Trimestral', 'Anual'];
export const STATUS_ALUNO = ['Ativo', 'Inativo'];

/**
 * Utilitários simples para catálogos compartilhados (planos, status, etc.).
 * Mantém um único ponto de verdade enquanto não integramos com a API real.
 */
export const buildOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));
