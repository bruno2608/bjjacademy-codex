'use client';

/**
 * Formulário reutilizável para criação e edição de alunos.
 * Encapsula validação simples e dispara callbacks fornecidos pelas páginas.
 */
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BELT_ORDER, getMaxStripes } from '../../lib/graduationRules';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const planos = ['Mensal', 'Trimestral', 'Anual'];
const statusOptions = ['Ativo', 'Inativo'];
const beltOptions = BELT_ORDER.filter((faixa) => faixa !== 'Vermelha');

export default function AlunoForm({ initialData, onSubmit, isSubmitting = false, submitLabel = 'Salvar' }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    plano: planos[0],
    status: statusOptions[0],
    faixa: 'Branca',
    graus: 0,
    mesesNaFaixa: 0,
    dataUltimaGraduacao: ''
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        telefone: initialData.telefone || '',
        plano: initialData.plano || planos[0],
        status: initialData.status || statusOptions[0],
        faixa: initialData.faixa || 'Branca',
        graus: Number(initialData.graus ?? 0),
        mesesNaFaixa: Number(initialData.mesesNaFaixa ?? 0),
        dataUltimaGraduacao: initialData.dataUltimaGraduacao || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    setFormData((prev) => {
      const limite = getMaxStripes(prev.faixa);
      if (limite === 0 && prev.graus !== 0) {
        return { ...prev, graus: 0 };
      }
      if (limite > 0 && prev.graus > limite) {
        return { ...prev, graus: limite };
      }
      return prev;
    });
  }, [formData.faixa]);

  const grauOptions = useMemo(() => {
    const limite = getMaxStripes(formData.faixa);
    const max = limite > 0 ? limite : 0;
    return Array.from({ length: max + 1 }, (_, index) => index);
  }, [formData.faixa]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let parsed = value;
    if (name === 'graus' || type === 'number') {
      parsed = Number(value);
    }
    setFormData((prev) => ({ ...prev, [name]: parsed }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    onSubmit({
      ...formData,
      graus: Number(formData.graus),
      mesesNaFaixa: Number(formData.mesesNaFaixa)
    });
  };

  const steps = [
    { id: 'perfil', label: 'Perfil', description: 'Dados pessoais e contato.' },
    { id: 'plano', label: 'Plano', description: 'Status contratual e participação.' },
    { id: 'graduacao', label: 'Graduação', description: 'Faixa, graus e histórico.' }
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const isLastStep = step === steps.length - 1;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="md:hidden">
        <nav className="flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-2.5">
          {steps.map((item, index) => {
            const active = index === step;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(index)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] transition ${
                  active ? 'bg-bjj-red/20 text-bjj-red' : 'text-bjj-gray-200/70'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">{item.label}</span>
                <span className="text-[10px] text-bjj-gray-200/60">{item.description}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section
          className={`space-y-3.5 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 md:col-span-1 ${
            step === 0 ? 'block' : 'hidden md:block'
          }`}
        >
          <header className="space-y-1">
            <h3 className="text-sm font-semibold text-bjj-white">Perfil</h3>
            <p className="text-xs text-bjj-gray-200/70">Dados básicos do aluno.</p>
          </header>
          <div className="space-y-3.5">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome</label>
              <Input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Telefone</label>
              <Input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>
        </section>

        <section
          className={`space-y-3.5 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 md:col-span-1 ${
            step === 1 ? 'block' : 'hidden md:block'
          }`}
        >
          <header className="space-y-1">
            <h3 className="text-sm font-semibold text-bjj-white">Plano e status</h3>
            <p className="text-xs text-bjj-gray-200/70">Controle de participação.</p>
          </header>
          <div className="space-y-3.5">
            <div>
              <label className="mb-2 block text-sm font-medium">Plano</label>
              <Select name="plano" value={formData.plano} onChange={handleChange}>
                {planos.map((plano) => (
                  <option key={plano}>{plano}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <Select name="status" value={formData.status} onChange={handleChange}>
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        <section
          className={`space-y-3.5 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 md:col-span-1 ${
            step === 2 ? 'block' : 'hidden md:block'
          }`}
        >
          <header className="space-y-1">
            <h3 className="text-sm font-semibold text-bjj-white">Graduação</h3>
            <p className="text-xs text-bjj-gray-200/70">Histórico técnico do atleta.</p>
          </header>
          <div className="space-y-3.5">
            <div>
              <label className="mb-2 block text-sm font-medium">Faixa atual</label>
              <Select name="faixa" value={formData.faixa} onChange={handleChange}>
                {beltOptions.map((faixa) => (
                  <option key={faixa}>{faixa}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Graus</label>
              <Select name="graus" value={formData.graus} onChange={handleChange}>
                {grauOptions.map((grau) => (
                  <option key={grau} value={grau}>
                    {grau}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-[11px] text-bjj-gray-200/70">Selecione a quantidade de graus já conquistados.</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Meses na faixa</label>
              <Input
                name="mesesNaFaixa"
                type="number"
                min={0}
                value={formData.mesesNaFaixa}
                onChange={handleChange}
                placeholder="Meses dedicados na faixa atual"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Última graduação</label>
              <Input
                name="dataUltimaGraduacao"
                type="date"
                value={formData.dataUltimaGraduacao || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex justify-between text-[11px] text-bjj-gray-200/70">
          <span>{steps[step].label}</span>
          <span>
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1 rounded-lg border border-bjj-gray-800 px-3.5 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red disabled:cursor-not-allowed disabled:opacity-50"
            disabled={step === 0}
          >
            <ChevronLeft size={14} /> Voltar
          </button>
          <button
            type={isLastStep ? 'submit' : 'button'}
            onClick={isLastStep ? undefined : nextStep}
            className="inline-flex items-center gap-1.5 rounded-lg bg-bjj-red px-3.5 py-2 text-xs font-semibold text-bjj-white transition hover:bg-bjj-red/80 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isLastStep ? submitLabel : 'Avançar'}
            {!isLastStep && <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-5 py-3.5">
        <div className="text-sm text-bjj-gray-200/70">
          <p>
            <span className="font-semibold text-bjj-white">{formData.nome || 'Aluno sem nome'}</span> ·{' '}
            {formData.faixa} ({formData.graus}º grau)
          </p>
          <p>Plano {formData.plano} · {formData.status}</p>
        </div>
        <Button
          type="submit"
          className="disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>

      {isLastStep && (
        <div className="md:hidden">
          <Button
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
