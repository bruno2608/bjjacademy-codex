import { MOCK_AULAS_INSTANCIAS } from '@/data/mocks/mockAulasInstancias';
import { MOCK_TURMAS } from '@/data/mocks/mockTurmas';
import type { AulaInstancia } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let aulasDb: AulaInstancia[] = clone(MOCK_AULAS_INSTANCIAS);

const buildAulaId = (turmaId: string, data: string) => `aula_${turmaId}_${data.replaceAll('-', '_')}`;

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

export async function buscarAulaPorTurmaEData(
  turmaId: string,
  data: string,
  fallbackHorario?: { horaInicio: string; horaFim: string }
): Promise<AulaInstancia> {
  const existente = aulasDb.find((item) => item.turmaId === turmaId && item.data === data);
  if (existente) return { ...existente };

  const nova: AulaInstancia = {
    id: buildAulaId(turmaId, data),
    turmaId,
    data,
    horaInicio: fallbackHorario?.horaInicio ?? '18:00',
    horaFim: fallbackHorario?.horaFim ?? '19:00',
    status: 'prevista',
  };

  aulasDb = [...aulasDb, nova];
  return { ...nova };
}

export async function atualizarStatusAula(
  aulaId: string,
  status: AulaInstancia['status']
): Promise<AulaInstancia | null> {
  const encontrada = aulasDb.find((aula) => aula.id === aulaId);
  if (!encontrada) return null;
  aulasDb = aulasDb.map((aula) => (aula.id === aulaId ? { ...aula, status } : aula));
  return { ...aulasDb.find((aula) => aula.id === aulaId)! };
}

export function resetAulasMock(): void {
  aulasDb = clone(MOCK_AULAS_INSTANCIAS);
}
