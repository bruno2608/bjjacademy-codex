import { create } from 'zustand';
import { GRADUATION_RULES, type GraduationRule, type GraduationRules } from '../config/graduationRules';

/**
 * Store que permite ajustar as regras de graduação de forma mockada
 * preservando o arquivo de referência original usado nos cálculos.
 */

const STORAGE_KEY = 'bjjacademy_graduation_rules';

type GraduationRulesState = {
  rules: GraduationRules;
  updateRule: (faixa: string, payload: Partial<GraduationRule>) => void;
  addRule: (faixa: string, payload: GraduationRule) => void;
  removeRule: (faixa: string) => void;
  updateStripe: (faixa: string, stripeNumber: number, payload: { tempoMinimoMeses: number; aulasMinimas: number }) => void;
  resetRules: () => void;
};

const readStorage = (): GraduationRules => {
  if (typeof window === 'undefined') {
    return GRADUATION_RULES;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return GRADUATION_RULES;
    }
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return GRADUATION_RULES;
    }
    const merged: GraduationRules = { ...GRADUATION_RULES };
    Object.keys(parsed).forEach((faixa) => {
      const base = GRADUATION_RULES[faixa] ?? null;
      const atualizado = parsed[faixa];
      if (!atualizado || typeof atualizado !== 'object') return;
      merged[faixa] = {
        ...(base ?? {}),
        ...atualizado,
        graus: Array.isArray(atualizado.graus)
          ? atualizado.graus
          : base?.graus ?? []
      } as GraduationRule;
    });
    return merged;
  } catch (error) {
    console.warn('Não foi possível carregar as regras de graduação.', error);
    return GRADUATION_RULES;
  }
};

const persistRules = (rules: GraduationRules) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
};

export const useGraduationRulesStore = create<GraduationRulesState>((set, get) => ({
  rules: readStorage(),
  updateRule: (faixa, payload) => {
    set((state) => {
      const atual = state.rules[faixa] ?? GRADUATION_RULES[faixa];
      const atualizado = {
        ...atual,
        ...payload,
        graus: payload.graus ?? atual.graus
      };
      const regras = { ...state.rules, [faixa]: atualizado } as GraduationRules;
      persistRules(regras);
      return { rules: regras };
    });
  },
  addRule: (faixa, payload) => {
    set((state) => {
      const regras = { ...state.rules, [faixa]: payload } as GraduationRules;
      persistRules(regras);
      return { rules: regras };
    });
  },
  removeRule: (faixa) => {
    set((state) => {
      const regras = { ...state.rules } as GraduationRules;
      delete regras[faixa];
      persistRules(regras);
      return { rules: regras };
    });
  },
  updateStripe: (faixa, stripeNumber, payload) => {
    set((state) => {
      const atual = state.rules[faixa] ?? GRADUATION_RULES[faixa];
      const graus = Array.isArray(atual.graus)
        ? atual.graus.map((grau) =>
            grau.numero === stripeNumber
              ? { ...grau, tempoMinimoMeses: payload.tempoMinimoMeses, aulasMinimas: payload.aulasMinimas }
              : grau
          )
        : atual.graus;
      const atualizado = { ...atual, graus };
      const regras = { ...state.rules, [faixa]: atualizado } as GraduationRules;
      persistRules(regras);
      return { rules: regras };
    });
  },
  resetRules: () => {
    persistRules(GRADUATION_RULES);
    set({ rules: GRADUATION_RULES });
  }
}));

export { GRADUATION_RULES };
