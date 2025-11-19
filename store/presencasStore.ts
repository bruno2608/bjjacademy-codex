import { create } from 'zustand';

import { MOCK_PRESENCAS } from '../data/mockPresencas';
import type { Presenca, StatusPresenca } from '../types/presenca';
import { useAlunosStore } from './alunosStore';

const normalizarStatus = (status: Presenca['status']): StatusPresenca => {
  const mapa: Record<string, StatusPresenca> = {
    PRESENTE: 'CONFIRMADO',
    CONFIRMADO: 'CONFIRMADO',
    CHECKIN: 'CHECKIN',
    PENDENTE: 'PENDENTE',
    AUSENTE: 'AUSENTE',
    AUSENTE_JUSTIFICADA: 'AUSENTE_JUSTIFICADA'
  };

  const chave = (status || '').toString().toUpperCase();
  return mapa[chave] ?? 'PENDENTE';
};

const normalizarPresencas = (lista: Presenca[]): Presenca[] =>
  (lista || []).map((item) => ({
    ...item,
    status: normalizarStatus(item.status)
  }));

const getCurrentTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

const syncAlunos = (presencas: Presenca[]) => {
  useAlunosStore.getState().recalculateFromPresencas(presencas);
};

const buildTreinosFechadosMock = () => {
  const hoje = new Date().toISOString().split('T')[0];
  return {
    [`${hoje}::t3`]: 'FECHADO_MANUAL'
  } as const;
};

type PresencasState = {
  presencas: Presenca[];
  treinosFechados: Record<string, 'FECHADO_MANUAL'>;
  setPresencas: (presencas: Presenca[]) => void;
  addPresenca: (presenca: Presenca) => void;
  updatePresenca: (id: string, payload: Partial<Presenca>) => Presenca | null;
  setStatus: (id: string, status: StatusPresenca) => Presenca | null;
  markJustified: (id: string) => Presenca | null;
  removePresenca: (id: string) => void;
  registerCheckin: (
    payload: Omit<Presenca, 'id' | 'status' | 'hora'> & {
      id?: string;
      horaInicio?: string;
    }
  ) => { registro: Presenca | null; status: 'checkin' | 'pendente' | 'duplicado' | 'fechado' };
  approveCheckin: (id: string) => Presenca | null;
  rejectCheckin: (id: string) => Presenca | null;
  cancelarTreinoDoDia: (data: string, treinoId: string | null) => Presenca[];
  fecharTreinoRapido: (data: string, treinoId: string | null, alunosAtivos: { id: string; nome: string; faixa: string; graus: number }[]) => {
    confirmados: number;
    ausentesCriados: number;
  };
  marcarTreinoFechado: (data: string, treinoId: string | null) => void;
  isTreinoFechado: (data: string, treinoId: string | null) => boolean;
};

