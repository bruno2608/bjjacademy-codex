/**
 * Serviço de alunos usando o mockRequest para simular operações CRUD.
 * Em uma futura integração basta substituir as chamadas pelo fetch real.
 */
import { mockRequest } from './api';
import useUserStore from '../store/userStore';

const normalizeAluno = (aluno) => ({
  ...aluno,
  faixa: aluno.faixa || 'Branca',
  graus: Number(aluno.graus ?? 0),
  mesesNaFaixa: Number(aluno.mesesNaFaixa ?? 0),
  dataUltimaGraduacao: aluno.dataUltimaGraduacao || null
});

export async function getAlunos() {
  const { alunos } = useUserStore.getState();
  return mockRequest(alunos);
}

export async function createAluno(aluno) {
  const { alunos, setAlunos } = useUserStore.getState();
  const novoAluno = { ...normalizeAluno(aluno), id: String(Date.now()) };
  setAlunos([...alunos, novoAluno]);
  return mockRequest(novoAluno);
}

export async function updateAluno(id, aluno) {
  const { alunos, setAlunos, syncAlunoReferencias } = useUserStore.getState();
  const dadosNormalizados = normalizeAluno(aluno);
  const atualizados = alunos.map((item) => (item.id === id ? { ...item, ...dadosNormalizados } : item));
  setAlunos(atualizados);
  const alunoAtualizado = { ...dadosNormalizados, id };
  syncAlunoReferencias(alunoAtualizado);
  return mockRequest(alunoAtualizado);
}

export async function deleteAluno(id) {
  const { alunos, setAlunos } = useUserStore.getState();
  const filtrados = alunos.filter((aluno) => aluno.id !== id);
  setAlunos(filtrados);
  return mockRequest({ success: true });
}
