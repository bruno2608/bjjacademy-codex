'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

export default function PrimeiroAcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailFromToken = searchParams.get('email');
  const papelSugerido = searchParams.get('papel') || 'ALUNO';

  const [form, setForm] = useState({
    nomeCompleto: '',
    email: emailFromToken || '',
    senha: '',
    confirmacaoSenha: '',
    telefone: '',
    dataNascimento: '',
    faixaAtual: 'branca-adulto',
    grauAtual: '0',
    aceiteTermos: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (emailFromToken) {
      setForm((prev) => ({ ...prev, email: emailFromToken }));
    }
  }, [emailFromToken]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nomeCompleto.trim() || form.nomeCompleto.trim().split(' ').length < 2) {
      newErrors.nomeCompleto = 'Informe nome completo (mínimo 2 palavras).';
    }
    if (!form.email.trim() || !/.+@.+\..+/.test(form.email)) {
      newErrors.email = 'E-mail inválido.';
    }
    if (form.senha.length < 10) {
      newErrors.senha = 'Senha deve ter pelo menos 10 caracteres.';
    }
    if (form.senha !== form.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Confirmação deve ser igual à senha.';
    }
    if (!form.aceiteTermos) {
      newErrors.aceiteTermos = 'É necessário aceitar os termos.';
    }
    if (!token) {
      newErrors.token = 'Convite inválido ou expirado.';
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSuccess('Convite ativado! Vamos redirecionar para o dashboard.');
    setTimeout(() => router.push('/dashboard'), 900);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="space-y-2">
          <h1 className="text-3xl font-semibold">Primeiro acesso via convite</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Complete os dados para ativar sua conta. Papel sugerido: <span className="font-semibold">{papelSugerido}</span>.
          </p>
        </section>

        <section className="w-full max-w-xl rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ValidatedField
              name="nomeCompleto"
              label="Nome completo"
              placeholder="Seu nome e sobrenome"
              value={form.nomeCompleto}
              onChange={handleChange}
              error={errors.nomeCompleto}
              required
            />
            <ValidatedField
              name="email"
              label="E-mail (do convite)"
              type="email"
              placeholder="voce@bjjacademy.com"
              value={form.email}
              onChange={handleChange}
              readOnly={Boolean(emailFromToken)}
              helper="E-mail vem do convite e não pode ser alterado"
              error={errors.email}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <ValidatedField
                name="senha"
                label="Crie sua senha"
                type="password"
                placeholder="••••••••••"
                value={form.senha}
                onChange={handleChange}
                helper="Mínimo 10 caracteres"
                error={errors.senha}
                required
              />
              <ValidatedField
                name="confirmacaoSenha"
                label="Confirme a senha"
                type="password"
                placeholder="Repita a senha"
                value={form.confirmacaoSenha}
                onChange={handleChange}
                error={errors.confirmacaoSenha}
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ValidatedField
                name="telefone"
                label="Telefone (opcional)"
                placeholder="5599999999999"
                value={form.telefone}
                onChange={handleChange}
                helper="Somente dígitos"
              />
              <ValidatedField
                name="dataNascimento"
                label="Data de nascimento (opcional)"
                type="date"
                value={form.dataNascimento}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ValidatedField
                name="faixaAtual"
                label="Faixa"
                placeholder="Selecione sua faixa"
                value={form.faixaAtual}
                onChange={handleChange}
                helper="Dropdown real em futura API"
              />
              <ValidatedField
                name="grauAtual"
                label="Grau (0-4)"
                type="number"
                min="0"
                max="4"
                value={form.grauAtual}
                onChange={handleChange}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-bjj-gray-200/80">
              <input
                type="checkbox"
                name="aceiteTermos"
                checked={form.aceiteTermos}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
              Aceito os termos de uso e política de privacidade
            </label>
            {errors.aceiteTermos && <p className="text-sm text-bjj-red">{errors.aceiteTermos}</p>}
            {errors.token && <p className="text-sm text-bjj-red">{errors.token}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}
            <Button type="submit" className="w-full justify-center">
              Ativar conta e acessar
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
