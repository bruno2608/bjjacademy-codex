# ZEKAI UI

## Introdução
ZEKAI UI é o design system que consolida a identidade visual da família ZEKAI (incluindo BJJ Academy Codex e futuros produtos como Zenco). Ele nasce sobre TailwindCSS + DaisyUI e adiciona uma camada própria de componentes (`Zk*`), padrões de layout e diretrizes de responsividade para manter consistência entre telas e times.

## O que é o ZEKAI UI
- **Base tecnológica:** TailwindCSS provê a fundação utilitária; DaisyUI adiciona temas e componentes com tokens configuráveis; a camada `Zk*` combina ambos com regras de layout e espaçamento próprias do produto.
- **Objetivo:** acelerar entregas de interface, reduzir divergências visuais e documentar decisões (gradientes, profundidade, radii, grids) em um só lugar.
- **Alinhamento visual:** preserva a estética dark e gamificada atual, mas com espaço para variantes futuras.

## Temas Z-Dark e Z-Light
- **Z-Dark:** tema escuro padrão, focado no produto atual. Usa fundo profundo, alto contraste e vermelho como cor primária. Ele é aplicado via `data-theme="Z-Dark"` na raiz do documento.
- **Z-Light:** tema claro planejado para evoluções futuras. Não está ativo, mas já existe na configuração DaisyUI para testes controlados.
- **Implementação via DaisyUI:** os temas são declarados via `@plugin "daisyui/theme"` em `styles/tailwind.css` e registrados no `tailwind.config.js` com `themes: ['Z-Dark', 'Z-Light']`. Alterar o tema é tão simples quanto trocar o `data-theme` na raiz do HTML (ex.: `data-theme="Z-Light"`) sem refatorar as telas.
- **Tokens principais (visão conceitual):**
  - `base-100/200/300` e `base-content` definem planos de fundo e contraste de texto.
  - `primary`, `secondary`, `neutral`, `info`, `success`, `warning`, `error` orientam estados e feedbacks.
  - Bordas e raios usam variáveis como `--radius-*`/`--border` para manter cantos arredondados consistentes.
  - Profundidade/ruído (`--depth`, `--noise`) sugerem camadas leves de sombra e textura para dar volume sem poluir.

## Padrões de Layout e Responsividade
### ZkContainer
Largura controlada para não perder legibilidade em monitores grandes:
```
w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8
```
Use em praticamente todas as páginas (exceto casos full-bleed).

### ZkPage
Wrapper raiz de página, pensado para o tema Z-Dark:
```
min-h-dvh
flex flex-col
bg-gradient-to-br from-base-300/40 via-base-200 to-base-100
```
Aplica o gradiente de fundo padrão e garante altura mínima de viewport.

### Layout de Auth (login/cadastro/reset)
- **Mobile:** `flex flex-col gap-8` → hero em cima, card de login embaixo.
- **Desktop:** `lg:flex-row lg:items-center lg:gap-12` → hero à esquerda (`flex-1`), form/card à direita (`w-full max-w-md`).
- Evite alturas fixas; combine `min-h-dvh`, `py-10`–`py-16` e grid flexível para que o formulário fique visível sem rolagem excessiva.

### Layout de Dashboard
- Topbar sticky: `sticky top-0 z-40 bg-base-100/80 backdrop-blur`.
- Conteúdo principal: header compacto (`ZkPageHeader`) + grid autoajustável `grid-cols-[repeat(auto-fit,minmax(260px,1fr))]` para cards.

### Layout de formulários
- `grid-cols-1` no mobile; `md:grid-cols-2` quando fizer sentido em telas médias+.
- Erros sempre inline abaixo dos campos: `text-xs text-error` para feedback imediato.

## Componentes Base ZEKAI UI
### ZkContainer
- **Quando usar:** sempre que precisar centralizar conteúdo e limitar largura. Evita linhas muito extensas em desktop.
- **Exemplo:**
```tsx
import { ZkContainer } from '@/components/zekai-ui/ZkContainer';

function Example() {
  return (
    <ZkContainer>
      <p>Conteúdo centralizado em até 6xl.</p>
    </ZkContainer>
  );
}
```

### ZkPage
- **Quando usar:** páginas completas (auth, dashboards, landing internas) que devem herdar o gradiente base e o comportamento de altura mínima.
- **Exemplo:**
```tsx
import { ZkPage } from '@/components/zekai-ui/ZkPage';
import { ZkContainer } from '@/components/zekai-ui/ZkContainer';

function Page() {
  return (
    <ZkPage>
      <ZkContainer className="py-10">
        <h1>Minha página</h1>
      </ZkContainer>
    </ZkPage>
  );
}
```

### (Referência breve)
Outros componentes podem seguir a convenção `Zk*` (ex.: `ZkPageHeader`, `ZkCard`, `ZkButton`) para padronizar headings, cartões e ações. Documente-os aqui quando existirem no código.

## Boas práticas gerais
- Evite heróis gigantes em telas operacionais; prefira blocos compactos e informação densa.
- Priorize contraste forte em Z-Dark (texto claro sobre fundo escuro) e use grids autoajustáveis para cards.
- Para formulários, prefira mensagens de erro inline a toasts genéricos; melhora rastreabilidade e acessibilidade.
- Use espaçamentos consistentes (`gap-8`, `py-10`/`py-16`) e limites de largura para preservar leitura em qualquer viewport.

## Como replicar o padrão nas próximas telas
- Envolva cada página com `ZkPage` para herdar o gradiente e o comportamento de altura mínima.
- Centralize o conteúdo com `ZkContainer` e respeite os limites de largura e paddings indicados.
- Sempre prefira tokens do tema (`bg-base-*`, `text-base-content`, `btn-primary`, `border-base-300`) em vez de cores fixas. Trocar o tema para `Z-Light` é tão simples quanto alterar `data-theme` na raiz, preservando a consistência sem refatorações adicionais.

### Checklist rápido para novas telas
- Use `ZkPage` + `ZkContainer` como esqueleto base e garanta `min-h-dvh` com fundo que herda as variáveis do tema.
- Aplique somente tokens DaisyUI (base/primary/neutral/etc.) para cores, bordas e textos; nada de hex fixo.
- Certifique-se de que o HTML raiz está com `data-theme="Z-Dark"` (ou `Z-Light` quando liberado) para herdar o tema certo.
