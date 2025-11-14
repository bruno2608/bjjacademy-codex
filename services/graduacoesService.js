/**
 * Serviço mock de graduações responsável por acompanhar o progresso dos alunos
 * rumo à próxima faixa. Permite atualizar status e agendar novas graduações.
 */
import { mockRequest } from './api';
import useUserStore from '../store/userStore';

export async function getGraduacoes() {
  const { graduacoes } = useUserStore.getState();
  return mockRequest(graduacoes);
}

export async function scheduleGraduacao(payload) {
  const novaGraduacao = { ...payload, id: `graduation-${Date.now()}` };
  const store = useUserStore.getState();
  store.setGraduacoes([...store.graduacoes, novaGraduacao]);
  return mockRequest(novaGraduacao);
}

export async function updateGraduacao(id, data) {
  useUserStore.getState().updateGraduacaoStatus(id, data);
  const atualizada = useUserStore.getState().graduacoes.find((item) => item.id === id);
  return mockRequest(atualizada);
}
