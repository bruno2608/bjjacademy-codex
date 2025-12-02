'use client';

import { Suspense } from 'react';
import GraduacoesStaffPageContent from '../GraduacoesStaffContent';

export default function GraduacoesHistoricoPage() {
  return (
    <Suspense fallback={<div className="p-6 text-bjj-gray-200">Carregando graduações...</div>}>
      <GraduacoesStaffPageContent defaultView="historico" showTabs={false} />
    </Suspense>
  );
}
