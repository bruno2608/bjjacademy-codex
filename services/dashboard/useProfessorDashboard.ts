import { useMemo, useState } from 'react'

import { Activity, BarChart2, BarChart3, CalendarCheck, Clock3, Medal, PieChart, ShieldCheck, TrendingUp, Users } from 'lucide-react'

import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { useCurrentInstrutor } from '@/hooks/useCurrentInstrutor'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAlunosStore } from '@/store/alunosStore'
import { useGraduacoesStore } from '@/store/graduacoesStore'
import { usePresencasStore } from '@/store/presencasStore'
import { useTreinosStore } from '@/store/treinosStore'
import type { BjjBeltVisualConfig } from '@/types/bjjBelt'

type PendingCheckin = {
  id: string
  alunoId: string
  alunoNome: string
  treinoId: string
  treinoNome: string
  treinoHora?: string
  dataLabel: string
}

type CheckinsPorStatus = {
  confirmados: number
  pendentes: number
  faltas: number
}

type SerieSemanal = { dia: string; total: number }

export interface ProfessorDashboardData {
  instructorName: string
  faixaConfig: BjjBeltVisualConfig
  graus: number
  avatarUrl: string
  statusLabel: string

  overviewCards: { label: string; value: number; icon: any; href: string }[]
  semanaCards: { label: string; value: number; icon: any; href: string }[]
  tabCards: Record<
    'visao' | 'alunos' | 'presencas' | 'graduacoes',
    { title: string; value: number | string; icon: any; tone: string }[]
  >

  analytics: {
    checkinsPorStatus: CheckinsPorStatus
    presencasNaSemana: SerieSemanal[]
  }

  pendencias: PendingCheckin[]
  pendentesTotal: number

  activeTab: string
  setActiveTab: (value: string) => void
  handleStatusChange: (id: string, action: 'approve' | 'reject') => Promise<void>
  updatingId: string | null
}

