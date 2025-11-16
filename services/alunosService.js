/**
 * Serviço de alunos usando o mockRequest para simular operações CRUD.
 * Em uma futura integração basta substituir as chamadas pelo fetch real.
 */
import { mockRequest } from './api';
import { useAlunosStore } from '../store/alunosStore';
import { useGraduacoesStore } from '../store/graduacoesStore';
import { usePresencasStore } from '../store/presencasStore';

export async function getAlunos() {
  const { alunos } = useAlunosStore.getState();
  return mockRequest(alunos);
}

export async function createAluno(aluno) {
  const alunosStore = useAlunosStore.getState();
  const presencas = usePresencasStore.getState().presencas;
  const novoAluno = alunosStore.addAluno(aluno, presencas);
  return mockRequest(novoAluno);
}

export async function updateAluno(id, aluno) {
  const alunosStore = useAlunosStore.getState();
  const presencasStore = usePresencasStore.getState();
  const graduacoesStore = useGraduacoesStore.getState();

  const alunoAtualizado = alunosStore.updateAluno(id, aluno, presencasStore.presencas);

  if (alunoAtualizado) {
    const presencasAtualizadas = presencasStore.presencas.map((item) =>
      item.alunoId === id
        ? { ...item, alunoNome: alunoAtualizado.nome, faixa: alunoAtualizado.faixa, graus: alunoAtualizado.graus }
        : item
    );
    presencasStore.setPresencas(presencasAtualizadas);

    const graduacoesAtualizadas = graduacoesStore.graduacoes.map((item) =>
      item.alunoId === id
        ? { ...item, alunoNome: alunoAtualizado.nome, faixaAtual: alunoAtualizado.faixa }
        : item
    );
    graduacoesStore.setGraduacoes(graduacoesAtualizadas);
  }

  return mockRequest(alunoAtualizado);
}

export async function deleteAluno(id) {
  const alunosStore = useAlunosStore.getState();
  alunosStore.removeAluno(id);
  return mockRequest({ success: true });
}
