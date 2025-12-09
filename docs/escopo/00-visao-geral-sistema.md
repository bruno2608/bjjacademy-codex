# Visão Geral do Sistema BJJAcademy

## Resumo do produto
- **BJJAcademy / BJJAcademy Codex** é um painel web progressivo para gestão de academias de Jiu-Jitsu, cobrindo alunos, staff e jornadas de presença/graduação.
- Resolve o controle diário de treinos, check-ins, presenças e evolução de faixas/graus, oferecendo visão centralizada para alunos e equipe da academia.

## Tipo de sistema
- **PWA web** em Next.js 14 + React 18, já com manifesto, service worker e ícones configurados (`app/layout.jsx`, `app/manifest.ts`, `/public/icons`).
- Estado atual: front-end mockado (dados em memória/localStorage) consumindo serviços e stores.
- Estado futuro declarado no repositório: API própria (ex.: NestJS) sobre banco real (Supabase/Postgres) e app mobile consumindo a mesma API.

## Perfis de usuário (alto nível)
- **Aluno**: check-in, agenda de treinos, histórico de presenças, evolução/graduações, perfil básico.
- **Instrutor**: confirma/ajusta presenças, consulta histórico, acompanha alunos.
- **Professor**: tudo do instrutor + gestão de graduações e configurações (regras, treinos, tipos).
- **Admin / Dono / Staff**: acesso amplo a configurações e cadastros.
- **Admin TI**: acesso total e modo de impersonação para QA (mesmo mapeamento de ADMIN_TI em `config/roles.ts`).

## Principais módulos
- **Autenticação**: `/login` com mock (`authMockService` + `userStore`), persistência em cookies/localStorage e middleware de RBAC.
- **Dashboards**: `/home` (resumo rápido, cards placeholders), `/dashboard` (placeholder de visão analítica).
- **Presenças**: check-in do aluno (`/checkin`, `/aluno/checkin/*`), conferência do staff (`/presencas/*`), histórico consolidado (`/historico-presencas`).
- **Gestão de Alunos**: listagem/filtros/CRUD mockado em `/alunos`.
- **Graduações**: planejamento e histórico em `/graduacoes/proximas` e `/graduacoes/historico`, usando componentes de faixa.
- **Agenda e Treinos**: leitura semanal em `/treinos`; configurações de grade em `/configuracoes/treinos` e tipos em `/configuracoes/tipos-treino`.
- **QR Code**: geração/validação/histórico em `/qrcode`, `/qrcode/validar`, `/qrcode/historico`.
- **Configurações**: regras de graduação (`/configuracoes/graduacao`), tipos de treino, grade semanal e troca de senha.
- **Perfil**: edição de dados básicos em `/perfil`.

## Visão geral da arquitetura
- **Front atual**: Next.js App Router; estilização com Tailwind + DaisyUI + tema ZEKAI (tokens em `styles/tailwind.css` e utilitários em `styles/globals.css`); componentes compartilhados em `components/` e `app/z-ui`.
- **Dados**: mocks centralizados em `data/mocks` e `data/mocks/db`, consumidos por `services/*`, armazenados em stores Zustand (`store/*`) e expostos a páginas via hooks (`hooks/*`).
- **Autorização**: middleware (`middleware.ts`) lê `bjj_roles` de cookie/localStorage, aplica RBAC pelo `config/siteMap.ts`/`config/roles.ts` e redireciona para `/login` ou `/unauthorized` quando necessário.
- **Futuro planejado**: troca dos services mockados por chamadas HTTP para API própria, mantendo contratos de stores/hooks; banco relacional (Supabase/Postgres) como fonte de verdade; app mobile reutilizando a mesma API.
