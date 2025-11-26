import { MOCK_PAPEIS } from '@/data/mocks/mockPapeis';
import type { Papel } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let papeisDb: Papel[] = clone(MOCK_PAPEIS);

export async function listarPapeis(): Promise<Papel[]> {
  return clone(papeisDb);
}

export async function buscarPapelPorCodigo(codigo: Papel['codigo']): Promise<Papel | null> {
  const papel = papeisDb.find((item) => item.codigo === codigo);
  return papel ? { ...papel } : null;
}

export function resetPapeisMock(): void {
  papeisDb = clone(MOCK_PAPEIS);
}
