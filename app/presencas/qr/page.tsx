'use client'

import { useEffect, useMemo, useState } from 'react'

import Button from '@/components/ui/Button'
import { getQrAcademiaAtual, regenerarQrAcademia } from '@/services/qrCheckinService'

export default function QrAcademiaPage() {
  const [qrAtual, setQrAtual] = useState(() => getQrAcademiaAtual())
  const [segundosRestantes, setSegundosRestantes] = useState(() => {
    const diff = new Date(qrAtual.expiresAt).getTime() - Date.now()
    return Math.max(0, Math.min(60, Math.round(diff / 1000))) || 60
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          const novoQr = regenerarQrAcademia()
          setQrAtual(novoQr)
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const progresso = useMemo(() => Math.max(0, Math.min(100, (segundosRestantes / 60) * 100)), [segundosRestantes])

  const handleRegenerar = () => {
    const novoQr = regenerarQrAcademia()
    setQrAtual(novoQr)
    setSegundosRestantes(60)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Painel staff</p>
        <h1 className="text-3xl font-bold text-white">QR Code da Academia</h1>
        <p className="text-bjj-gray-100">QR Code único que se renova automaticamente a cada minuto</p>
      </header>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-5 ring-1 ring-bjj-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">QR Code Dinâmico</p>
            <p className="text-xs text-bjj-gray-200">ID: {qrAtual.id}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-100 ring-1 ring-green-500/60">
            Ativo
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 p-5 text-center">
            <div className="mx-auto mb-4 flex aspect-square max-w-xs items-center justify-center rounded-2xl border border-bjj-gray-700 bg-bjj-gray-950 text-bjj-gray-200">
              <span className="text-lg font-semibold">QR Code Mock</span>
            </div>
            <p className="text-sm text-bjj-gray-200">Código atual: {qrAtual.codigo}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-bjj-gray-200">
              <span>Expira em</span>
              <span className="font-semibold text-white">{segundosRestantes}s</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bjj-gray-800">
              <div
                className="h-2 rounded-full bg-bjj-blue-600 transition-[width] duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-bjj-gray-300">
              Criado em {new Date(qrAtual.createdAt).toLocaleString('pt-BR')} · Expira em {new Date(qrAtual.expiresAt).toLocaleTimeString('pt-BR')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="btn-sm bg-bjj-blue-700 text-white hover:bg-bjj-blue-600" onClick={handleRegenerar}>
                Gerar Novo QR Code Agora
              </Button>
              <Button
                className="btn-sm border border-bjj-gray-700 bg-bjj-gray-900 text-bjj-gray-200 hover:border-bjj-gray-600 hover:bg-bjj-gray-800"
                onClick={() => alert('TODO: implementação futura')}
              >
                Baixar QR Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 ring-1 ring-bjj-gray-900">
        <h3 className="mb-2 text-lg font-semibold text-white">Como usar</h3>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-bjj-gray-200">
          <li>Exiba este QR Code próximo à entrada ou recepção.</li>
          <li>Regenere manualmente se precisar reiniciar o timer.</li>
          <li>Peça para os alunos escanearem com o app staff ou leitor dedicado.</li>
          <li>Validações aparecerão na tela de “Validar QR Code”.</li>
          <li>Consulte o histórico completo na aba de “Histórico de validações”.</li>
        </ol>
      </div>
    </div>
  )
}
