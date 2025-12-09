# Arquitetura Atual – Front/PWA

## Organização de pastas
- `app/`: rotas do App Router (Next.js 14). Telas principais: `/home`, `/dashboard`, `/checkin`, `/presencas/*`, `/alunos`, `/graduacoes/*`, `/historico-presencas`, `/treinos`, `/evolucao`, `/qrcode/*`, `/configuracoes/*`, `/perfil`, `/login` e fluxos de onboarding/recuperação.
- `components/`: UI compartilhada (Modal, Input, Table, PageHero, StudentHero, TabletNav, UserMenu, etc.) e vitrine de tema em `app/z-ui`.
- `data/`: mocks legados (`mockAlunos`, `mockPresencas`, etc.) e catálogo; `data/mocks` contém mocks canônicos e `data/mocks/db` reúne entidades por tabela.
- `services/`: camada de acesso a dados mockados (authMockService, presencasService, graduacoesService, academias/usuarios/papeis/matriculas/turmas/aulas, dashboard services).
- `store/`: Zustand para cada domínio (user, alunos, presencas, graduacoes, treinos, tipos de treino, qrCheckin, etc.), com persistência em `localStorage`.
- `hooks/`: seleção e composição de dados (`useCurrentUser`, `useCurrentAluno`, `useCurrentStaff`, `useHeroAlunoDashboard`, dashboards de aluno/staff, role helper).
- `config/`: RBAC (`roles.ts`, `siteMap.ts`), regras de graduação e temas.
- `styles/`: `tailwind.css` define temas DaisyUI `zdark`/`zlight`; `globals.css` traz utilitários do design system.

## Fluxo de dados
`mocks (data/mocks/db) → services/* → stores (Zustand) → hooks → componentes/páginas`
- Mocks são a única fonte de dados; services os clonam e aplicam regras (ex.: fechamento de treino, normalização de presença).
- Stores mantêm estado global e persistem em `localStorage` (presenças, alunos, graduações, treinos, regras de graduação, sessão do usuário).
- Hooks entregam view models prontos para UI (dashboards, hero do aluno, graduações do professor, role atual).

## Autenticação e RBAC
- **Sessão mock**: `userStore` persiste token fictício, usuário e roles (`bjj_token`, `bjj_user`, `bjj_roles`, `bjj_impersonation`), com hidratação no `AppShell`.
- **Login**: `authMockService` valida whitelist de `mockDb` e senha piloto; erros específicos mapeados na tela de login.
- **RBAC**: `middleware.ts` verifica cookie `bjj_roles` e usa `config/siteMap.ts` para autorizar rotas; admins/ti têm acesso total. Navegação (`lib/navigation.js`) monta menus/top/drawer/avatar conforme roles e injeta grupo de QR quando professor/admin/ti.
- **Layouts**: `AppShell` protege rotas (exceto `/login`, `/unauthorized`, `/z-ui`), injeta navegação (`TabletNav`), banners de impersonação e atualizações PWA.

## UI e temas
- Tailwind + DaisyUI com tokens definidos diretamente em `styles/tailwind.css`; temas `zdark` (padrão) e `zlight` aplicados via `data-theme`.
- Componentes ZK/Zenko (ZkContainer, ZAlert, ZCard, ZInputField) e design “bjj-*” legado convivem; `/z-ui` é playground de tema/componentes.

## PWA
- Manifesto (`app/manifest.ts`), service worker custom e ícones completos em `/public/icons`.
- `usePwaUpdate` e `PwaUpdateBanner` alertam sobre novas versões; `AppShell` inclui meta/theme-color.
