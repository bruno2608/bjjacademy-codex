import { MOCK_TURMAS } from '@/data/mocks/mockTurmas';
import type { Turma } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let turmasDb: Turma[] = clone(MOCK_TURMAS);

export async function listarTurmas(): Promise<Turma[]> {
  return clone(turmasDb);
}

export async function listarTurmasDaAcademia(academiaId: string): Promise<Turma[]> {
  return clone(turmasDb.filter((turma) => turma.academiaId === academiaId));
}

export async function buscarTurmaPorId(id: string): Promise<Turma | null> {
  const turma = turmasDb.find((item) => item.id === id);
  return turma ? { ...turma } : null;
}

export function resetTurmasMock(): void {
  turmasDb = clone(MOCK_TURMAS);
}
