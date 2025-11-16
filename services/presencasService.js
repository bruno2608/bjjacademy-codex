/**
 * Serviço responsável por simular o CRUD de presenças dos alunos.
 * Todas as operações utilizam o store global e retornam Promises mockadas.
 */
import { mockRequest } from './api';
import { usePresencasStore } from '../store/presencasStore';
import { useTreinosStore } from '../store/treinosStore';

const horaAtual = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

const normalizarDia = (data) => {
  if (!data) return null;
  const parsed = new Date(data);
  if (Number.isNaN(parsed.getTime())) return null;
  const nome = parsed.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
  return nome.replace('-feira', '').trim();
};

const resolverTreino = (data, treinoId) => {
  const treinos = useTreinosStore.getState().treinos;
  const diaSemana = normalizarDia(data) || normalizarDia(new Date().toISOString().split('T')[0]);
  const treinoEncontrado =
    treinos.find((item) => item.id === treinoId) ||
    treinos.find((item) => item.diaSemana === diaSemana && item.ativo) ||
    treinos.find((item) => item.ativo) ||
    treinos[0];

  if (!treinoEncontrado) {
    return { treinoId: treinoId || null, tipoTreino: 'Sessão principal' };
  }

  return { treinoId: treinoEncontrado.id, tipoTreino: treinoEncontrado.nome };
};

export async function getPresencas() {
  const { presencas } = usePresencasStore.getState();
  return mockRequest(presencas);
}

export async function createPresenca(payload) {
  const treino = resolverTreino(payload.data, payload.treinoId);
  const novaPresenca = {
    id: payload.id || `presence-${Date.now()}`,
    ...payload,
    ...treino,
    hora: payload.hora ?? horaAtual()
  };
  usePresencasStore.getState().addPresenca(novaPresenca);
  return mockRequest(novaPresenca);
}

export async function togglePresenca(id) {
  const atualizado = usePresencasStore.getState().togglePresencaStatus(id);
  return mockRequest(atualizado);
}

export async function deletePresenca(id) {
  usePresencasStore.getState().removePresenca(id);
  return mockRequest({ success: true });
}

export async function updatePresenca(id, payload) {
  const treino = resolverTreino(payload.data, payload.treinoId);
  usePresencasStore.getState().updatePresenca(id, { ...payload, ...treino });
  const registro = usePresencasStore.getState().presencas.find((item) => item.id === id);
  return mockRequest(registro);
}
