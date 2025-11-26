import { MOCK_ACADEMIAS } from '@/data/mocks/mockAcademias';
import type { Academia } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let academiasDb: Academia[] = clone(MOCK_ACADEMIAS);

export async function listarAcademias(): Promise<Academia[]> {
  return clone(academiasDb);
}

export async function buscarAcademiaPorId(id: string): Promise<Academia | null> {
  const academia = academiasDb.find((item) => item.id === id);
  return academia ? { ...academia } : null;
}

export function resetAcademiasMock(): void {
  academiasDb = clone(MOCK_ACADEMIAS);
}
