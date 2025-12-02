'use client'

import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, QrCode, XCircle } from 'lucide-react'

import { useQrCheckinStore } from '@/store/qrCheckinStore'

export default function QrCodeHistoricoPage() {
  const { loadInitial, validations } = useQrCheckinStore()

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">QR Code Check-in</p>
        <h1 className="text-3xl font-bold text-white">Histórico de Validações de QR Code</h1>
        <p className="text-bjj-gray-100">Registro completo de todas as validações de QR Code realizadas na academia.</p>
      </header>

      <section className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-5 shadow-lg ring-1 ring-bjj-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-bjj-gray-200">
          <Clock3 size={16} /> Log de acessos
        </div>

        {validations.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/70 px-6 py-10 text-bjj-gray-200">
            <QrCode size={28} className="text-bjj-gray-300" />
            <p className="text-sm">Nenhuma validação registrada ainda.</p>
            <p className="text-xs text-bjj-gray-400">Escaneie QR Codes na página “Validar QR Code” para começar.</p>
          </div>
        )}

        <div className="space-y-3">
          {validations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-3 text-bjj-gray-50 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{item.alunoNome}</p>
                <p className="text-xs text-bjj-gray-300">{item.dataHora}</p>
                <p className="text-xs text-bjj-gray-400">{item.motivo}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide md:self-center ${
                  item.resultado === 'SUCESSO'
                    ? 'bg-green-600/15 text-green-100 ring-1 ring-green-500/50'
                    : 'bg-red-600/15 text-red-100 ring-1 ring-red-500/50'
                }`}
              >
                {item.resultado === 'SUCESSO' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {item.resultado === 'SUCESSO' ? 'Sucesso' : 'Falha'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-bjj-amber-500/30 bg-bjj-amber-500/10 p-5 text-bjj-amber-50 ring-1 ring-bjj-amber-500/50">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
          <AlertTriangle size={16} /> Informações
        </div>
        <ul className="space-y-3 text-sm text-bjj-amber-50/90">
          <li>• O histórico registra todas as tentativas de validação, incluindo sucessos e falhas.</li>
          <li>• Sucesso indica QR válido e dentro do prazo de expiração.</li>
          <li>• Falhas podem ocorrer por código expirado, academia incorreta ou formato inválido.</li>
          <li>• Use estes registros para auditar acessos em períodos de pico.</li>
        </ul>
      </section>
    </div>
  )
}
