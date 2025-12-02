'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  CalendarClock,
  Clock4,
  HandHeart,
  History,
  QrCode,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { usePresencasStore } from '@/store/presencasStore'

const STATUS_STYLES = {
  PRESENTE: 'bg-green-600/15 text-green-200 border border-green-500/50',
  FALTA: 'bg-red-600/15 text-red-200 border border-red-500/40',
  PENDENTE: 'bg-amber-500/20 text-amber-100 border border-amber-400/60',
  JUSTIFICADA: 'bg-indigo-600/20 text-indigo-100 border border-indigo-400/50',
}

const ORIGEM_LABEL = {
  ALUNO: 'Manual',
  PROFESSOR: 'Sistema',
}

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatDateOnly = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function MeuCheckinPage() {
  const router = useRouter()
  const { user, aluno } = useCurrentAluno()
  const alunoId = aluno?.id || user?.alunoId

  const presencas = usePresencasStore((state) => state.presencas)
  const listarDoAluno = usePresencasStore((state) => state.listarDoAluno)

  useEffect(() => {
    if (!alunoId) return
    listarDoAluno(alunoId)
  }, [alunoId, listarDoAluno])

  const recentes = useMemo(() => {
    const lista = presencas
      .filter((item) => item.alunoId === alunoId)
      .sort((a, b) => {
        const dataA = new Date(a.updatedAt || a.data || 0).getTime()
        const dataB = new Date(b.updatedAt || b.data || 0).getTime()
        return dataB - dataA
      })
    return lista.slice(0, 5)
  }, [alunoId, presencas])

  const renderStatusBadge = (status) => {
    const style = STATUS_STYLES[status] || 'bg-bjj-gray-800 text-bjj-gray-100 border border-bjj-gray-700'
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${style}`}>
        <Clock4 size={14} />
        {status === 'PRESENTE' ? 'Presente' : status === 'PENDENTE' ? 'Pendente' : status === 'FALTA' ? 'Falta' : status}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Meu Check-in</h1>
        <p className="text-sm text-bjj-gray-300">Registre sua presença de forma rápida e fácil.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push('/checkin/manual')}
          className="flex flex-col items-start gap-3 rounded-2xl border border-bjj-gray-800 bg-gradient-to-br from-bjj-gray-900 to-bjj-black p-5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.4)] transition hover:border-bjj-blue/60 hover:shadow-[0_18px_60px_rgba(24,144,255,0.18)]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
              <HandHeart size={26} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">Check-in Manual</h3>
              <p className="text-sm text-bjj-gray-300">Registre sua presença com um clique</p>
            </div>
          </div>
          <div className="mt-2 w-full rounded-xl bg-bjj-gray-900/80 px-4 py-3 text-sm text-bjj-gray-200">
            Confirme sua presença na aula de hoje de forma imediata.
          </div>
        </button>

        <div className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 opacity-70">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600/20 text-green-300">
              <QrCode size={26} />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Check-in por QR Code</h3>
                <span className="rounded-full bg-bjj-gray-800 px-2 py-0.5 text-[11px] font-semibold uppercase text-bjj-gray-200">
                  Em breve
                </span>
              </div>
              <p className="text-sm text-bjj-gray-300">Em breve: escaneie o QR Code da academia</p>
            </div>
          </div>
          <div className="rounded-xl bg-bjj-gray-900/60 px-4 py-3 text-sm text-bjj-gray-400">
            Fluxo de QR Code será habilitado em uma próxima atualização.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-bjj-gray-200" />
            <h3 className="text-lg font-semibold text-white">Check-ins Recentes</h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="btn-xs border-bjj-gray-800 bg-bjj-gray-900 text-xs text-bjj-gray-200 hover:border-bjj-blue/60 hover:text-white"
            onClick={() => router.push('/historico-presencas')}
          >
            Ver histórico completo
          </Button>
        </div>

        {recentes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-black/50 p-6 text-center text-bjj-gray-300">
            <AlertCircle className="text-bjj-gray-400" />
            <p className="text-sm">Você ainda não tem check-ins registrados.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentes.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-bjj-gray-200">
                    <CalendarClock size={16} className="text-bjj-gray-300" />
                    <span>{formatDateOnly(item.data || item.updatedAt)}</span>
                  </div>
                  <p className="text-xs text-bjj-gray-400">
                    {formatDateTime(item.updatedAt || item.data)} · {ORIGEM_LABEL[item.origem] || 'Manual'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {renderStatusBadge(item.status)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