const parseDate = (value?: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const isSameWeek = (value: string | undefined, start: Date, end: Date) => {
  const date = parseDate(value)
  if (!date) return false
  return date >= start && date < end
}

const startOfCurrentWeek = () => {
  const today = new Date()
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  const day = start.getDay()
  const diff = (day + 6) % 7 // Monday as first day
  start.setDate(start.getDate() - diff)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

const normalizarStatus = (status?: string | null) => (status || '').toString().toUpperCase()

const getAlunoNome = (id: string, alunos: ReturnType<typeof useAlunosStore.getState>['alunos']) =>
  alunos.find((a) => a.id === id)?.nome || 'Aluno não encontrado'

export function useProfessorDashboard(): ProfessorDashboardData {
  const { user } = useCurrentUser()
  const { aluno: alunoAtual } = useCurrentAluno()
  const { instrutor } = useCurrentInstrutor()
  const presencas = usePresencasStore((state) => state.presencas)
  const atualizarStatus = usePresencasStore((state) => state.atualizarStatus)
  const alunos = useAlunosStore((state) => state.alunos)
  const treinos = useTreinosStore((state) => state.treinos)
  const graduacoes = useGraduacoesStore((state) => state.graduacoes)
  const [activeTab, setActiveTab] = useState('visao')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const perfilInstrutor = instrutor || null
  const perfilAlunoFallback = !perfilInstrutor ? alunoAtual : null
  const profile = perfilInstrutor || perfilAlunoFallback || null

  const faixaSlug = normalizeFaixaSlug(profile?.faixaSlug || (perfilAlunoFallback?.faixa ?? '')) || 'branca-adulto'
  const faixaConfig = getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto')!
  const graus = typeof profile?.graus === 'number' ? profile.graus : faixaConfig?.grausMaximos ?? 0

  const instructorName = profile?.nomeCompleto || profile?.nome || user?.nomeCompleto || 'Instrutor'
  const avatarUrl = profile?.avatarUrl || user?.avatarUrl || ''
  const statusLabel = normalizarStatus(profile?.status) || 'ATIVO'

  const treinoPorId = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; hora?: string; data?: string }>()
    treinos.forEach((treino) => map.set(treino.id, treino))
    return map
  }, [treinos])

  const { start, end } = useMemo(() => startOfCurrentWeek(), [])

  const presencasSemana = useMemo(
    () => presencas.filter((p) => isSameWeek(p.data, start, end)),
    [end, presencas, start]
  )

  const checkinsPorStatus = useMemo<CheckinsPorStatus>(() => {
    const base = { confirmados: 0, pendentes: 0, faltas: 0 }
    return presencas.reduce((acc, item) => {
      const status = normalizarStatus(item.status)
      if (status === 'PRESENTE') acc.confirmados += 1
      else if (status === 'PENDENTE') acc.pendentes += 1
      else if (status === 'FALTA' || status === 'JUSTIFICADA') acc.faltas += 1
      return acc
    }, base)
  }, [presencas])

  const alunosAtivos = useMemo(
    () => alunos.filter((a) => normalizarStatus(a.status) === 'ATIVO').length,
    [alunos]
  )

  const presencasNaSemana = useMemo<SerieSemanal[]>(() => {
    const labels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
    const counts = Array(7).fill(0) as number[]
    presencasSemana.forEach((p) => {
      const data = parseDate(p.data)
      if (!data) return
      const idx = (data.getDay() + 6) % 7 // Monday index 0
      counts[idx] += 1
    })
    return counts.map((total, idx) => ({ dia: labels[idx], total }))
  }, [presencasSemana])

  const pendencias = useMemo<PendingCheckin[]>(() => {
    return presencas
      .filter((p) => normalizarStatus(p.status) === 'PENDENTE')
      .map((item) => {
        const alunoNome = getAlunoNome(item.alunoId, alunos)
        const treino = treinoPorId.get(item.treinoId)
        const dataLabel = item.data
          ? new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
          : 'Sem data'
        return {
          id: item.id,
          alunoId: item.alunoId,
          alunoNome,
          treinoId: item.treinoId,
          treinoNome: treino?.nome || treino?.titulo || 'Treino',
          treinoHora: treino?.hora || treino?.horaInicio,
          dataLabel,
        }
      })
  }, [alunos, presencas, treinoPorId])

  const metrics = useMemo(() => {
    const totalAlunos = alunos.length
    const graduacoesTotal = graduacoes.length
    const aulasNaSemana = treinos.filter((treino) => isSameWeek(treino.data, start, end)).length
    const historicoSemana = presencasSemana.length
    const checkinsRegistradosSemana = presencasSemana.filter((p) => normalizarStatus(p.status) !== 'FALTA').length

    return {
      totalAlunos,
      alunosAtivos,
      graduacoesTotal,
      pendentesAprovacao: checkinsPorStatus.pendentes,
      aulasNaSemana,
      historicoSemana,
      checkinsRegistradosSemana,
    }
  }, [alunos.length, alunosAtivos, checkinsPorStatus.pendentes, graduacoes.length, presencasSemana, treinos, start, end])

  const overviewCards = useMemo(
    () => [
      { label: 'Pendentes de aprovação', value: metrics.pendentesAprovacao, icon: Clock3, href: '/presencas' },
      { label: 'Alunos ativos', value: metrics.alunosAtivos, icon: Activity, href: '/alunos' },
      { label: 'Graduações', value: metrics.graduacoesTotal, icon: Medal, href: '/configuracoes/graduacao' },
    ],
    [metrics.alunosAtivos, metrics.graduacoesTotal, metrics.pendentesAprovacao]
  )

  const semanaCards = useMemo(
    () => [
      { label: 'Aulas na semana', value: metrics.aulasNaSemana, icon: CalendarCheck, href: '/presencas' },
      { label: 'Histórico na semana', value: metrics.historicoSemana, icon: BarChart3, href: '/historico-presencas' },
      { label: 'Total de alunos', value: metrics.totalAlunos, icon: Users, href: '/alunos' },
      { label: 'Check-ins registrados', value: metrics.checkinsRegistradosSemana, icon: Activity, href: '/presencas' },
    ],
    [metrics.aulasNaSemana, metrics.checkinsRegistradosSemana, metrics.historicoSemana, metrics.totalAlunos]
  )

  const tabCards = useMemo(
    () => ({
      visao: [
        { title: 'Presenças semanais', value: metrics.historicoSemana, icon: CalendarCheck, tone: 'text-green-300' },
        { title: 'Registros pendentes', value: metrics.pendentesAprovacao, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Faixas em progresso', value: metrics.graduacoesTotal, icon: Medal, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.alunosAtivos, icon: Users, tone: 'text-bjj-red' },
      ],
      alunos: [
        { title: 'Total de alunos', value: metrics.totalAlunos, icon: Users, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.alunosAtivos, icon: Activity, tone: 'text-green-300' },
        { title: 'Inativos', value: Math.max(metrics.totalAlunos - metrics.alunosAtivos, 0), icon: BarChart2, tone: 'text-yellow-300' },
        { title: 'Últimas matrículas', value: 4, icon: TrendingUp, tone: 'text-bjj-red' },
      ],
      presencas: [
        { title: 'Check-ins registrados', value: metrics.checkinsRegistradosSemana, icon: Activity, tone: 'text-white' },
        { title: 'Pendentes de aprovação', value: metrics.pendentesAprovacao, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Ausências', value: checkinsPorStatus.faltas, icon: BarChart3, tone: 'text-bjj-red' },
        { title: 'Presenças na semana', value: metrics.historicoSemana, icon: CalendarCheck, tone: 'text-green-300' },
      ],
      graduacoes: [
        { title: 'Próximas graduações', value: graduacoes.length, icon: Medal, tone: 'text-white' },
        { title: 'Faixas avançadas', value: metrics.graduacoesTotal, icon: ShieldCheck, tone: 'text-bjj-red' },
        { title: 'Tempo médio na faixa', value: '14 meses', icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Relatórios emitidos', value: 12, icon: PieChart, tone: 'text-green-300' },
      ],
    }),
    [checkinsPorStatus.faltas, graduacoes.length, metrics]
  )

  const handleStatusChange = async (id: string, action: 'approve' | 'reject') => {
    if (!id) return
    setUpdatingId(id)
    try {
      await atualizarStatus(id, action === 'approve' ? 'PRESENTE' : 'FALTA')
    } finally {
      setUpdatingId(null)
    }
  }

  return {
    instructorName,
    faixaConfig,
    graus,
    avatarUrl,
    statusLabel,
    overviewCards,
    semanaCards,
    tabCards,
    analytics: { checkinsPorStatus, presencasNaSemana },
    pendencias,
    pendentesTotal: metrics.pendentesAprovacao,
    activeTab,
    setActiveTab,
    handleStatusChange,
    updatingId,
  }
}
