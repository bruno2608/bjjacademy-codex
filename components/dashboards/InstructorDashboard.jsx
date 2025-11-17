'use client';

import PageHero from '../ui/PageHero';

export default function InstructorDashboard() {
  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Dashboard do Instrutor"
        title="Visão rápida da turma"
        description="Acompanhe presenças do dia e navegue para registro manual, regras e horários."
      />
      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-6 text-sm text-bjj-gray-200/80">
        Utilize o menu para registrar presenças, revisar regras e horários. Métricas detalhadas podem ser adicionadas quando a API estiver ativa.
      </div>
    </div>
  );
}
