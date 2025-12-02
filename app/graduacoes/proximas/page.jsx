'use client'

import { Suspense } from 'react'

import { GraduacoesStaffPageContent } from '../GraduacoesStaffPageContent'

export default function GraduacoesProximasPage() {
  return (
    <Suspense fallback={<div className="p-6 text-bjj-gray-200">Carregando graduações...</div>}>
      <GraduacoesStaffPageContent forcedView="proximas" showTabs={false} />
    </Suspense>
  )
}
