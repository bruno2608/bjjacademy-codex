'use client';

import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import ValidatedField from '../../components/ui/ValidatedField';
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
  const [fileName, setFileName] = useState('');
  const [saved, setSaved] = useState(false);

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

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="form-control">
            <div className="label pb-1">
              <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-100">Faixa</span>
            </div>
            <input
              disabled
              value={aluno?.faixa || '—'}
              className="input input-bordered input-primary w-full border border-bjj-gray-600/70 bg-gradient-to-r from-bjj-gray-700/90 via-bjj-gray-800/90 to-bjj-gray-950 text-sm font-semibold text-white placeholder:text-bjj-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.32)] disabled:border-bjj-gray-500/80 disabled:bg-bjj-gray-800"
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
              className="input input-bordered input-primary w-full border border-bjj-gray-600/70 bg-gradient-to-r from-bjj-gray-700/90 via-bjj-gray-800/90 to-bjj-gray-950 text-sm font-semibold text-white placeholder:text-bjj-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.32)] disabled:border-bjj-gray-500/80 disabled:bg-bjj-gray-800"
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
              className="input input-bordered input-primary w-full border border-bjj-gray-600/70 bg-gradient-to-r from-bjj-gray-700/90 via-bjj-gray-800/90 to-bjj-gray-950 text-sm font-semibold text-white placeholder:text-bjj-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.32)] disabled:border-bjj-gray-500/80 disabled:bg-bjj-gray-800"
              readOnly
            />
            <div className="label pt-1">
              <span className="label-text-alt text-[11px] text-bjj-gray-50/80">Alterações via secretaria</span>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="px-5">Salvar alterações</Button>
          {saved && <span className="text-sm text-green-300">Dados atualizados</span>}
        </div>
      </form>
    </div>
  );
}
