# BJJ Academy Codex — Visão Geral Técnica

> **Status:** Atualizado em 06/12/2025  
> **Fonte principal:** [01-visao-geral-bjjacademy-codex.md](./01-visao-geral-bjjacademy-codex.md)

## 1. Visão geral do projeto
## 1. Visão geral do projeto
- **Nome:** BJJ Academy Codex
- **Tipo:** PWA para gestão de academias de Jiu-Jitsu.
- **Framework principal:** Next.js (App Router) em modo PWA com metadata e manifest já configurados no `app/layout.jsx`.
- **Perfis de usuário atuais:** aluno, instrutor, professor, admin e admin de TI (normalizados a partir de aliases em `config/roles.ts`).
- **Objetivo percebido no código:** entregar um painel gamificado para staff e alunos, com rotas de dashboard, presenças, graduações, check-ins e playground de UI/tema.

## 2. Stack e ferramentas
- **Next.js 14.1** e **React 18** (`package.json`).
- **Tailwind CSS 4** + **DaisyUI 5** configurados via `@import "tailwindcss";` e `@plugin "daisyui"` em `styles/tailwind.css` (o `tailwind.config.js` está vazio, deixando a configuração no entry CSS).
- **Zustand 4.5** para estado global (ex.: `store/userStore.ts`).
- **Icones:** `lucide-react` e `@iconify/react` (usados em alerts e botões do login/z-ui).
- **PWA:** `next-pwa` listado nas dependências; manifest e theme-color declarados em `app/layout.jsx`.
- **Arquivos de configuração/estilo relevantes:**
  - `styles/tailwind.css` — entry do Tailwind e definição completa dos temas `zdark`/`zlight`.
  - `styles/globals.css` — classes utilitárias do design system (ex.: `.zk-card`, `.zk-badge-soft`).
  - `tailwind.config.js` — placeholder sem overrides.

## 3. Arquitetura de pastas e layout
- **App Router:** todas as rotas ficam em `app/`. O `app/layout.jsx` aplica o tema padrão (`data-theme="zdark"`), importa os estilos globais e envolve as páginas com `AppShell`.
- **Controle de layout:** `AppShell` (em `components/ui/AppShell.jsx`) protege rotas autenticadas. Ele libera apenas `/login`, `/unauthorized` e `/z-ui` como “bare layout”; demais caminhos redirecionam para `/login` quando o usuário não está hidratado/autenticado.
- **Navegação:** para áreas autenticadas, o `AppShell` injeta `TabletNav`, `ImpersonationBanner` e `ShellFooter`, aplicando espaçamento padrão no `<main>`.
- **Rotas principais implementadas (observadas no diretório `app/`):**
  - Autenticação e onboarding: `/login`, `/cadastro`, `/acesso-convite`, `/esqueci-senha`, `/redefinir-senha`, `/forgot-password`, `/reset-password`, `/primeiro-acesso`, `/unauthorized`.
  - Painel staff/aluno: `/dashboard`, `/presencas`, `/alunos`, `/graduacoes`, `/relatorios`, `/configuracoes`, `/historico-presencas`, `/treinos`, `/checkin`, `/evolucao`, `/perfil`, `/aluno`, `/qrcode`, `/belt-demo`.
  - Playground de UI/tema: `/z-ui`.

## 4. Design System e temas (zdark / zlight)
- **Definição de temas:** `styles/tailwind.css` usa `@plugin "daisyui" { themes: zdark --default, zlight --prefersdark; }` e duas instâncias de `@plugin "daisyui/theme"` para declarar tokens dos temas `zdark` (padrão, `prefersdark`) e `zlight` (alternativo). Tokens incluem paleta (`--color-base-*`, `--color-primary` etc.), radius (`--radius-selector`, `--radius-field`, `--radius-box`), tamanhos (`--size-selector`, `--size-field`) e efeitos (`--border`, `--depth`, `--noise`).
- **Consumo de tokens:**
  - Classes DaisyUI (`bg-base-*`, `text-base-content`, `alert-*`, `btn-*`, etc.) distribuem as cores/contrastes.
  - Utilitários personalizados em `styles/globals.css` usam as variáveis de radius e border (ex.: `.zk-card` aplica `border-width: var(--border, 3px)` e `rounded-[var(--radius-box)]`).
  - Componentes como `ZCard` e `ZAlert` empregam `bg-base-*`, `border-base-*` e `alert-*`, reforçando a leitura das variáveis de tema.
- **Fonte de verdade de tema:** centralizada no `styles/tailwind.css`; o `tailwind.config.js` não replica tokens, sinalizando que a migração para Tailwind 4 + DaisyUI 5 concentra a configuração no CSS.

## 5. Componentes base do design system (Z*)
- **`ZCard`** (`app/z-ui/_components/ZCard.tsx`):
  - Variações `default`, `subtle`, `ghost` mapeiam para combinações de `bg-base-*`, `border-base-*` e `shadow`.
  - Suporta `padded` para controlar o `card-body` padrão (gap/padding) e aceita `className` adicional.
  - Usado no tab “Components Demo” para abrigar vitrines de cards complexos.
- **`ZAlert`** (`app/z-ui/_components/ZAlert.tsx`):
  - Variantes `info`, `success`, `warning`, `error`, com ícones opcionais via Iconify.
  - Estrutura `alert` do DaisyUI com título, descrição e ação opcionais.
  - Demostrado no tab “Component Variants” e em exemplos da `ColorPalette`.
