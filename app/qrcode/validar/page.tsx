'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Camera, CheckCircle2, QrCode, XCircle } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useQrCheckinStore } from '@/store/qrCheckinStore'

export default function QrCodeValidarPage() {
  const { loadInitial, registerValidation, ultimaValidacao } = useQrCheckinStore()
  const [scannerAtivo, setScannerAtivo] = useState(false)

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const handleAtivarScanner = () => {
    setScannerAtivo(true)
    registerValidation('SUCESSO', 'QR válido e dentro do prazo.', 'Leitura simulada')
  }

  const handleSimularFalha = () => {
    registerValidation('FALHA', 'QR expirado ou inválido.', 'Leitura simulada')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">QR Code Check-in</p>
        <h1 className="text-3xl font-bold text-white">Validar QR Code da Academia</h1>
        <p className="text-bjj-gray-100">Escaneie o QR Code dinâmico da academia para validar acesso ao check-in.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 shadow-lg ring-1 ring-bjj-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-300">Câmera</p>
              <h2 className="text-lg font-semibold text-white">Simulação de leitura</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${scannerAtivo ? 'bg-green-600/15 text-green-100 ring-1 ring-green-500/50' : 'bg-bjj-gray-800 text-bjj-gray-200 ring-1 ring-bjj-gray-700'}`}>
              {scannerAtivo ? 'Scanner ativo' : 'Scanner desligado'}
            </span>
          </div>

          <div className="mb-5 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 text-bjj-gray-200">
            <div className="text-center text-sm">
              <Camera size={28} className="mx-auto mb-2 text-bjj-gray-100" />
              <p>{scannerAtivo ? 'Aguardando leitura simulada...' : 'Clique para ativar o scanner mock'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-bjj-blue-700 text-white hover:bg-bjj-blue-600" onClick={handleAtivarScanner}>
              <QrCode size={16} /> Ativar Scanner
            </Button>
            <Button
              className="bg-bjj-gray-800 text-bjj-gray-100 hover:bg-bjj-gray-700"
              onClick={handleSimularFalha}
              disabled={!scannerAtivo}
            >
              <XCircle size={16} /> Simular falha
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 shadow-lg ring-1 ring-bjj-gray-900">
          <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-300">Última validação</p>
          {!ultimaValidacao && (
            <div className="mt-4 rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-bjj-gray-200">
              Aguardando leitura do QR Code da academia
            </div>
          )}

          {ultimaValidacao && (
            <div className="mt-4 space-y-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                {ultimaValidacao.resultado === 'SUCESSO' ? (
                  <CheckCircle2 size={18} className="text-green-400" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
                <span>{ultimaValidacao.resultado === 'SUCESSO' ? 'Sucesso' : 'Falha'}</span>
              </div>
              <p className="text-sm text-bjj-gray-100">{ultimaValidacao.motivo}</p>
              <p className="text-xs text-bjj-gray-300">Leitura simulada · {ultimaValidacao.dataHora}</p>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-bjj-amber-500/30 bg-bjj-amber-500/10 p-5 text-bjj-amber-50 ring-1 ring-bjj-amber-500/50">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
          <AlertTriangle size={16} /> Como usar
        </div>
        <ol className="space-y-3 text-sm text-bjj-amber-50/90">
          <li>1. Ative o scanner para iniciar a leitura do QR Code dinâmico.</li>
          <li>2. Posicione o código da academia na área destacada.</li>
          <li>3. Sucesso indica QR válido e dentro do prazo de 60s.</li>
          <li>4. Falhas podem significar código expirado ou formato inválido.</li>
          <li>5. Consulte o histórico para auditar todas as tentativas.</li>
        </ol>
      </section>
    </div>
  )
}
