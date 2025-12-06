# ZEKAI UI

> **Status:** Atualizado em 06/12/2025  
> **Fonte principal:** [01-visao-geral-bjjacademy-codex.md](./01-visao-geral-bjjacademy-codex.md)

## 1. Visão geral
O ZEKAI UI é o design system oficial do bjjacademy-codex, construído sobre Tailwind CSS + DaisyUI 5. Ele organiza o visual em torno dos temas **zdark** (padrão) e **zlight** (toggle interno do playground), define wrappers base (`ZkContainer`, `ZkPage`) e dita o modelo de responsividade para telas públicas e de dashboard. A intenção é manter um visual moderno, escuro por padrão, coerente com o preview do DaisyUI Theme Generator.

## 2. Temas (zdark / zlight)
- **zdark (padrão, dark):** fundo escuro usando `base-100/200/300`, texto claro em `base-content`, CTA neutro em `primary` (claro) e destaque em `secondary`. `accent` permanece profundo, `neutral` é azul escuro e estados usam `info/success/warning/error` da paleta oficial.
- **zlight (futuro, light):** mesma lógica em paleta clara, preservando contraste alto para dashboards.
- **Tokens principais e uso recomendado:**
  - **Fundo e texto:** `bg-base-100/200/300`, `text-base-content`.
  - **CTAs:** `btn-primary` para ações neutras, `btn-secondary` para destaque vermelho brand; `btn-ghost`/`btn-outline` para ações secundárias.
  - **Mensagens e status:** `alert-info/success/warning/error`, `badge-*` seguindo a paleta.
  - **Inputs:** `input input-bordered bg-base-200` como padrão; foco com `focus-visible:ring-primary`.
- **Fonte da verdade:** os temas são definidos em `styles/tailwind.css` via `@plugin "daisyui"` e dois blocos `@plugin "daisyui/theme"` (zdark/zlight). O `tailwind.config.js` permanece mínimo, apenas carregando Tailwind 4. Consulte o [relatório de tema](./zekai-theme-report.md) para a lista completa de tokens. O tema ativo vem de `data-theme="zdark"` no `<html>`; trocar para zlight basta alterar esse atributo ou usar o toggle do `/z-ui`.

## 3. Layout e responsividade
- **Wrapper global:** `ZkContainer` centraliza e limita largura (`w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8`).
- **Páginas públicas/Auth:** fundo `bg-base-300` ou `bg-base-200`, grid 2 colunas em desktop (`lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`), empilhado em mobile (`grid-cols-1`). Texto/hero na esquerda e card/formulário na direita; em mobile, texto acima e card ocupando toda a largura.
- **Dashboard:** topbar sticky (`sticky top-0 z-40 bg-base-100/80 backdrop-blur`), header compacto e grids autoajustáveis (`grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`).
- **Formulários:** colunas únicas no mobile; `md:grid-cols-2` quando fizer sentido. Erros inline (`text-xs text-error`) logo abaixo do campo.

## 4. Componentes base
- **ZkContainer:** wrapper responsivo para centralizar conteúdo na maioria das páginas.
- **ZkPage:** opcional para páginas completas; usa fundo gradiente e `min-h-dvh` quando necessário.
- **Botões:** `btn-primary` (ação neutra clara), `btn-secondary` (vermelho brand), `btn-outline`/`btn-ghost` para ações secundárias.
- **Inputs:** `input input-bordered bg-base-200/80` com foco em `primary`. Checkbox/radio/toggle usam as variantes padrão do DaisyUI para respeitar o tema.
- **Feedbacks:** `alert-*` e `badge-*` seguem a paleta do tema; prefira badges outline para marcadores discretos.

## Estado atual do tema (zdark / zlight)
- DaisyUI está configurado no entry `styles/tailwind.css`, que registra o plugin e os tokens customizados de `zdark` (default/prefersdark) e `zlight` (light).【F:styles/tailwind.css†L1-L74】
- O `<html>` aplica `data-theme="zdark"`, tornando o dark o tema ativo global; `/z-ui` permite alternar temporariamente e persiste em `localStorage` (`zekai-ui-theme`).【F:app/layout.jsx†L18-L25】【F:app/z-ui/page.tsx†L80-L141】
- A tela `/login` usa somente tokens do tema (`bg-base-*`, `text-base-content`, `btn-*`), sem cores fixas, e força `data-theme="zdark"` ao carregar.【F:app/login/page.jsx†L95-L137】【F:app/login/page.jsx†L133-L219】
- Overrides antigos baseados em `bjj-*` ou cores hardcoded foram substituídos por tokens; resquícios permanecem apenas em telas legadas fora do fluxo `/z-ui` e login.

## Checklist rápido para novas telas
- Use `ZkContainer` para centralizar e limitar a largura; em auth, combine com grids responsivos (2 colunas no desktop, colunas empilhadas no mobile).
- Aplique apenas tokens do tema para cores/bordas/textos; evite hex/hsl fixo.
- Confirme que `data-theme="zdark"` está setado na raiz (ou `zlight` quando o modo claro for liberado).

## Playground de Componentes (/z-ui)
- Rota interna para validar visualmente o tema zdark/zlight aplicado ao DaisyUI, sem necessidade de navegar pelas telas reais.
- Exibe abas inspiradas no Theme Generator: **Components Demo**, **Component Variants** e **Color Palette**.
- Mostra a paleta com tokens (base/primary/secondary/accent/neutral/info/success/warning/error) e valores OKLCH, mais componentes como botões, badges, inputs, checkbox/radio/toggle, alerts e exemplos de tipografia sobre diferentes superfícies.
- Inclui toggle interno (zdark / zlight) para validar rapidamente o contraste e o comportamento dos tokens sem sair da página.
- Use esta página para conferir contrastes, bordas e estados antes de aplicar ajustes de tema em produção.
