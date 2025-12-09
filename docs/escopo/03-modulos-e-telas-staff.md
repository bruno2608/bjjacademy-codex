# Módulos e Telas – Staff / Professor / Admin

## Rotas principais (estado atual do código)
- **Home (`/home`)**: cards de atalho (`SecaoAcessoRapido`, `SecaoCardsPrincipais`) e hero de aluno (`HeroAlunoDashboard`). Hoje renderiza dados do aluno por padrão; variação por papel ainda é planejada.
- **Dashboard (`/dashboard`)**: placeholder com título e aviso de “visão analítica futura”. Nenhum dado dinâmico implementado.

## Presenças (staff)
- **Check-in de Alunos (`/presencas/check-in` e alias `/presencas/chamada`)**: lista alunos, mostra totais (presentes/pendentes), registra check-in manual (status PRESENTE) e links para pendências/revisão. Usa `usePresencasStore`, `useAlunosStore`; dados mockados.
- **Pendências de aprovação (`/presencas/pendencias`)**: filtra presenças `PENDENTE`, aprova (PRESENTE) ou reprova (FALTA). Indicadores de totais e pendências do dia.
- **Revisão de presenças (`/presencas/revisao`)**: histórico dos últimos 30 dias agrupado por data; permite exclusão de registro.
- **Histórico consolidado (`/historico-presencas`)**: timeline com filtros de mês, faixa, status e treino; agrega totais. Compartilhado com aluno, mas usado como hub de auditoria do staff.

## Alunos
- **Lista e filtros (`/alunos`)**: cards hero com métricas do dashboard staff, filtros por nome/faixa/status/treino, tabela com ações de editar/excluir e modal de criação. CRUD mockado em `useAlunosStore`; remove e recalcula métricas de presenças/graduações. Rota de detalhe `/alunos/[id]` ainda não implementada.

## Graduações
- **Próximas graduações (`/graduacoes/proximas`)**: cards de pendentes/concluídas/próxima cerimônia, filtros por nome/faixa/tipo/status/período (0/30/60/90 dias) e alteração de status (inclui atualização automática quando aluno já atingiu meta). Usa `useGraduacoesProfessorView`, `useGraduacoesStore`, `useAlunosStore`.
- **Histórico de graduações (`/graduacoes/historico`)**: combina histórico do aluno com graduações concluídas, filtros por nome/faixa/período; renderiza faixas com `BjjBeltStrip`.

## QR Code (staff)
- **QR Code da academia (`/qrcode`)**: gera código dinâmico que expira a cada 60s (mock), com botão de gerar novo e instruções de uso.
- **Validar QR Code (`/qrcode/validar`)**: simula leitura (sucesso/falha), atualiza `ultimaValidacao` na store.
- **Histórico de validações (`/qrcode/historico`)**: lista leituras com resultado e motivo; dados mockados em `qrCheckinStore`.

## Configurações
- **Regras de graduação (`/configuracoes/graduacao`)**: CRUD mockado das regras por faixa/grau (tempo, aulas mínimas, idade, próxima faixa). Acesso condicionado a papéis de staff (`ROLE_KEYS`).
- **Grade de treinos (`/configuracoes/treinos`)**: agenda semanal (nome, tipo, dia/hora, ativo), com criar/editar/ativar/desativar/remover via `useTreinosStore`.
- **Tipos de treino (`/configuracoes/tipos-treino`)**: catálogo de modalidades (Gi, No-Gi, etc.), CRUD simples via `useTiposTreinoStore`.
- **Troca de senha (`/configuracoes/trocar-senha`)**: formulário mockado (validações locais, sem backend).

## Perfil e utilidades
- **Perfil do staff (`/perfil`)**: edita nome/telefone/email/avatar; campos de papéis/unidade/especialidade em modo leitura; sincroniza `userStore` e `alunosStore`.
- **Relatórios (`/relatorios`)**: placeholder informativo, aguardando implementação analítica.
- **Belt demo (`/belt-demo`)**: vitrine de componentes de faixa (apenas demonstração).

## Status de implementação
- Telas listadas acima consomem serviços/stores e dados mockados persistidos em `localStorage`; não há chamadas de API reais.
- Rotas **placeholder ou parciais**: `/dashboard`, `/relatorios`, `/home` (ainda centrada no aluno), `/alunos/[id]`.
- RBAC ativo: middleware e site map liberam staff para `/presencas`, `/alunos`, `/graduacoes`, `/qrcode`, `/configuracoes`; admins/ti têm acesso total.
