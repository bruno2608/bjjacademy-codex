'use client'

import { useEffect, useMemo } from 'react'
import { AlertTriangle, CalendarDays, Trash2 } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

const formatDia = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function RevisaoPresencasPage() {
  const presencas = usePresencasStore((state) => state.presencas)
  const listarUltimos30Dias = usePresencasStore((state) => state.listarUltimos30Dias)
  const excluirPresenca = usePresencasStore((state) => state.excluirPresenca)
  const alunos = useAlunosStore((state) => state.alunos)

  useEffect(() => {
    listarUltimos30Dias()
  }, [listarUltimos30Dias])

  const grupos = useMemo(() => {
    const limite = new Date()
    limite.setDate(limite.getDate() - 30)
    const agrupado = presencas.reduce((acc, presenca) => {
      if (!presenca.data) return acc
      if (new Date(presenca.data) < limite) return acc
      const lista = acc[presenca.data] || []
      lista.push(presenca)
      acc[presenca.data] = lista
      return acc
    }, {})

    return Object.entries(agrupado)
      .map(([data, lista]) => ({ data, registros: lista.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')) }))
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [presencas])

  const alunoNome = (id) => alunos.find((aluno) => aluno.id === id)?.nome || 'Aluno'

  const handleExcluir = async (id) => {
    const confirmado = window.confirm('Deseja excluir este registro de presença?')
    if (!confirmado) return
    await excluirPresenca(id)
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Revisão de Presenças</h1>
        <p className="text-sm text-bjj-gray-300">Revise e corrija presenças registradas (últimos 30 dias)</p>
      </header>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/60 bg-amber-500/10 p-4 text-sm text-amber-100">
        <AlertTriangle size={18} />
        <div>
          <p className="font-semibold">Atenção ao revisar presenças</p>
          <p className="text-amber-100/90">Alterações manuais devem ser feitas com cuidado. As presenças excluídas não poderão ser recuperadas.</p>
        </div>
      </div>

      {grupos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-950/60 p-8 text-center text-bjj-gray-300">
          <CalendarDays className="text-bjj-gray-400" />
          <p className="text-sm">Nenhuma presença registrada ainda para os últimos 30 dias.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grupos.map((grupo) => (
            <div key={grupo.data} className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-bjj-gray-200">
                  <CalendarDays size={18} className="text-bjj-gray-100" />
                  <span className="font-semibold capitalize">{formatDia(grupo.data)}</span>
                </div>
                <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bjj-gray-200">
                  {grupo.registros.length} presenças
                </span>
              </div>

              <div className="space-y-3">
                {grupo.registros.map((registro) => (
                  <div
                    key={registro.id}
                    className="flex items-center justify-between rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-3 text-sm text-bjj-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bjj-gray-800 text-sm font-semibold text-white">
                        {alunoNome(registro.alunoId)[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{alunoNome(registro.alunoId)}</p>
                        <p className="text-xs text-bjj-gray-400">{registro.updatedAt ? new Date(registro.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                        <p className="text-xs text-bjj-gray-400">Origem: {registro.origem === 'PROFESSOR' ? 'Sistema' : 'Manual'}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:bg-red-600/15"
                      onClick={() => handleExcluir(registro.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
