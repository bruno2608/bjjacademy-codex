'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

const faixaOptions = [
  { value: 'branca-adulto', label: 'Branca' },
  { value: 'azul-adulto', label: 'Azul' },
  { value: 'roxa-adulto', label: 'Roxa' },
  { value: 'marrom-adulto', label: 'Marrom' },
  { value: 'preta-adulto', label: 'Preta' }
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    telefone: '',
    dataNascimento: '',
    faixaAtual: 'branca-adulto',
    grauAtual: '0',
    codigoConviteSufixo: '',
    aceiteTermos: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

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
    if (!/^[A-Za-z0-9]{6}$/.test(form.codigoConviteSufixo.trim())) {
      newErrors.codigoConviteSufixo = 'Código deve ter 6 caracteres alfanuméricos.';
    }
    if (!form.aceiteTermos) {
      newErrors.aceiteTermos = 'É necessário aceitar os termos.';
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSuccess('Cadastro enviado! Confirme seu e-mail para seguir para o primeiro acesso.');
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="max-w-xl space-y-3">
          <h1 className="text-3xl font-semibold">Cadastro público de aluno</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Complete seus dados para vincular-se à academia pelo código de convite compartilhado pelo professor/admin.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-bjj-gray-200/80">
            <li>Campos obrigatórios: nome completo, e-mail, senha, código de convite e aceite de termos.</li>
            <li>Senha mínima de 10 caracteres; evitar senhas triviais.</li>
            <li>Telefone e data de nascimento são opcionais (sem datas futuras).</li>
          </ul>
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
              label="E-mail"
              type="email"
              placeholder="voce@bjjacademy.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <ValidatedField
                name="senha"
                label="Senha"
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
                label="Confirmação da senha"
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
                helper="Somente dígitos com DDI/DDD"
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/80">Faixa atual</span>
                </label>
                <select
                  name="faixaAtual"
                  value={form.faixaAtual}
                  onChange={handleChange}
                  className="select select-bordered select-primary w-full border-bjj-gray-700 bg-bjj-gray-900"
                >
                  {faixaOptions.map((faixa) => (
                    <option key={faixa.value} value={faixa.value}>
                      {faixa.label}
                    </option>
                  ))}
                </select>
              </div>
              <ValidatedField
                name="grauAtual"
                label="Grau (0-4)"
                type="number"
                min="0"
                max="4"
                value={form.grauAtual}
                onChange={handleChange}
                helper="Use 0 se recém-graduado"
              />
            </div>
            <ValidatedField
              name="codigoConviteSufixo"
              label="Código de convite (6 caracteres)"
              placeholder="C4E582"
              value={form.codigoConviteSufixo}
              onChange={handleChange}
              error={errors.codigoConviteSufixo}
              helper="Será convertido para o formato BJJ-XXXXXX"
              required
            />
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
            {success && <p className="text-sm text-green-400">{success}</p>}
            <Button type="submit" className="w-full justify-center">
              Criar conta de aluno
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
