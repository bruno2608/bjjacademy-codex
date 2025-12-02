import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Clock } from 'lucide-react';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { iconColors, iconSizes } from '@/styles/iconTokens';

// Visão específica da chamada do dia para professores/instrutores
export default function PresencasChamadaView({
  selectedDate,
  selectedTurmaId,
  onSelectDate,
  onSelectTurma,
  turmasDaAcademia,
  turmaAtual,
  resumoAula,
  alunosDaChamada,
  handleStatusChange,
  formatDateBr,
  StatusBadge,
  aulaAtual,
  handleFecharAula,
  currentAulaId
}) {
  return (
    <section className="rounded-2xl bg-bjj-gray-800/70 p-5 shadow-lg ring-1 ring-bjj-gray-700">
      <div className="flex flex-col gap-3 border-b border-bjj-gray-700 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200">Operação em tempo real</p>
          <h2 className="text-xl font-semibold text-white">Chamada do dia</h2>
          <p className="text-sm text-bjj-gray-200">Defina a turma e a data para registrar presenças imediatamente.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Input type="date" value={selectedDate} onChange={(e) => onSelectDate(e.target.value)} className="w-full sm:w-auto" />
          <Select value={selectedTurmaId} onChange={(e) => onSelectTurma(e.target.value)} className="w-full sm:w-auto">
            {turmasDaAcademia.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {turmasDaAcademia.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/60 p-4 text-bjj-gray-100">
          <Clock size={20} className={`${iconSizes.md} text-yellow-300`} />
          <div>
            <p className="font-semibold text-white">Nenhuma turma encontrada</p>
            <p className="text-sm text-bjj-gray-200">Cadastre turmas na academia para iniciar a chamada.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200 ring-1 ring-bjj-gray-700">
            <div className="flex items-center gap-2 text-white">
              <Clock size={16} className={`${iconSizes.sm} ${iconColors.default}`} />
              <span>{turmaAtual ? turmaAtual.nome : 'Turma não selecionada'} • {formatDateBr(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <StatusBadge status={aulaAtual?.status === 'encerrada' ? 'PRESENTE' : 'PENDENTE'} />
              <span className="rounded-full bg-bjj-gray-800 px-2 py-1 text-bjj-gray-100">{resumoAula.total || alunosDaChamada.length} alunos na chamada</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {alunosDaChamada.length === 0 && <p className="text-bjj-gray-100">Nenhum aluno ativo vinculado a esta turma.</p>}
            {alunosDaChamada.map(({ aluno, matricula, presenca }) => {
              const faixa = aluno?.faixaSlug ? getFaixaConfigBySlug(aluno.faixaSlug) : null;
              const status = presenca ? presenca.status : 'PENDENTE';
              return (
                <div
                  key={matricula.id}
                  className="flex flex-col gap-3 rounded-xl border border-bjj-gray-700 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">{aluno?.nome}</p>
                    <p className="text-sm text-bjj-gray-200">Matrícula #{matricula.numero}</p>
                    {faixa && <p className={`inline-flex rounded-full bg-bjj-gray-800 px-2 py-1 text-xs ${faixa.textColor}`}>{faixa.nome}</p>}
                  </div>
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                    <StatusBadge status={status} />
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="success" onClick={() => handleStatusChange(aluno.id, 'PRESENTE')}>
                        Presente
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleStatusChange(aluno.id, 'FALTA')}>
                        Falta
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(aluno.id, 'JUSTIFICADA')}>
                        Justificar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-bjj-gray-900/60 p-4 ring-1 ring-bjj-gray-700 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-bjj-gray-200">
              <p className="font-semibold text-white">Fechar treino</p>
              <p>Marca pendentes como presentes e encerra a aula instância.</p>
            </div>
            <Button variant="primary" onClick={handleFecharAula} disabled={!currentAulaId}>
              Fechar treino
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
