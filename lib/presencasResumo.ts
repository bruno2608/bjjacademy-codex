import type { Aluno } from '@/types/aluno'
import type { PresencaRegistro } from '@/types/presenca'

export type RegistroDoDia = PresencaRegistro & {
  alunoNome: string
  faixaSlug?: string | null
  graus?: number | null
  isPlaceholder?: boolean
}

const normalizarStatus = (status?: string | null) => (status || '').toString().toUpperCase()

const isAtivo = (status?: string | null) => normalizarStatus(status) === 'ATIVO'

export function calcularResumoPresencas(registros: Array<{ status?: string | null }>) {
  const base = { presentes: 0, faltas: 0, pendentes: 0 }
  return registros.reduce(
    (acc, registro) => {
      const status = normalizarStatus(registro.status)
      if (status === 'PRESENTE') acc.presentes += 1
      else if (status === 'PENDENTE') acc.pendentes += 1
      else if (status === 'FALTA' || status === 'JUSTIFICADA') acc.faltas += 1
      return acc
    },
    { ...base }
  )
}

export function comporRegistrosDoDia({
  data,
  presencas,
  alunos,
  sugerirTreino,
}: {
  data: string
  presencas: PresencaRegistro[]
  alunos: Aluno[]
  sugerirTreino?: (data: string, alunoId: string) => { id?: string | null } | null
}): RegistroDoDia[] {
  const registros = presencas
    .filter((item) => item.data === data)
    .map<RegistroDoDia>((item) => ({ ...item, isPlaceholder: false, alunoNome: '', faixaSlug: null, graus: null }))

  const alunosAtivos = alunos.filter((aluno) => isAtivo(aluno.status))
  const alunosComRegistro = new Set(registros.map((item) => item.alunoId))

  const placeholders: RegistroDoDia[] = alunosAtivos
    .filter((aluno) => !alunosComRegistro.has(aluno.id))
    .map((aluno) => {
      const sugestao = sugerirTreino?.(data, aluno.id)
      return {
        id: `placeholder-${aluno.id}-${sugestao?.id || 'principal'}`,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixaSlug: aluno.faixaSlug || aluno.faixa,
        graus: Number.isFinite(Number(aluno.graus)) ? Number(aluno.graus) : 0,
        data,
        treinoId: sugestao?.id || null,
        status: 'FALTA',
        isPlaceholder: true,
      }
    })

  const combinados = [...registros, ...placeholders].map((item) => {
    const aluno = alunos.find((entry) => entry.id === item.alunoId)
    return {
      ...item,
      alunoNome: aluno?.nome || item.alunoNome || 'Aluno não encontrado',
      faixaSlug: item.faixaSlug || aluno?.faixaSlug || aluno?.faixa || null,
      graus: item.graus ?? (aluno?.graus ?? null),
    }
  })

  return combinados.sort((a, b) => a.alunoNome.localeCompare(b.alunoNome, 'pt-BR'))
}