- **`ZInputField`** (`app/z-ui/_components/ZInputField.tsx`):
  - Inclui `label`, `helperText`, `error` e `containerClassName`.
  - Aplica `input input-bordered` e ativa estado de erro via `input-error border-error/80`, exibindo mensagem abaixo.
- **`ZkAlert`** (`app/z-ui/_components/ui/ZkAlert.tsx`):
  - Variante gamificada usada no login e na paleta do playground; suporta `info/success/warning/error`, ícone opcional e título.
- **Wrappers**: `ZkContainer` (`src/components/zekai-ui/ZkContainer.tsx`) centraliza largura (`max-w-6xl`) e é aplicado no `/login` e `/z-ui`.

## 6. Telas / rotas principais implementadas
### Login (`app/login/page.jsx`)
- **Layout:** duas colunas responsivas dentro de `ZkContainer`; texto institucional à esquerda e card de login à direita usando `.zk-card` (bg-base-200, borda baseada em `--border`, radius `--radius-box`).
- **Design system:** inputs seguem `input input-bordered` e estados de erro DaisyUI; mensagens de erro usam `ZkAlert` variante `error`.
- **Estado do formulário:** controlado por estado local (`useState` para campos e erros tocados). Botão desabilita durante envio e exibe `Loader2` animado.
- **Fluxo de autenticação:** chama `login` do `useUserStore` (Zustand). Em caso de sucesso, redireciona para `/dashboard`, `/dashboard-aluno` ou `redirect` passado na query. Erros tratam códigos específicos do mock (`CREDENCIAIS_INVALIDAS`, `USUARIO_CONVITE_PENDENTE`, etc.). O tema é forçado para `zdark` na montagem (atualiza `data-theme` e `localStorage`).

### ZEKAI UI / Theme Playground (`app/z-ui/page.tsx` + `_components`)
- **Tabs:**
  - **Theme Editor:** layout estático inspirado no DaisyUI Theme Generator; mostra lista de temas, controles de cores, radius, efeitos e opções de tema padrão (sem persistência real).
  - **Components Demo:** grid de cards `ZCard` com previews de listas, gráficos fictícios, calendário, chat, pricing, etc. para validar contraste e radius.
  - **Component Variants:** catálogo de botões, badges, inputs (`ZInputField`) e `ZAlert` em variações de estado.
  - **Color Palette:** exibe paletas dos temas e alerta informativo (`ZkAlert`) sobre o uso.
- **Tema ao vivo:** a página controla `data-theme` e persiste a escolha `zdark/zlight` em `localStorage` (`zekai-ui-theme`).

### Outras rotas observadas
- **Painel staff/aluno:** páginas como `/dashboard`, `/presencas`, `/alunos`, `/graduacoes` e `/relatorios` usam componentes legados (`bjj-*`) com gradientes escuros e cards próprios. A navegação é gerenciada pelo `AppShell`, que injeta cabeçalhos e navegação lateral/tablet.
- **Utilidades:** `/belt-demo` e demais páginas de configuração/check-in utilizam conjuntos de componentes específicos (badges de faixa, tabelas, timelines), ainda no tema anterior.

## 7. Autenticação e estado (atual)
- **Mock de login:** `services/authMockService.ts` valida credenciais em listas locais (`data/mocks/*`) e exige senha piloto `BJJ@pilot2025`. Dispara erros sem comunicação com backend real.
- **Store de usuário:** `store/userStore.ts` (Zustand) mantém `user`, `token`, `impersonation` e hidrata do `localStorage`/cookies. Normaliza roles via `normalizeRoles` e persiste dados (`bjj_user`, `bjj_roles`, `bjj_token`). Fornece `startImpersonation`/`stopImpersonation` e redireciona via `AppShell` quando não autenticado.
- **Controle de acesso:** `AppShell` considera `/login`, `/unauthorized` e `/z-ui` públicos; demais caminhos exigem usuário hidratado.

## 8. Status da migração de UI / tema
- **Tailwind 4 + DaisyUI 5 já configurados** no entry CSS com temas `zdark` (default) e `zlight` (prefersdark alternativo).
- **Componentes críticos já migrados:** rota `/z-ui` usa `ZCard`, `ZAlert`, `ZInputField`, `ZkAlert` e classes `bg-base-*`/`border-base-*`. O login emprega `.zk-card` e `ZkAlert`, mas ainda usa inputs manuais em vez de `ZInputField`.
- **Resquícios de visual antigo:** páginas de dashboard e módulos (`/dashboard`, `/presencas`, etc.) seguem estilos `bjj-*` personalizados e não consomem os tokens de DaisyUI/Tailwind 4. Não há tokens duplicados no `tailwind.config.js`, porém a coesão de tema ainda não foi aplicada a todas as telas.

## 9. Próximos passos recomendados (UI / Tema / Login / Z-UI)
- Unificar telas legadas (`/dashboard`, presenças, graduações) para usar `bg-base-*`, bordas `var(--border)` e componentes `ZCard`/`ZAlert`, reduzindo discrepância com `/z-ui`.
- Refatorar o formulário de login para usar `ZInputField` e mover `.zk-card` para um componente React (`ZCard`) para padronizar radius/sombreamento.
- Completar o toggle real de tema entre `zdark` e `zlight` no app inteiro, reutilizando o estado salvo em `localStorage` pelo `/z-ui` e propagando para o `AppShell`.
- Formalizar documentação viva do design system consolidando `docs/zekai-ui.md` com os componentes `ZCard`/`ZAlert`/`ZInputField` e exemplos reais do painel.
- Planejar remoção de classes `bjj-*` e migração das páginas de relatórios/configurações para `styles/tailwind.css` + DaisyUI, evitando estilos duplicados.