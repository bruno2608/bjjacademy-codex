'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays, GraduationCap, UserRound, UsersRound } from 'lucide-react'

import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip'
import { useAlunoDetalhesStaff } from '@/hooks/useAlunoDetalhesStaff'
import type { HistoricoGraduacaoResumo, PresencaResumo, ProximaGraduacaoResumo } from '@/hooks/useAlunoDetalhesStaff'
import { cn } from '@/lib/utils'
import type { BjjBeltVisualConfig } from '@/types/bjjBelt'
import type { ReactNode } from 'react'

const formatDate = (value?: string | null) => {
  if (!value) return 'Data não informada'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 'Data não informada' : parsed.toLocaleDateString('pt-BR')
}

const PresencaStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PRESENTE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    FALTA: 'bg-red-500/10 text-red-300 border-red-500/40',
    JUSTIFICADA: 'bg-amber-500/10 text-amber-200 border-amber-500/40',
    PENDENTE: 'bg-sky-500/10 text-sky-200 border-sky-500/40'
  }
  return (
    <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide', styles[status] || '')}>
      {status}
    </span>
  )
}

const CardShell = ({ children }: { children: ReactNode }) => (
  <section className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/60 p-4 shadow-[0_14px_38px_-18px_rgba(0,0,0,0.6)] md:p-5">
    {children}
  </section>
)

