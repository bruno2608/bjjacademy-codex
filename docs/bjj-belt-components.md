# Sistema de Faixas (BJJ Belt)

## Visao geral
- Representa todas as faixas IBJJF (infantil, adulto e honorificas) com graus e progresso de aulas.
- Playground oficial: `app/belt-demo/page.tsx` renderiza cards + strips e deve ser aberto sempre que o tema/Tailwind mudar.
- Componentes canonicos: `components/bjj/BjjBeltStrip.tsx` (visual puro) e `components/bjj/BjjBeltProgressCard.tsx` (faixa + progresso). Arquivos kebab-case apenas reexportam para compatibilidade.
- Sistema de faixas é independente do tema DaisyUI: as cores sao fixas e vêm apenas das classes `bg-bjj-*`/`bg-bjj-belt-*`.

## Fluxo atual (pos-refatoracao)
1) Palette: `src/design/bjj/bjjBeltPalette.ts` centraliza o visual das 22 faixas em `BJJ_BELT_VISUALS` (cores de faixa, ponteira, graus, texto, progressos, listras horizontais, stitching).  
2) Mocks: `data/mocks/bjjBeltMocks.ts` consome a palette via spreads e adiciona somente dados de dominio (`id`, `slug`, `categoria`, `grausMaximos`, `nome` e `tipoPreta` quando existir).  
3) Resolucao: `data/mocks/bjjBeltUtils.ts` mapeia `beltConfigBySlug` + `getFaixaConfigBySlug` sem sobrescrever cores; fallbacks minimos ficam nos componentes.  
4) Render: `BjjBeltProgressCard` usa `BjjBeltStrip` para exibir graus; `app/belt-demo/page.tsx` resolve cada slug via helper e passa `grauAtual` simulado. Se algo aparecer monocromatico, verifique se o slug esta na palette e se as classes existem no tema.

## Tokens de cor
- Tailwind: `tailwind.config.js` expõe cores `bjj-*` (neutros/ponteira/graus/texto) e `bjj-belt-*` (bases das faixas). Elas vivem em `theme.extend.colors` (fora de qualquer `@theme` DaisyUI) e geram as classes publicas `bg-bjj-*`, `bg-bjj-belt-*`, `text-bjj-*`.
- Base de faixas: `src/tokens/bjjBeltTokens.ts` exporta `BJJ_BELT_COLORS` mapeando para `bg-bjj-belt-*`.
- Palette completa: `src/design/bjj/bjjBeltPalette.ts` exporta `BJJ_BELT_VISUALS`, que combina `BJJ_BELT_COLORS` com neutros (`bjj-*`) para definir beltColor, tipColor, stripes, texto, stitching e progressos de todas as faixas (adulto, infantil, honorificas). Esta é a fonte unica de verdade para visual.
- Coral e vermelho: usam `from-bjj-belt-red/80 to-bjj-belt-black/80` (coral) ou `bg-bjj-belt-red/80` (vermelha), reaproveitando `bjj-belt-red`/`bjj-belt-black`.
- Reuso: em novos projetos importe `BJJ_BELT_VISUALS` (ou `BJJ_BELT_COLORS` se quiser so bases) e garanta que `bjj-belt-*` esta no tema.

## Tipos e mocks
- Tipos em `types/bjjBelt.ts`: `BjjBeltVisualConfig`, `BjjBeltStripProps`, `BjjBeltProgressCardProps`.
- Campos obrigatorios em `BjjBeltVisualConfig`:
  - `id`, `nome`, `slug`, `categoria` ("INFANTIL" | "ADULTO"), `grausMaximos`
  - `beltColorClass`, `tipColorClass`, `stripeColorClass`, `stripeInactiveClass`
  - opcionais: `horizontalStripeClass`, `stitchingColorClass`, `textColorClass`, `tipoPreta? ("competidor" | "professor" | "padrao")`, `progressBarClass`
- Exemplo adulto (usando palette + mock):
```ts
import { BJJ_BELT_VISUALS } from "@/design/bjj/bjjBeltPalette";

{
  nome: "Roxa",
  slug: "roxa",
  categoria: "ADULTO",
  grausMaximos: 4,
  ...BJJ_BELT_VISUALS["adulto-roxa"],
}
```
- Exemplo infantil com listra horizontal:
```ts
import { BJJ_BELT_VISUALS } from "@/design/bjj/bjjBeltPalette";

{
  nome: "Amarela e Preta",
  slug: "amarela-preta",
  categoria: "INFANTIL",
  grausMaximos: 4,
  ...BJJ_BELT_VISUALS["infantil-amarela-preta"],
}
```

