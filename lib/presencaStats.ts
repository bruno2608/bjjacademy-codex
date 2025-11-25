import type { PresencaRegistro, PresencaStatus } from '@/types/presenca'

export interface ResumoPresencas {
  totalPresencas: number
  totalFaltas: number
  totalPendentes: number
  totalRegistros: number
}

const STATUS_PRESENCA: PresencaStatus[] = ['PRESENTE']
const STATUS_FALTA: PresencaStatus[] = ['FALTA', 'JUSTIFICADA']
const STATUS_PENDENTE: PresencaStatus[] = ['PENDENTE']

export const normalizarStatusPresenca = (status?: string | null): PresencaStatus | '' => {
  if (!status) return ''
  return status.toString().toUpperCase() as PresencaStatus
}

export function calcularResumoPresencas(presencas: Array<Pick<PresencaRegistro, 'status'>>): ResumoPresencas {
  const base: ResumoPresencas = {
    totalPresencas: 0,
    totalFaltas: 0,
    totalPendentes: 0,
    totalRegistros: 0,
  }

  return presencas.reduce((acc, item) => {
    const status = normalizarStatusPresenca(item?.status)
    acc.totalRegistros += 1

    if (STATUS_PRESENCA.includes(status as PresencaStatus)) {
      acc.totalPresencas += 1
      return acc
    }

    if (STATUS_FALTA.includes(status as PresencaStatus)) {
      acc.totalFaltas += 1
      return acc
    }

    if (STATUS_PENDENTE.includes(status as PresencaStatus)) {
      acc.totalPendentes += 1
      return acc
    }

    return acc
  }, base)
}

export const getSemanaAtualIntervalo = (referencia = new Date()) => {
  const hoje = new Date(referencia)
  const inicio = new Date(hoje)
  inicio.setHours(0, 0, 0, 0)
  const diaSemana = inicio.getDay()
  const diff = (diaSemana + 6) % 7 // segunda como primeiro dia
  inicio.setDate(inicio.getDate() - diff)
  const fim = new Date(inicio)
  fim.setDate(inicio.getDate() + 7)
  return { inicio, fim }
}

export const isMesmaSemana = (valor: string | undefined, inicio: Date, fim: Date) => {
  if (!valor) return false
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return false
  return data >= inicio && data < fim
}
