'use client';

import { useMemo, useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import { useGraduationRulesStore } from '../../../../store/graduationRulesStore';

/**
 * Permite editar os requisitos mockados de cada faixa sem impactar o módulo principal.
 */

const numberOrZero = (value) => Number.isNaN(Number(value)) ? 0 : Number(value);

export default function RegrasGraduacaoPage() {
  const { rules, updateRule } = useGraduationRulesStore();
  const [selectedBelt, setSelectedBelt] = useState(null);
  const [form, setForm] = useState(null);

  const belts = useMemo(() => Object.entries(rules), [rules]);

  const openModal = (beltName, rule) => {
    setSelectedBelt(beltName);
    setForm({
      tempoMinimoMeses: rule.tempoMinimoMeses ?? rule.tempoFaixaMeses ?? 0,
      idadeMinima: rule.idadeMinima ?? 0,
      aulasMinimasFaixa: rule.aulasMinimasFaixa ?? 0,
      metodoGraus: rule.metodoGraus || 'manual',
      graus: Array.isArray(rule.graus)
        ? rule.graus.map((grau) => ({
            numero: grau.numero,
            tempoMinimoMeses: grau.tempoMinimoMeses ?? 0,
            aulasMinimas: grau.aulasMinimas ?? 0
          }))
        : []
    });
  };

  const closeModal = () => {
    setSelectedBelt(null);
    setForm(null);
  };

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateStripeField = (index, name, value) => {
    setForm((prev) => ({
      ...prev,
      graus: prev.graus.map((grau, idx) => (idx === index ? { ...grau, [name]: value } : grau))
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedBelt || !form) return;

    updateRule(selectedBelt, {
      tempoMinimoMeses: numberOrZero(form.tempoMinimoMeses),
      idadeMinima: numberOrZero(form.idadeMinima),
      aulasMinimasFaixa: numberOrZero(form.aulasMinimasFaixa),
      metodoGraus: form.metodoGraus,
      graus: form.graus.map((grau) => ({
        numero: grau.numero,
        tempoMinimoMeses: numberOrZero(grau.tempoMinimoMeses),
        aulasMinimas: numberOrZero(grau.aulasMinimas)
      }))
    });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Regras oficiais</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Regras de Graduação</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Ajuste os requisitos mínimos de cada faixa. O sistema usa esses valores para sugerir próximos passos, mas a confirmação continua manual pelo professor responsável.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {belts.map(([belt, rule]) => (
          <article
            key={belt}
            className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-bjj-white">Faixa {belt}</h2>
                <p className="text-xs text-bjj-gray-200/70">{rule.categoria} · método {rule.metodoGraus}</p>
              </div>
              <button
                type="button"
                onClick={() => openModal(belt, rule)}
                className="btn-secondary px-3 py-1 text-xs"
              >
                Editar
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-bjj-gray-200/80">
              <div className="flex items-center justify-between">
                <dt>Tempo mínimo:</dt>
                <dd>{rule.tempoMinimoMeses} meses</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Idade mínima:</dt>
                <dd>{rule.idadeMinima} anos</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Aulas por grau:</dt>
                <dd>{rule.graus?.[0]?.aulasMinimas ?? rule.aulasMinimasFaixa} aulas</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total de graus:</dt>
                <dd>{rule.graus?.length || 0}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <Modal isOpen={Boolean(selectedBelt)} onClose={closeModal} title={`Editar faixa ${selectedBelt || ''}`}>
        {form && (
          <form className="space-y-4 text-sm text-bjj-gray-200/80" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Tempo mínimo (meses)</span>
                <Input
                  type="number"
                  min="0"
                  value={form.tempoMinimoMeses}
                  onChange={(event) => updateField('tempoMinimoMeses', event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Idade mínima</span>
                <Input
                  type="number"
                  min="0"
                  value={form.idadeMinima}
                  onChange={(event) => updateField('idadeMinima', event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Aulas mínimas (faixa)</span>
                <Input
                  type="number"
                  min="0"
                  value={form.aulasMinimasFaixa}
                  onChange={(event) => updateField('aulasMinimasFaixa', event.target.value)}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Método de graus</span>
              <Select value={form.metodoGraus} onChange={(event) => updateField('metodoGraus', event.target.value)}>
                <option value="manual">Manual</option>
                <option value="mensal">Mensal</option>
              </Select>
            </label>
            {form.graus.length ? (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Graus</p>
                <div className="space-y-2">
                  {form.graus.map((grau, index) => (
                    <div key={grau.numero} className="grid grid-cols-1 gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:grid-cols-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">{grau.numero}º grau</div>
                      <label className="flex flex-col gap-1 text-xs md:col-span-1">
                        <span>Tempo mínimo</span>
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
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
