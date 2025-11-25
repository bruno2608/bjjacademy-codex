import { useStaffDashboard } from './useStaffDashboard'
export type { StaffDashboardData as ProfessorDashboardData } from './useStaffDashboard'

export function useProfessorDashboard() {
  return useStaffDashboard()
}
