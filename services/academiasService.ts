import { mockDb } from '@/data/mocks/db';
import type { Academia } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let academiasDb: Academia[] = clone(mockDb.academias);

export async function listarAcademias(): Promise<Academia[]> {
  return clone(academiasDb);
}

export async function buscarAcademiaPorId(id: string): Promise<Academia | null> {
  const academia = academiasDb.find((item) => item.id === id);
  return academia ? { ...academia } : null;
}

export function resetAcademiasMock(): void {
  academiasDb = clone(mockDb.academias);
}
