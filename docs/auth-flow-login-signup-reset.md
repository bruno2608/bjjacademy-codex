# Fluxo de autenticação atual (mock)

> **Documento consolidado:** as definições completas de autenticação, cadastro, reset e check-in estão em [`docs/auth-and-checkin-flow.md`](./auth-and-checkin-flow.md). Este arquivo permanece como fotografia do estado técnico atual (mocks/stores) e histórico de implementação.

Este documento descreve o estado atual do fluxo de autenticação do BJJ Academy PWA. Ele consolida rotas existentes, stores, serviços mock e o comportamento do AppShell/middleware, sem propor mudanças de comportamento.

## 1. Estado atual da autenticação

- **Serviço de login mockado:** o login usa `authMockService` (`services/authMockService.ts`), que valida o e-mail em uma whitelist de usuários piloto e exige a senha fixa `BJJ@pilot2025`. Cada usuário mock possui `id`, `email`, `nomeCompleto`/`name`, `roles`, `alunoId`/`instrutorId`/`professorId`, `academiaId`, `avatarUrl` e telefone opcional.【F:services/authMockService.ts†L4-L72】【F:services/authMockService.ts†L74-L95】
- **Persistência local e estado:** `useUserStore` (`store/userStore.ts`) mantém `user`, `effectiveUser`, `impersonation`, `token`, `hydrated` e `isAuthenticated`. O login gera um token fake, normaliza papéis, persiste dados em `localStorage`/cookie (`bjj_token`, `bjj_roles`, `bjj_user`, `bjj_impersonation`) e marca `isAuthenticated` como `true`. O método `hydrateFromStorage` reconstrói o usuário e papéis a partir do armazenamento local antes de renderizar rotas protegidas.【F:store/userStore.ts†L8-L113】【F:store/userStore.ts†L141-L214】
- **Fluxo padrão:** a rota `/` redireciona para `/login`. Na tela de login, `userStore.login` chama o serviço mock; após autenticação, usuários staff (qualquer papel além de `ALUNO`) são redirecionados para `/dashboard` e alunos exclusivos para `/dashboard-aluno`. Se o usuário já estiver autenticado e a store hidratada, a página de login faz o redirecionamento imediato sem novo submit.【F:app/page.jsx†L1-L9】【F:app/login/page.jsx†L19-L57】

## 2. Telas de Login

- **Rota e arquivo:** `app/login/page.jsx` é a única tela de entrada. Não há rota duplicada em `(auth)` ou variações.
- **Formulário:** campos de `email` e `senha` com validação básica de preenchimento. Os campos usam `ValidatedField`, exibindo mensagens de erro se vazios e helper text sobre uso de e-mail institucional/senha compartilhada.【F:app/login/page.jsx†L30-L76】
- **Submit:** o `handleSubmit` chama `login({ email, senha })` da store. Em sucesso, avalia papéis para decidir entre `/dashboard` (staff) ou `/dashboard-aluno` (aluno exclusivo). Em erro, trata mensagens específicas: `USUARIO_NAO_HABILITADO_PILOTO` → “usuário não habilitado para o piloto”; `CREDENCIAIS_INVALIDAS` → “E-mail ou senha inválidos”; qualquer outro → erro genérico. O botão mostra loading (`Entrando...`) enquanto aguarda resposta.【F:app/login/page.jsx†L78-L123】
- **Mensagens visuais:** o rodapé lembra que é preciso usar um e-mail habilitado no piloto e a senha padrão; não há links de cadastro ou esqueci senha na UI atual.【F:app/login/page.jsx†L124-L146】

## 3. Cadastro / Signup

- **Status:** não existe rota ou componente de cadastro público/invitational no código atual. Apenas os usuários piloto da whitelist conseguem acessar o sistema. Menus e login não exibem CTA de criação de conta.

## 4. Esqueci senha / Reset

- **Status:** não há rotas ou componentes de “Esqueci minha senha” ou redefinição. A tela de login não mostra links para recuperação e o serviço de autenticação não implementa envios de e-mail ou troca de senha.

## 5. Proteção de rotas (AppShell + middleware)

