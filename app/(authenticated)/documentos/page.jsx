'use client';

import { FileText, Shield } from 'lucide-react';

const docs = [
  { title: 'Termos de uso', description: 'Condições de uso do aplicativo e regras de convivência.', icon: FileText },
  { title: 'Políticas internas', description: 'Orientações gerais da academia e códigos de conduta.', icon: Shield }
];

export default function DocumentosPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Documentos</p>
        <h1 className="text-2xl font-semibold">Consultas rápidas</h1>
        <p className="text-sm text-bjj-gray-300/80">
          Termos e políticas ficam disponíveis em modo somente leitura para alunos e instrutores.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {docs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.title} className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon size={16} className="text-bjj-red" /> {doc.title}
              </div>
              <p className="mt-2 text-sm text-bjj-gray-300/80">{doc.description}</p>
              <p className="mt-3 text-xs text-bjj-gray-400">Disponível para visualização na academia.</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
