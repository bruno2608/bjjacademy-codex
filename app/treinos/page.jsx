'use client';

import { useMemo } from 'react';
import { CalendarCheck, Users } from 'lucide-react';
import { useTreinosStore } from '../../store/treinosStore';
import { iconColors, iconSizes } from '@/styles/iconTokens';

const diasSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export default function AgendaPage() {
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));

  const agenda = useMemo(
    () =>
      diasSemana.map((dia) => ({
        dia,
        treinos: treinos.filter((treino) => treino.diaSemana === dia)
      })),
    [treinos]
  );

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Treinos do aluno</p>
        <h1 className="text-2xl font-semibold">Treinos da semana</h1>
        <p className="text-sm text-bjj-gray-300/80">Visualização apenas leitura dos treinos publicados pela academia.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {agenda.map((dia) => (
          <div key={dia.dia} className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="uppercase tracking-[0.2em] text-bjj-gray-300">{dia.dia}</span>
              <CalendarCheck className={`${iconSizes.sm} ${iconColors.default}`} />
            </div>
            {dia.treinos.length === 0 ? (
              <p className="text-sm text-bjj-gray-300/80">Nenhum treino cadastrado para este dia.</p>
            ) : (
              <ul className="space-y-2 text-sm text-bjj-gray-100">
                {dia.treinos.map((treino) => (
                  <li
                    key={treino.id}
                    className="flex items-center justify-between rounded-xl border border-bjj-gray-800 bg-bjj-black/40 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-white">{treino.nome}</p>
                      <p className="text-xs text-bjj-gray-400">{treino.tipo}</p>
                    </div>
                    <div className="text-right text-xs text-bjj-gray-300/80">
                      <p>{treino.hora}</p>
                      <p className="inline-flex items-center gap-1 rounded-full bg-bjj-gray-800 px-2 py-0.5 text-[11px]">
                        <Users className={`${iconSizes.xs} ${iconColors.default}`} /> Prof. responsável
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
