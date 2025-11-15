import { create } from 'zustand';

/**
 * Store que mantém a lista de modalidades (Gi, No-Gi, Kids...) com persistência local.
 * As páginas de configurações e o cadastro de treinos reutilizam este catálogo.
 */

const STORAGE_KEY = 'bjjacademy_tipos_treino';

export type TipoTreinoStore = {
  tipos: string[];
  addTipo: (tipo: string) => void;
  updateTipo: (index: number, novoNome: string) => void;
  removeTipo: (index: number) => void;
};

const DEFAULT_TIPOS = ['Gi', 'No-Gi'];

const readStorage = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_TIPOS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_TIPOS;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.length) {
      return DEFAULT_TIPOS;
    }
    return parsed.map((item) => String(item));
  } catch (error) {
    console.warn('Não foi possível carregar os tipos de treino.', error);
    return DEFAULT_TIPOS;
  }
};

const persistTipos = (tipos: string[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tipos));
};

export const useTiposTreinoStore = create<TipoTreinoStore>((set) => ({
  tipos: readStorage(),
  addTipo: (tipo) => {
    const sanitized = tipo.trim();
    if (!sanitized) return;
    set((state) => {
      if (state.tipos.includes(sanitized)) {
        return state;
      }
      const atualizados = [...state.tipos, sanitized];
      persistTipos(atualizados);
      return { tipos: atualizados };
    });
  },
  updateTipo: (index, novoNome) => {
    const sanitized = novoNome.trim();
    if (!sanitized) return;
    set((state) => {
      const atualizados = state.tipos.map((tipo, idx) => (idx === index ? sanitized : tipo));
      persistTipos(atualizados);
      return { tipos: atualizados };
    });
  },
  removeTipo: (index) => {
    set((state) => {
      const atualizados = state.tipos.filter((_, idx) => idx !== index);
      persistTipos(atualizados);
      return { tipos: atualizados };
    });
  }
}));

export { DEFAULT_TIPOS };
