'use client';

import { useState } from 'react';
import { useTiposTreinoStore } from '../../../../store/tiposTreinoStore';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import ConfirmDialog from '../../../../components/ui/ConfirmDialog';

/**
 * Mantém o catálogo de modalidades que alimenta cadastros de treino e presenças.
 */

export default function TiposTreinoPage() {
  const { tipos, addTipo, updateTipo, removeTipo } = useTiposTreinoStore();
  const [novoTipo, setNovoTipo] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  const confirmarExclusao = () => {
    if (deleteIndex !== null) {
      removeTipo(deleteIndex);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="card space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Catálogo de sessões</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Tipos de Treino</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Mantenha a lista de modalidades disponíveis (Gi, No-Gi, Kids, Competição, etc.). Elas aparecem na agenda e na tela de presenças.
        </p>
      </header>

      <form className="card" onSubmit={handleAdd}>
        <label className="flex flex-col gap-2 text-sm text-bjj-gray-200/80 md:flex-row md:items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Novo tipo</span>
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <Input
              placeholder="Ex.: Competição"
              value={novoTipo}
              onChange={(event) => setNovoTipo(event.target.value)}
            />
            <Button type="submit" className="btn-sm md:btn-md md:w-auto">
              Adicionar
            </Button>
          </div>
        </label>
      </form>

      <section className="space-y-3">
        {tipos.map((tipo, index) => (
          <article
            key={`${tipo}-${index}`}
            className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            {editIndex === index ? (
              <form className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3" onSubmit={handleEdit}>
                <Input
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 text-xs">
                  <Button type="submit" className="btn-sm">
                    Salvar
                  </Button>
                  <Button type="button" variant="secondary" className="btn-sm" onClick={() => setEditIndex(null)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <span className="text-sm font-medium text-bjj-white">{tipo}</span>
                <div className="flex gap-2 text-xs text-bjj-gray-200/70">
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-sm"
                    onClick={() => startEdit(index, tipo)}
                  >
                    Renomear
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-sm border-bjj-red/70 text-bjj-red hover:border-bjj-red hover:text-bjj-red hover:bg-bjj-red/10"
                    onClick={() => setDeleteIndex(index)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </article>
        ))}
        {!tipos.length && (
          <p className="card border-dashed text-sm text-bjj-gray-200/70">
            Nenhum tipo cadastrado. Adicione pelo menos um para vincular às sessões de treino.
          </p>
        )}
      </section>

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Confirmar exclusão"
        message={deleteIndex !== null ? `Deseja remover o tipo de treino "${tipos[deleteIndex]}"?` : ''}
        confirmLabel="Remover tipo"
        onConfirm={confirmarExclusao}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
