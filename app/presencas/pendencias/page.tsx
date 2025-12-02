'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, Clock, ThumbsDown, UsersRound } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

const formatDate = (value?: string | null) => {
  if (!value) return '--/--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return value
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatTime = (value?: string | null) => {
  if (!value) return '--:--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return '--:--'
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function PresencasPendenciasPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)
  const carregarTodas = usePresencasStore((state) => state.carregarTodas)
  const atualizarStatus = usePresencasStore((state) => state.atualizarStatus)

  useEffect(() => {
    carregarTodas()
  }, [carregarTodas])

  const pendencias = useMemo(
    () =>
      presencas
        .filter((item) => item.status === 'PENDENTE')
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [presencas]
  )

  const totais = useMemo(() => {
    const total = pendencias.length
    const dataHoje = new Date().toISOString().split('T')[0]
    const deHoje = pendencias.filter((item) => (item.data || '').startsWith(dataHoje)).length
    return { total, deHoje }
  }, [pendencias])

  const handleStatus = async (id: string, status: 'PRESENTE' | 'FALTA') => {
    setLoadingId(id)
    try {
      await atualizarStatus(id, status)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Painel staff</p>
        <h1 className="text-3xl font-bold text-white">Pendências de aprovação</h1>
        <p className="text-bjj-gray-100">Revise presenças que ainda precisam ser confirmadas</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bjj-blue-700/20 text-bjj-blue-100 ring-2 ring-bjj-blue-700/60">
            <UsersRound size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Pendências totais</p>
            <p className="text-2xl font-bold text-white">{totais.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-100 ring-2 ring-amber-500/60">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Pendentes hoje</p>
            <p className="text-2xl font-bold text-white">{totais.deHoje}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20 text-green-100 ring-2 ring-green-600/60">
            <Check size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Ações rápidas</p>
            <p className="text-sm text-bjj-gray-200">Aprove ou reprove diretamente na lista</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
        <AlertCircle size={18} />
        <div>
          <p className="text-sm font-semibold">Atenção ao aprovar pendências</p>
          <p className="text-sm text-amber-50">Confirme somente após verificar a presença do aluno.</p>
        </div>
      </div>

      <div className="space-y-3">
        {pendencias.length === 0 && (
          <div className="rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-5 py-10 text-center text-bjj-gray-200">
            Nenhuma presença pendente.
          </div>
        )}

        {pendencias.map((presenca) => {
          const aluno = alunos.find((a) => a.id === presenca.alunoId)
          const statusLabel = presenca.origem === 'ALUNO' ? 'Manual (aluno)' : presenca.origem === 'PROFESSOR' ? 'Professor' : 'Sistema'

          return (
            <div
              key={presenca.id}
              className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-4 text-bjj-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bjj-gray-800 text-lg font-bold text-white ring-1 ring-bjj-gray-700">
                  {aluno?.nome?.charAt(0) || '?'}
                </span>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">{aluno?.nome || 'Aluno'}</p>
                  <p className="text-xs text-bjj-gray-200">
                    {formatDate(presenca.data || presenca.createdAt)} • {formatTime(presenca.createdAt)}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Origem: {statusLabel}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100 ring-1 ring-amber-500/60">
                  Pendente
                </span>
                <Button
                  className="btn-sm bg-green-600 text-white hover:bg-green-500"
                  onClick={() => handleStatus(presenca.id, 'PRESENTE')}
                  disabled={loadingId === presenca.id}
                >
                  <Check size={14} /> Aprovar
                </Button>
                <Button
                  className="btn-sm border border-red-600/70 bg-red-600/10 text-red-100 hover:bg-red-600/20"
                  onClick={() => handleStatus(presenca.id, 'FALTA')}
                  disabled={loadingId === presenca.id}
                >
                  <ThumbsDown size={14} /> Reprovar
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