export const usePresencasStore = create<PresencasState>((set) => ({
  presencas: normalizarPresencas(MOCK_PRESENCAS),
  treinosFechados: buildTreinosFechadosMock(),
  setPresencas: (presencas) => {
    const normalizadas = normalizarPresencas(presencas);
    set({ presencas: normalizadas });
    syncAlunos(normalizadas);
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
    let atualizada: Presenca | null = null;
    set((state) => {
      const statusNormalizado = payload.status ? normalizarStatus(payload.status) : null;
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        const status = statusNormalizado ?? item.status;
        atualizada = {
          ...item,
          ...payload,
          status,
          hora: status === 'CONFIRMADO' ? item.hora || getCurrentTime() : item.hora
        };
        return atualizada;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizada;
  },
  setStatus: (id, status) => {
    let atualizada: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        atualizada = {
          ...item,
          status,
          hora: status === 'CONFIRMADO' ? item.hora || getCurrentTime() : item.hora
        };
        return atualizada;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizada;
  },
  markJustified: (id) => {
    let atualizada: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        atualizada = { ...item, status: 'AUSENTE_JUSTIFICADA', hora: item.hora };
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
    let status: 'checkin' | 'pendente' | 'duplicado' | 'fechado' = 'pendente';
    let registro: Presenca | null = null;
    const janelaMinutos = 30;
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const sessionKey = `${payload.data || ''}::${payload.treinoId || 'principal'}`;
      if (state.treinosFechados[sessionKey]) {
        status = 'fechado';
        return { presencas: lista };
      }

      const existenteIndex = lista.findIndex(
        (item) => item.alunoId === payload.alunoId && item.data === payload.data && item.treinoId === payload.treinoId
      );

      if (existenteIndex >= 0) {
        const existente = lista[existenteIndex];
        const statusElegivelDuplicado: StatusPresenca[] = ['CHECKIN', 'PENDENTE', 'CONFIRMADO'];
        if (statusElegivelDuplicado.includes(existente.status)) {
          status = 'duplicado';
          registro = existente;
          return { presencas: lista };
        }
      }

      const agora = new Date();
      const dataReferencia = payload.data ? new Date(`${payload.data}T${payload.horaInicio || '00:00'}`) : new Date();
      const inicio = dataReferencia.getTime();
      const limite = inicio + janelaMinutos * 60 * 1000;
      const dentroJanela = agora.getTime() >= inicio && agora.getTime() <= limite;

      const statusPresenca: StatusPresenca = dentroJanela ? 'CHECKIN' : 'PENDENTE';
      status = dentroJanela ? 'checkin' : 'pendente';

      const payloadRegistro: Presenca = {
        id: payload.id || `checkin-${Date.now()}`,
        ...payload,
        status: statusPresenca,
        hora: dentroJanela ? getCurrentTime() : null,
        treinoModalidade: payload.treinoModalidade ?? payload.treinoId ?? null,
        origem: 'ALUNO'
      };

      const atualizadas =
        existenteIndex >= 0
          ? lista.map((item, index) =>
              index === existenteIndex ? { ...item, ...payloadRegistro, id: item.id } : item
            )
          : [...lista, payloadRegistro];
      registro = existenteIndex >= 0 ? { ...payloadRegistro, id: lista[existenteIndex].id } : payloadRegistro;
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
        atualizado = { ...item, status: 'CONFIRMADO', hora: item.hora || getCurrentTime(), origem: item.origem || 'PROFESSOR' };
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
        atualizado = { ...item, status: 'AUSENTE', hora: null, origem: item.origem || 'PROFESSOR' };
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
  },
  fecharTreinoRapido: (data, treinoId, alunosAtivos) => {
    const sessionKey = `${data}::${treinoId || 'principal'}`;
    let confirmados = 0;
    let ausentesCriados = 0;
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const atualizadas = lista.map((item) => { 
        if (item.data === data && item.treinoId === treinoId) {
          if (item.status === 'CHECKIN') {
            confirmados += 1;
            return { ...item, status: 'CONFIRMADO', hora: item.hora || getCurrentTime(), origem: item.origem || 'PROFESSOR' };
          }
        }
        return item;
      });

      const alunosComRegistro = new Set(
        atualizadas.filter((item) => item.data === data && item.treinoId === treinoId).map((item) => item.alunoId)
      );
      const novosAusentes: Presenca[] = [];
      alunosAtivos.forEach((aluno) => {
        if (alunosComRegistro.has(aluno.id)) return;
        ausentesCriados += 1;
        novosAusentes.push({
          id: `abs-${aluno.id}-${Date.now()}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          faixa: aluno.faixa,
          graus: aluno.graus,
          data,
          hora: null,
          status: 'AUSENTE',
          treinoId,
          tipoTreino: 'Sessão principal',
          origem: 'PROFESSOR'
        });
      });

      const listaFinal = [...atualizadas, ...novosAusentes];
      syncAlunos(listaFinal);
      return {
        presencas: listaFinal,
        treinosFechados: { ...state.treinosFechados, [sessionKey]: 'FECHADO_MANUAL' }
      };
    });
    return { confirmados, ausentesCriados };
  },
  marcarTreinoFechado: (data, treinoId) => {
    const sessionKey = `${data}::${treinoId || 'principal'}`;
    set((state) => ({
      treinosFechados: { ...state.treinosFechados, [sessionKey]: 'FECHADO_MANUAL' }
    }));
  },
  isTreinoFechado: (data, treinoId) => {
    const sessionKey = `${data}::${treinoId || 'principal'}`;
    return Boolean(usePresencasStore.getState().treinosFechados[sessionKey]);
  }
}));