const AlunoHeader = ({
  nome,
  faixaConfig,
  grauAtual,
  matriculaStatus,
  dataInicio
}: {
  nome: string
  faixaConfig: BjjBeltVisualConfig | null
  grauAtual: number
  matriculaStatus: string
  dataInicio?: string | null
}) => {
  const statusColor = matriculaStatus.toLowerCase() === 'ativo' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-200 bg-amber-500/10 border-amber-500/40'
  return (
    <CardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bjj-gray-300/70">Ficha do aluno</p>
            <h1 className="text-2xl font-semibold text-bjj-white md:text-3xl">{nome}</h1>
            <p className="text-sm text-bjj-gray-200/80">Visão consolidada para o professor: faixa, presença e evolução.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={cn('flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold', statusColor)}>
              <UserRound size={14} />
              {matriculaStatus || 'Status não informado'}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              <CalendarDays size={14} /> Início {formatDate(dataInicio)}
            </span>
          </div>
        </div>

        {faixaConfig && (
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <BjjBeltStrip config={faixaConfig} grauAtual={grauAtual} className="scale-[0.96] md:scale-100" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70">Faixa atual</p>
            <p className="text-lg font-semibold text-bjj-white">{faixaConfig?.nome ?? '—'}</p>
            <p className="text-sm text-bjj-gray-300/70">{grauAtual}º grau</p>
          </div>
          <div className="rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70">Categoria</p>
            <p className="text-lg font-semibold text-bjj-white">{faixaConfig?.categoria ?? 'Adulto'}</p>
            <p className="text-sm text-bjj-gray-300/70">Visualização alinhada ao dashboard</p>
          </div>
          <div className="rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70">Grau máximo</p>
            <p className="text-lg font-semibold text-bjj-white">{faixaConfig?.grausMaximos ?? 0}</p>
            <p className="text-sm text-bjj-gray-300/70">Regras via BJJ Belt helpers</p>
          </div>
          <div className="rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70">Matrícula</p>
            <p className="text-lg font-semibold text-bjj-white">{matriculaStatus || '—'}</p>
            <p className="text-sm text-bjj-gray-300/70">Controle centralizado via store</p>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

const PresencasCard = ({
  resumo,
  treinosMap,
  alunoId
}: {
  resumo: PresencaResumo
  treinosMap: Map<string, { id: string; nome: string; hora?: string }>
  alunoId: string
}) => {
  const cards = [
    { label: 'Presentes', value: resumo.presentes, color: 'text-emerald-300' },
    { label: 'Faltas', value: resumo.faltas, color: 'text-red-300' },
    { label: 'Justificadas', value: resumo.justificadas, color: 'text-amber-200' },
    { label: 'Pendentes', value: resumo.pendentes, color: 'text-sky-200' }
  ]

  return (
    <CardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-bjj-gray-200/70">
            <UsersRound size={18} /> Presenças recentes ({resumo.referenciaDias} dias)
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-semibold text-bjj-white md:text-3xl">
                {typeof resumo.percentual === 'number' ? `${resumo.percentual}%` : '—'}
              </p>
              <p className="text-sm text-bjj-gray-300/70">Taxa de presença</p>
            </div>
            <Link
              href={`/historico-presencas?alunoId=${alunoId}`}
              className="btn btn-sm rounded-full border-bjj-gray-700 bg-bjj-gray-800 text-bjj-gray-100 hover:border-bjj-gray-500"
            >
              Ver histórico completo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">{card.label}</p>
              <p className={cn('text-xl font-semibold', card.color)}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-bjj-gray-100">Últimas aulas</p>
          <div className="space-y-3">
            {resumo.ultimas.map((presenca) => {
              const treino = treinosMap.get(presenca.treinoId)
              return (
                <div
                  key={presenca.id}
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-bjj-white">{treino?.nome || 'Sessão registrada'}</p>
                    <p className="text-xs text-bjj-gray-300/80">
                      {formatDate(presenca.data)} {treino?.hora ? `· ${treino.hora}` : ''}
                    </p>
                  </div>
                  <PresencaStatusBadge status={presenca.status} />
                </div>
              )
            })}
            {resumo.ultimas.length === 0 && (
              <p className="text-sm text-bjj-gray-300/70">Nenhuma presença registrada recentemente.</p>
            )}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

const ProximaGraduacaoCard = ({ graduacao }: { graduacao: ProximaGraduacaoResumo | null }) => {
  if (!graduacao) {
    return (
      <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-300/80">
        Nenhuma próxima graduação estimada no momento.
      </div>
    )
  }

  const destinoLabel =
    graduacao.tipo === 'Faixa'
      ? `${graduacao.faixaAtual} → ${graduacao.proximaFaixa || graduacao.proximaFaixaSlug || graduacao.faixaAtual}`
      : `${graduacao.grauDestino ?? graduacao.grauAlvo ?? ''}º grau em ${graduacao.faixaAtual}`

  const progresso = typeof graduacao.progressoPercentual === 'number' ? graduacao.progressoPercentual : null
  const safeProgress = Math.min(100, Math.max(0, progresso ?? 0))

  return (
    <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Próxima graduação</p>
            <p className="text-lg font-semibold text-bjj-white">{destinoLabel}</p>
            <p className="text-xs text-bjj-gray-300/70">Prevista para {graduacao.dataPrevista ? formatDate(graduacao.dataPrevista) : '—'}</p>
          </div>
          <span className="rounded-full border border-bjj-gray-700 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
            {graduacao.tipo}
          </span>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-bjj-gray-200/80">
            <span>Progresso</span>
            <span className="font-semibold text-bjj-white">{progresso != null ? `${safeProgress}%` : '—'}</span>
          </div>
          <div className="h-2 rounded-full bg-bjj-gray-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-bjj-red/70 via-bjj-red to-bjj-red"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
          <p className="text-xs text-bjj-gray-300/70">
            {graduacao.aulasFeitas ?? 0} aulas registradas {graduacao.aulasMeta ? `de ${graduacao.aulasMeta}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

const HistoricoGraduacoesList = ({ historico }: { historico: HistoricoGraduacaoResumo[] }) => (
  <div className="space-y-3">
    <p className="text-sm font-semibold text-bjj-gray-100">Histórico recente</p>
    <div className="space-y-3">
      {historico.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-1 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-bjj-white">{item.titulo}</p>
            <span className="rounded-full border border-bjj-gray-700 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              {item.tipo}
            </span>
          </div>
          <p className="text-xs text-bjj-gray-300/80">{formatDate(item.data)}</p>
          {item.instrutor && <p className="text-xs text-bjj-gray-300/80">Instrutor: {item.instrutor}</p>}
        </div>
      ))}
      {historico.length === 0 && <p className="text-sm text-bjj-gray-300/70">Nenhum registro recente de graduação.</p>}
    </div>
  </div>
)

const EvolucaoCard = ({
  proxima,
  historico,
  alunoId
}: {
  proxima: ProximaGraduacaoResumo | null
  historico: HistoricoGraduacaoResumo[]
  alunoId: string
}) => (
  <CardShell>
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-bjj-gray-200/70">
          <GraduationCap size={18} /> Evolução do aluno
        </div>
        <Link
          href={`/graduacoes?alunoId=${alunoId}`}
          className="btn btn-sm rounded-full border-bjj-gray-700 bg-bjj-gray-800 text-bjj-gray-100 hover:border-bjj-gray-500"
        >
          Ver tela completa de graduações
        </Link>
      </div>

      <ProximaGraduacaoCard graduacao={proxima} />
      <HistoricoGraduacoesList historico={historico} />
    </div>
  </CardShell>
)

export default function AlunoDetalheStaffPage() {
  const router = useRouter()
  const params = useParams()
  const alunoId = params?.id as string
  const { aluno, faixaConfig, grauAtual, matriculaPrincipal, resumoPresencas, proximaGraduacao, historicoGraduacoes, treinosMap } =
    useAlunoDetalhesStaff(alunoId)

  if (!aluno) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          className="btn btn-sm btn-ghost inline-flex items-center gap-2 rounded-full border border-bjj-gray-700 text-bjj-gray-100"
          onClick={() => router.push('/alunos')}
        >
          <ArrowLeft size={16} /> Voltar para lista
        </button>
        <p className="text-sm text-bjj-red">Aluno não encontrado.</p>
      </div>
    )
  }

  const matriculaStatus = matriculaPrincipal?.status ?? aluno.status ?? 'ativo'

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn btn-sm btn-ghost inline-flex items-center gap-2 rounded-full border border-bjj-gray-700 text-bjj-gray-100"
          onClick={() => router.push('/alunos')}
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <Link
          href={`/dashboard?alunoId=${aluno.id}`}
          className="btn btn-sm rounded-full border-bjj-gray-700 bg-bjj-gray-800 text-bjj-gray-100 hover:border-bjj-gray-500"
        >
          Ver aluno como aluno
        </Link>
      </div>

      <AlunoHeader
        nome={aluno.nomeCompleto || aluno.nome}
        faixaConfig={faixaConfig}
        grauAtual={grauAtual}
        matriculaStatus={matriculaStatus}
        dataInicio={matriculaPrincipal?.dataInicio || aluno.dataInicio}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <PresencasCard resumo={resumoPresencas} treinosMap={treinosMap} alunoId={aluno.id} />
        <EvolucaoCard proxima={proximaGraduacao} historico={historicoGraduacoes} alunoId={aluno.id} />
      </div>
    </div>
  )
}
