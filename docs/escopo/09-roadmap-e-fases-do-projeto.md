# Roadmap e Fases do Projeto

## Estado atual (PWA com mocks)
- Login funcional via `authMockService` + `userStore`, roles normalizados, middleware de RBAC ativo.
- Fluxo de presenças completo com mocks: check-in do aluno (`/checkin`, `/aluno/checkin/*`), conferência do staff (`/presencas/*`), histórico filtrável (`/historico-presencas`), fechamento de treino em `presencasService`.
- Gestão de alunos (`/alunos`) com filtros, criação/edição/exclusão mockada e métricas do dashboard staff.
- Graduações (`/graduacoes/proximas`, `/graduacoes/historico`) com filtros, status e renderização de faixas/graus.
- Configurações de regras de graduação, grade semanal e tipos de treino prontas no front, com guarda de acesso por papel.
- QR Code mockado (geração, validação, histórico) e PWA/manifesto ativos.
- Documentação técnica existente em `docs/*.md` detalha flows de autenticação/check-in e modelo de dados mock.

## Pendências por módulo
- **Dashboards**: `/dashboard` e `/home` (versão staff) são placeholders; necessidade de integrar métricas reais e separar visões aluno/staff.
- **Autenticação real**: cadastro/convite/reset de senha são mockados; falta API/autenticação persistente.
- **Alunos**: rota de detalhe `/alunos/[id]` ausente; integração com API para CRUD e sincronismo com matrículas/turmas.
- **Presenças**: validar check-in com contexto de aula/turma/academia e tokens de QR reais; logs de QR no backend.
- **Graduações**: consolidar regras de graduação no domínio (mockDb) e integrar com presenças para cálculo de metas.
- **UI/tema**: telas legadas ainda usam classes “bjj-*”; migração total para tokens DaisyUI/Zenko é planejada.
- **Relatórios**: `/relatorios` é placeholder; nenhum gráfico ou exportação implementado.

## Fases / marcos sugeridos
- **Fase 1 (concluída no front)**: PWA com mocks estáveis, RBAC centralizado, telas de presença/alunos/graduações funcionando com stores.
- **Fase 2**: Criar API (ex.: NestJS) + banco (Supabase/Postgres) espelhando `data/mocks/db`; substituir serviços mockados por chamadas HTTP; implementar autenticação real (signup, convite, reset, tokens/JWT).
- **Fase 3**: Integrar QR real (tokens temporais, validação por aula/academia, logs); alinhar dashboards e relatórios com dados do backend.
- **Fase 4**: Unificar tema (DaisyUI/Zenko) em todas as rotas, completar tela de detalhe de aluno e visão analítica do staff; otimizar PWA (caching seletivo, fallback offline).
- **Fase 5**: App mobile consumindo a mesma API; ajustes de UX responsiva e push notifications para check-ins/graduações.

## Riscos e observações
- Toda a persistência atual é local (`localStorage`); risco de divergência/limpeza entre sessões.
- Regras de negócio críticas (check-in, fechamento de treino, progressão) estão no front; devem migrar para o backend para evitar inconsistências.
- RBAC depende de cookie `bjj_roles`; ao adotar API real, alinhar geração/refresh de tokens e expiração.
