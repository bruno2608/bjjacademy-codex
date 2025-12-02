'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, HandRaised } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { usePresencasStore } from '@/store/presencasStore'

const formatDateTime = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) + ` às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

export default function CheckinManualAlunoPage() {
  const hoje = useMemo(() => new Date(), [])
  const dataHoje = useMemo(() => new Date().toISOString().split('T')[0], [])

  const { user, aluno } = useCurrentAluno()
  const alunoId = aluno?.id || user?.alunoId || ''

  const presencas = usePresencasStore((state) => state.presencas)
  const carregarPorAluno = usePresencasStore((state) => state.carregarPorAluno)
  const registrarCheckinManual = usePresencasStore((state) => state.registrarCheckinManual)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (alunoId) {
      carregarPorAluno(alunoId)
    }
  }, [alunoId, carregarPorAluno])

  const registroHoje = useMemo(
    () => presencas.find((item) => item.alunoId === alunoId && (item.data || '').startsWith(dataHoje)),
    [alunoId, dataHoje, presencas]
  )

  const jaRegistrado = Boolean(registroHoje && registroHoje.status !== 'FALTA')

  const handleConfirmar = async () => {
    if (!alunoId || jaRegistrado) return
    setIsLoading(true)
    setError(null)
    try {
      await registrarCheckinManual(alunoId, 'ALUNO', hoje)
      setSucesso(true)
    } catch (err) {
      setError('Não foi possível registrar sua presença agora. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const saudacao = aluno?.nome || user?.nomeCompleto || 'Aluno'

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl space-y-4">
        <div className="rounded-2xl bg-bjj-gray-900/80 p-6 ring-1 ring-bjj-gray-800">
          <div className="mb-3 flex items-center justify-between text-bjj-gray-100">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Fluxo aluno</p>
              <h1 className="text-2xl font-bold text-white">Check-in Manual</h1>
            </div>
            {jaRegistrado && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/60">
                <CheckCircle2 size={16} />
                Confirmado
              </span>
            )}
          </div>

          <p className="text-bjj-gray-100">Confirme sua presença na aula de hoje</p>

          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bjj-blue-700/30 text-bjj-blue-100 ring-4 ring-bjj-blue-800/60">
              <HandRaised size={36} />
            </span>
            <p className="text-lg font-semibold text-white">Olá, {saudacao}!</p>
            <p className="text-sm text-bjj-gray-200">Clique no botão abaixo para confirmar sua presença.</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-bjj-gray-800 px-4 py-2 text-sm text-bjj-gray-100 ring-1 ring-bjj-gray-700">
              <CalendarDays size={16} className="text-bjj-blue-100" />
              <span>{formatDateTime(hoje)}</span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

          <div className="mt-5">
            <Button
              className="btn-block"
              onClick={handleConfirmar}
              disabled={isLoading || jaRegistrado || !alunoId}
            >
              {isLoading ? 'Registrando…' : jaRegistrado || sucesso ? 'Presença Confirmada' : 'Confirmar Presença'}
            </Button>
          </div>

          {sucesso && !jaRegistrado && (
            <div className="mt-3 rounded-xl bg-green-600/10 px-4 py-3 text-sm text-green-100 ring-1 ring-green-500/40">
              Tudo certo! Você já está marcado como presente hoje.
            </div>
          )}

          {jaRegistrado && (
            <div className="mt-3 rounded-xl bg-green-600/10 px-4 py-3 text-sm text-green-100 ring-1 ring-green-500/40">
              Tudo certo! Você já está marcado como presente hoje.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Ao confirmar, sua presença será registrada automaticamente no sistema.
        </div>
      </div>
    </div>
  )
}
