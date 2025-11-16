'use client';

import { useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import Modal from '../../../../components/ui/Modal';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import { useGraduationRulesStore } from '../../../../store/graduationRulesStore';
import { BELT_ORDER } from '../../../../config/graduationRules';

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
  corPonteira: '#E10600',
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
  corPonteira: rule.corPonteira ?? '#E10600',
  proximaFaixa: rule.proximaFaixa ?? null,
  graus: Array.isArray(rule.graus)
    ? rule.graus.map((grau, index) => ({
        numero: grau.numero ?? index + 1,
        tempoMinimoMeses: grau.tempoMinimoMeses ?? 0,
        aulasMinimas: grau.aulasMinimas ?? 0
      }))
    : []
});

const BeltPreview = ({ corFaixa, corBarra, corPonteira, stripes = 0 }) => {
  const totalStripes = stripes > 0 ? stripes : 4;
  const isPlaceholder = stripes === 0;
  return (
    <div className="belt-widget">
      <span className="belt-widget__strap" style={{ backgroundColor: corFaixa }} />
      <span className="belt-widget__center" style={{ backgroundColor: corBarra }} />
      <span className="belt-widget__tip" style={{ backgroundColor: corPonteira }}>
        <span className="belt-widget__stripes">
          {Array.from({ length: totalStripes }).map((_, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`belt-widget__stripe${isPlaceholder ? ' belt-widget__stripe--placeholder' : ''}`}
            />
          ))}
        </span>
        <span className="belt-widget__pointer" style={{ backgroundColor: corPonteira }} aria-hidden="true" />
      </span>
    </div>
  );
};

export default function RegrasGraduacaoPage() {
  const { rules, updateRule, addRule, removeRule } = useGraduationRulesStore();
  const [selectedBelt, setSelectedBelt] = useState(null);
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const belts = useMemo(() => sortBelts(Object.entries(rules)), [rules]);
  const beltNames = useMemo(() => belts.map(([belt]) => belt), [belts]);

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

  const handleDelete = (beltName) => {
    const confirmed = window.confirm(`Deseja remover a faixa ${beltName}?`);
    if (!confirmed) return;
    removeRule(beltName);
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

  return (
    <div className="space-y-6">
      <header className="card space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Regras oficiais</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Regras de Graduação</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Ajuste os requisitos mínimos de cada faixa. O sistema usa esses valores para sugerir próximos passos, mas a confirmação continua manual pelo professor responsável.
        </p>
      </header>

      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus size={16} /> Nova faixa
        </Button>
      </div>

      <section className="card overflow-x-auto p-0">
        <table className="table w-full">
          <thead>
            <tr className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/70">
              <th>Faixa</th>
              <th className="w-48">Visual</th>
              <th className="hidden lg:table-cell">Descrição</th>
              <th className="hidden xl:table-cell w-1/3">Requisitos básicos</th>
              <th className="w-24 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {belts.map(([belt, rule]) => (
              <tr key={belt} className="align-middle text-sm">
                <td className="py-4">
                  <p className="font-semibold text-bjj-white">{belt}</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-bjj-gray-200/60">
                    {rule.categoria}
                  </p>
                </td>
                <td>
                  <BeltPreview
                    corFaixa={rule.corFaixa}
                    corBarra={rule.corBarra}
                    corPonteira={rule.corPonteira}
                    stripes={rule.graus?.length ?? 0}
                  />
                </td>
                <td className="hidden lg:table-cell text-sm text-bjj-gray-200/80">
                  {rule.descricao || 'Descrição não informada.'}
                </td>
                <td className="hidden xl:table-cell text-xs text-bjj-gray-200/80">
                  <ul className="space-y-1">
                    <li>
                      <span className="font-semibold text-bjj-white">Tempo:</span> {rule.tempoFaixaMeses} meses
                    </li>
                    <li>
                      <span className="font-semibold text-bjj-white">Aulas mínimas:</span> {rule.aulasMinimasFaixa}
                    </li>
                    <li>
                      <span className="font-semibold text-bjj-white">Graus:</span> {rule.graus?.length ?? 0}
                    </li>
                    <li>
                      <span className="font-semibold text-bjj-white">Próxima faixa:</span> {rule.proximaFaixa || '—'}
                    </li>
                  </ul>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="btn-xs flex items-center gap-1"
                      onClick={() => openEditModal(belt, rule)}
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="btn-xs flex items-center gap-1"
                      onClick={() => handleDelete(belt)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={Boolean(mode)}
        onClose={closeModal}
        title={mode === 'create' ? 'Adicionar nova faixa' : `Editar faixa ${selectedBelt || ''}`}
      >
        {form && (
          <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
            {mode === 'create' && (
              <label className="flex flex-col gap-1 text-xs">
                <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Nome da faixa</span>
                <Input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} />
              </label>
            )}
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
              <label className="flex flex-col gap-1 text-xs">
                <span className="uppercase tracking-[0.2em] text-bjj-gray-200/70">Descrição</span>
                <textarea
                  className="textarea textarea-bordered w-full bg-bjj-gray-900/40 text-sm text-bjj-gray-200"
                  rows={3}
                  value={form.descricao}
                  onChange={(event) => updateField('descricao', event.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/70">Graus</p>
                <Button type="button" variant="secondary" onClick={handleAddStripe} className="btn-sm">
                  Adicionar grau
                </Button>
              </div>
              {form.graus.length ? (
                <div className="space-y-2">
                  {form.graus.map((grau, index) => (
                    <div
                      key={`${grau.numero}-${index}`}
                      className="grid grid-cols-1 gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:grid-cols-4"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/70">
                        {grau.numero}º grau
                      </div>
                      <label className="flex flex-col gap-1 text-xs md:col-span-1">
                        <span>Tempo mínimo (meses)</span>
                        <Input
                          type="number"
                          min="0"
                          value={grau.tempoMinimoMeses}
                          onChange={(event) => updateStripeField(index, 'tempoMinimoMeses', event.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs md:col-span-1">
                        <span>Aulas mínimas</span>
                        <Input
                          type="number"
                          min="0"
                          value={grau.aulasMinimas}
                          onChange={(event) => updateStripeField(index, 'aulasMinimas', event.target.value)}
                        />
                      </label>
                      <div className="flex items-start justify-end md:items-center">
                        <Button
                          type="button"
                          variant="secondary"
                          className="btn-xs"
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
    </div>
  );
}
