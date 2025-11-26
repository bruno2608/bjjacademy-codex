import { MOCK_MATRICULAS } from '@/data/mocks/mockMatriculas';
import type { Matricula } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let matriculasDb: Matricula[] = clone(MOCK_MATRICULAS);

export async function listarMatriculas(): Promise<Matricula[]> {
  return clone(matriculasDb);
}

export async function listarMatriculasPorAcademia(academiaId: string): Promise<Matricula[]> {
  return clone(matriculasDb.filter((item) => item.academiaId === academiaId));
}

export async function listarMatriculasPorAluno(alunoId: string): Promise<Matricula[]> {
  return clone(matriculasDb.filter((item) => item.alunoId === alunoId));
}

export async function buscarMatriculaPorId(id: string): Promise<Matricula | null> {
  const matricula = matriculasDb.find((item) => item.id === id);
  return matricula ? { ...matricula } : null;
}

export function resetMatriculasMock(): void {
  matriculasDb = clone(MOCK_MATRICULAS);
}
