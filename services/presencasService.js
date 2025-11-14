/**
 * Serviço responsável por simular o CRUD de presenças dos alunos.
 * Todas as operações utilizam o store global e retornam Promises mockadas.
 */
import { mockRequest } from './api';
import useUserStore from '../store/userStore';

export async function getPresencas() {
  const { presencas } = useUserStore.getState();
  return mockRequest(presencas);
}

export async function createPresenca(payload) {
  const novaPresenca = { ...payload, id: `presence-${Date.now()}` };
  useUserStore.getState().addPresenca(novaPresenca);
  return mockRequest(novaPresenca);
}

export async function togglePresenca(id) {
  useUserStore.getState().togglePresencaStatus(id);
  const atualizadas = useUserStore.getState().presencas;
  return mockRequest(atualizadas.find((item) => item.id === id));
}

export async function deletePresenca(id) {
  useUserStore.getState().removePresenca(id);
  return mockRequest({ success: true });
}
