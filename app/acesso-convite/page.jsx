'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

const faixaOptions = [
  { value: 'branca-adulto', label: 'Branca' },
  { value: 'azul-adulto', label: 'Azul' },
  { value: 'roxa-adulto', label: 'Roxa' },
  { value: 'marrom-adulto', label: 'Marrom' },
  { value: 'preta-professor', label: 'Preta (professor)' }
];

function AcessoConviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteFromQuery = searchParams.get('token');
  const emailFromQuery = searchParams.get('email');
  const papelSugeridoQuery = searchParams.get('papel') || 'ALUNO';

  const [codigoConvite, setCodigoConvite] = useState(inviteFromQuery ? `BJJ-${inviteFromQuery.slice(0, 6).toUpperCase()}` : '');
  const [conviteValidado, setConviteValidado] = useState(Boolean(inviteFromQuery));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const inviteData = useMemo(
    () => ({
      email: emailFromQuery || 'convidado@bjjacademy.com',
      papelSugerido: papelSugeridoQuery.toUpperCase(),
      nomeCompleto: 'Convidado BJJ',
      academiaId: 'acad-1'
    }),
    [emailFromQuery, papelSugeridoQuery]
  );

  const [form, setForm] = useState({
    nomeCompleto: inviteData.nomeCompleto,
    email: inviteData.email,
    senha: '',
    confirmacaoSenha: '',
    telefone: '',
    dataNascimento: '',
    faixaAtual: 'branca-adulto',
    grauAtual: '0',
    aceiteTermos: false
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      email: inviteData.email,
      nomeCompleto: inviteData.nomeCompleto
    }));
  }, [inviteData]);

  const validateStepTwo = () => {
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
    return newErrors;
  };

  const handleValidateConvite = (event) => {
    event.preventDefault();
    setErrors({});
    setSuccess('');
    if (!/^BJJ-[A-Za-z0-9]{6}$/.test(codigoConvite.trim())) {
      setErrors({ codigoConvite: 'Código deve seguir o formato BJJ-XXXXXX.' });
      return;
    }
    // TODO: integrar com authMockService.validateInvite(codigoConvite)
    // eslint-disable-next-line no-console
    console.log('Validando convite (mock):', codigoConvite);
    setConviteValidado(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateStepTwo();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    // TODO: integrar com authMockService.completeInvite
    // eslint-disable-next-line no-console
    console.log('Ativando convite (mock):', { codigoConvite, ...form, papelSugerido: inviteData.papelSugerido });
    setSuccess('Convite ativado! Você pode acessar o painel.');
    setTimeout(() => router.push('/login'), 900);
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-start lg:gap-12">
        <section className="max-w-xl space-y-3">
          <h1 className="text-3xl font-semibold">Acesso por convite</h1>
          <p className="text-sm text-bjj-gray-200/80">
            Valide o código recebido do professor/admin e complete seu cadastro. Papel sugerido: {inviteData.papelSugerido}.
          </p>
        </section>

        <section className="w-full max-w-xl rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 shadow-lg">
          {!conviteValidado ? (
            <form className="space-y-4" onSubmit={handleValidateConvite}>
              <ValidatedField
                name="codigoConvite"
                label="Código de convite"
                placeholder="BJJ-C4E582"
                value={codigoConvite}
                onChange={(event) => setCodigoConvite(event.target.value.toUpperCase())}
                error={errors.codigoConvite}
                helper="Formato BJJ-XXXXXX"
                required
              />
              <Button type="submit" className="w-full justify-center">
                Validar convite
              </Button>
              <p className="text-center text-xs text-bjj-gray-200/70">Convites vencidos ou inválidos devem ser reemitidos.</p>
            </form>
          ) : (
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
                readOnly
                helper="E-mail vem do convite e não pode ser alterado"
                error={errors.email}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <ValidatedField
                  name="senha"
                  label="Crie sua senha"
                  type="password"
                  placeholder="•••••••••"
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/80">Faixa</span>
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
              {success && <p className="text-sm text-green-400">{success}</p>}
              <Button type="submit" className="w-full justify-center">
                Ativar conta e acessar
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AcessoConvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bjj-black" aria-busy="true" />}>
      <AcessoConviteContent />
    </Suspense>
  );
}
