'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

function ResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ senha: '', confirmacaoSenha: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.senha.length < 10) {
      setError('Senha deve ter pelo menos 10 caracteres.');
      return;
    }
    if (form.senha !== form.confirmacaoSenha) {
      setError('Confirmação deve ser igual à senha.');
      return;
    }
    // TODO: validar token e chamar authMockService.resetPassword(token, senha)
    // eslint-disable-next-line no-console
    console.log('Reset de senha (mock):', { token, novaSenha: form.senha });
    setSuccess('Senha alterada com sucesso!');
    setTimeout(() => router.push('/login'), 900);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="max-w-lg space-y-3">
          <h1 className="text-3xl font-semibold">Redefinir senha</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Escolha uma nova senha forte (mínimo 10 caracteres). O link de redefinição enviado por e-mail expira em poucos minutos.
          </p>
          {!token && <p className="text-xs text-bjj-red">Token ausente na URL (fluxo mockado).</p>}
        </section>

        <section className="w-full max-w-md rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ValidatedField
              name="senha"
              label="Nova senha"
              type="password"
              placeholder="••••••••••"
              value={form.senha}
              onChange={handleChange}
              helper="Evite sequências triviais"
              required
            />
            <ValidatedField
              name="confirmacaoSenha"
              label="Confirme a nova senha"
              type="password"
              placeholder="Repita a senha"
              value={form.confirmacaoSenha}
              onChange={handleChange}
              required
            />
            {error && <p className="text-sm text-bjj-red">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}
            <Button type="submit" className="w-full justify-center">
              Salvar nova senha
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bjj-black" aria-busy="true" />}>
      <ResetContent />
    </Suspense>
  );
}
