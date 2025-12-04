'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="space-y-2">
          <h1 className="text-3xl font-semibold">Esqueci minha senha</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Informe seu e-mail. Se ele existir, enviaremos um link seguro para redefinição de senha.
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
              required
            />
            {submitted && (
              <p className="text-sm text-green-400">
                Se este e-mail existir, enviaremos um link para redefinição.
              </p>
            )}
            <Button type="submit" className="w-full justify-center">
              Enviar link de redefinição
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
