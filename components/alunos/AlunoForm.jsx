'use client';

/**
 * Formulário reutilizável para criação e edição de alunos.
 * Encapsula validação simples e dispara callbacks fornecidos pelas páginas.
 */
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { beltConfigBySlug, getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { PLANOS_MOCK, STATUS_ALUNO } from '../../data/catalogs';
import { useGraduationRulesStore } from '../../store/graduationRulesStore';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import FormSection from '../ui/FormSection';
import { iconColors, iconSizes } from '@/styles/iconTokens';

const formatTelefone = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export default function AlunoForm({ initialData, onSubmit, isSubmitting = false, submitLabel = 'Salvar' }) {
  const rules = useGraduationRulesStore((state) => state.rules);

  const beltOptions = useMemo(() => {
    const baseOptions = Object.values(rules || {}).map((rule) => {
      const faixaConfig = getFaixaConfigBySlug(rule.faixaSlug);
      return {
        slug: rule.faixaSlug,
        label: faixaConfig?.nome || rule.faixaSlug,
        maxStripes: rule.grausMaximos ?? rule.graus?.length ?? 0,
        order: faixaConfig?.id ?? Number.MAX_SAFE_INTEGER
      };
    });

    if (baseOptions.length) {
      return baseOptions.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
    }

    const fallbackOptions = Object.values(beltConfigBySlug)
      .filter((item) => item.slug !== 'vermelha')
      .map((item) => ({
        slug: item.slug,
        label: item.nome,
        maxStripes: item.grausMaximos ?? 0,
        order: item.id ?? Number.MAX_SAFE_INTEGER
      }));

    return fallbackOptions.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  }, [rules]);

  const planos = useMemo(() => PLANOS_MOCK, []);
  const statusOptions = useMemo(() => STATUS_ALUNO, []);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    plano: planos[0],
    status: statusOptions[0],
    faixa: beltOptions[0]?.label || 'Branca',
    faixaSlug: beltOptions[0]?.slug || 'branca-adulto',
    graus: 0,
    mesesNaFaixa: 0,
    dataUltimaGraduacao: ''
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        telefone: initialData.telefone ? formatTelefone(initialData.telefone) : '',
        plano: initialData.plano || planos[0],
        status: initialData.status || statusOptions[0],
        faixa: initialData.faixa || initialData.faixaSlug || beltOptions[0]?.label || 'Branca',
        faixaSlug:
          initialData.faixaSlug || beltOptions[0]?.slug || 'branca-adulto',
        graus: Number(initialData.graus ?? 0),
        mesesNaFaixa: Number(initialData.mesesNaFaixa ?? 0),
        dataUltimaGraduacao: initialData.dataUltimaGraduacao || ''
      });
    }
  }, [initialData, planos, statusOptions, beltOptions]);

  useEffect(() => {
    if (!beltOptions.length) return;
    setFormData((prev) => ({
      ...prev,
      faixa: beltOptions.find((item) => item.slug === prev.faixaSlug)?.label || beltOptions[0].label,
      faixaSlug: beltOptions.find((item) => item.slug === prev.faixaSlug)?.slug || beltOptions[0].slug
    }));
  }, [beltOptions]);

  const getStripeLimit = useCallback(
    (slug) => beltOptions.find((item) => item.slug === slug)?.maxStripes ?? 0,
    [beltOptions]
  );

  useEffect(() => {
    setFormData((prev) => {
      const limite = getStripeLimit(prev.faixaSlug);
      if (limite === 0 && prev.graus !== 0) {
        return { ...prev, graus: 0 };
      }
      if (limite > 0 && prev.graus > limite) {
        return { ...prev, graus: limite };
      }
      return prev;
    });
  }, [formData.faixaSlug, getStripeLimit]);

  const grauOptions = useMemo(() => {
    const limite = getStripeLimit(formData.faixaSlug);
    const max = limite > 0 ? limite : 0;
    return Array.from({ length: max + 1 }, (_, index) => index);
  }, [formData.faixaSlug, getStripeLimit]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (name === 'telefone') {
      setFormData((prev) => ({ ...prev, telefone: formatTelefone(value) }));
      setErrors((prev) => ({ ...prev, telefone: undefined }));
      return;
    }

    if (name === 'faixaSlug') {
      const selecionada = beltOptions.find((item) => item.slug === value) || beltOptions[0];
      setFormData((prev) => ({
        ...prev,
        faixaSlug: selecionada?.slug || value,
        faixa: selecionada?.label || prev.faixa
      }));
      setErrors((prev) => ({ ...prev, faixaSlug: undefined }));
      return;
    }

    let parsed = value;
    if (name === 'graus' || type === 'number') {
      parsed = Math.max(0, Number(value));
    }

    setFormData((prev) => ({ ...prev, [name]: parsed }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.nome.trim()) {
      nextErrors.nome = 'Informe o nome completo.';
    }

    const phoneDigits = formData.telefone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      nextErrors.telefone = 'Use DDD + telefone (10 ou 11 dígitos).';
    }

    if (formData.mesesNaFaixa < 0) {
      nextErrors.mesesNaFaixa = 'Valor inválido.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    if (!validateForm()) {
      return;
    }
    onSubmit({
      ...formData,
      faixaSlug: formData.faixaSlug,
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
        <FormSection
          title="Perfil"
          description="Dados básicos do aluno."
          className={`md:col-span-1 ${step === 0 ? 'block' : 'hidden md:block'}`}
        >
          <div className="space-y-3.5">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome</label>
              <Input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
                minLength={3}
                autoComplete="name"
                className={errors.nome ? 'border-bjj-red focus:border-bjj-red' : ''}
              />
              {errors.nome && <p className="mt-1 text-xs text-bjj-red">{errors.nome}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Telefone</label>
              <Input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
                type="tel"
                inputMode="tel"
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                maxLength={16}
                className={errors.telefone ? 'border-bjj-red focus:border-bjj-red' : ''}
              />
              {errors.telefone && <p className="mt-1 text-xs text-bjj-red">{errors.telefone}</p>}
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Plano e status"
          description="Controle de participação."
          className={`md:col-span-1 ${step === 1 ? 'block' : 'hidden md:block'}`}
        >
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
        </FormSection>

        <FormSection
          title="Graduação"
          description="Histórico técnico do atleta."
          className={`md:col-span-1 ${step === 2 ? 'block' : 'hidden md:block'}`}
        >
          <div className="space-y-3.5">
            <div>
              <label className="mb-2 block text-sm font-medium">Faixa atual</label>
              <Select name="faixaSlug" value={formData.faixaSlug} onChange={handleChange}>
                {beltOptions.map((faixa) => (
                  <option key={faixa.slug} value={faixa.slug}>
                    {faixa.label}
                  </option>
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
                inputMode="numeric"
                value={formData.mesesNaFaixa}
                onChange={handleChange}
                placeholder="Meses dedicados na faixa atual"
                className={errors.mesesNaFaixa ? 'border-bjj-red focus:border-bjj-red' : ''}
              />
              {errors.mesesNaFaixa && <p className="mt-1 text-xs text-bjj-red">{errors.mesesNaFaixa}</p>}
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
        </FormSection>
      </div>

      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex justify-between text-[11px] text-bjj-gray-200/70">
          <span>{steps[step].label}</span>
          <span>
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            className="btn-sm"
            onClick={prevStep}
            disabled={step === 0}
          >
            <ChevronLeft size={14} className={`${iconSizes.sm} ${iconColors.default}`} /> Voltar
          </Button>
          <Button
            type={isLastStep ? 'submit' : 'button'}
            className="btn-sm"
            onClick={isLastStep ? undefined : nextStep}
            disabled={isSubmitting}
          >
            {isLastStep ? submitLabel : 'Avançar'}
            {!isLastStep && <ChevronRight size={14} className={`${iconSizes.sm} ${iconColors.default}`} />}
          </Button>
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
