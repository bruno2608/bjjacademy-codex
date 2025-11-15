'use client';

/**
 * PresenceForm permite registrar rapidamente uma nova presença,
 * exibindo os alunos disponíveis e definindo status inicial.
 */
import { useEffect, useMemo, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useTreinosStore } from '../../store/treinosStore';

const statusOptions = ['Presente', 'Ausente'];

const obterHoraAtual = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

export default function PresenceForm({ onSubmit, initialData = null, onCancel, submitLabel }) {
  const alunos = useUserStore((state) => state.alunos);
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isEditing = Boolean(initialData?.id);

  const normalizarDiaSemana = (valor) => {
    const referencia = valor ? new Date(valor) : new Date();
    if (Number.isNaN(referencia.getTime())) return null;
    const nome = referencia.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    return nome.replace('-feira', '').trim();
  };

  const treinosDisponiveis = useMemo(() => {
    if (initialData?.treinoId && !treinos.some((treino) => treino.id === initialData.treinoId)) {
      return [
        ...treinos,
        {
          id: initialData.treinoId,
          nome: initialData.tipoTreino || 'Sessão principal',
          hora: initialData.hora || '--:--',
          diaSemana: normalizarDiaSemana(initialData.data) || ''
        }
      ];
    }
    return treinos;
  }, [initialData, normalizarDiaSemana, treinos]);

  const sugerirTreino = (dataReferencia) => {
    const dia = normalizarDiaSemana(dataReferencia) || normalizarDiaSemana(hoje);
    const candidatos = treinos.filter((treino) => treino.diaSemana === dia);
    return candidatos[0] || treinos[0] || null;
  };

  const [form, setForm] = useState({
    alunoId: initialData?.alunoId || '',
    data: initialData?.data || hoje,
    status: initialData?.status || statusOptions[0],
    treinoId:
      initialData?.treinoId ||
      (initialData ? sugerirTreino(initialData.data)?.id : sugerirTreino(hoje)?.id) ||
      ''
  });

  useEffect(() => {
    if (!initialData) return;
    setForm({
      alunoId: initialData.alunoId,
      data: initialData.data,
      status: initialData.status,
      treinoId: initialData.treinoId || sugerirTreino(initialData.data)?.id || ''
    });
  }, [initialData, treinos]);

  useEffect(() => {
    if (initialData) return;
    if (alunos.length > 0 && !form.alunoId) {
      setForm((prev) => ({ ...prev, alunoId: alunos[0].id }));
    }
  }, [alunos, form.alunoId, initialData]);

  useEffect(() => {
    if (initialData || isEditing) return;
    if (!form.treinoId) {
      const sugestao = sugerirTreino(form.data);
      if (sugestao?.id) {
        setForm((prev) => ({ ...prev, treinoId: sugestao.id }));
      }
    }
  }, [form.data, form.treinoId, initialData, isEditing, treinos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (name === 'data' && !isEditing) {
        const sugestao = sugerirTreino(value);
        return { ...prev, data: value, treinoId: sugestao?.id || prev.treinoId };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const alunoSelecionado = alunos.find((aluno) => aluno.id === form.alunoId);
    if (!alunoSelecionado) return;

    const treinoSelecionado =
      treinosDisponiveis.find((treino) => treino.id === form.treinoId) || sugerirTreino(form.data);
    const horaSessao = treinoSelecionado?.hora || initialData?.hora || obterHoraAtual();

    onSubmit({
      ...form,
      hora: horaSessao,
      treinoId: treinoSelecionado?.id || form.treinoId || null,
      tipoTreino: treinoSelecionado?.nome || 'Sessão principal',
      alunoNome: alunoSelecionado.nome,
      faixa: alunoSelecionado.faixa,
      graus: alunoSelecionado.graus
    });

    if (!isEditing) {
      const sugestao = sugerirTreino(hoje);
      setForm({
        alunoId: alunos[0]?.id || '',
        data: hoje,
        status: statusOptions[0],
        treinoId: sugestao?.id || ''
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="lg:col-span-2">
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
            disabled={isEditing}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Treino / sessão</label>
          <select
            name="treinoId"
            className="input-field"
            value={form.treinoId}
            onChange={handleChange}
          >
            {treinosDisponiveis.map((treino) => (
              <option key={treino.id} value={treino.id}>
                {treino.nome} · {treino.hora}
              </option>
            ))}
            {!treinosDisponiveis.length && <option value="">Sessão principal</option>}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select name="status" className="input-field" value={form.status} onChange={handleChange}>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary md:w-auto">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary md:w-auto">
          {submitLabel || (isEditing ? 'Salvar alterações' : 'Registrar presença')}
        </button>
      </div>
    </form>
  );
}
