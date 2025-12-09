# Arquitetura Alvo – App, API e Banco

## Estado atual
- Front/PWA em Next.js 14 + React 18, com dados mockados em `data/mocks` → services → stores (Zustand) → UI.
- RBAC e navegação já centralizados; camada de services isola a origem dos dados, facilitando troca de backend.
- Sem API ou banco reais; autenticação e persistência são locais.

## Componentes planejados
- **PWA / painel web**: mantém App Router e camada de services/stores, mas passa a consumir API HTTP em vez de mocks.
- **App mobile**: consumidor da mesma API (referência aos repositórios mobile no README). Deve reaproveitar contratos REST expostos pelo backend.
- **API backend**: planejada com NestJS (menção em README) para unificar regras de negócio, autenticação, RBAC e orquestração de check-in/graduações.
- **Banco de dados**: Supabase/Postgres (citados nas docs/db-model), refletindo as entidades já mockadas (academias, usuários/papéis, matrículas, turmas, aulas, presenças, faixas/regras/graduações, convites, QR logs).

## Interação entre camadas (alvo)
- Fronts (PWA e mobile) consomem a API via HTTP/REST (ou GraphQL se adotado), mantendo a mesma assinatura hoje usada pelos services mockados.
- API centraliza validações (tokens de QR, pertencimento a academia/turma, status do usuário, duplicidade de check-in) e aplica RBAC antes de acessar o banco.
- Banco persiste todas as entidades e histórico; serviços de cache/push podem ser adicionados depois (não implementados no repo atual).

## Regras de negócio no alvo
- **Front**: UI, navegação, formulários, feedback e caches locais (stores). Nenhuma regra crítica deve ficar no cliente além da UX.
- **API**: regras de presença (check-in, fechamento de treino, aprovação/reprovação, logs de QR), progressão de faixa/grau, convites/onboarding, permissões por papel.
- **BD**: integridade relacional (FKs entre academias, usuários/papéis, matrículas, turmas/aulas, presenças, graduações), auditoria (timestamps, logs de QR).

## Migração sugerida (derivada do código atual)
- Substituir cada `services/*` por chamadas HTTP mantendo contratos das stores; `mockDb` pode servir de fixture inicial.
- Centralizar geração/validação de QR na API e armazenar logs em tabela dedicada (`qrcode_logs` já descrita em `docs/db-model-bjjacademy-codex.md`).
- Mover autenticação do mock para provider real (JWT/Supabase Auth), respeitando os papéis e aliases já mapeados em `config/roles.ts`.
