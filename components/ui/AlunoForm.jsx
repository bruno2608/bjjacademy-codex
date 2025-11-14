'use client';

/**
 * Formulário reutilizável para criação e edição de alunos.
 * Encapsula validação simples e dispara callbacks fornecidos pelas páginas.
 */
import { useState, useEffect } from 'react';

const planos = ['Mensal', 'Trimestral', 'Anual'];
const statusOptions = ['Ativo', 'Inativo'];

export default function AlunoForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    plano: planos[0],
    status: statusOptions[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
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
      <button type="submit" className="btn-primary w-full md:w-auto">Salvar</button>
    </form>
  );
}