## Componentes canonicos
### BjjBeltStrip (`components/bjj/BjjBeltStrip.tsx`)
- Props: `{ config?: BjjBeltVisualConfig; grauAtual: number; className?: string }`.
- Comportamento:
  - `safeGrau = clamp(grauAtual, 0, config.grausMaximos)`.
  - Usa cores do mock; fallbacks apenas se vazio: `textColorClass ?? "text-white"`, `stripeColorClass ?? "bg-white"`, `stripeInactiveClass ?? "bg-white/10"`, `stitchingColorClass ?? "bg-black/20"`, `beltColorClass ?? "bg-neutral-800"`, `tipColorClass ?? "bg-black"`.
  - Texto fixo “JIU-JITSU” com `textColorClass` para manter contraste (branca usa texto escuro do mock).
  - Ponteira com largura fixa; se `tipoPreta === "professor"`, desenha bordas brancas laterais.
  - Graus: renderiza sempre ativos e inativos com contraste, usando `stripeColorClass`/`stripeInactiveClass` do config.

### BjjBeltProgressCard (`components/bjj/BjjBeltProgressCard.tsx`)
- Props: `{ config?: BjjBeltVisualConfig; grauAtual: number; aulasFeitasNoGrau: number; aulasMetaNoGrau?: number | null; className?: string }`.
- Logica: clampa `grauAtual`, calcula percentual `aulasFeitasNoGrau / aulasMetaNoGrau` (0..100) e usa `config.progressBarClass ?? config.beltColorClass` na barra (sem depender de `bg-primary`).
- Render: cabecalho com categoria e badges de `tipoPreta`, faixa via `<BjjBeltStrip />` e barra de progresso.
- Arquivo kebab-case `components/bjj/bjj-belt-progress-card.tsx` apenas reexporta a versao canonica.

## Pagina /belt-demo
- Local: `app/belt-demo/page.tsx`.
- Fluxo: percorre `MOCK_FAIXAS`, resolve `config` via `getFaixaConfigBySlug`, simula `grauAtual` e aulas, e renderiza:
  - Cards de Progresso e Metas (`BjjBeltProgressCard`).
  - Visual Puro das Faixas (`BjjBeltStrip`).
- Casos rapidos para QA visual: Azul grau 1/4 (1 listra ativa, 3 inativas), Roxa grau 2/4 (2 ativas), Preta professor (graus visiveis + bordas brancas), Branca com texto “JIU-JITSU” escuro.

## Como usar em telas reais
- Resolva o config pelo slug: `const config = getFaixaConfigBySlug(faixaSlug)` e passe para `BjjBeltStrip` ou `BjjBeltProgressCard`.
- Sempre clame `grauAtual` entre `0..config.grausMaximos` (os componentes ja aplicam o clamp).
- Nao duplique mocks; use o helper para manter uma unica fonte de cores.
- Telas atuais que usam: `/dashboard`, `/evolucao`, `/graduacoes`, `/historico-presencas`, `/alunos` etc., todas apontando para o componente canonico.

## Adicionando ou editando faixas
1) Adicione/ajuste o item em `BJJ_BELT_VISUALS` (`src/design/bjj/bjjBeltPalette.ts`), mantendo contraste de ponteira/graus/texto e progressao.  
2) Referencie o item no mock (`data/mocks/bjjBeltMocks.ts`) via spread, apenas complementando dados de dominio (id/slug/nome/categoria/grausMaximos/tipoPreta).  
3) Se precisar de cor nova, crie em `BJJ_BELT_COLORS` (`src/tokens/bjjBeltTokens.ts`) e inclua `bjj-belt-*` correspondente em `tailwind.config.js` (mantendo neutros `bjj-*` para ponteira/gradientes).  
4) Use `/belt-demo` para validar visualmente (adulto + infantil).  
5) Evite inserir defaults em utils; mantenha as cores na palette/mock e deixe os fallbacks do strip cobrirem quando um campo estiver vazio.

## Licoes da quebra da migracao
- Causa: fallbacks fixos (`bg-white/bg-white/10`) no strip sobrescreviam as cores de graus vindas do mock, apagando listras e ponteiras especificas.
- Prevencao: componente confia no mock, fallbacks so quando o campo nao existe; arquivos kebab-case reexportam o canonico para evitar divergencia de implementacao.

## Checklist rapido (tema + faixas)
- Tema global: `<html data-theme="zdark">` + `<body class="bg-base-100 text-base-content">` devem refletir as cores do DaisyUI (nenhum `@theme` extra com `--color-bjj-*`). `AppShell` tambem usa `bg-base-100 text-base-content` para nao forcar fundo preto.
- Cores de faixa: moram em `tailwind.config.js` (`extend.colors`), usadas por `BJJ_BELT_COLORS` → `BJJ_BELT_VISUALS` → mocks → componentes.
- QA visual /belt-demo: Azul 1/4 (1 listra ativa + 3 inativas), Roxa 2/4, Preta professor com ponteira vermelha e bordas brancas, Branca com texto “JIU-JITSU” escuro, infantis com listras horizontais corretas (amarela/preta, cinza/branca etc.).
