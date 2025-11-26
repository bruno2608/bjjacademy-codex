import { MOCK_PAPEIS } from '@/data/mocks/mockPapeis';
import { MOCK_USUARIOS } from '@/data/mocks/mockUsuarios';
import { MOCK_USUARIOS_PAPEIS } from '@/data/mocks/mockUsuariosPapeis';
import type { Papel, Usuario, UsuarioPapel } from '@/types';

const clone = <T>(items: T[]): T[] => items.map((item) => ({ ...item }));

let usuariosDb: Usuario[] = clone(MOCK_USUARIOS);
let papeisDb: Papel[] = clone(MOCK_PAPEIS);
let usuariosPapeisDb: UsuarioPapel[] = clone(MOCK_USUARIOS_PAPEIS);

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
  usuariosDb = clone(MOCK_USUARIOS);
  papeisDb = clone(MOCK_PAPEIS);
  usuariosPapeisDb = clone(MOCK_USUARIOS_PAPEIS);
}
