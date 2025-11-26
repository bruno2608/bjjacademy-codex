'use client';

import { useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { useGraduationRulesStore } from '../../../store/graduationRulesStore';
import { BELT_ORDER } from '../../../config/graduationRules';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { ROLE_KEYS } from '@/config/roles';

/**
 * Permite editar os requisitos mockados de cada faixa sem impactar o módulo principal.
 */

const numberOrZero = (value) => (Number.isNaN(Number(value)) ? 0 : Number(value));

const DEFAULT_RULE = {
  nome: '',
  categoria: 'Adulto',
  metodoGraus: 'manual',
  tempoFaixaMeses: 12,
  tempoMinimoMeses: 12,
  idadeMinima: 0,
  aulasMinimasFaixa: 0,
  descricao: '',
  corFaixa: '#FFFFFF',
  corBarra: '#000000',
  corPonteira: '#000000',
  proximaFaixa: null,
  graus: []
};

const sortBelts = (entries) => {
  return entries.sort((a, b) => {
    const idxA = BELT_ORDER.indexOf(a[0]);
    const idxB = BELT_ORDER.indexOf(b[0]);
    if (idxA === -1 && idxB === -1) return a[0].localeCompare(b[0]);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const buildFormFromRule = (nome, rule) => ({
  nome,
  categoria: rule.categoria ?? 'Adulto',
  metodoGraus: rule.metodoGraus ?? 'manual',
  tempoFaixaMeses: rule.tempoFaixaMeses ?? rule.tempoMinimoMeses ?? 0,
  tempoMinimoMeses: rule.tempoMinimoMeses ?? 0,
  idadeMinima: rule.idadeMinima ?? 0,
  aulasMinimasFaixa: rule.aulasMinimasFaixa ?? 0,
  descricao: rule.descricao ?? '',
  corFaixa: rule.corFaixa ?? '#FFFFFF',
  corBarra: rule.corBarra ?? '#000000',
  corPonteira: rule.corPonteira ?? '#000000',
  proximaFaixa: rule.proximaFaixa ?? null,
  graus: Array.isArray(rule.graus)
    ? rule.graus.map((grau, index) => ({
        numero: grau.numero ?? index + 1,
        tempoMinimoMeses: grau.tempoMinimoMeses ?? 0,
        aulasMinimas: grau.aulasMinimas ?? 0
      }))
    : []
});

export default function RegrasGraduacaoPage() {
  const { user } = useCurrentUser();
  const { staff } = useCurrentStaff();
  const { rules, updateRule, addRule, removeRule } = useGraduationRulesStore();
  const [selectedBelt, setSelectedBelt] = useState(null);
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState('');

  const canManageConfigs = Boolean(
    user?.roles?.some((role) =>
      [ROLE_KEYS.professor, ROLE_KEYS.instrutor, ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role)
    )
  );

  const belts = useMemo(() => sortBelts(Object.entries(rules)), [rules]);
  const beltNames = useMemo(() => belts.map(([belt]) => belt), [belts]);

  if (!canManageConfigs) {
    return (
      <div className="space-y-4">
        <header className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Acesso restrito</p>
          <h1 className="mt-2 text-xl font-semibold text-bjj-white">Regras de graduação</h1>
          <p className="mt-2 text-sm text-bjj-gray-200/70">Somente staff autorizado pode editar as regras.</p>
        </header>
      </div>
    );
  }

  const openCreateModal = () => {
    setMode('create');
    setSelectedBelt(null);
    setForm({ ...DEFAULT_RULE, nome: '', graus: [] });
  };

  const openEditModal = (beltName, rule) => {
    setMode('edit');
    setSelectedBelt(beltName);
    setForm(buildFormFromRule(beltName, rule));
  };

  const closeModal = () => {
    setSelectedBelt(null);
    setMode(null);
    setForm(null);
    setError('');
  };

  const updateField = (name, value) => {
    setError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateStripeField = (index, name, value) => {
    setForm((prev) => ({
      ...prev,
      graus: prev.graus.map((grau, idx) => (idx === index ? { ...grau, [name]: value } : grau))
    }));
  };

  const handleAddStripe = () => {
    setForm((prev) => ({
      ...prev,
      graus: [
        ...prev.graus,
        { numero: prev.graus.length + 1, tempoMinimoMeses: 0, aulasMinimas: 0 }
      ]
    }));
  };

  const handleRemoveStripe = (index) => {
    setForm((prev) => ({
      ...prev,
      graus: prev.graus
        .filter((_, idx) => idx !== index)
        .map((grau, idx) => ({ ...grau, numero: idx + 1 }))
    }));
  };

  const handleDelete = (beltName) => setDeleteTarget(beltName);

  const confirmarExclusao = () => {
    if (!deleteTarget) return;
    removeRule(deleteTarget);
    setDeleteTarget('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form) return;

    const payload = {
      categoria: form.categoria,
      metodoGraus: form.metodoGraus,
      tempoFaixaMeses: numberOrZero(form.tempoFaixaMeses),
      tempoMinimoMeses: numberOrZero(form.tempoMinimoMeses),
      idadeMinima: numberOrZero(form.idadeMinima),
      aulasMinimasFaixa: numberOrZero(form.aulasMinimasFaixa),
      descricao: form.descricao,
      corFaixa: form.corFaixa,
      corBarra: form.corBarra,
      corPonteira: form.corPonteira,
      proximaFaixa: form.proximaFaixa || null,
      graus: form.graus.map((grau, index) => ({
        numero: grau.numero ?? index + 1,
        tempoMinimoMeses: numberOrZero(grau.tempoMinimoMeses),
        aulasMinimas: numberOrZero(grau.aulasMinimas)
      }))
    };

    if (mode === 'create') {
      const nome = (form.nome || '').trim();
      if (!nome) {
        setError('Informe o nome da faixa.');
        return;
      }
      if (rules[nome]) {
        setError('Já existe uma faixa com esse nome.');
        return;
      }
      addRule(nome, payload);
    } else if (selectedBelt) {
      updateRule(selectedBelt, payload);
    }

    closeModal();
  };

  const actionButtonClasses =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red';

  return (
    <div className="space-y-6">
      <header className="card space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Regras oficiais</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Regras de Graduação</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Ajuste os requisitos mínimos de cada faixa. O sistema usa esses valores para sugerir próximos passos, mas a confirmação continua manual pelo professor responsável.
        </p>
        {staff?.nome && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/70">
            Responsável: {staff.nome} · {staff.roles?.join(', ') || 'Staff'}
          </p>
        )}
      </header>

      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus size={16} /> Nova faixa
        </Button>
      </div>

      <section className="card overflow-x-auto p-0">
        <table className="table table-compact table-fixed min-w-[760px] text-sm md:min-w-full">
          <thead>
            <tr className="text-[0.65rem] uppercase tracking-[0.25em] text-bjj-gray-200/70">
              <th className="w-[120px] px-4 py-3 text-center font-semibold">Ações</th>
              <th className="w-[22%] px-4 py-3 font-semibold">Faixa</th>
              <th className="w-[38%] px-4 py-3 font-semibold">Requisitos</th>
              <th className="w-[28%] px-4 py-3 font-semibold">Visual</th>
            </tr>
          </thead>
          <tbody>
            {belts.map(([belt, rule]) => {
              const faixaConfig = getFaixaConfigBySlug(rule.faixaSlug);

              return (
                <tr key={belt} className="align-middle text-sm text-bjj-gray-200">
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className={actionButtonClasses}
                        aria-label={`Editar ${belt}`}
                        onClick={() => openEditModal(belt, rule)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className={actionButtonClasses}
                        aria-label={`Excluir ${belt}`}
                        onClick={() => handleDelete(belt)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <p className="text-base font-semibold text-bjj-white">{belt}</p>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm">
                      <p>
                        <span className="font-semibold text-bjj-white">Tempo:</span> {rule.tempoFaixaMeses} meses
                      </p>
                      <p>
                        <span className="font-semibold text-bjj-white">Aulas mínimas:</span> {rule.aulasMinimasFaixa}
                      </p>
                      <p>
                        <span className="font-semibold text-bjj-white">Graus:</span> {rule.graus?.length ?? 0}
                      </p>
                      <p>
                        <span className="font-semibold text-bjj-white">Próxima faixa:</span> {rule.proximaFaixa || '—'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle w-64">
                    {faixaConfig && (
                      <BjjBeltStrip
                        config={faixaConfig}
                        grauAtual={rule.grausMaximos ?? faixaConfig.grausMaximos}
                        className="scale-[0.9] origin-center"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={Boolean(mode)}
        onClose={closeModal}
        title={mode === 'create' ? 'Adicionar nova faixa' : `Editar faixa ${selectedBelt || ''}`}
      >
        {form && (
          <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
            {mode === 'create' && (
              <label className="flex flex-col gap-1 text-xs">
                <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Nome da faixa</span>
                <Input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} />
              </label>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.25em] text-bjj-gray-200/70">Requisitos básicos</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Categoria</span>
                    <Select value={form.categoria} onChange={(event) => updateField('categoria', event.target.value)}>
                      <option value="Adulto">Adulto</option>
                      <option value="Infantil">Infantil</option>
                    </Select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Método de graus</span>
                    <Select value={form.metodoGraus} onChange={(event) => updateField('metodoGraus', event.target.value)}>
                      <option value="manual">Manual</option>
                      <option value="mensal">Mensal</option>
                    </Select>
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Próxima faixa</span>
                  <Select
                    value={form.proximaFaixa ?? ''}
                    onChange={(event) =>
                      updateField('proximaFaixa', event.target.value ? event.target.value : null)
                    }
                  >
                    <option value="">Sem próxima</option>
                    {beltNames
                      .filter((name) => name !== (mode === 'edit' ? selectedBelt : form.nome))
                      .map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </Select>
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Tempo de faixa (meses)</span>
                    <Input
                      type="number"
                      min="0"
                      value={form.tempoFaixaMeses}
                      onChange={(event) => updateField('tempoFaixaMeses', event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Tempo mínimo (meses)</span>
                    <Input
                      type="number"
                      min="0"
                      value={form.tempoMinimoMeses}
                      onChange={(event) => updateField('tempoMinimoMeses', event.target.value)}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Idade mínima</span>
                    <Input
                      type="number"
                      min="0"
                      value={form.idadeMinima}
                      onChange={(event) => updateField('idadeMinima', event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Aulas mínimas (faixa)</span>
                    <Input
                      type="number"
                      min="0"
                      value={form.aulasMinimasFaixa}
                      onChange={(event) => updateField('aulasMinimasFaixa', event.target.value)}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Observações</span>
                  <textarea
                    className="textarea textarea-bordered w-full bg-bjj-gray-900/40 text-sm text-bjj-gray-200"
                    rows={3}
                    placeholder="Ex.: Entrada no sistema adulto com construção de base."
                    value={form.descricao}
                    onChange={(event) => updateField('descricao', event.target.value)}
                  />
                </label>
              </div>

              <div className="space-y-4 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.25em] text-bjj-gray-200/70">Paleta e pré-visualização</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Cor da faixa</span>
                    <input
                      type="color"
                      className="h-12 w-full cursor-pointer rounded-lg border border-bjj-gray-800 bg-transparent"
                      value={form.corFaixa}
                      onChange={(event) => updateField('corFaixa', event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Cor da barra</span>
                    <input
                      type="color"
                      className="h-12 w-full cursor-pointer rounded-lg border border-bjj-gray-800 bg-transparent"
                      value={form.corBarra}
                      onChange={(event) => updateField('corBarra', event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Cor da ponteira</span>
                    <input
                      type="color"
                      className="h-12 w-full cursor-pointer rounded-lg border border-bjj-gray-800 bg-transparent"
                      value={form.corPonteira}
                      onChange={(event) => updateField('corPonteira', event.target.value)}
                    />
                  </label>
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Pré-visualização</span>
                    <FaixaVisual
                      corBase={form.corFaixa}
                      corLinha={form.corBarra}
                      corPonteira={form.corPonteira}
                      graus={form.graus.length}
                      categoria={form.categoria}
                      className="w-full max-w-[12rem]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-200/70">Graus</p>
                <Button type="button" variant="secondary" onClick={handleAddStripe} className="btn-sm">
                  Adicionar grau
                </Button>
              </div>
              {form.graus.length ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {form.graus.map((grau, index) => (
                    <div
                      key={`${grau.numero}-${index}`}
                      className="grid grid-cols-1 gap-3 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-950/80 p-4 md:grid-cols-3"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/70">
                        {grau.numero}º grau
                      </div>
                      <label className="flex flex-col gap-1 text-xs">
                        <span>Tempo mínimo (meses)</span>
                        <Input
                          type="number"
                          min="0"
                          value={grau.tempoMinimoMeses}
                          onChange={(event) => updateStripeField(index, 'tempoMinimoMeses', event.target.value)}
                        />
                      </label>
                      <div className="grid grid-cols-[1fr_auto] gap-2 md:grid-cols-1 md:items-center md:justify-end">
                        <label className="flex flex-col gap-1 text-xs">
                          <span>Aulas mínimas</span>
                          <Input
                            type="number"
                            min="0"
                            value={grau.aulasMinimas}
                            onChange={(event) => updateStripeField(index, 'aulasMinimas', event.target.value)}
                          />
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          className="btn-xs self-end md:self-center"
                          onClick={() => handleRemoveStripe(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-bjj-gray-200/70">Nenhum grau configurado.</p>
              )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirmar exclusão"
        message={deleteTarget ? `Deseja remover a faixa ${deleteTarget}?` : ''}
        confirmLabel="Remover faixa"
        onConfirm={confirmarExclusao}
        onCancel={() => setDeleteTarget('')}
      />
    </div>
  );
}
