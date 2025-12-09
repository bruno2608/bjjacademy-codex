import { mockDb } from '@/data/mocks/db';
import type { Turma } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let turmasDb: Turma[] = clone(mockDb.turmas);

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
  turmasDb = clone(mockDb.turmas);
}
