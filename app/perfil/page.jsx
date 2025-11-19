"use client";

import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import ValidatedField from '../../components/ui/ValidatedField';
import { ROLE_KEYS } from '../../config/roles';
import useUserStore from '../../store/userStore';
import { useAlunosStore } from '../../store/alunosStore';

export default function PerfilAlunoPage() {
  const { user, updateUser } = useUserStore();
  const alunos = useAlunosStore((state) => state.alunos);
  const updateAluno = useAlunosStore((state) => state.updateAluno);
  const isAluno = user?.roles?.includes(ROLE_KEYS.aluno);
  const aluno = useMemo(() => {
    if (!isAluno) return null;
    return alunos.find((item) => item.id === user?.alunoId) || alunos[0] || null;
  }, [alunos, isAluno, user?.alunoId]);

  const professorRoles = useMemo(
    () => (user?.roles || []).filter((role) => role !== ROLE_KEYS.aluno),
    [user?.roles]
  );

  const deriveInitialForm = () => ({
    nome: (isAluno ? aluno?.nome : user?.name) || '',
    telefone: (isAluno ? aluno?.telefone : user?.telefone) || '',
    email: (isAluno ? aluno?.email : user?.email) || '',
    avatarUrl: (isAluno ? aluno?.avatarUrl : user?.avatarUrl) || ''
  });

  const [form, setForm] = useState(deriveInitialForm);
  const [fileName, setFileName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(deriveInitialForm());
  }, [aluno, user, isAluno]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatarUrl: previewUrl }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isAluno && aluno) {
      updateAluno(aluno.id, form);
    } else {
      updateUser?.({
        name: form.nome,
        telefone: form.telefone,
        email: form.email,
        avatarUrl: form.avatarUrl
      });
    }
    setSaved(true);
  };

  const disabledFieldClass =
    'input input-bordered input-primary w-full border border-bjj-gray-500/80 bg-bjj-gray-800/90 text-sm font-semibold text-bjj-gray-100/90 placeholder:text-bjj-gray-200 disabled:cursor-not-allowed disabled:border-bjj-gray-500 disabled:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_12px,rgba(255,255,255,0.03)_12px,rgba(255,255,255,0.03)_24px)]';

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Perfil</p>
        <h1 className="text-2xl font-semibold">{isAluno ? 'Dados do aluno' : 'Perfil do professor'}</h1>
        <p className="text-sm text-bjj-gray-300/80">
          {isAluno
            ? 'Altere apenas suas informações pessoais. Plano e faixa são somente leitura.'
            : 'Mantenha seus contatos atualizados. Papéis e credenciais são controlados pela secretaria.'}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ValidatedField
            name="nome"
            label="Nome"
            placeholder="Seu nome completo"
            value={form.nome}
            onChange={handleChange}
            helper="Como deve aparecer nos certificados"
            required
          />
          <ValidatedField
            name="telefone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={form.telefone}
            onChange={handleChange}
            helper="Use DDD para contato"
          />
          <ValidatedField
            type="email"
            name="email"
            label="Email"
            placeholder="voce@bjj.academy"
            value={form.email}
            onChange={handleChange}
            helper="Usado para notificações"
            required
          />
          <div className="form-control w-full">
            <div className="label pb-1">
              <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/80">Foto de perfil</span>
              <span className="label-text-alt text-[11px] text-bjj-gray-300">PNG ou JPG</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-primary w-full border-bjj-gray-800 bg-bjj-gray-900"
              onChange={handleFileChange}
            />
            <div className="label pt-1">
              <span className="label-text-alt text-[11px] text-bjj-gray-300">{fileName || 'Opcional, manter foto atual'}</span>
            </div>
            {form.avatarUrl && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-bjj-gray-800 bg-bjj-black/50 p-3 text-sm">
                <img src={form.avatarUrl} alt="Preview do avatar" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Pré-visualização</p>
                  <p className="text-sm text-bjj-gray-100">Sua foto aparecerá nos relatórios e cartões digitais.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isAluno ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Faixa</span>
              </div>
              <input
                disabled
                value={aluno?.faixa || '—'}
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Gerenciado pelo instrutor</span>
              </div>
            </label>
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Grau</span>
              </div>
              <input
                disabled
                value={`${aluno?.graus || 0}º`}
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Controle exclusivo da academia</span>
              </div>
            </label>
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Plano</span>
              </div>
              <input
                disabled
                value={aluno?.plano || 'Mensal'}
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Alterações via secretaria</span>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Papéis</span>
              </div>
              <input
                disabled
                value={
                  professorRoles.length
                    ? professorRoles.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')
                    : 'Instrutor'
                }
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Definido pela coordenação</span>
              </div>
            </label>
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Unidade</span>
              </div>
              <input
                disabled
                value={user?.unidade || 'Matriz - Vila Mariana'}
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Atualize com a secretaria se mudar</span>
              </div>
            </label>
            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Especialidade</span>
              </div>
              <input
                disabled
                value={user?.especialidade || 'Aulas avançadas e No-Gi'}
                className={disabledFieldClass}
                readOnly
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Editável apenas pela coordenação</span>
              </div>
            </label>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" className="px-5">Salvar alterações</Button>
          {saved && <span className="text-sm text-green-300">Dados atualizados</span>}
        </div>
      </form>
    </div>
  );
}
