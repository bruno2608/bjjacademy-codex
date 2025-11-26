'use client';

/**
 * PresenceForm permite registrar rapidamente uma nova presença,
 * exibindo os alunos disponíveis e definindo status inicial.
 */
import { useEffect, useMemo, useState } from 'react';
import { useAlunosStore } from '../../store/alunosStore';
import { useTreinosStore } from '../../store/treinosStore';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const statusOptions = ['PRESENTE', 'PENDENTE', 'FALTA', 'JUSTIFICADA'];

export default function PresenceForm({ onSubmit, initialData = null, onCancel, submitLabel }) {
  const alunos = useAlunosStore((state) => state.alunos);
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
      if (name === 'data') {
        const sugestao = sugerirTreino(value);
        const treinoValido =
          prev.treinoId && treinosDisponiveis.some((treino) => treino.id === prev.treinoId)
            ? prev.treinoId
            : sugestao?.id;
        return { ...prev, data: value, treinoId: treinoValido || '' };
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

    onSubmit({
      ...form,
      treinoId: treinoSelecionado?.id || form.treinoId || null
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
          <Select name="alunoId" value={form.alunoId} onChange={handleChange}>
            {alunos.map((aluno) => {
              const faixa = aluno.faixaSlug || aluno.faixa || 'Sem faixa';
              const grauAtual = Number.isFinite(Number(aluno.graus)) ? Number(aluno.graus) : 0;
              return (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome} · {faixa} ({grauAtual}º grau)
                </option>
              );
            })}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Data</label>
          <Input
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Treino / sessão</label>
          <Select name="treinoId" value={form.treinoId} onChange={handleChange}>
            {treinosDisponiveis.map((treino) => (
              <option key={treino.id} value={treino.id}>
                {treino.nome} · {treino.hora}
              </option>
            ))}
            {!treinosDisponiveis.length && <option value="">Sessão principal</option>}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select name="status" value={form.status} onChange={handleChange}>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="md:w-auto">
            Cancelar
          </Button>
        )}
        <Button type="submit" className="md:w-auto">
          {submitLabel || (isEditing ? 'Salvar alterações' : 'Registrar presença')}
        </Button>
      </div>
    </form>
  );
}
