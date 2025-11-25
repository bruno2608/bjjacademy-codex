import { useMemo, useState } from 'react'

import { Activity, BarChart2, BarChart3, CalendarCheck, Clock3, Medal, PieChart, ShieldCheck, TrendingUp, Users } from 'lucide-react'

import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'
import { useTreinosStore } from '@/store/treinosStore'
import { confirmarPresenca, marcarAusencia } from '@/services/presencasService'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCurrentInstrutor } from '@/hooks/useCurrentInstrutor'

export interface ProfessorDashboardData {
  instructorName: string
  faixaSlug: string
  faixaConfig: ReturnType<typeof getFaixaConfigBySlug>
  graus: number
  avatarUrl: string
  metrics: { totalAlunos: number; ativos: number; inativos: number; graduados: number; pendentes: number; presentesSemana: number }
  tabCards: Record<
    'visao' | 'alunos' | 'presencas' | 'graduacoes',
    { title: string; value: number | string; icon: any; tone: string }[]
  >
  treinoPorId: Map<string, { id: string; nome: string; hora?: string }>
  pendentes: ReturnType<typeof usePresencasStore>['presencas']
  presencas: ReturnType<typeof usePresencasStore>['presencas']
  treinos: ReturnType<typeof useTreinosStore>['treinos']
  alunos: ReturnType<typeof useAlunosStore>['alunos']
  getAlunoById: ReturnType<typeof useAlunosStore>['getAlunoById']
  activeTab: string
  setActiveTab: (value: string) => void
  handleStatusChange: (id: string, action: 'approve' | 'reject') => Promise<void>
  updatingId: string | null
}

export function useProfessorDashboard(): ProfessorDashboardData {
  const { user } = useCurrentUser()
  const { aluno: alunoAtual } = useCurrentAluno()
  const { instrutor } = useCurrentInstrutor()
  const presencas = usePresencasStore((state) => state.presencas)
  const alunos = useAlunosStore((state) => state.alunos)
  const getAlunoById = useAlunosStore((state) => state.getAlunoById)
  const treinos = useTreinosStore((state) => state.treinos)
  const [activeTab, setActiveTab] = useState('visao')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const instructorName = alunoAtual?.nome || instrutor?.nome || user?.nomeCompleto || 'Instrutor'
  const faixaSlug = normalizeFaixaSlug(alunoAtual?.faixaSlug || alunoAtual?.faixa || instrutor?.faixaSlug) || 'branca-adulto'
  const faixaConfig = getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto')
  const graus = typeof alunoAtual?.graus === 'number' ? alunoAtual.graus : instrutor?.graus ?? faixaConfig?.grausMaximos ?? 0
  const avatarUrl = alunoAtual?.avatarUrl || instrutor?.avatarUrl || user?.avatarUrl || ''

  const treinoPorId = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; hora?: string }>()
    treinos.forEach((treino) => map.set(treino.id, treino))
    return map
  }, [treinos])

  const metrics = useMemo(() => {
    const totalAlunos = alunos.length
    const ativos = alunos.filter((a) => (a.status || '').toString().toUpperCase() === 'ATIVO').length
    const inativos = totalAlunos - ativos
    const graduados = alunos.filter((a) => (a.faixa || '').toLowerCase() !== 'branca').length
    const pendentes = presencas.filter((p) => p.status === 'PENDENTE').length
    const presentesSemana = presencas.filter((p) => p.status === 'PRESENTE').length
    return { totalAlunos, ativos, inativos, graduados, pendentes, presentesSemana }
  }, [alunos, presencas])

  const tabCards = useMemo(
    () => ({
      visao: [
        { title: 'Presenças hoje', value: metrics.presentesSemana, icon: CalendarCheck, tone: 'text-green-300' },
        { title: 'Registros pendentes', value: metrics.pendentes, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Faixas em progresso', value: metrics.graduados, icon: Medal, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.ativos, icon: Users, tone: 'text-bjj-red' }
      ],
      alunos: [
        { title: 'Total de alunos', value: metrics.totalAlunos, icon: Users, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.ativos, icon: Activity, tone: 'text-green-300' },
        { title: 'Inativos', value: metrics.inativos, icon: BarChart2, tone: 'text-yellow-300' },
        { title: 'Últimas matrículas', value: 4, icon: TrendingUp, tone: 'text-bjj-red' }
      ],
      presencas: [
        { title: 'Presenças na semana', value: metrics.presentesSemana, icon: CalendarCheck, tone: 'text-green-300' },
        { title: 'Pendentes de aprovação', value: metrics.pendentes, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Ausências', value: presencas.filter((p) => p.status === 'FALTA').length, icon: BarChart3, tone: 'text-bjj-red' },
        { title: 'Check-ins registrados', value: presencas.length, icon: Activity, tone: 'text-white' }
      ],
      graduacoes: [
        { title: 'Próximas graduações', value: alunos.filter((a) => a.proximaMeta).length || 6, icon: Medal, tone: 'text-white' },
        { title: 'Faixas avançadas', value: metrics.graduados, icon: ShieldCheck, tone: 'text-bjj-red' },
        { title: 'Tempo médio na faixa', value: '14 meses', icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Relatórios emitidos', value: 12, icon: PieChart, tone: 'text-green-300' }
      ]
    }),
    [alunos, metrics, presencas]
  )

  const handleStatusChange = async (id: string, action: 'approve' | 'reject') => {
    if (!id) return
    setUpdatingId(id)
    try {
      if (action === 'approve') {
        await confirmarPresenca(id)
      } else {
        await marcarAusencia(id)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const pendentes = useMemo(() => presencas.filter((p) => p.status === 'PENDENTE'), [presencas])

  return {
    instructorName,
    faixaSlug,
    faixaConfig,
    graus,
    avatarUrl,
    metrics,
    tabCards,
    treinoPorId,
    pendentes,
    presencas,
    treinos,
    alunos,
    getAlunoById,
    activeTab,
    setActiveTab,
    handleStatusChange,
    updatingId
  }
}
