import { academias } from "./academias.mock"
import { usuarios } from "./usuarios.mock"
import { papeis } from "./papeis.mock"
import { usuariosPapeis } from "./usuariosPapeis.mock"
import { matriculas } from "./matriculas.mock"
import { faixas } from "./faixas.mock"
import { regrasGraduacao } from "./regrasGraduacao.mock"
import { graduacoes } from "./graduacoes.mock"
import { turmas } from "./turmas.mock"
import { aulas } from "./aulas.mock"
import { presencas } from "./presencas.mock"
import { convites } from "./convites.mock"
import { alunos } from "./alunos.mock"

export const mockDb = {
  alunos,
  academias,
  usuarios,
  papeis,
  usuariosPapeis,
  matriculas,
  faixas,
  regrasGraduacao,
  graduacoes,
  turmas,
  aulas,
  presencas,
  convites,
} as const

export type MockDb = typeof mockDb
