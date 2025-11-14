'use client';

/**
 * Página de login mock que valida credenciais básicas e salva token no Zustand/localStorage.
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../../store/userStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, token } = useUserStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('bjj_token');
    if (savedToken && !token) {
      login({ email: 'instrutor@bjj.academy' });
      router.replace('/dashboard');
    }
  }, [login, router, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Informe e-mail e senha.');
      return;
    }
    setError('');
    login({ email: form.email });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bjj-black px-6">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Bem-vindo(a) à BJJ Academy</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              name="email"
              type="email"
              placeholder="voce@bjj.academy"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          {error && <p className="text-sm text-bjj-red">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
