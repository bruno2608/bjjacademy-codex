'use client';

import { useMemo, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useUserStore from '../../store/userStore';
import { useAlunosStore } from '../../store/alunosStore';

export default function PerfilAlunoPage() {
  const { user } = useUserStore();
  const alunos = useAlunosStore((state) => state.alunos);
  const updateAluno = useAlunosStore((state) => state.updateAluno);
  const aluno = useMemo(() => alunos.find((item) => item.id === user?.alunoId) || alunos[0], [alunos, user?.alunoId]);
  const [form, setForm] = useState({
    nome: aluno?.nome || '',
    telefone: aluno?.telefone || '',
    email: aluno?.email || '',
    avatarUrl: aluno?.avatarUrl || ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateAluno(aluno.id, form);
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Perfil</p>
        <h1 className="text-2xl font-semibold">Dados do aluno</h1>
        <p className="text-sm text-bjj-gray-300/80">Altere apenas suas informações pessoais. Plano e faixa são somente leitura.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">Nome</label>
            <Input name="nome" value={form.nome} onChange={handleChange} className="mt-2" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">Telefone</label>
            <Input name="telefone" value={form.telefone} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">Email</label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} className="mt-2" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">Foto de perfil (URL)</label>
            <Input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className="mt-2" placeholder="https://" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Faixa</p>
            <p className="text-lg font-semibold">{aluno?.faixa}</p>
          </div>
          <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Grau</p>
            <p className="text-lg font-semibold">{aluno?.graus}</p>
          </div>
          <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Plano</p>
            <p className="text-lg font-semibold">{aluno?.plano || 'Mensal'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="px-5">Salvar alterações</Button>
          {saved && <span className="text-sm text-green-300">Dados atualizados</span>}
        </div>
      </form>
    </div>
  );
}
