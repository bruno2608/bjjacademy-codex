'use client';

import { useMemo, useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import { useTreinosStore } from '../../../../store/treinosStore';
import { useTiposTreinoStore } from '../../../../store/tiposTreinoStore';

/**
 * Editor mockado da grade semanal usado posteriormente pela tela de presenças.
 */

const DIAS_SEMANA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];

const emptyTreino = {
  nome: '',
  diaSemana: 'segunda',
  hora: '07:00',
  tipo: 'Gi',
  ativo: true
};

export default function TreinosPage() {
  const { treinos, addTreino, updateTreino, toggleTreinoStatus, removeTreino } = useTreinosStore();
  const tipos = useTiposTreinoStore((state) => state.tipos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTreino);

  const sortedTreinos = useMemo(
    () =>
      [...treinos].sort((a, b) => {
        if (a.diaSemana === b.diaSemana) return a.hora.localeCompare(b.hora);
        return DIAS_SEMANA.indexOf(a.diaSemana) - DIAS_SEMANA.indexOf(b.diaSemana);
      }),
    [treinos]
  );

  const openModal = (treino) => {
    if (treino) {
      setEditingId(treino.id);
      setForm({ nome: treino.nome, diaSemana: treino.diaSemana, hora: treino.hora, tipo: treino.tipo, ativo: treino.ativo });
    } else {
      setEditingId(null);
      setForm({ ...emptyTreino, tipo: tipos[0] || 'Gi' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyTreino);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      updateTreino(editingId, form);
    } else {
      addTreino(form);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Agenda da academia</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-bjj-white">Horários de Treino</h1>
            <p className="mt-1 text-sm text-bjj-gray-200/70">
              Organize as sessões semanais da academia. Os treinos ativos aparecem na tela de presenças para agilizar o check-in.
            </p>
          </div>
          <Button type="button" className="w-full md:w-auto" onClick={() => openModal(null)}>
            Cadastrar treino
          </Button>
        </div>
      </header>

      <section className="space-y-3">
        {sortedTreinos.map((treino) => (
          <article
            key={treino.id}
            className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-base font-semibold text-bjj-white">{treino.nome}</h2>
              <p className="text-xs text-bjj-gray-200/70">
                {treino.diaSemana} · {treino.hora} · {treino.tipo}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-bjj-gray-200/70">
              <span className={`rounded-full px-3 py-1 ${treino.ativo ? 'bg-bjj-red/20 text-bjj-white' : 'bg-bjj-gray-800/60'}`}>
                {treino.ativo ? 'Ativo' : 'Inativo'}
              </span>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full px-3 py-1"
                onClick={() => openModal(treino)}
              >
                Editar
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full px-3 py-1"
                onClick={() => toggleTreinoStatus(treino.id)}
              >
                {treino.ativo ? 'Desativar' : 'Ativar'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full px-3 py-1 border-bjj-red/70 text-bjj-red hover:border-bjj-red hover:text-bjj-red hover:bg-bjj-red/10"
                onClick={() => removeTreino(treino.id)}
              >
                Remover
              </Button>
            </div>
          </article>
        ))}
        {!sortedTreinos.length && (
          <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
            Nenhum treino cadastrado até o momento. Cadastre a grade semanal para habilitar a marcação de presenças por sessão.
          </p>
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar treino' : 'Novo treino'}>
        <form className="space-y-4 text-sm text-bjj-gray-200/80" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Nome</span>
            <Input
              value={form.nome}
              onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
              placeholder="Treino avançado · Noite"
              required
            />
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Dia da semana</span>
              <Select
                value={form.diaSemana}
                onChange={(event) => setForm((prev) => ({ ...prev, diaSemana: event.target.value }))}
              >
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia}>{dia}</option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Horário</span>
              <Input
                type="time"
                value={form.hora}
                onChange={(event) => setForm((prev) => ({ ...prev, hora: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Tipo</span>
              <Select
                value={form.tipo}
                onChange={(event) => setForm((prev) => ({ ...prev, tipo: event.target.value }))}
              >
                {(tipos.length ? tipos : ['Gi']).map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </Select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(event) => setForm((prev) => ({ ...prev, ativo: event.target.checked }))}
              className="h-3 w-3 accent-bjj-red"
            />
            Treino ativo
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
