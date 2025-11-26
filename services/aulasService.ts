import { MOCK_AULAS_INSTANCIAS } from '@/data/mocks/mockAulasInstancias';
import { MOCK_TURMAS } from '@/data/mocks/mockTurmas';
import type { AulaInstancia } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let aulasDb: AulaInstancia[] = clone(MOCK_AULAS_INSTANCIAS);

export async function listarAulas(): Promise<AulaInstancia[]> {
  return clone(aulasDb);
}

export async function listarAulasDaTurma(turmaId: string): Promise<AulaInstancia[]> {
  return clone(aulasDb.filter((aula) => aula.turmaId === turmaId));
}

export async function listarAulasDaAcademia(academiaId: string): Promise<AulaInstancia[]> {
  const turmaIds = MOCK_TURMAS.filter((turma) => turma.academiaId === academiaId).map((turma) => turma.id);
  return clone(aulasDb.filter((aula) => turmaIds.includes(aula.turmaId)));
}

export async function buscarAulaPorId(id: string): Promise<AulaInstancia | null> {
  const aula = aulasDb.find((item) => item.id === id);
  return aula ? { ...aula } : null;
}

export function resetAulasMock(): void {
  aulasDb = clone(MOCK_AULAS_INSTANCIAS);
}
