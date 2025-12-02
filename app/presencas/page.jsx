'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PresencasIndexRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/presencas/chamada')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-bjj-gray-900/80 p-10 text-center text-bjj-gray-100 ring-1 ring-bjj-gray-800">
      <p className="text-sm uppercase tracking-[0.28em] text-bjj-gray-300">Presenças</p>
      <h1 className="text-2xl font-bold text-white">Redirecionando para o fluxo oficial</h1>
      <p className="text-sm text-bjj-gray-200">Caso não seja redirecionado automaticamente, utilize o atalho abaixo.</p>
      <Link href="/presencas/chamada" className="inline-flex items-center gap-2 rounded-full bg-bjj-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-bjj-blue-900/40 transition hover:-translate-y-0.5">
        Ir para Check-in de Alunos
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
