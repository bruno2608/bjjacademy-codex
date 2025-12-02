'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GraduacoesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/graduacoes/proximas');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-bjj-gray-900/70 text-bjj-gray-200">
      Redirecionando para graduações...
    </div>
  );
}
