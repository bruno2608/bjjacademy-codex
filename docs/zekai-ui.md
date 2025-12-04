# ZEKAI UI

## 1. Visão geral
O ZEKAI UI é o design system oficial do bjjacademy-codex, construído sobre Tailwind CSS + DaisyUI. Ele organiza o visual em torno dos temas **Z-Dark** (padrão) e **Z-Light** (futuro toggle), define wrappers base (`ZkContainer`, `ZkPage`) e dita o modelo de responsividade para telas públicas e de dashboard. A intenção é manter um visual moderno, escuro por padrão, coerente com o preview do DaisyUI Theme Generator.

## 2. Temas (Z-Dark / Z-Light)
- **Z-Dark (padrão, dark):** fundo escuro usando `base-100/200/300`, texto claro em `base-content`, CTA neutro em `primary` (claro) e destaque em `secondary` (vermelho brand). `accent` permanece preto, `neutral` é azul escuro e estados usam `info/success/warning/error` da paleta oficial.
- **Z-Light (futuro, light):** mesma lógica em paleta clara, preservando contraste alto para dashboards.
- **Tokens principais e uso recomendado:**
  - **Fundo e texto:** `bg-base-100/200/300`, `text-base-content`.
  - **CTAs:** `btn-primary` para ações neutras, `btn-secondary` para destaque vermelho brand; `btn-ghost`/`btn-outline` para ações secundárias.
  - **Mensagens e status:** `alert-info/success/warning/error`, `badge-*` seguindo a paleta.
  - **Inputs:** `input input-bordered bg-base-200` como padrão; foco com `focus-visible:ring-primary`.
- **Fonte da verdade:** os temas vivem no `tailwind.config.js` em `daisyui.themes` (apenas `Z-Dark` e `Z-Light`, com `darkTheme: "Z-Dark"`). O tema ativo vem de `data-theme="Z-Dark"` no `<html>`; trocar para Z-Light basta alterar esse atributo quando o toggle for liberado.

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

## Estado atual do tema (Z-Dark / Z-Light)
- DaisyUI está configurado com os temas personalizados `Z-Dark` (default) e `Z-Light` exclusivamente no `tailwind.config.js` (`daisyui.themes`).
- O `<html>` aplica `data-theme="Z-Dark"`, tornando o dark o tema ativo global.
- A tela `/login` usa somente tokens do tema (`bg-base-*`, `text-base-content`, `btn-*`), sem cores fixas.
- Overrides antigos baseados em `bjj-*` ou cores hardcoded foram removidos ou convertidos para tokens do tema.

## Checklist rápido para novas telas
- Use `ZkContainer` para centralizar e limitar a largura; em auth, combine com grids responsivos (2 colunas no desktop, colunas empilhadas no mobile).
- Aplique apenas tokens do tema para cores/bordas/textos; evite hex/hsl fixo.
- Confirme que `data-theme="Z-Dark"` está setado na raiz (ou `Z-Light` quando o modo claro for liberado).

## Playground de Componentes (/z-ui)
- Rota interna para validar visualmente o tema Z-Dark/Z-Light aplicado ao DaisyUI, sem necessidade de navegar pelas telas reais.
- Exibe paleta com tokens (base/primary/secondary/accent/neutral/info/success/warning/error) e valores OKLCH, mais componentes como botões, badges, inputs, checkbox/radio/toggle, alerts e exemplos de tipografia sobre diferentes superfícies.
- Use esta página para conferir contrastes, bordas e estados antes de aplicar ajustes de tema em produção.
