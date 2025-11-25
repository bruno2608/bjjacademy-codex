import { useMemo } from 'react'

import { calcularResumoPresencas, getSemanaAtualIntervalo, isMesmaSemana } from '@/lib/presencaStats'
import { usePresencasStore } from '@/store/presencasStore'

const normalizarData = (valor?: string | Date) => {
  if (!valor) return new Date().toISOString().split('T')[0]
  if (typeof valor === 'string') return valor
  return valor.toISOString().split('T')[0]
}

export function useResumoPresencasDoDia(dataReferencia?: string | Date) {
  const presencas = usePresencasStore((state) => state.presencas)
  const dataAlvo = normalizarData(dataReferencia)

  const presencasDoDia = useMemo(
    () => presencas.filter((item) => item.data === dataAlvo),
    [dataAlvo, presencas],
  )

  const resumo = useMemo(() => calcularResumoPresencas(presencasDoDia), [presencasDoDia])

  return { dataAlvo, presencasDoDia, resumo }
}

export function useResumoPresencasDaSemana(dataReferencia?: Date) {
  const presencas = usePresencasStore((state) => state.presencas)

  const { inicio, fim } = useMemo(() => getSemanaAtualIntervalo(dataReferencia), [dataReferencia])
  const presencasDaSemana = useMemo(
    () => presencas.filter((item) => isMesmaSemana(item.data, inicio, fim)),
    [fim, inicio, presencas],
  )

  const resumo = useMemo(() => calcularResumoPresencas(presencasDaSemana), [presencasDaSemana])

  return { inicio, fim, presencasDaSemana, resumo }
}
