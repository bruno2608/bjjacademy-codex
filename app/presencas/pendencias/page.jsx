'use client';

import { Suspense } from 'react';
import PresencasPageContent from '../PresencasContent';

export default function PresencasPendenciasPage() {
  return (
    <Suspense fallback={<div className="p-6 text-bjj-gray-200">Carregando presenças...</div>}>
      <PresencasPageContent lockedView="pendencias" showTabs={false} />
    </Suspense>
  );
}