- **AppShell (client-side):** renderizado em `app/layout.jsx`. Traça uma lista de rotas “nuas” (`/login`, `/unauthorized`). Para qualquer outra rota, hidrata a store; se hidratado e sem `user`, redireciona para `/login`. Enquanto hidrata, exibe loader; se autenticado, renderiza nav + conteúdo. A navegação usa `effectiveUser`, permitindo modo teste/impersonação.【F:app/layout.jsx†L6-L27】【F:components/ui/AppShell.jsx†L12-L61】
- **Middleware (edge):** intercepta todas as rotas (exceto `/login`, `/unauthorized`, manifest e assets). Lê o cookie `bjj_roles`; se vazio, redireciona para `/login?redirect=<pathname>`. Caso haja papéis, verifica permissão via `config/siteMap` e, se negar acesso, redireciona para uma rota permitida ou `/unauthorized`. Administradores/`ADMIN_TI` têm acesso total.【F:middleware.ts†L1-L50】【F:config/siteMap.ts†L1-L74】
- **Navegação inicial:** a página `/` redireciona para `/login`; após login, a escolha entre `/dashboard` e `/dashboard-aluno` segue a lógica do formulário de login, não do middleware.

## 6. Modo teste / Impersonação (ADMIN_TI)

- **Estado na store:** `useUserStore` mantém `impersonation` (`isActive`, `targetUser`) e `effectiveUser`. `startImpersonation` grava o usuário alvo e passa a usar `effectiveUser` para renderizar a navegação; `stopImpersonation` restaura o usuário real e limpa a persistência (`bjj_impersonation`).【F:store/userStore.ts†L15-L25】【F:store/userStore.ts†L214-L243】
- **Interface:** o componente `AdminTiViewSwitcher` (usado no `TabletNav`) só aparece para papéis que incluem `ADMIN_TI`. Ele lista usuários piloto não-admin da whitelist e permite ativar “modo teste” (impersonação) ou voltar para o usuário real. O rótulo exibe “Modo teste” ou “Testando: <nome>” conforme estado ativo.【F:components/ui/AdminTiViewSwitcher.jsx†L1-L95】【F:components/ui/AdminTiViewSwitcher.jsx†L97-L173】
- **Banner de aviso:** quando `impersonation.isActive`, `ImpersonationBanner` mostra alerta fixo com o nome e papéis do usuário simulado e um botão “Voltar para meu usuário”.【F:components/ui/ImpersonationBanner.jsx†L1-L33】

## 7. Problemas conhecidos e inconsistências

- Não há fluxos de **cadastro** ou **recuperação de senha** implementados; apenas a whitelist mock permite acesso.
- A senha piloto é fixa e única (`BJJ@pilot2025`), sem rotação ou onboarding seguro.
- O README antigo ainda menciona login liberado para qualquer e-mail/senha; a implementação atual exige whitelist. (Seção ajustada no README nesta branch.)
- O redirecionamento pós-login depende apenas da tela de login; acessos diretos a rotas protegidas dependem do cookie `bjj_roles`, podendo perder o destino pretendido se a store ainda não hidratou.

## 8. Sugestão de próximos passos (alto nível)

- [ ] Consolidar tela de login consumindo o serviço real (ou Supabase) mantendo compatibilidade com `userStore`.
- [ ] Criar tela de **cadastro/primeiro acesso** baseada em convite/código de academia, fora do modo piloto.
- [ ] Implementar fluxo visual de **“Esqueci minha senha”** (tela + feedback), mesmo que sem backend real inicialmente.
- [ ] Centralizar redirecionamento pós-login (store ou middleware) respeitando `redirect` query string.
- [ ] Formalizar lista de **usuários piloto** e credenciais padrão em doc pública ou variável de ambiente, evitando hardcode.
- [ ] Expandir o modo **impersonação** para permitir simular perfis com dados customizados (ex.: aluno com pendências de presença).
- [ ] Revisar navegação para expor (ou esconder) CTAs de cadastro/recuperação apenas quando os fluxos existirem.
- [ ] Adicionar testes de fumaça para AppShell/middleware cobrindo cenários sem cookie, com cookie inválido e com roles sem permissão.
