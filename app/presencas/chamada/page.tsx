'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, Clock, ListChecks, QrCode, Search, UsersRound } from 'lucide-react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { isQrCheckinEnabled } from '@/lib/featureFlags'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

const hoje = () => new Date().toISOString().split('T')[0]

const statusConfig = {
  presente: {
    label: 'Presente',
    tone: 'bg-green-600/15 text-green-100 border border-green-500/50',
  },
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-500/15 text-amber-100 border border-amber-400/50',
  },
}

export default function PresencasChamadaPage() {
  const [busca, setBusca] = useState('')
  const [loadingAluno, setLoadingAluno] = useState<string | null>(null)

  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)
  const carregarTodas = usePresencasStore((state) => state.carregarTodas)
  const registrarCheckinManual = usePresencasStore((state) => state.registrarCheckinManual)

  useEffect(() => {
    carregarTodas()
  }, [carregarTodas])

  const hojeChave = useMemo(() => hoje(), [])

  const alunosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase()
    return alunos.filter((aluno) => aluno.nome.toLowerCase().includes(termo))
  }, [alunos, busca])

  const statusPorAluno = useMemo(() => {
    return alunosFiltrados.map((aluno) => {
      const registro = presencas.find((item) => item.alunoId === aluno.id && (item.data || '').startsWith(hojeChave))
      if (registro && registro.status === 'PRESENTE') {
        return { aluno, status: 'presente' as const }
      }
      return { aluno, status: 'pendente' as const }
    })
  }, [alunosFiltrados, hojeChave, presencas])

  const totais = useMemo(() => {
    const total = statusPorAluno.length
    const presentes = statusPorAluno.filter((item) => item.status === 'presente').length
    const pendentes = total - presentes
    const checkinsHoje = presencas.filter((item) => (item.data || '').startsWith(hojeChave)).length
    return { total, presentes, pendentes, checkinsHoje }
  }, [hojeChave, presencas, statusPorAluno])

  const handleConfirmar = async (alunoId: string) => {
    setLoadingAluno(alunoId)
    try {
      await registrarCheckinManual(alunoId, 'PROFESSOR', new Date())
    } finally {
      setLoadingAluno(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Painel staff</p>
            <h1 className="text-3xl font-bold text-white">Check-in de Alunos</h1>
            <p className="text-bjj-gray-100">Registre a presença dos alunos nas aulas</p>
          </div>

          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-sm gap-2 border border-bjj-gray-700 bg-bjj-gray-900 text-bjj-gray-100 hover:border-bjj-gray-500 hover:bg-bjj-gray-800"
            >
              <ListChecks size={16} />
              Outros fluxos
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950 p-2 text-sm text-bjj-gray-100 shadow-lg"
            >
              <li>
                <Link href="/presencas/pendencias" className="hover:bg-bjj-gray-900">
                  Pendências de aprovação
                  <span className="text-[11px] text-bjj-gray-400">Revisar presenças pendentes</span>
                </Link>
              </li>
              <li>
                <Link href="/presencas/revisao" className="hover:bg-bjj-gray-900">
                  Revisão / últimos envios
                  <span className="text-[11px] text-bjj-gray-400">Histórico agrupado (30 dias)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bjj-blue-700/20 text-bjj-blue-100 ring-2 ring-bjj-blue-700/60">
            <UsersRound size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Total de Alunos</p>
            <p className="text-2xl font-bold text-white">{totais.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20 text-green-100 ring-2 ring-green-600/60">
            <Check size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Check-ins Hoje</p>
            <p className="text-2xl font-bold text-white">{totais.checkinsHoje}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-bjj-gray-900/70 p-4 ring-1 ring-bjj-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-100 ring-2 ring-amber-500/60">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Pendentes</p>
            <p className="text-2xl font-bold text-white">{totais.pendentes}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-bjj-gray-900/80 p-4 ring-1 ring-bjj-gray-800">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/70">Lista de alunos</p>
            <h2 className="text-lg font-semibold text-white">Confirme presença rapidamente</h2>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-3 text-bjj-gray-300" />
            <Input
              className="w-full bg-bjj-gray-950 pl-9 text-sm"
              placeholder="Buscar aluno por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {statusPorAluno.map(({ aluno: item, status }) => (
            <div
              key={item.id}
              className={`flex flex-col gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 px-4 py-3 text-bjj-gray-50 sm:flex-row sm:items-center sm:justify-between ${
                status === 'presente' ? 'bg-green-600/10 border-green-600/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bjj-gray-800 text-lg font-bold text-white ring-1 ring-bjj-gray-700">
                  {item.nome.charAt(0)}
                </span>
                <div>
                  <p className="text-base font-semibold text-white">{item.nome}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-bjj-gray-200">
                    <span className="rounded-full bg-bjj-gray-800 px-2 py-1 ring-1 ring-bjj-gray-700">Faixa {item.faixaSlug || 'Branca'}</span>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusConfig[status].tone}`}>
                      {statusConfig[status].label}
                    </span>
                  </div>
                </div>
              </div>

              {status === 'presente' ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/60">
                  <Check size={14} /> Confirmado
                </span>
              ) : (
                <Button
                  className="btn-sm bg-green-600 text-white hover:bg-green-500"
                  onClick={() => handleConfirmar(item.id)}
                  disabled={loadingAluno === item.id}
                >
                  {loadingAluno === item.id ? 'Confirmando...' : 'Confirmar'}
                </Button>
              )}
            </div>
          ))}

          {statusPorAluno.length === 0 && (
            <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-6 text-center text-bjj-gray-200">
              Nenhum aluno encontrado.
            </div>
          )}
        </div>

        {isQrCheckinEnabled() && (
          <div className="mt-6 rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-950/70 p-5 text-bjj-gray-50">
            <div className="mb-3 flex items-center gap-2 text-white">
              <QrCode size={18} className="text-bjj-blue-100" />
              <p className="text-lg font-semibold">QR Code Check-in (Beta)</p>
            </div>
            <p className="text-sm text-bjj-gray-200">Acesse as telas beta de QR Code para testar o fluxo de validação.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link
                href="/staff/qr/academia"
                className="rounded-full bg-bjj-blue-700/20 px-3 py-1 font-semibold text-bjj-blue-100 ring-1 ring-bjj-blue-700/60 hover:bg-bjj-blue-700/30"
              >
                QR Code da Academia
              </Link>
              <Link
                href="/staff/qr/validar"
                className="rounded-full bg-bjj-gray-800 px-3 py-1 font-semibold text-bjj-gray-100 ring-1 ring-bjj-gray-700 hover:bg-bjj-gray-700"
              >
                Validar QR Code
              </Link>
              <Link
                href="/staff/qr/historico"
                className="rounded-full bg-bjj-gray-800 px-3 py-1 font-semibold text-bjj-gray-100 ring-1 ring-bjj-gray-700 hover:bg-bjj-gray-700"
              >
                Histórico de Validações
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
