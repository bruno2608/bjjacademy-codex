# Fluxo de autenticação atual (mock) — Resumo

> **Fonte única:** consulte [`docs/auth-and-checkin-flow.md`](./auth-and-checkin-flow.md) para regras completas de login, cadastro, reset de senha, papéis e check-in. Este arquivo mantém apenas um retrato curto do estado técnico atual (mocks/stores) e diferenças conhecidas.

## O que existe hoje no código
- Login único em `/login` usando `authMockService` com senha piloto fixa e whitelist de usuários.
- Estado e persistência via `useUserStore` (token fake, roles, impersonação) com hidratação de `localStorage`/cookies.
- Middleware protege rotas (exceto `/login` e `/unauthorized`) lendo `bjj_roles` e comparando com `config/siteMap`.
- Modo teste/impersonação disponível para `ADMIN_TI` via `AdminTiViewSwitcher` + `ImpersonationBanner`.

## Lacunas conhecidas
- Não existem rotas reais de cadastro público, convite ou recuperação de senha; telas devem ser criadas conforme o guia central.
- Redirecionamento pós-login depende da tela de login (não há centralização em middleware/store ainda).
- Senha piloto fixa e usuários limitados a mocks — será substituído por backend (Supabase/API) seguindo o contrato do guia central.
