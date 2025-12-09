'use client'

import { useEffect, useMemo, useState } from 'react'
import { Camera, CheckCircle2, QrCode } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { usePresencasStore } from '@/store/presencasStore'

const formatDateTime = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) + ` às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

export default function CheckinQrCodeAlunoPage() {
  const hoje = useMemo(() => new Date(), [])
  const dataHoje = useMemo(() => new Date().toISOString().split('T')[0], [])

  const { user, aluno } = useCurrentAluno()
  const alunoId = aluno?.id || user?.alunoId || ''

  const presencas = usePresencasStore((state) => state.presencas)
  const carregarPorAluno = usePresencasStore((state) => state.carregarPorAluno)
  const registrarCheckinQrCode = usePresencasStore((state) => state.registrarCheckinQrCode)

  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
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

  const handleSimularLeitura = async () => {
    if (!alunoId || jaRegistrado) return
    setIsLoading(true)
    setErro(null)
    setSucesso(false)
    try {
      await registrarCheckinQrCode(alunoId, hoje)
      setSucesso(true)
    } catch (err) {
      setErro('Não foi possível registrar sua presença agora. Tente novamente.')
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
              <h1 className="text-2xl font-bold text-white">Check-in por QR Code</h1>
            </div>
            {(sucesso || jaRegistrado) && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/60">
                <CheckCircle2 size={16} />
                Confirmado
              </span>
            )}
          </div>

          <p className="text-bjj-gray-100">Aponte a câmera para o QR Code da academia para registrar sua presença.</p>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700/25 text-emerald-100 ring-4 ring-emerald-700/60">
                <QrCode size={36} />
              </span>
              <p className="text-lg font-semibold text-white">Olá, {saudacao}!</p>
              <p className="text-sm text-bjj-gray-200">Clique para simular a leitura do QR Code da academia.</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-bjj-gray-800 px-4 py-2 text-sm text-bjj-gray-100 ring-1 ring-bjj-gray-700">
                <Camera size={16} className="text-emerald-100" />
                <span>{formatDateTime(hoje)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimularLeitura}
              disabled={isLoading || jaRegistrado || !alunoId}
              className="group flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-emerald-700/50 bg-emerald-900/20 text-bjj-gray-100 transition hover:border-emerald-500 hover:bg-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="text-center text-sm">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/25 text-emerald-100 ring-2 ring-emerald-600/60">
                  <Camera size={24} />
                </div>
                <p className="font-semibold text-white">Clique para simular leitura do QR Code</p>
                <p className="text-xs text-bjj-gray-200">Nenhuma câmera real é utilizada neste modo.</p>
              </div>
            </button>

            {erro && <p className="text-sm text-red-300">{erro}</p>}

            <div className="mt-1">
              <Button className="btn-block" onClick={handleSimularLeitura} disabled={isLoading || jaRegistrado || !alunoId}>
                {isLoading ? 'Registrando…' : jaRegistrado || sucesso ? 'Presença registrada via QR Code' : 'Confirmar presença via QR Code'}
              </Button>
            </div>

            {(sucesso || jaRegistrado) && (
              <div className="rounded-xl bg-green-600/10 px-4 py-3 text-sm text-green-100 ring-1 ring-green-500/40">
                Presença registrada com sucesso via QR Code.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-bjj-amber-500/40 bg-bjj-amber-500/10 px-4 py-3 text-sm text-bjj-amber-50">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-bjj-amber-100">Como funciona</p>
          <ul className="space-y-2 text-bjj-amber-50/90">
            <li>1. Abra o card de Check-in por QR Code e clique na área da câmera para simular a leitura.</li>
            <li>2. O sistema registra sua presença imediatamente usando um QR Code mock.</li>
            <li>3. O status da sua presença aparece em &quot;Check-ins Recentes&quot; na home.</li>
            <li>4. Você pode acessar novamente para conferir se já está marcado.</li>
            <li>5. Quando a leitura real estiver disponível, este fluxo ficará ainda mais rápido.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
