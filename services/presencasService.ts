import { MOCK_PRESENCAS } from '@/data/mockPresencas'
import type { PresencaRegistro, PresencaStatus } from '@/types/presenca'

type RegistrarPresencaPayload = {
  alunoId: string
  turmaId: string
  aulaId: string
  status?: PresencaStatus
  origem?: PresencaRegistro['origem']
  data?: string | null
}

let presencasDb: PresencaRegistro[] = [...MOCK_PRESENCAS]

const clone = (lista: PresencaRegistro[]) => lista.map((item) => ({ ...item }))
const agoraIso = () => new Date().toISOString()
const hoje = () => new Date().toISOString().split('T')[0]

const localizarPorId = (id: string) => presencasDb.find((item) => item.id === id)

const normalizarRegistro = (
  payload: Omit<PresencaRegistro, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): PresencaRegistro => {
  const agora = agoraIso()
  return {
    ...payload,
    treinoId: payload.treinoId ?? payload.turmaId ?? 'turma_desconhecida',
    createdAt: payload.createdAt ?? agora,
    updatedAt: payload.updatedAt ?? agora,
    observacao: payload.observacao ?? null,
  }
}

export function snapshotPresencas(): PresencaRegistro[] {
  return clone(presencasDb)
}

export async function listarTodasPresencas(): Promise<PresencaRegistro[]> {
  return clone(presencasDb)
}

export async function listarPresencasPorAluno(alunoId: string): Promise<PresencaRegistro[]> {
  return clone(presencasDb.filter((item) => item.alunoId === alunoId))
}

export async function listarPresencasPorTreino(treinoId: string): Promise<PresencaRegistro[]> {
  return clone(presencasDb.filter((item) => item.treinoId === treinoId))
}

export async function listarPresencasPorAula(aulaId: string): Promise<PresencaRegistro[]> {
  return clone(presencasDb.filter((item) => item.aulaId === aulaId))
}

export async function registrarCheckin(
  alunoId: string,
  treinoId: string,
  data?: string
): Promise<PresencaRegistro> {
  const existente = presencasDb.find(
    (item) => item.alunoId === alunoId && item.treinoId === treinoId && item.data === data
  )

  const agora = agoraIso()
  if (existente) {
    const atualizado = { ...existente, status: 'PENDENTE' as const, updatedAt: agora }
    presencasDb = presencasDb.map((item) => (item.id === existente.id ? atualizado : item))
    return { ...atualizado }
  }

  const novo: PresencaRegistro = {
    id: `checkin-${Date.now()}`,
    alunoId,
    treinoId,
    turmaId: treinoId,
    status: 'PENDENTE',
    origem: 'ALUNO',
    data,
    aulaId: null,
    createdAt: agora,
    updatedAt: agora,
    observacao: null,
  }
  presencasDb = [...presencasDb, novo]
  return { ...novo }
}

export async function registrarOuAtualizarPresenca(payload: RegistrarPresencaPayload): Promise<PresencaRegistro> {
  const data = payload.data ?? hoje()
  const existente = presencasDb.find(
    (item) => item.alunoId === payload.alunoId && item.aulaId === payload.aulaId
  )
  const agora = agoraIso()

  const base: PresencaRegistro = existente ?? {
    id: existente?.id ?? `presenca-${Date.now()}`,
    alunoId: payload.alunoId,
    treinoId: payload.turmaId,
    turmaId: payload.turmaId,
    aulaId: payload.aulaId,
    status: 'PENDENTE',
    origem: payload.origem ?? 'PROFESSOR',
    observacao: null,
    data,
    createdAt: agora,
    updatedAt: agora,
  }

  const atualizado = normalizarRegistro({
    ...base,
    turmaId: payload.turmaId,
    treinoId: payload.turmaId,
    aulaId: payload.aulaId,
    status: payload.status ?? base.status,
    origem: payload.origem ?? base.origem,
    data,
    updatedAt: agora,
  })

  presencasDb = presencasDb.some((item) => item.id === atualizado.id)
    ? presencasDb.map((item) => (item.id === atualizado.id ? atualizado : item))
    : [...presencasDb, atualizado]

  return { ...atualizado }
}

export async function criarPresenca(
  payload: Omit<PresencaRegistro, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<PresencaRegistro> {
  const registro = normalizarRegistro(payload)
  presencasDb = [...presencasDb.filter((item) => item.id !== registro.id), registro]
  return { ...registro }
}

export async function atualizarStatusPresenca(
  presencaId: string,
  novoStatus: PresencaStatus,
  observacao?: string
): Promise<PresencaRegistro> {
  const atual = localizarPorId(presencaId)
  const agora = agoraIso()
  const base =
    atual ??
    ({
      id: presencaId,
      alunoId: 'desconhecido',
      treinoId: 'desconhecido',
      turmaId: 'desconhecido',
      aulaId: null,
      status: 'PENDENTE',
      origem: 'PROFESSOR',
      data: hoje(),
      createdAt: agora,
      updatedAt: agora,
      observacao: null,
    } satisfies PresencaRegistro)

  const atualizado: PresencaRegistro = {
    ...base,
    status: novoStatus,
    observacao: observacao ?? base.observacao ?? null,
    updatedAt: agora,
  }

  presencasDb = presencasDb.some((item) => item.id === presencaId)
    ? presencasDb.map((item) => (item.id === presencaId ? atualizado : item))
    : [...presencasDb, atualizado]

  return { ...atualizado }
}

export async function removerPresenca(id: string): Promise<void> {
  presencasDb = presencasDb.filter((item) => item.id !== id)
}

export async function fecharTreino(treinoId: string, aulaId?: string): Promise<void> {
  const agora = agoraIso()
  presencasDb = presencasDb.map((item) => {
    const matchAula = aulaId ? item.aulaId === aulaId : item.treinoId === treinoId
    if (!matchAula) return item
    if (item.status !== 'PENDENTE') return item
    return { ...item, status: 'PRESENTE', origem: 'PROFESSOR', updatedAt: agora }
  })
}

export async function fecharAula(aulaId: string): Promise<void> {
  await fecharTreino('desconhecido', aulaId)
}

export function resetPresencasMock(): void {
  presencasDb = [...MOCK_PRESENCAS]
}
