'use client'

import { useEffect, useState } from 'react'

import { Clock, History, ShieldCheck } from 'lucide-react'

import { listarValidacoesQr, type MockQrValidacao } from '@/services/qrCheckinService'

export default function QrHistoricoPage() {
  const [validacoes, setValidacoes] = useState<MockQrValidacao[]>([])

  useEffect(() => {
    setValidacoes(listarValidacoesQr())
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Painel staff</p>
        <h1 className="text-3xl font-bold text-white">Histórico de Validações de QR Code</h1>
        <p className="text-bjj-gray-100">Registro completo de todas as validações de QR Code realizadas na academia</p>
      </header>

      <div className="space-y-4">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 p-5 ring-1 ring-bjj-gray-900">
          <div className="mb-3 flex items-center gap-2 text-white">
            <History size={18} className="text-bjj-blue-100" />
            <p className="text-lg font-semibold">Log de Acessos</p>
          </div>

          {validacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-8 text-bjj-gray-200">
              <Clock size={28} className="mb-2 text-bjj-gray-400" />
              Nenhuma validação registrada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {validacoes.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-3 text-bjj-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{item.alunoNome}</p>
                    <p className="text-xs text-bjj-gray-300">{item.dataHora}</p>
                    <p className="text-xs text-bjj-gray-200">Motivo: {item.motivo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        item.resultado === 'SUCESSO'
                          ? 'bg-green-600/20 text-green-100 ring-1 ring-green-500/50'
                          : 'bg-red-600/20 text-red-100 ring-1 ring-red-500/50'
                      }`}
                    >
                      {item.resultado}
                    </span>
                    <span className="rounded-full bg-bjj-gray-800 px-2 py-1 text-xs text-bjj-gray-200">{item.academiaCodigo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 ring-1 ring-bjj-gray-900">
          <div className="mb-2 flex items-center gap-2 text-white">
            <ShieldCheck size={18} className="text-bjj-blue-100" />
            <p className="text-lg font-semibold">Informações</p>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-bjj-gray-200">
            <li>O histórico registra todas as tentativas de validação (sucessos e falhas).</li>
            <li>Sucesso indica que o QR estava válido e dentro do prazo de expiração.</li>
            <li>Falhas podem indicar QR expirado, código inválido ou academia incorreta.</li>
            <li>Use esta lista para auditoria rápida do fluxo de check-in via QR.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
