'use client';

import { useEffect, useMemo, useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useUserStore from '../../../store/userStore';
import { useAlunosStore } from '../../../store/alunosStore';

const buildInitials = (name = '', email = '') => {
  const source = name || email || 'Instrutor';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (!parts.length) return 'IN';
  return parts
    .slice(0, 2)
    .map((value) => value[0])
    .join('')
    .toUpperCase();
};

export default function PerfilPage() {
  const { user, updateUser } = useUserStore();
  const roles = user?.roles || [];
  const isAluno = roles.includes('ALUNO');

  const alunos = useAlunosStore((state) => state.alunos);
  const updateAluno = useAlunosStore((state) => state.updateAluno);

  const aluno = useMemo(
    () => alunos.find((item) => item.id === user?.alunoId) || alunos[0],
    [alunos, user?.alunoId]
  );

  const [form, setForm] = useState({
    nome: user?.name || aluno?.nome || '',
    telefone: aluno?.telefone || '',
    email: user?.email || aluno?.email || '',
    avatarUrl: aluno?.avatarUrl || user?.avatarUrl || ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      nome: user?.name || aluno?.nome || '',
      telefone: aluno?.telefone || '',
      email: user?.email || aluno?.email || '',
      avatarUrl: aluno?.avatarUrl || user?.avatarUrl || ''
    });
  }, [aluno?.avatarUrl, aluno?.email, aluno?.nome, aluno?.telefone, user?.avatarUrl, user?.email, user?.name]);

  const initials = buildInitials(user?.name, user?.email);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser?.({ name: form.nome, email: form.email, avatarUrl: form.avatarUrl });
    if (isAluno && aluno?.id) {
      updateAluno(aluno.id, {
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        avatarUrl: form.avatarUrl
      });
    }
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Preferências pessoais</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-lg font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt={`Avatar de ${form.nome || 'Instrutor'}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              initials
            )}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-bjj-white">Meu Perfil</h1>
            <p className="mt-1 text-sm text-bjj-gray-200/70">
              Campos e permissões ajustam automaticamente conforme o papel do usuário.
            </p>
          </div>
          <div className="ml-auto inline-flex flex-wrap gap-2 text-xs">
            {(roles.length ? roles : ['INSTRUTOR']).map((role) => (
              <span key={role} className="rounded-full border border-bjj-red/50 bg-bjj-red/10 px-3 py-1 font-semibold text-bjj-white">
                {role}
              </span>
            ))}
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">
            Nome
            <Input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              disabled={!isAluno && !updateUser}
              className="text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">
            Telefone
            <Input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              disabled={!isAluno}
              className="text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">
            E-mail
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!isAluno && !updateUser}
              className="text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-400">
            Foto de perfil (URL)
            <Input
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={handleChange}
              placeholder="https://"
              disabled={!isAluno && !updateUser}
              className="text-base"
            />
          </label>
        </div>

        {isAluno && aluno ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Faixa</p>
              <p className="mt-1 text-lg font-semibold">{aluno.faixa}</p>
            </div>
            <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Grau</p>
              <p className="mt-1 text-lg font-semibold">{aluno.graus}</p>
            </div>
            <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Plano</p>
              <p className="mt-1 text-lg font-semibold">{aluno.plano || 'Mensal'}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/50 p-4 text-sm text-bjj-gray-200/80">
            Dados de graduação e planos ficam ocultos para perfis administrativos. Utilize a ficha do aluno para alterações.
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" className="px-5" disabled={!isAluno && !updateUser}>
            Salvar alterações
          </Button>
          {saved && <span className="text-sm text-green-300">Preferências atualizadas</span>}
          {!isAluno && (
            <span className="text-xs text-bjj-gray-300/70">Alguns campos permanecem somente leitura para este papel.</span>
          )}
        </div>
      </form>
    </div>
  );
}
