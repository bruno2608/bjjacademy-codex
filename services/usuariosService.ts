import { mockDb } from '@/data/mocks/db';
import type { Papel, Usuario, UsuarioPapel } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let usuariosDb: Usuario[] = clone(mockDb.usuarios);
let papeisDb: Papel[] = clone(mockDb.papeis);
let usuariosPapeisDb: UsuarioPapel[] = clone(mockDb.usuariosPapeis);

export type UsuarioComPapeis = Usuario & { papeis: Papel[] };

export async function listarUsuarios(): Promise<Usuario[]> {
  return clone(usuariosDb);
}

export async function buscarUsuarioPorId(id: string): Promise<Usuario | null> {
  const usuario = usuariosDb.find((item) => item.id === id);
  return usuario ? { ...usuario } : null;
}

export async function listarUsuariosComPapeis(): Promise<UsuarioComPapeis[]> {
  return usuariosDb.map((usuario) => {
    const papeisIds = usuariosPapeisDb.filter((rel) => rel.usuarioId === usuario.id).map((rel) => rel.papelId);
    const papeis = papeisDb.filter((papel) => papeisIds.includes(papel.id));
    return { ...usuario, papeis: clone(papeis) };
  });
}

export function resetUsuariosMock(): void {
  usuariosDb = clone(mockDb.usuarios);
  papeisDb = clone(mockDb.papeis);
  usuariosPapeisDb = clone(mockDb.usuariosPapeis);
}
