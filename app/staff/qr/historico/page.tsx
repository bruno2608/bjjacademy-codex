'use client'

import { useEffect } from 'react'
import { AlertCircle, ArrowDownUp, CheckCircle, Info, ListChecks, ShieldAlert, UserRound } from 'lucide-react'

import { isQrCheckinEnabled } from '@/lib/featureFlags'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useQrCodeStore } from '@/store/qrCodeStore'

const formatDateTime = (value?: string | null) => {
  if (!value) return '--'
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return '--'
  return data.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
}

export default function HistoricoQrCodePage() {
  const { user } = useCurrentUser()
  const academiaId = user?.academiaId || 'academia-001'
  const { validacoes, carregarEstadoInicial } = useQrCodeStore()

  const featureFlagHabilitada = isQrCheckinEnabled()

  useEffect(() => {
    if (!featureFlagHabilitada) return
    carregarEstadoInicial(academiaId)
  }, [academiaId, carregarEstadoInicial, featureFlagHabilitada])

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
        <p className="text-xs uppercase tracking-[0.28em] text-bjj-gray-300">Log de acessos</p>
        <h1 className="text-3xl font-bold text-white">Histórico de Validações de QR Code</h1>
        <p className="text-bjj-gray-100">Consulte as leituras registradas para auditoria rápida.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="mb-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-bjj-blue-100" />
              <p className="text-lg font-semibold">Log de Acessos</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-bjj-gray-800 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              <ArrowDownUp size={14} />
              Mais recente
            </span>
          </div>

          {validacoes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-950/60 px-4 py-6 text-bjj-gray-200">
              Nenhuma validação registrada ainda. Escaneie QR Codes na página “Validar QR Code” para começar.
            </div>
          ) : (
            <ul className="space-y-2">
              {validacoes.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/70 px-4 py-3 text-bjj-gray-100 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bjj-gray-800 text-sm font-bold text-white ring-1 ring-bjj-gray-700">
                      <UserRound size={18} />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">QR: {item.qrCodeId}</p>
                      <p className="text-xs text-bjj-gray-300">{item.mensagem}</p>
                      <p className="text-[11px] text-bjj-gray-400">{formatDateTime(item.criadoEm)}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      item.resultado === 'SUCESSO'
                        ? 'bg-green-600/20 text-green-100 ring-1 ring-green-500/50'
                        : 'bg-red-600/20 text-red-100 ring-1 ring-red-500/50'
                    }`}
                  >
                    {item.resultado === 'SUCESSO' ? 'Sucesso' : 'Falha'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-bjj-gray-900/80 p-5 ring-1 ring-bjj-gray-800">
          <div className="flex items-center gap-2 text-white">
            <Info size={18} className="text-bjj-blue-100" />
            <p className="text-lg font-semibold">Informações</p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-bjj-gray-100">
            <p>
              <ShieldAlert size={16} className="mr-2 inline text-red-300" /> Falhas indicam QR expirado, academia incorreta ou
              formato inválido.
            </p>
            <p>
              <CheckCircle size={16} className="mr-2 inline text-green-300" /> Sucesso confirma que o QR estava dentro do prazo e
              pertence à academia.
            </p>
            <p className="text-xs text-bjj-gray-300">Use este log para auditoria rápida das leituras realizadas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
