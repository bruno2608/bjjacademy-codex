import { NextResponse } from 'next/server';

import { MOCK_GRADUACOES } from '@/data/mockGraduacoes';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const alunoId = url.searchParams.get('aluno_id');

  const graduacoes = Array.isArray(MOCK_GRADUACOES) ? [...MOCK_GRADUACOES] : [];
  const filtradas = alunoId ? graduacoes.filter((item) => item.alunoId === alunoId) : graduacoes;

  return NextResponse.json({ graduacoes: filtradas });
}
