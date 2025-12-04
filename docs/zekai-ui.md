# ZEKAI UI

## 1. Visão geral
O ZEKAI UI é o design system oficial do bjjacademy-codex, construído sobre Tailwind CSS + DaisyUI. Ele padroniza o visual em torno de dois temas (Z-Dark e Z-Light), componentes base (`Zk*`) e um modelo de responsividade pensado para dashboards e telas de autenticação. O objetivo é entregar um visual moderno e escuro por padrão, próximo ao preview gerado no DaisyUI Theme Generator, mantendo consistência entre páginas e times.

## 2. Temas (Z-Dark / Z-Light)
- **Z-Dark (padrão, dark):** plano de fundo escuro com `base-100/200/300`, texto claro em `base-content`, CTA neutro em `primary` (claro) e destaque em `secondary` (vermelho brand). `accent` permanece preto, `neutral` é um azul escuro e os estados usam `info/success/warning/error` derivados do generator.
- **Z-Light (futuro, light):** mesma lógica em paleta clara. Mantém contraste elevado para dashboards, mas não é o tema ativo ainda.
- **Tokens principais e uso recomendado:**
  - **Fundo e texto:** `bg-base-100/200/300`, `text-base-content`.
  - **CTAs:** `btn-primary` para ações neutras/claras, `btn-secondary` para o destaque vermelho brand; `btn-ghost`/`btn-outline` para ações secundárias.
  - **Mensagens e status:** `alert-info/success/warning/error`, `badge-*` seguindo o mesmo esquema.
  - **Inputs:** `input input-bordered bg-base-200` como padrão; foco com `focus-visible:ring-primary`.
- **Ativação do tema:** configurado em `tailwind.config.js` via DaisyUI (`themes: ["Z-Dark", "Z-Light"]`, `darkTheme: "Z-Dark"`). O tema ativo é definido por `data-theme="Z-Dark"` no `<html>`. Alternar para Z-Light requer apenas mudar esse atributo quando o toggle for liberado.

## 3. Layout e responsividade
- **Wrapper global:** `ZkContainer` centraliza e limita largura (`w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8`).
- **Páginas públicas/Auth:** fundo `bg-base-300` ou `bg-base-200`, grid 2 colunas em desktop (`lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`), empilhado em mobile (`grid-cols-1`). Texto/hero na esquerda, card/formulário na direita; em mobile o texto aparece acima e o card ocupa a largura inteira.
- **Dashboard:** topbar sticky (`sticky top-0 z-40 bg-base-100/80 backdrop-blur`), header compacto e grids autoajustáveis (`grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`).
- **Formulários:** colunas únicas no mobile; `md:grid-cols-2` quando fizer sentido. Erros inline (`text-xs text-error`) logo abaixo do campo.

## 4. Componentes base
- **ZkContainer:** wrapper responsivo. Use em praticamente todas as páginas para centralizar o conteúdo.
- **ZkPage:** opcional para cenários que pedem fundo gradiente/altura mínima; combine com `ZkContainer` quando quiser herdar o padrão de página inteira.
- **Botões:** `btn-primary` (ação neutra clara), `btn-secondary` (vermelho brand), `btn-outline`/`btn-ghost` para ações secundárias.
- **Inputs:** `input input-bordered bg-base-200/80` com foco em `primary`. Checkbox/radio/toggle usam as variantes padrão do DaisyUI para respeitar o tema.
- **Feedbacks:** `alert-*` e `badge-*` seguem a paleta do tema; prefira badges outline para marcadores discretos.

## Estado atual do tema (Z-Dark / Z-Light)
- DaisyUI configurado com os temas personalizados `Z-Dark` (default) e `Z-Light` em `tailwind.config.js`.
- O `<html>` aplica `data-theme="Z-Dark"`, tornando o dark o tema ativo global.
- A tela `/login` usa somente tokens do tema (`bg-base-*`, `text-base-content`, `btn-*`), sem cores fixas.
- Overrides antigos baseados em `bjj-*` ou cores hardcoded foram removidos ou convertidos para tokens do tema.

## Checklist rápido para novas telas
- Use `ZkContainer` para centralizar e limitar a largura; em auth, combine com grids responsivos (2 colunas no desktop, colunas empilhadas no mobile).
- Aplique apenas tokens do tema para cores/bordas/textos; evite hex/hsl fixo.
- Confirme que `data-theme="Z-Dark"` está setado na raiz (ou `Z-Light` quando o modo claro for liberado).
