'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CalendarClock, Check, HandHeart } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { usePresencasStore } from '@/store/presencasStore'

const formatBr = (date = new Date()) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

export default function CheckinManualPage() {
  const router = useRouter()
  const { user, aluno } = useCurrentAluno()
  const alunoId = aluno?.id || user?.alunoId

  const presencas = usePresencasStore((state) => state.presencas)
  const listarDoAluno = usePresencasStore((state) => state.listarDoAluno)
  const registrarCheckinManual = usePresencasStore((state) => state.registrarCheckinManual)

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const hojeKey = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    if (alunoId) {
      listarDoAluno(alunoId)
    }
  }, [alunoId, listarDoAluno])

  const presencaHoje = useMemo(
    () => presencas.find((item) => item.alunoId === alunoId && item.data === hojeKey),
    [alunoId, hojeKey, presencas]
  )

  const jaConfirmado = presencaHoje?.status === 'PRESENTE'

  const handleConfirmar = async () => {
    if (!alunoId) return
    setIsSaving(true)
    setError('')
    try {
      const registro = await registrarCheckinManual(alunoId, new Date().toISOString(), 'ALUNO')
      if (registro) {
        setSucesso(true)
      }
    } catch (err) {
      setError('Não foi possível registrar sua presença. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button
        type="button"
        className="text-sm text-bjj-gray-300 transition hover:text-white"
        onClick={() => router.back()}
      >
        ← Voltar
      </button>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
            <HandHeart size={32} />
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Check-in Manual</h1>
            <p className="text-sm text-bjj-gray-300">Confirme sua presença na aula de hoje</p>
          </div>

          <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200">
            <p className="font-semibold text-white">Olá, {aluno?.nome || 'aluno'}!</p>
            <p className="text-bjj-gray-300">Clique no botão abaixo para confirmar sua presença.</p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-bjj-gray-300">
              <CalendarClock size={16} className="text-bjj-gray-100" />
              <span>{formatBr()}</span>
            </div>
          </div>

          <Button
            type="button"
            className="btn-lg w-full max-w-sm bg-blue-600 text-white hover:bg-blue-500"
            onClick={handleConfirmar}
            disabled={isSaving || jaConfirmado}
            loading={isSaving}
          >
            <Check size={18} /> {jaConfirmado || sucesso ? 'Presença Confirmada' : 'Confirmar Presença'}
          </Button>

          {(jaConfirmado || sucesso) && (
            <div className="rounded-full border border-green-500/60 bg-green-600/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-200">
              Tudo certo! Você já está marcado como presente.
            </div>
          )}

          {error ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/60 bg-red-600/10 px-4 py-3 text-sm text-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-4 text-sm text-bjj-gray-200">
        <p className="font-semibold text-white">Aviso</p>
        <p className="text-bjj-gray-300">Ao confirmar, sua presença será registrada automaticamente no sistema.</p>
      </div>
    </div>
  )
}
