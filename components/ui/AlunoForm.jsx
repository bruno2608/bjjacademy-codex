'use client';

/**
 * Formulário reutilizável para criação e edição de alunos.
 * Encapsula validação simples e dispara callbacks fornecidos pelas páginas.
 */
import { useEffect, useMemo, useState } from 'react';
import { BELT_ORDER, getMaxStripes } from '../../lib/graduationRules';

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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2">Nome</label>
        <input
          name="nome"
          className="input-field"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome completo"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Telefone</label>
        <input
          name="telefone"
          className="input-field"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Plano</label>
          <select name="plano" className="input-field" value={formData.plano} onChange={handleChange}>
            {planos.map((plano) => (
              <option key={plano}>{plano}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select name="status" className="input-field" value={formData.status} onChange={handleChange}>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Faixa atual</label>
          <select name="faixa" className="input-field" value={formData.faixa} onChange={handleChange}>
            {beltOptions.map((faixa) => (
              <option key={faixa}>{faixa}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Graus</label>
          <select name="graus" className="input-field" value={formData.graus} onChange={handleChange}>
            {grauOptions.map((grau) => (
              <option key={grau} value={grau}>
                {grau}
              </option>
            ))}
          </select>
          <p className="text-xs text-bjj-gray-200/70 mt-1">Selecione a quantidade de graus já conquistados.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Meses na faixa</label>
          <input
            name="mesesNaFaixa"
            type="number"
            min={0}
            className="input-field"
            value={formData.mesesNaFaixa}
            onChange={handleChange}
            placeholder="Meses dedicados na faixa atual"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Última graduação</label>
        <input
          name="dataUltimaGraduacao"
          type="date"
          className="input-field"
          value={formData.dataUltimaGraduacao || ''}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}
