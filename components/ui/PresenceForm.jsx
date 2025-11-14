'use client';

/**
 * PresenceForm permite registrar rapidamente uma nova presença,
 * exibindo os alunos disponíveis e definindo status inicial.
 */
import { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';

const statusOptions = ['Presente', 'Ausente'];

export default function PresenceForm({ onSubmit }) {
  const alunos = useUserStore((state) => state.alunos);
  const [form, setForm] = useState({ alunoId: '', data: '', status: statusOptions[0] });

  useEffect(() => {
    if (alunos.length > 0 && !form.alunoId) {
      setForm((prev) => ({ ...prev, alunoId: alunos[0].id }));
    }
  }, [alunos, form.alunoId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const alunoSelecionado = alunos.find((aluno) => aluno.id === form.alunoId);
    if (!alunoSelecionado) return;
    onSubmit({
      ...form,
      alunoNome: alunoSelecionado.nome
    });
    setForm({ alunoId: alunos[0]?.id || '', data: '', status: statusOptions[0] });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2">Aluno</label>
        <select name="alunoId" className="input-field" value={form.alunoId} onChange={handleChange}>
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Data</label>
        <input
          name="data"
          type="date"
          className="input-field"
          value={form.data}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select name="status" className="input-field" value={form.status} onChange={handleChange}>
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full">
          Registrar presença
        </button>
      </div>
    </form>
  );
}
