'use client';

/**
 * PresenceForm permite registrar rapidamente uma nova presença,
 * exibindo os alunos disponíveis e definindo status inicial.
 */
import { useEffect, useMemo, useState } from 'react';
import useUserStore from '../../store/userStore';

const statusOptions = ['Presente', 'Ausente'];

const obterHoraAtual = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

export default function PresenceForm({ onSubmit, initialData = null, onCancel, submitLabel }) {
  const alunos = useUserStore((state) => state.alunos);
  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isEditing = Boolean(initialData?.id);
  const [form, setForm] = useState({
    alunoId: initialData?.alunoId || '',
    data: initialData?.data || hoje,
    status: initialData?.status || statusOptions[0],
    hora: initialData?.hora || obterHoraAtual()
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        alunoId: initialData.alunoId,
        data: initialData.data,
        status: initialData.status,
        hora: initialData.hora || obterHoraAtual()
      });
      return;
    }

    if (alunos.length > 0 && !form.alunoId) {
      setForm((prev) => ({ ...prev, alunoId: alunos[0].id }));
    }
  }, [alunos, form.alunoId, initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const abrirSeletorNativo = (event) => {
    if (typeof event.target.showPicker === 'function') {
      event.target.showPicker();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const alunoSelecionado = alunos.find((aluno) => aluno.id === form.alunoId);
    if (!alunoSelecionado) return;
    onSubmit({
      ...form,
      alunoNome: alunoSelecionado.nome,
      faixa: alunoSelecionado.faixa,
      graus: alunoSelecionado.graus
    });
    if (!isEditing) {
      setForm({
        alunoId: alunos[0]?.id || '',
        data: hoje,
        status: statusOptions[0],
        hora: obterHoraAtual()
      });
    }
  };

  return (
    <form className="grid grid-cols-1 gap-4 md:grid-cols-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2">Aluno</label>
        <select
          name="alunoId"
          className="input-field"
          value={form.alunoId}
          onChange={handleChange}
          disabled={isEditing}
        >
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome} · {aluno.faixa} ({aluno.graus}º grau)
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
          onClick={abrirSeletorNativo}
          onFocus={abrirSeletorNativo}
          disabled={isEditing}
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
      <div>
        <label className="block text-sm font-medium mb-2">Horário</label>
        <input
          name="hora"
          type="time"
          className="input-field"
          value={form.hora}
          onChange={handleChange}
          onClick={abrirSeletorNativo}
          onFocus={abrirSeletorNativo}
          required
        />
      </div>
      <div className="flex items-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary w-full"
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary w-full">
          {submitLabel || (isEditing ? 'Salvar alterações' : 'Registrar presença')}
        </button>
      </div>
    </form>
  );
}
