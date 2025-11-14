/**
 * Serviço de alunos usando o mockRequest para simular operações CRUD.
 * Em uma futura integração basta substituir as chamadas pelo fetch real.
 */
import { mockRequest } from './api';
import useUserStore from '../store/userStore';

export async function getAlunos() {
  const { alunos } = useUserStore.getState();
  return mockRequest(alunos);
}

export async function createAluno(aluno) {
  const { alunos, setAlunos } = useUserStore.getState();
  const novoAluno = { ...aluno, id: String(Date.now()) };
  setAlunos([...alunos, novoAluno]);
  return mockRequest(novoAluno);
}

export async function updateAluno(id, aluno) {
  const { alunos, setAlunos } = useUserStore.getState();
  const atualizados = alunos.map((item) => (item.id === id ? { ...item, ...aluno } : item));
  setAlunos(atualizados);
  return mockRequest({ ...aluno, id });
}

export async function deleteAluno(id) {
  const { alunos, setAlunos } = useUserStore.getState();
  const filtrados = alunos.filter((aluno) => aluno.id !== id);
  setAlunos(filtrados);
  return mockRequest({ success: true });
}
