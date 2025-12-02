'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button'
import { getQrAcademiaAtual, registrarValidacaoSimulada, regenerarQrAcademia } from '@/services/qrCheckinService'

interface UltimaValidacao {
  resultado: 'SUCESSO' | 'FALHA'
  mensagem: string
  dataHora: string
}

export default function QrValidarPage() {
  const [ultimaValidacao, setUltimaValidacao] = useState<UltimaValidacao | null>(null)
  const [qrAtual, setQrAtual] = useState(() => getQrAcademiaAtual())

  const handleValidar = () => {
    const agora = new Date()
    const expirado = new Date(qrAtual.expiresAt).getTime() < agora.getTime()

    let resultado: UltimaValidacao
    if (expirado) {
      const log = registrarValidacaoSimulada('FALHA', 'QR expirado, gere um novo código.', 'Leitura automática')
      resultado = { resultado: log.resultado, mensagem: log.motivo, dataHora: log.dataHora }
    } else {
      const log = registrarValidacaoSimulada('SUCESSO', 'QR válido e dentro do prazo.', 'Leitura automática')
      resultado = { resultado: log.resultado, mensagem: log.motivo, dataHora: log.dataHora }
    }

    if (expirado) {
      const novo = regenerarQrAcademia()
      setQrAtual(novo)
    }

    setUltimaValidacao(resultado)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Painel staff</p>
        <h1 className="text-3xl font-bold text-white">Validar QR Code da Academia</h1>
        <p className="text-bjj-gray-100">Escaneie o QR Code dinâmico da academia para validar acesso ao check-in</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-5 ring-1 ring-bjj-gray-900">
          <div className="mb-3 flex items-center justify-between text-white">
            <p className="font-semibold">Câmera</p>
            <span className="text-xs text-bjj-gray-300">QR atual: {qrAtual.codigo}</span>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 text-bjj-gray-300">
            <span className="text-3xl" role="img" aria-label="camera">
              📷
            </span>
          </div>
          <p className="mt-3 text-sm text-bjj-gray-200">Clique abaixo para simular a leitura do QR Code da academia.</p>
          <Button className="mt-3 bg-bjj-blue-700 text-white hover:bg-bjj-blue-600" onClick={handleValidar}>
            Ativar Scanner
          </Button>
        </div>

        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-5 ring-1 ring-bjj-gray-900">
          <div className="mb-3 flex items-center justify-between text-white">
            <p className="font-semibold">Última validação</p>
            <span className="text-xs text-bjj-gray-300">Atualizado em tempo real</span>
          </div>

          {!ultimaValidacao ? (
            <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-6 text-center text-bjj-gray-200">
              Aguardando leitura do QR Code da academia.
            </div>
          ) : (
            <div className="space-y-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-4 text-bjj-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    ultimaValidacao.resultado === 'SUCESSO' ? 'bg-green-400' : 'bg-red-500'
                  }`}
                />
                <p className="text-sm font-semibold text-white">
                  {ultimaValidacao.resultado === 'SUCESSO' ? 'Sucesso' : 'Falha'}
                </p>
              </div>
              <p className="text-sm text-bjj-gray-200">{ultimaValidacao.mensagem}</p>
              <p className="text-xs text-bjj-gray-400">{ultimaValidacao.dataHora}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 ring-1 ring-bjj-gray-900">
        <h3 className="mb-2 text-lg font-semibold text-white">Como usar</h3>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-bjj-gray-200">
          <li>Posicione o QR Code da academia à frente do scanner.</li>
          <li>Confirme se o timer do QR está ativo (não expirado).</li>
          <li>Clique em “Ativar Scanner” para simular a leitura.</li>
          <li>Veja o resultado acima e ajuste se necessário.</li>
          <li>Consulte o histórico de validações para auditoria.</li>
        </ol>
      </div>
    </div>
  )
}
