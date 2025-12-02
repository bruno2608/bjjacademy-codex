'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PresencasRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/presencas/chamada');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-bjj-gray-900/70 text-bjj-gray-200">
      Redirecionando para chamada de presenças...
    </div>
  );
}
