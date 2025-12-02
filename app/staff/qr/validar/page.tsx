'use client'

import { useEffect } from 'react'
import { AlertCircle, Camera, CheckCircle2, Clock3, Info, Loader2, ScanLine, ShieldAlert } from 'lucide-react'

import Button from '@/components/ui/Button'
import { isQrCheckinEnabled } from '@/lib/featureFlags'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useQrCodeStore } from '@/store/qrCodeStore'

const formatDateTime = (value?: string | null) => {
  if (!value) return '--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return '--'
  return data.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
}

export default function ValidarQrCodePage() {
  const { user } = useCurrentUser()
  const academiaId = user?.academiaId || 'academia-001'

  const { qrAtual, validacoes, carregarEstadoInicial, registrarValidacaoFake } = useQrCodeStore()

  const featureFlagHabilitada = isQrCheckinEnabled()

  useEffect(() => {
    if (!featureFlagHabilitada) return
    carregarEstadoInicial(academiaId)
  }, [academiaId, carregarEstadoInicial, featureFlagHabilitada])

  const ultimaValidacao = validacoes[0]

  const handleScanner = async () => {
    await registrarValidacaoFake(
      academiaId,
      'SUCESSO',
      qrAtual?.status === 'EXPIRADO' ? 'QR Code expirado. Gere um novo.' : 'QR Code válido e dentro do prazo.'
    )
  }

  if (!featureFlagHabilitada) {
    return (
      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 text-bjj-gray-100">
        <div className="flex items-center gap-2 text-amber-200">
          <AlertCircle size={18} />
          <p className="font-semibold">QR Code Check-in (Beta) desabilitado</p>
        </div>
        <p className="text-sm text-bjj-gray-200">
          Habilite a flag NEXT_PUBLIC_ENABLE_QR_CHECKIN para visualizar o módulo de QR Code.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Validação simulada</p>
        <h1 className="text-3xl font-bold text-white">Validar QR Code da Academia</h1>
        <p className="text-bjj-gray-100">Simule leituras do QR Code e veja o resultado em tempo real.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Camera size={18} className="text-bjj-blue-100" />
              <p className="text-lg font-semibold">Câmera</p>
            </div>
            <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              QR atual: {qrAtual?.codigo || 'Carregando...'}
            </span>
          </div>

          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-95
0/60 text-bjj-gray-200">
            <div className="flex flex-col items-center gap-3 text-center">
              <ScanLine size={32} className="text-bjj-blue-100" />
              <p className="text-sm text-bjj-gray-100">Clique para ativar o scanner</p>
              <Button onClick={handleScanner}>
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-bjj-blue-100" />
                  Ativar Scanner
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="mb-3 flex items-center gap-2 text-white">
            <Info size={18} className="text-bjj-blue-100" />
            <p className="text-lg font-semibold">Última Validação</p>
          </div>

          {ultimaValidacao ? (
            <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-4 text-bjj-gray-100">
              <div className="mb-2 flex items-center gap-2">
                {ultimaValidacao.resultado === 'SUCESSO' ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/50">
                    <CheckCircle2 size={14} />
                    Sucesso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-100 ring-1 ring-red-500/50">
                    <ShieldAlert size={14} />
                    Falha
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-bjj-gray-800 px-2 py-1 text-[11px] font-semibold text-bjj-gray-100">
                  <Clock3 size={12} /> {formatDateTime(ultimaValidacao.criadoEm)}
                </span>
              </div>
              <p className="text-sm text-white">{ultimaValidacao.mensagem}</p>
              <p className="text-xs text-bjj-gray-300">QR: {ultimaValidacao.qrCodeId}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-950/50 px-4 py-6 text-bjj-gray-200">
              Aguardando leitura do QR Code da academia.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-bjj-gray-900/70 p-5 ring-1 ring-bjj-gray-800">
        <div className="flex items-center gap-2 text-white">
          <Info size={18} className="text-bjj-blue-100" />
          <p className="text-lg font-semibold">Como usar</p>
        </div>
        <ol className="mt-3 space-y-2 text-sm text-bjj-gray-100">
          <li>1. Clique em “Ativar Scanner” para simular uma leitura.</li>
          <li>2. O resultado aparece imediatamente no painel ao lado.</li>
          <li>3. Gere um novo QR Code se o atual estiver expirado.</li>
          <li>4. Consulte o histórico de validações para auditoria.</li>
        </ol>
      </div>
    </div>
  )
}
