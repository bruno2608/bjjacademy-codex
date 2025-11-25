export interface Treino {
  id: string
  academiaId: string
  data: string // ISO date: "2025-11-24"
  horaInicio: string // por ex: "18:30"
  horaFim?: string
  titulo: string // "Treino Adulto", "No-Gi", etc.
  ativo: boolean
  // Campos legados (mantidos para compatibilidade com telas atuais)
  nome?: string
  diaSemana?: string
  hora?: string
  tipo?: string
}
