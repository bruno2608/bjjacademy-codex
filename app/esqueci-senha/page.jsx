'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!/.+@.+\..+/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    // TODO: integrar com authMockService.requestPasswordReset
    // eslint-disable-next-line no-console
    console.log('Solicitação de reset (mock) para:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="max-w-lg space-y-3">
          <h1 className="text-3xl font-semibold">Esqueceu sua senha?</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Informe seu e-mail. Se ele existir, enviaremos um link seguro para redefinir sua senha. Não revelamos se o e-mail está
            cadastrado.
          </p>
        </section>

        <section className="w-full max-w-md rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ValidatedField
              name="email"
              label="E-mail"
              type="email"
              placeholder="voce@bjjacademy.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={error}
              required
            />
            {submitted && (
              <p className="text-sm text-green-400">
                Se o e-mail estiver cadastrado, enviaremos instruções de redefinição.
              </p>
            )}
            <Button type="submit" className="w-full justify-center">
              Enviar link de redefinição
            </Button>
            <Button type="button" variant="ghost" className="w-full justify-center" onClick={() => router.push('/login')}>
              Voltar para login
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
