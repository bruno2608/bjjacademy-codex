import { create } from 'zustand';
import { GRADUATION_RULES } from '../lib/graduationRules';

/**
 * Store que permite ajustar as regras de graduação de forma mockada
 * preservando o arquivo de referência original usado nos cálculos.
 */

const STORAGE_KEY = 'bjjacademy_graduation_rules';

type GraduationRule = (typeof GRADUATION_RULES)[keyof typeof GRADUATION_RULES];

type GraduationRulesState = {
  rules: typeof GRADUATION_RULES;
  updateRule: (faixa: string, payload: Partial<GraduationRule>) => void;
  updateStripe: (faixa: string, stripeNumber: number, payload: { tempoMinimoMeses: number; aulasMinimas: number }) => void;
  resetRules: () => void;
};

const readStorage = (): typeof GRADUATION_RULES => {
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
    return Object.keys(GRADUATION_RULES).reduce((acc, faixa) => {
      const base = GRADUATION_RULES[faixa as keyof typeof GRADUATION_RULES];
      const atualizado = parsed[faixa] ?? base;
      return {
        ...acc,
        [faixa]: {
          ...base,
          ...atualizado,
          graus: Array.isArray(atualizado?.graus) ? atualizado.graus : base.graus
        }
      };
    }, {} as typeof GRADUATION_RULES);
  } catch (error) {
    console.warn('Não foi possível carregar as regras de graduação.', error);
    return GRADUATION_RULES;
  }
};

const persistRules = (rules: typeof GRADUATION_RULES) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
};

export const useGraduationRulesStore = create<GraduationRulesState>((set, get) => ({
  rules: readStorage(),
  updateRule: (faixa, payload) => {
    set((state) => {
      const atual = state.rules[faixa] ?? GRADUATION_RULES[faixa as keyof typeof GRADUATION_RULES];
      const atualizado = {
        ...atual,
        ...payload,
        graus: payload.graus ?? atual.graus
      };
      const regras = { ...state.rules, [faixa]: atualizado } as typeof GRADUATION_RULES;
      persistRules(regras);
      return { rules: regras };
    });
  },
  updateStripe: (faixa, stripeNumber, payload) => {
    set((state) => {
      const atual = state.rules[faixa] ?? GRADUATION_RULES[faixa as keyof typeof GRADUATION_RULES];
      const graus = Array.isArray(atual.graus)
        ? atual.graus.map((grau) =>
            grau.numero === stripeNumber
              ? { ...grau, tempoMinimoMeses: payload.tempoMinimoMeses, aulasMinimas: payload.aulasMinimas }
              : grau
          )
        : atual.graus;
      const atualizado = { ...atual, graus };
      const regras = { ...state.rules, [faixa]: atualizado } as typeof GRADUATION_RULES;
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
