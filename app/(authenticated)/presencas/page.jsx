'use client';

/**
 * Tela de presenças concentra o registro diário dos alunos,
 * permitindo adicionar, alternar e remover registros rapidamente.
 */
import { useEffect, useState } from 'react';
import AttendanceTable from '../../../components/ui/AttendanceTable';
import PresenceForm from '../../../components/ui/PresenceForm';
import {
  createPresenca,
  deletePresenca,
  getPresencas,
  togglePresenca
} from '../../../services/presencasService';

export default function PresencasPage() {
  const [presencas, setPresencas] = useState([]);

  useEffect(() => {
    getPresencas().then(setPresencas);
  }, []);

  const handleCreate = async (payload) => {
    const novoRegistro = await createPresenca(payload);
    setPresencas((prev) => [...prev, novoRegistro]);
  };

  const handleToggle = async (registro) => {
    const atualizado = await togglePresenca(registro.id);
    setPresencas((prev) => prev.map((item) => (item.id === atualizado.id ? atualizado : item)));
  };

  const handleDelete = async (registro) => {
    await deletePresenca(registro.id);
    setPresencas((prev) => prev.filter((item) => item.id !== registro.id));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Gestão de presenças</h2>
        <p className="text-sm text-bjj-gray-200/70">
          Registre o comparecimento dos alunos em cada aula e acompanhe o histórico para feedbacks rápidos.
        </p>
      </header>
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold">Registrar nova presença</h3>
        <PresenceForm onSubmit={handleCreate} />
      </div>
      <AttendanceTable records={presencas} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}
