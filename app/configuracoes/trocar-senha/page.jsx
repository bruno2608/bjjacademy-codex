'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ValidatedField from '@/components/ui/ValidatedField';

export default function TrocarSenhaPage() {
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmacaoSenha: '' });
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
    if (!form.senhaAtual) {
      setError('Informe sua senha atual.');
      return;
    }
    if (form.novaSenha.length < 10) {
      setError('Nova senha deve ter pelo menos 10 caracteres.');
      return;
    }
    if (form.novaSenha !== form.confirmacaoSenha) {
      setError('Confirmação deve ser igual à nova senha.');
      return;
    }
    setSuccess('Senha alterada com sucesso (mock).');
  };

  return (
    <div className="space-y-4 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 shadow-lg">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Conta</p>
        <h1 className="text-2xl font-semibold">Trocar senha</h1>
        <p className="text-sm text-bjj-gray-200/80">Altere sua senha seguindo as regras mínimas da documentação.</p>
      </header>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <ValidatedField
          name="senhaAtual"
          type="password"
          label="Senha atual"
          placeholder="Senha atual"
          value={form.senhaAtual}
          onChange={handleChange}
          required
        />
        <ValidatedField
          name="novaSenha"
          type="password"
          label="Nova senha"
          placeholder="Nova senha"
          value={form.novaSenha}
          onChange={handleChange}
          helper="Mínimo 10 caracteres; evitar sequências simples"
          required
        />
        <ValidatedField
          name="confirmacaoSenha"
          type="password"
          label="Confirme a nova senha"
          placeholder="Repita a nova senha"
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
    </div>
  );
}
