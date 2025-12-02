'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock4,
  Search,
  Users,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

const STATUS_STYLES = {
  PRESENTE: {
    label: 'Presente',
    classes: 'bg-green-600/15 text-green-200 border border-green-500/50',
  },
  PENDENTE: {
    label: 'Pendente',
    classes: 'bg-amber-500/15 text-amber-100 border border-amber-400/60',
  },
  FALTA: {
    label: 'Falta',
    classes: 'bg-red-600/15 text-red-200 border border-red-500/50',
  },
}

const hojeKey = () => new Date().toISOString().split('T')[0]

export default function CheckinAlunosPage() {
  const [query, setQuery] = useState('')
  const [loadingId, setLoadingId] = useState(null)
  const presencas = usePresencasStore((state) => state.presencas)
  const carregarTodas = usePresencasStore((state) => state.carregarTodas)
  const registrarCheckinManual = usePresencasStore((state) => state.registrarCheckinManual)
  const alunos = useAlunosStore((state) => state.alunos)

  const diaAtual = useMemo(() => hojeKey(), [])

  useEffect(() => {
    carregarTodas()
  }, [carregarTodas])

  const resumo = useMemo(() => {
    const presentes = presencas.filter((p) => p.data === diaAtual && p.status === 'PRESENTE').length
    const pendentes = alunos.length - presentes
    return {
      total: alunos.length,
      presentes,
      pendentes: pendentes < 0 ? 0 : pendentes,
    }
  }, [alunos.length, diaAtual, presencas])

  const alunosFiltrados = useMemo(() => {
    const termo = query.toLowerCase()
    return alunos
      .filter((aluno) => aluno.nome?.toLowerCase().includes(termo))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [alunos, query])

  const statusDoAluno = (alunoId) => {
    const presenca = presencas.find((item) => item.alunoId === alunoId && item.data === diaAtual)
    if (!presenca) return 'PENDENTE'
    return presenca.status
  }

  const handleConfirmar = async (alunoId) => {
    setLoadingId(alunoId)
    await registrarCheckinManual(alunoId, new Date().toISOString(), 'PROFESSOR')
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Check-in de Alunos</h1>
        <p className="text-sm text-bjj-gray-300">Registre a presença dos alunos nas aulas</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-4">
          <div className="flex items-center gap-3 text-bjj-gray-200">
            <Users size={20} className="text-bjj-gray-100" />
            <div>
              <p className="text-xs uppercase tracking-wide text-bjj-gray-400">Total de alunos</p>
              <p className="text-2xl font-bold text-white">{resumo.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-4">
          <div className="flex items-center gap-3 text-bjj-gray-200">
            <CheckCircle2 size={20} className="text-green-300" />
            <div>
              <p className="text-xs uppercase tracking-wide text-bjj-gray-400">Check-ins hoje</p>
              <p className="text-2xl font-bold text-white">{resumo.presentes}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-4">
          <div className="flex items-center gap-3 text-bjj-gray-200">
            <Clock4 size={20} className="text-amber-300" />
            <div>
              <p className="text-xs uppercase tracking-wide text-bjj-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-white">{resumo.pendentes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bjj-gray-400" />
            <Input
              placeholder="Buscar aluno por nome…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-bjj-gray-800 bg-bjj-gray-900 pl-10 text-bjj-gray-100"
            />
          </div>
        </div>

        <div className="space-y-3">
          {alunosFiltrados.map((alunoItem) => {
            const status = statusDoAluno(alunoItem.id)
            const statusInfo = STATUS_STYLES[status] || STATUS_STYLES.PENDENTE
            const confirmado = status === 'PRESENTE'
            return (
              <div
                key={alunoItem.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  confirmado
                    ? 'border-green-500/40 bg-green-700/10'
                    : 'border-bjj-gray-800 bg-bjj-gray-900/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bjj-gray-800 text-lg font-semibold text-white">
                    {alunoItem.nome?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{alunoItem.nome}</p>
                    <div className="flex items-center gap-2 text-xs text-bjj-gray-300">
                      <span className="rounded-full bg-bjj-gray-800 px-2 py-0.5">{alunoItem.faixa || 'Faixa não informada'}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusInfo.classes}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {confirmado ? (
                    <span className="rounded-full border border-green-500/40 bg-green-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-200">
                      Confirmado
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-500"
                      onClick={() => handleConfirmar(alunoItem.id)}
                      loading={loadingId === alunoItem.id}
                      disabled={loadingId === alunoItem.id}
                    >
                      Confirmar
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-100">
        <AlertTriangle size={18} />
        <span>Ao confirmar, o aluno será marcado como presente na data de hoje.</span>
      </div>
    </div>
  )
}
