import { create } from 'zustand';

import { MOCK_PRESENCAS } from '../data/mockPresencas';
import type { Presenca } from '../types/presenca';
import { useAlunosStore } from './alunosStore';

const getCurrentTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

const syncAlunos = (presencas: Presenca[]) => {
  useAlunosStore.getState().recalculateFromPresencas(presencas);
};

type PresencasState = {
  presencas: Presenca[];
  setPresencas: (presencas: Presenca[]) => void;
  addPresenca: (presenca: Presenca) => void;
  updatePresenca: (id: string, payload: Partial<Presenca>) => void;
  togglePresencaStatus: (id: string) => Presenca | null;
  removePresenca: (id: string) => void;
  registerCheckin: (
    payload: Omit<Presenca, 'id' | 'status' | 'hora'> & {
      id?: string;
      horaInicio?: string;
    }
  ) => { registro: Presenca | null; status: 'registrado' | 'pendente' | 'duplicado' | 'fora_do_horario' };
  approveCheckin: (id: string) => Presenca | null;
  rejectCheckin: (id: string) => Presenca | null;
  cancelarTreinoDoDia: (data: string, treinoId: string | null) => Presenca[];
};

export const usePresencasStore = create<PresencasState>((set) => ({
  presencas: MOCK_PRESENCAS,
  setPresencas: (presencas) => {
    set({ presencas });
    syncAlunos(presencas);
  },
  addPresenca: (presenca) => {
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const existenteIndex = lista.findIndex(
        (item) =>
          item.alunoId === presenca.alunoId &&
          item.data === presenca.data &&
          item.treinoId === presenca.treinoId
      );
      const payload = { ...presenca, hora: presenca.hora ?? getCurrentTime() };
      const atualizadas =
        existenteIndex >= 0
          ? lista.map((item, index) => (index === existenteIndex ? { ...item, ...payload } : item))
          : [...lista, payload];
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  },
  updatePresenca: (id, payload) => {
    set((state) => {
      const atualizadas = state.presencas.map((item) => (item.id === id ? { ...item, ...payload } : item));
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  },
  togglePresencaStatus: (id) => {
    let atualizada: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        const novoStatus = item.status === 'Presente' ? 'Ausente' : 'Presente';
        atualizada = {
          ...item,
          status: novoStatus,
          hora: novoStatus === 'Presente' ? getCurrentTime() : null
        };
        return atualizada;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizada;
  },
  removePresenca: (id) => {
    set((state) => {
      const atualizadas = state.presencas.filter((item) => item.id !== id);
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  },
  registerCheckin: (payload) => {
    let status: 'registrado' | 'pendente' | 'duplicado' | 'fora_do_horario' = 'pendente';
    let registro: Presenca | null = null;
    const janelaMinutos = 30;
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const existente = lista.find(
        (item) => item.alunoId === payload.alunoId && item.data === payload.data && item.treinoId === payload.treinoId
      );
      if (existente) {
        status = 'duplicado';
        registro = existente;
        return { presencas: lista };
      }

      const agora = new Date();
      const dataReferencia = payload.data ? new Date(`${payload.data}T${payload.horaInicio || '00:00'}`) : new Date();
      const inicio = dataReferencia.getTime();
      const limite = inicio + janelaMinutos * 60 * 1000;

      if (agora.getTime() < inicio || agora.getTime() > limite) {
        status = 'fora_do_horario';
        registro = null;
        return { presencas: lista };
      }

      const confirmavel = agora.getTime() === inicio;
      status = confirmavel ? 'registrado' : 'pendente';

      registro = {
        id: payload.id || `checkin-${Date.now()}`,
        ...payload,
        status: confirmavel ? 'Presente' : 'Pendente',
        hora: confirmavel ? getCurrentTime() : null,
        treinoModalidade: payload.treinoModalidade ?? payload.treinoId ?? null
      } as Presenca;

      const atualizadas = [...lista, registro];
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return { registro, status };
  },
  approveCheckin: (id) => {
    let atualizado: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        atualizado = { ...item, status: 'Presente', hora: item.hora || getCurrentTime() };
        return atualizado;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizado;
  },
  rejectCheckin: (id) => {
    let atualizado: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        atualizado = { ...item, status: 'Ausente', hora: null };
        return atualizado;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizado;
  },
  cancelarTreinoDoDia: (data, treinoId) => {
    let novos: Presenca[] = [];
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.data === data && item.treinoId === treinoId) {
          const cancelado = { ...item, status: 'Cancelado' as const };
          novos.push(cancelado);
          return cancelado;
        }
        return item;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return novos;
  }
}));
