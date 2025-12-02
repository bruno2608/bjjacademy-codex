'use client'

import { useEffect, useMemo } from 'react'
import { AlertTriangle, CalendarDays, Trash2 } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return value
  return data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const formatTime = (value?: string | null) => {
  if (!value) return '--:--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return '--:--'
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const onlyDate = (value?: string | null) => (value ? value.split('T')[0] : '')

export default function PresencasRevisaoPage() {
  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)
  const carregarTodas = usePresencasStore((state) => state.carregarTodas)
  const excluirPresenca = usePresencasStore((state) => state.excluirPresenca)

  useEffect(() => {
    carregarTodas()
  }, [carregarTodas])

  const presencas30Dias = useMemo(() => {
    const limite = new Date()
    limite.setDate(limite.getDate() - 30)
    return presencas
      .filter((item) => {
        const referencia = onlyDate(item.data) || onlyDate(item.createdAt)
        if (!referencia) return false
        const dataItem = new Date(referencia)
        return dataItem >= limite
      })
      .sort((a, b) => (onlyDate(b.data || b.createdAt) || '').localeCompare(onlyDate(a.data || a.createdAt) || ''))
  }, [presencas])

  const agrupadas = useMemo(() => {
    const mapa: Record<string, typeof presencas30Dias> = {}
    presencas30Dias.forEach((p) => {
      const chave = onlyDate(p.data) || onlyDate(p.createdAt)
      if (!chave) return
      mapa[chave] = mapa[chave] ? [...mapa[chave], p] : [p]
    })
    return Object.entries(mapa).sort(([a], [b]) => b.localeCompare(a))
  }, [presencas30Dias])

  const handleExcluir = async (id: string) => {
    const confirmar = typeof window !== 'undefined' ? window.confirm('Deseja excluir esta presença?') : true
    if (!confirmar) return
    await excluirPresenca(id)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Auditoria</p>
        <h1 className="text-3xl font-bold text-white">Revisão de Presenças</h1>
        <p className="text-bjj-gray-100">Revise e corrija presenças registradas (últimos 30 dias)</p>
      </header>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
        <AlertTriangle size={18} />
        <div>
          <p className="text-sm font-semibold">Atenção ao revisar presenças</p>
          <p className="text-sm text-amber-50">Alterações manuais devem ser feitas com cuidado. As presenças excluídas não poderão ser recuperadas.</p>
        </div>
      </div>

      {agrupadas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-5 py-10 text-center text-bjj-gray-200">
          Nenhuma presença registrada nos últimos 30 dias.
        </div>
      ) : (
        <div className="space-y-4">
          {agrupadas.map(([dia, registros]) => (
            <div key={dia} className="rounded-2xl bg-bjj-gray-900/80 p-4 ring-1 ring-bjj-gray-800">
              <div className="flex flex-col gap-2 border-b border-bjj-gray-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-bjj-gray-50">
                  <CalendarDays size={18} className="text-bjj-blue-100" />
                  <p className="text-base font-semibold capitalize">{formatDate(dia)}</p>
                </div>
                <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
                  {registros.length} presenças
                </span>
              </div>

              <div className="divide-y divide-bjj-gray-800">
                {registros.map((registro) => {
                  const aluno = alunos.find((a) => a.id === registro.alunoId)
                  return (
                    <div key={registro.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bjj-gray-800 text-sm font-bold text-white ring-1 ring-bjj-gray-700">
                          {aluno?.nome?.charAt(0) || '?'}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{aluno?.nome || 'Aluno'}</p>
                          <p className="text-xs text-bjj-gray-200">Horário: {formatTime(registro.createdAt)}</p>
                          <p className="text-xs text-bjj-gray-300">Origem: {registro.origem === 'ALUNO' ? 'Manual' : registro.origem === 'PROFESSOR' ? 'Professor' : 'Sistema'}</p>
                        </div>
                      </div>

                      <Button
                        className="btn-sm bg-red-600 text-white hover:bg-red-500"
                        onClick={() => handleExcluir(registro.id)}
                      >
                        <Trash2 size={14} />
                        Remover
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
