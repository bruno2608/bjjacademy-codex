# ZEKAI UI — Relatório de Tema (zdark / zlight)

> **Status:** Atualizado em 08/12/2025  
> **Arquivos-chave:** `styles/tailwind.css`, `tailwind.config.js`, `app/layout.jsx`, `src/tokens/bjjBeltTokens.ts`, `src/design/bjj/bjjBeltPalette.ts`

## 1) Fluxo de background do app
- `styles/tailwind.css` registra DaisyUI (`@plugin "daisyui"`) e define os temas `zdark`/`zlight` via `@plugin "daisyui/theme"`. Esses blocos criam `--color-base-*`, `--color-primary`, etc., que DaisyUI converte em utilitários `bg-base-100`, `text-base-content`, `btn`, etc. Não coloque `--color-bjj-*` aqui. Em Tailwind v4, mantenha `@config "../tailwind.config.js"` no topo do CSS para carregar o tema extendido.
- `app/layout.jsx` fixa `data-theme="zdark"` no `<html>` e aplica `bg-base-100 text-base-content` no `<body>`, então o fundo global vem exclusivamente dos tokens DaisyUI do tema ativo. `AppShell` também segue `bg-base-100 text-base-content` (sem `bg-bjj-black`), mantendo o fundo do tema.
- `styles/globals.css` só lê `--b2/--bc` (DaisyUI) para pintar `html, body`; sem hexcodes manuais.

## 2) Onde vivem as cores BJJ (faixas)
- `tailwind.config.js` (`theme.extend.colors`) expõe os tokens `bjj-*` (neutros/ponteira) e `bjj-belt-*` (bases das faixas, incluindo coral). Isso garante as classes `bg-bjj-*`, `bg-bjj-belt-*`, `text-bjj-*`, etc., sem interferir nos tokens `base`/`primary` da DaisyUI.
- `src/tokens/bjjBeltTokens.ts` mapeia cada base para a classe Tailwind correspondente (`bg-bjj-belt-blue`, ...).
- `src/design/bjj/bjjBeltPalette.ts` monta `BJJ_BELT_VISUALS` (cores completas de faixa, ponteira, listras, texto, progress bar, stitching) para adulto/infantil/honoríficas.
- `data/mocks/bjjBeltMocks.ts` apenas faz spread da palette e adiciona domínio (id/slug/categoria/graus/tipoPreta).
- `components/bjj/BjjBeltStrip.tsx` e `BjjBeltProgressCard.tsx` consomem o mock e só usam fallbacks mínimos quando algum campo não existe.

## 3) Por que o fundo ficou preto
- Um bloco `@theme` com `--color-bjj-*` em `styles/tailwind.css` foi interpretado pelo pipeline Tailwind/DaisyUI como um tema adicional sem tokens `base`. Isso sobrescreveu os tokens `--b1/--b2` do tema padrão e `bg-base-100` passou a resolver para preto.
- Solução aplicada: remover o `@theme` de cores BJJ do CSS, manter wrappers globais (`AppShell`) em `bg-base-100 text-base-content` e garantir `@config "../tailwind.config.js"` no CSS. As cores de faixa vivem apenas no `tailwind.config.js` (extend.colors), isoladas dos temas globais.

## 4) Separação atual
- **Tema global:** apenas nos blocos `@plugin "daisyui/theme"` de `styles/tailwind.css` (zdark/zlight). Controla `base`, `primary`, `secondary`, etc., e pinta `<body>` via `bg-base-100`. Nenhum token de faixa mora aqui.
- **Cores de faixas:** definidas em `tailwind.config.js` (`extend.colors`) → `bjjBeltTokens` → `bjjBeltPalette` → mocks → componentes. Não tocam `base/primary`.
- Safelist em `tailwind.config.js` garante geração das classes específicas de faixa (incluindo gradientes e `bg-bjj-belt-coral`).

## 5) Como adicionar novas cores de faixa sem quebrar o tema
1. Adicione a cor em `tailwind.config.js` dentro de `extend.colors` com prefixo `bjj-*` ou `bjj-belt-*`.  
2. Mapeie a chave em `BJJ_BELT_COLORS` (`src/tokens/bjjBeltTokens.ts`).  
3. Use a chave em `BJJ_BELT_VISUALS` (`src/design/bjj/bjjBeltPalette.ts`) para faixa/tip/listras/progresso.  
4. Espalhe a palette no mock correspondente em `data/mocks/bjjBeltMocks.ts`.  
5. Valide em `/belt-demo` (adulto + infantil).  
Nenhum passo altera `styles/tailwind.css` ou os tokens `base/primary`; o fundo global continua vindo do tema DaisyUI.

## 6) QA rápido pós-correção
- Fundo global deve seguir `bg-base-100` do zdark/zlight em qualquer página.  
- `/belt-demo`: Azul com 1 grau (1 listra branca ativa + 3 inativas), Roxa com 2 listras ativas, Preta professor com ponteira vermelha e bordas brancas, Branca com texto “JIU-JITSU” escuro. Faixas infantis mantêm listras horizontais e combinações (amarela/preta, cinza/branca, etc.).
