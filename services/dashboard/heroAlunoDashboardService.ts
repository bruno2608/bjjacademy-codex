import { mockDb } from "@/data/mocks/db"
import type { DashboardAlunoHeroDTO } from "@/types/dashboard-aluno"
import type { AuthUser } from "@/types/user"

type StatusAuth = AuthUser["status"] | undefined

const mapStatusToMatricula = (status: StatusAuth): DashboardAlunoHeroDTO["aluno"]["statusMatricula"] => {
  if (status === "inactive") return "INATIVO"
  if (status === "invited") return "TRANCADO"
  return "ATIVO"
}

const normalizeDate = (value?: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const presencaDateString = (data?: string, createdAt?: string) => data || createdAt || null

const normalizeFaixaVisualSlug = (slug?: string | null) => {
  const lower = (slug || "branca-adulto").toString().toLowerCase()
  if (lower.includes("preta-professor")) return "preta-professor"
  if (lower.includes("preta")) return "preta-padrao"
  if (lower.includes("branca")) return "branca-adulto"
  if (lower.includes("azul")) return "azul"
  if (lower.includes("roxa")) return "roxa"
  if (lower.includes("marrom")) return "marrom"
  return lower.replace("-adulto", "").replace("-infantil", "")
}

const FAIXA_NOME_BY_SLUG: Record<string, string> = {
  "branca-adulto": "Faixa Branca",
  azul: "Faixa Azul",
  roxa: "Faixa Roxa",
  marrom: "Faixa Marrom",
  "preta-padrao": "Faixa Preta",
  "preta-professor": "Faixa Preta Professor",
}

export function buildHeroAlunoDashboardData(user: AuthUser | null | undefined): DashboardAlunoHeroDTO | null {
  if (!user) return null

  const alunoId = user.alunoId || user.id
  const academia = mockDb.academias.find((a) => a.id === user.academiaId) ?? null

  const faixaSlug = normalizeFaixaVisualSlug(user.faixaAtualSlug)
  const grauAtual = user.grauAtual ?? 0

  const regra =
    mockDb.regrasGraduacao.find(
      (regra) => regra.faixaSlug === faixaSlug && regra.grau === grauAtual,
    ) ?? null

  const presencasDoAluno = mockDb.presencas.filter((p) => p.alunoId === alunoId)
  const presencasOrdenadas = [...presencasDoAluno].sort((a, b) => {
    const da = normalizeDate(presencaDateString(a.data, a.createdAt))?.getTime() ?? 0
    const db = normalizeDate(presencaDateString(b.data, b.createdAt))?.getTime() ?? 0
    return db - da
  })

  const now = new Date()
  const treinosMesAtual = presencasDoAluno.filter((p) => {
    const date = normalizeDate(presencaDateString(p.data, p.createdAt))
    if (!date) return false
    return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth()
  }).length

  const ultimaPresenca = presencasOrdenadas[0] ?? null
  const ultimaAula = ultimaPresenca?.aulaId
    ? mockDb.aulas.find((a) => a.id === ultimaPresenca.aulaId)
    : null
  const turmaDaUltimaAula = ultimaAula
    ? mockDb.turmas.find((t) => t.id === ultimaAula.turmaId)
    : null

  const aulasNoGrau = presencasDoAluno.length
  const aulasMetaNoGrau = regra?.metaAulasNoGrau ?? regra?.aulasMinimas ?? 0

  const aluno: DashboardAlunoHeroDTO["aluno"] = {
    id: alunoId,
    nome: user.nomeCompleto || user.name || user.username || "Aluno",
    avatarUrl: user.avatarUrl ?? null,
    statusMatricula: mapStatusToMatricula(user.status),
    academiaNome: academia?.nome ?? "Academia",
    academiaCidade: academia?.cidade ?? null,
    desde: "2023-01-01",
  }

  const faixaNome = FAIXA_NOME_BY_SLUG[faixaSlug] || `Faixa ${faixaSlug}`

  const faixa: DashboardAlunoHeroDTO["faixa"] = {
    slug: faixaSlug,
    nome: faixaNome,
    categoria: "ADULTO",
    grauAtual: grauAtual,
    grausMaximos: regra?.metaAulasNoGrau ? (faixaSlug.includes("preta") ? 6 : 4) : 4,
    aulasNoGrau,
    aulasMetaNoGrau,
  }

  const metricas: DashboardAlunoHeroDTO["metricas"] = {
    treinosMesAtual,
    ultimoTreino: ultimaPresenca
      ? {
          dataHora: presencaDateString(ultimaPresenca.data, ultimaPresenca.createdAt) ?? "",
          turmaNome: turmaDaUltimaAula?.nome || ultimaAula?.turmaId || ultimaPresenca.turmaId || undefined,
        }
      : null,
  }

  return { aluno, faixa, metricas }
}
