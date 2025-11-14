'use client';

/**
 * Página de graduações acompanha o progresso dos alunos rumo às próximas faixas
 * com possibilidade de atualizar status e agendar novas cerimônias.
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import GraduationList from '../../../components/ui/GraduationList';
import { getGraduacoes, scheduleGraduacao, updateGraduacao } from '../../../services/graduacoesService';
import useUserStore from '../../../store/userStore';

export default function GraduacoesPage() {
  const [graduacoes, setGraduacoes] = useState([]);
  const alunos = useUserStore((state) => state.alunos);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { alunoId: alunos[0]?.id || '', faixaAtual: '', proximaFaixa: '', previsao: '' }
  });

  useEffect(() => {
    getGraduacoes().then(setGraduacoes);
  }, []);

  useEffect(() => {
    reset({ alunoId: alunos[0]?.id || '', faixaAtual: '', proximaFaixa: '', previsao: '' });
  }, [alunos, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const alunoSelecionado = alunos.find((aluno) => aluno.id === values.alunoId);
    if (!alunoSelecionado) return;
    const novaGraduacao = await scheduleGraduacao({
      ...values,
      alunoNome: alunoSelecionado.nome,
      status: 'Planejado'
    });
    setGraduacoes((prev) => [...prev, novaGraduacao]);
    reset({ alunoId: alunos[0]?.id || '', faixaAtual: '', proximaFaixa: '', previsao: '' });
  });

  const handleStatusChange = async (graduacao, novoStatus) => {
    const atualizado = await updateGraduacao(graduacao.id, { status: novoStatus });
    setGraduacoes((prev) => prev.map((item) => (item.id === graduacao.id ? atualizado : item)));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Linha do tempo de graduações</h2>
        <p className="text-sm text-bjj-gray-200/70">
          Visualize o caminho de evolução dos atletas e mantenha o calendário de cerimônias organizado.
        </p>
      </header>
      <section className="card space-y-4">
        <h3 className="text-lg font-semibold">Agendar nova graduação</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Aluno</label>
            <select {...register('alunoId')} className="input-field">
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Faixa atual</label>
            <input {...register('faixaAtual', { required: true })} className="input-field" placeholder="Faixa atual" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Próxima faixa</label>
            <input {...register('proximaFaixa', { required: true })} className="input-field" placeholder="Faixa alvo" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Previsão</label>
            <input type="date" {...register('previsao', { required: true })} className="input-field" />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="btn-primary">Salvar agenda</button>
          </div>
        </form>
      </section>
      <GraduationList graduacoes={graduacoes} onStatusChange={handleStatusChange} />
    </div>
  );
}
