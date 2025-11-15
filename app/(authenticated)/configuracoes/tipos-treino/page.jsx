'use client';

import { useState } from 'react';
import { useTiposTreinoStore } from '../../../../store/tiposTreinoStore';

/**
 * Mantém o catálogo de modalidades que alimenta cadastros de treino e presenças.
 */

export default function TiposTreinoPage() {
  const { tipos, addTipo, updateTipo, removeTipo } = useTiposTreinoStore();
  const [novoTipo, setNovoTipo] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = (event) => {
    event.preventDefault();
    if (!novoTipo.trim()) return;
    addTipo(novoTipo);
    setNovoTipo('');
  };

  const startEdit = (index, valor) => {
    setEditIndex(index);
    setEditValue(valor);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    if (editIndex === null || !editValue.trim()) return;
    updateTipo(editIndex, editValue);
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Catálogo de sessões</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Tipos de Treino</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Mantenha a lista de modalidades disponíveis (Gi, No-Gi, Kids, Competição, etc.). Elas aparecem na agenda e na tela de presenças.
        </p>
      </header>

      <form className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-5" onSubmit={handleAdd}>
        <label className="flex flex-col gap-2 text-sm text-bjj-gray-200/80 md:flex-row md:items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Novo tipo</span>
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <input
              className="input-field"
              placeholder="Ex.: Competição"
              value={novoTipo}
              onChange={(event) => setNovoTipo(event.target.value)}
            />
            <button type="submit" className="btn-primary md:w-auto">
              Adicionar
            </button>
          </div>
        </label>
      </form>

      <section className="space-y-3">
        {tipos.map((tipo, index) => (
          <article
            key={`${tipo}-${index}`}
            className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
          >
            {editIndex === index ? (
              <form className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3" onSubmit={handleEdit}>
                <input
                  className="input-field"
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 text-xs">
                  <button type="submit" className="btn-primary px-3 py-1">
                    Salvar
                  </button>
                  <button type="button" className="btn-secondary px-3 py-1" onClick={() => setEditIndex(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <span className="text-sm font-medium text-bjj-white">{tipo}</span>
                <div className="flex gap-2 text-xs text-bjj-gray-200/70">
                  <button type="button" className="btn-secondary px-3 py-1" onClick={() => startEdit(index, tipo)}>
                    Renomear
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-bjj-gray-800 px-3 py-1 text-bjj-red transition hover:border-bjj-red/70 hover:bg-bjj-red/10"
                    onClick={() => removeTipo(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
        {!tipos.length && (
          <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
            Nenhum tipo cadastrado. Adicione pelo menos um para vincular às sessões de treino.
          </p>
        )}
      </section>
    </div>
  );
}
