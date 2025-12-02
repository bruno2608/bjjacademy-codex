'use client'

import { useEffect } from 'react'
import { AlertTriangle, Download, QrCode, RefreshCw } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useQrCheckinStore } from '@/store/qrCheckinStore'

const TOTAL_SECONDS = 60

export default function QrCodeAcademiaPage() {
  const { qrAtual, expiresIn, loadInitial, tick, generateNewQr } = useQrCheckinStore()

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000)
    return () => clearInterval(interval)
  }, [tick])

  useEffect(() => {
    if (expiresIn <= 0 && qrAtual) {
      generateNewQr()
    }
  }, [expiresIn, qrAtual, generateNewQr])

  const progress = Math.min(100, Math.max(0, (expiresIn / TOTAL_SECONDS) * 100))

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">QR Code Check-in</p>
        <h1 className="text-3xl font-bold text-white">QR Code da Academia</h1>
        <p className="text-bjj-gray-100">QR Code único que se renova automaticamente a cada minuto.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 shadow-lg ring-1 ring-bjj-gray-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-300">QR Code Dinâmico</p>
              <h2 className="text-xl font-semibold text-white">{qrAtual?.codigo || 'QR Code mock'}</h2>
            </div>
            <span className="rounded-full bg-green-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/50">
              Ativo
            </span>
          </div>

          <div className="mb-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-bjj-gray-200">
              <QrCode size={18} className="text-bjj-blue-100" />
              <span>Renova em {String(Math.floor(expiresIn / 60)).padStart(2, '0')}:{String(expiresIn % 60).padStart(2, '0')}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bjj-gray-900 ring-1 ring-bjj-gray-800">
              <div
                className="h-full bg-gradient-to-r from-bjj-blue-600 via-bjj-blue-400 to-bjj-blue-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-5 flex items-center justify-center">
            <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 text-bjj-gray-100">
              <div className="text-center text-sm">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bjj-blue-700/20 text-bjj-blue-100 ring-2 ring-bjj-blue-700/40">
                  <QrCode size={20} />
                </div>
                <p className="font-semibold">QR Code Mock</p>
                <p className="text-xs text-bjj-gray-300">{qrAtual?.codigo || 'Código dinâmico'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-bjj-blue-700 text-white hover:bg-bjj-blue-600" onClick={generateNewQr}>
              <RefreshCw size={16} /> Gerar Novo QR Code Agora
            </Button>
            <Button
              variant="ghost"
              className="border border-bjj-gray-800 bg-bjj-gray-900 text-bjj-gray-100 hover:border-bjj-gray-600"
              onClick={() => alert('TODO: implementação futura')}
            >
              <Download size={16} /> Baixar QR Code
            </Button>
          </div>
        </section>

        <aside className="rounded-2xl border border-bjj-amber-500/30 bg-bjj-amber-500/10 p-5 text-bjj-amber-50 ring-1 ring-bjj-amber-500/50">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
            <AlertTriangle size={16} /> Como usar
          </div>
          <ol className="space-y-3 text-sm text-bjj-amber-50/90">
            <li>1. Exiba este QR Code impresso ou no tablet na entrada da academia.</li>
            <li>2. Peça para o aluno abrir a tela de validação e escanear o código.</li>
            <li>3. O código expira a cada 60s e é automaticamente renovado.</li>
            <li>4. Em caso de problemas, gere um novo código manualmente.</li>
            <li>5. Acompanhe as leituras no histórico para auditar acessos.</li>
          </ol>
        </aside>
      </div>
    </div>
  )
}
