import { MOCK_PRESENCAS } from '@/data/mockPresencas'
import type { PresencaRegistro, PresencaStatus } from '@/types/presenca'

let presencasDb: PresencaRegistro[] = [...MOCK_PRESENCAS]

const clone = (lista: PresencaRegistro[]) => lista.map((item) => ({ ...item }))

const agoraIso = () => new Date().toISOString()

const localizarPorId = (id: string) => presencasDb.find((item) => item.id === id)

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
    status: 'PENDENTE',
    origem: 'ALUNO',
    data,
    createdAt: agora,
    updatedAt: agora,
    observacao: null,
  }
  presencasDb = [...presencasDb, novo]
  return { ...novo }
}

export async function criarPresenca(
  payload: Omit<PresencaRegistro, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<PresencaRegistro> {
  const agora = agoraIso()
  const registro: PresencaRegistro = {
    ...payload,
    createdAt: payload.createdAt ?? agora,
    updatedAt: payload.updatedAt ?? agora,
  }
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
      status: 'PENDENTE',
      origem: 'PROFESSOR',
      data: new Date().toISOString().split('T')[0],
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

export async function fecharTreino(treinoId: string): Promise<void> {
  const agora = agoraIso()
  presencasDb = presencasDb.map((item) => {
    if (item.treinoId !== treinoId) return item
    if (item.status !== 'PENDENTE') return item
    return { ...item, status: 'PRESENTE', origem: 'PROFESSOR', updatedAt: agora }
  })
}

export function resetPresencasMock(): void {
  presencasDb = [...MOCK_PRESENCAS]
}
