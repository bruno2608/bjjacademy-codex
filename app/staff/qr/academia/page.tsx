'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Clock3, Download, Info, Loader2, QrCode, RefreshCcw } from 'lucide-react'

import Button from '@/components/ui/Button'
import { isQrCheckinEnabled } from '@/lib/featureFlags'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useQrCodeStore } from '@/store/qrCodeStore'

const formatDateTime = (value?: string | null) => {
  if (!value) return '--:--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return '--:--'
  return (
    data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' às ' +
    data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  )
}

export default function QrCodeAcademiaPage() {
  const { user } = useCurrentUser()
  const academiaId = user?.academiaId || 'academia-001'

  const { qrAtual, validacoes, carregarEstadoInicial, gerarNovoQr, marcarExpirado } = useQrCodeStore()
  const [carregando, setCarregando] = useState(false)
  const [segundosRestantes, setSegundosRestantes] = useState<number | null>(null)

  const featureFlagHabilitada = isQrCheckinEnabled()

  useEffect(() => {
    if (!featureFlagHabilitada) return
    carregarEstadoInicial(academiaId)
  }, [academiaId, carregarEstadoInicial, featureFlagHabilitada])

  useEffect(() => {
    if (!qrAtual?.expiresAt) {
      setSegundosRestantes(null)
      return
    }
    const calcular = () => {
      const diff = Math.max(0, Math.floor((new Date(qrAtual.expiresAt).getTime() - Date.now()) / 1000))
      setSegundosRestantes(diff)
      if (diff <= 0) {
        marcarExpirado(qrAtual.id)
      }
    }
    calcular()
    const interval = setInterval(calcular, 1000)
    return () => clearInterval(interval)
  }, [qrAtual?.expiresAt, qrAtual?.id, marcarExpirado])

  const progresso = useMemo(() => {
    if (segundosRestantes === null || segundosRestantes <= 0) return 0
    return Math.min(100, (segundosRestantes / 60) * 100)
  }, [segundosRestantes])

  const qrImageUrl = useMemo(() => {
    const conteudo = qrAtual?.codigo || 'BJJ-QR-MOCK'
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(conteudo)}&size=240x240`
  }, [qrAtual?.codigo])

  const handleGerarNovo = async () => {
    if (!academiaId) return
    setCarregando(true)
    await gerarNovoQr(academiaId)
    setCarregando(false)
  }

  const handleDownload = () => {
    if (!qrImageUrl) return
    const link = document.createElement('a')
    link.href = qrImageUrl
    link.download = 'qr-code-academia.png'
    link.click()
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
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Check-in QR (Beta)</p>
        <h1 className="text-3xl font-bold text-white">QR Code da Academia</h1>
        <p className="text-bjj-gray-100">QR Code único que se renova automaticamente a cada minuto.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-bjj-blue-700/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bjj-blue-100 ring-1 ring-bjj-blue-700/60">
              <QrCode size={14} />
              QR Code ativo
            </span>
            {qrAtual?.status === 'EXPIRADO' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-100 ring-1 ring-red-500/50">
                Expirado
              </span>
            )}
            {segundosRestantes !== null && segundosRestantes > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-bjj-gray-800 px-3 py-1 text-xs font-semibold text-bjj-gray-100 ring-1 ring-bjj-gray-700">
                <Clock3 size={14} className="text-bjj-blue-100" />
                Expira em {segundosRestantes}s
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-bjj-gray-950/70 p-5 ring-1 ring-bjj-gray-800">
              <div className="rounded-2xl bg-white p-3 shadow-lg">
                {qrAtual ? (
                  <img
                    src={qrImageUrl}
                    alt="QR Code da academia"
                    className="h-56 w-56 object-contain"
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center bg-bjj-gray-200 text-bjj-gray-700">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-sm text-bjj-gray-200">Código: {qrAtual?.codigo || 'Carregando...'}</p>
            </div>

            <div className="w-full space-y-3 lg:max-w-xs">
              <div className="rounded-2xl bg-bjj-gray-950/70 p-4 ring-1 ring-bjj-gray-800">
                <p className="text-sm font-semibold text-white">Validade</p>
                <p className="text-sm text-bjj-gray-200">{formatDateTime(qrAtual?.expiresAt)}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bjj-gray-800">
                  <div
                    className="h-full rounded-full bg-bjj-blue-600 transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Button className="btn-block" onClick={handleGerarNovo} disabled={carregando}>
                  {carregando ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RefreshCcw size={16} />
                      Gerar Novo QR Code Agora
                    </span>
                  )}
                </Button>
                <Button className="btn-block btn-outline" onClick={handleDownload}>
                  <Download size={16} /> Baixar QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="flex items-center gap-2 text-white">
            <Info size={18} className="text-bjj-blue-100" />
            <h2 className="text-lg font-semibold">Como usar</h2>
          </div>
          <ol className="mt-3 space-y-2 text-sm text-bjj-gray-100">
            <li>1. Imprima ou projete o QR Code da academia.</li>
            <li>2. Mantenha-o visível próximo à entrada ou recepção.</li>
            <li>3. Peça para os alunos escanearem ao chegar.</li>
            <li>4. Renove manualmente quando necessário ou aguarde a renovação automática.</li>
            <li>5. Acompanhe as validações na aba de histórico.</li>
          </ol>
          <div className="mt-4 rounded-xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-3 text-xs text-bjj-gray-200">
            Última validação: {validacoes[0]?.mensagem || 'Nenhuma leitura registrada.'}
          </div>
        </div>
      </div>
    </div>
  )
}
