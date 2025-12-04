'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { ArrowRight, Clock3, Hand, History, QrCode } from 'lucide-react'

import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { usePresencasStore } from '@/store/presencasStore'

const formatDate = (value?: string | null) => {
  if (!value) return '--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return value
  return data.toLocaleDateString('pt-BR', {
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

const statusTone: Record<string, string> = {
  PRESENTE: 'bg-green-500/15 text-green-200 border border-green-400/40',
  PENDENTE: 'bg-amber-500/15 text-amber-200 border border-amber-400/40',
  FALTA: 'bg-red-500/15 text-red-200 border border-red-400/40',
  JUSTIFICADA: 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/40',
}

const origemLabel: Record<string, string> = {
  ALUNO: 'Manual',
  PROFESSOR: 'Professor',
  SISTEMA: 'Sistema',
  QR_CODE: 'QR Code',
}

export default function MeuCheckinPage() {
  const { user, aluno } = useCurrentAluno()
  const alunoId = aluno?.id || user?.alunoId || ''

  const presencas = usePresencasStore((state) => state.presencas)
  const carregarPorAluno = usePresencasStore((state) => state.carregarPorAluno)

  useEffect(() => {
    if (alunoId) {
      carregarPorAluno(alunoId)
    }
  }, [alunoId, carregarPorAluno])

  const recentes = useMemo(() => {
    const lista = presencas.filter((item) => item.alunoId === alunoId)
    return lista
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
      .slice(0, 5)
  }, [alunoId, presencas])

  return (
    <div className="space-y-6">
      <header className="space-y-1 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Fluxo rápido</p>
        <h1 className="text-3xl font-bold text-white">Meu Check-in</h1>
        <p className="text-bjj-gray-100">Registre sua presença de forma rápida e fácil</p>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <Link
          href="/aluno/checkin/qrcode"
          className="block rounded-2xl bg-gradient-to-r from-emerald-900/60 via-bjj-gray-900 to-bjj-gray-900 p-5 ring-1 ring-bjj-gray-800 transition hover:-translate-y-0.5 hover:ring-emerald-600"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700/25 text-emerald-100 ring-2 ring-emerald-600/70">
              <QrCode size={28} />
            </span>
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">Check-in por QR Code</p>
              <p className="text-sm text-bjj-gray-100">Simule a leitura do QR Code da academia</p>
            </div>
            <ArrowRight className="text-bjj-gray-200" />
          </div>
        </Link>

        <Link href="/aluno/checkin/manual" className="block rounded-2xl bg-gradient-to-r from-bjj-blue-900/60 via-bjj-gray-900 to-bjj-gray-900 p-5 ring-1 ring-bjj-gray-800 transition hover:-translate-y-0.5 hover:ring-bjj-blue-700">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bjj-blue-700/30 text-bjj-blue-100 ring-2 ring-bjj-blue-700/70">
              <Hand size={28} />
            </span>
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">Check-in Manual</p>
              <p className="text-sm text-bjj-gray-100">Registre sua presença com um clique</p>
            </div>
            <ArrowRight className="text-bjj-gray-200" />
          </div>
        </Link>

        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="mb-3 flex items-center gap-2 text-bjj-gray-100">
            <History size={18} />
            <p className="text-sm font-semibold">Check-ins Recentes</p>
          </div>

          {recentes.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/80 px-4 py-6 text-bjj-gray-200">
              <Clock3 size={20} className="text-bjj-gray-300" />
              <span>Você ainda não tem check-ins registrados.</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentes.map((presenca) => (
                <li
                  key={presenca.id}
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-950/70 px-4 py-3 text-sm text-bjj-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-white">{formatDate(presenca.data)}</p>
                    <p className="text-xs text-bjj-gray-200">Horário: {formatTime(presenca.createdAt)}</p>
                    <p className="text-xs text-bjj-gray-300">Origem: {origemLabel[presenca.origem] || 'Sistema'}</p>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      statusTone[presenca.status] || 'bg-bjj-gray-800 text-bjj-gray-100 border border-bjj-gray-700'
                    }`}
                  >
                    {presenca.status === 'PRESENTE'
                      ? 'Presente'
                      : presenca.status === 'FALTA'
                      ? 'Falta'
                      : presenca.status === 'JUSTIFICADA'
                      ? 'Justificada'
                      : 'Pendente'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/40 px-5 py-4 text-bjj-gray-100">
        <p className="text-sm font-semibold text-white">Como usar</p>
        <p className="text-sm text-bjj-gray-200">
          Escolha entre o Check-in Manual ou por QR Code para registrar sua presença e acompanhe os resultados nos check-ins
          recentes.
        </p>
      </div>
    </div>
  )
}
