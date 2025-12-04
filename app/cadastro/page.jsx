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

const formatTelefone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    username: '',
    senha: '',
    confirmacaoSenha: '',
    telefone: '',
    dataNascimento: '',
    faixaAtual: 'branca-adulto',
    grauAtual: '0',
    codigoConvite: '',
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
    if (!form.username.trim() || !/^[a-z][a-z0-9._]{2,19}$/.test(form.username.trim())) {
      newErrors.username = 'Usuário deve ser minúsculo e seguir o padrão a-z0-9._ (3-20).';
    }
    if (form.senha.length < 10) {
      newErrors.senha = 'Senha deve ter pelo menos 10 caracteres.';
    }
    if (form.senha !== form.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Confirmação deve ser igual à senha.';
    }
    if (form.codigoConvite.trim() && !/^BJJ-[A-Za-z0-9]{6}$/.test(form.codigoConvite.trim())) {
      newErrors.codigoConvite = 'Código precisa seguir o formato BJJ-XXXXXX.';
    }
    if (!form.aceiteTermos) {
      newErrors.aceiteTermos = 'É necessário aceitar os termos.';
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = name === 'telefone' ? formatTelefone(value) : value;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : nextValue }));
    setSuccess('');
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value.toLowerCase();
    setForm((prev) => ({ ...prev, username: value }));
    setSuccess('');
  };

  const handleCodigoConviteChange = (event) => {
    const value = event.target.value.toUpperCase();
    setForm((prev) => ({ ...prev, codigoConvite: value }));
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    // TODO: integrar com authMockService.signupAluno quando disponível
    // eslint-disable-next-line no-console
    console.log('Cadastro público (mock):', form);
    setSuccess('Cadastro concluído! Agora você pode acessar o painel.');
    setTimeout(() => router.push('/login'), 900);
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
            <li>Campos obrigatórios: nome completo, e-mail, usuário, senha e aceite de termos.</li>
            <li>Senha mínima de 10 caracteres; evitar senhas triviais.</li>
            <li>Telefone e data de nascimento são opcionais (sem datas futuras).</li>
            <li>TODO: sugestão automática de usuário a partir do nome.</li>
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
            <ValidatedField
              name="username"
              label="Usuário"
              placeholder="seuusuario"
              value={form.username}
              onChange={handleUsernameChange}
              helper="Minúsculo, 3-20 caracteres (a-z, 0-9, . ou _)"
              error={errors.username}
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
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={handleChange}
                helper="Máscara visual; armazenar só dígitos"
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
              name="codigoConvite"
              label="Código de convite (BJJ-XXXXXX)"
              placeholder="BJJ-C4E582"
              value={form.codigoConvite}
              onChange={handleCodigoConviteChange}
              error={errors.codigoConvite}
              helper="Validação visual; vinculação real será feita pela API"
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
            <p className="text-center text-xs text-bjj-gray-200/70">
              Já tem conta?{' '}
              <a href="/login" className="text-bjj-red hover:text-bjj-red/80">
                Ir para login
              </a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
