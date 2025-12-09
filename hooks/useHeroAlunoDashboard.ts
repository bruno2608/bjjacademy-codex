import { useMemo } from "react"

import { buildHeroAlunoDashboardData } from "@/services/dashboard/heroAlunoDashboardService"
import { useUserStore } from "@/store/userStore"
import type { DashboardAlunoHeroDTO } from "@/types/dashboard-aluno"

export function useHeroAlunoDashboard(): DashboardAlunoHeroDTO | null {
  const user = useUserStore((state) => state.effectiveUser ?? state.user)

  return useMemo(() => buildHeroAlunoDashboardData(user), [user])
}
