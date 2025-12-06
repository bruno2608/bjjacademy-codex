# ZEKAI UI – Relatório de Tema (zdark / zlight)

> **Status:** Atualizado em 06/12/2025  
> **Fonte principal:** [01-visao-geral-bjjacademy-codex.md](./01-visao-geral-bjjacademy-codex.md)

## 1. Resumo
- DaisyUI é carregado pelo entry CSS `styles/tailwind.css` usando `@plugin "daisyui"` e duas instâncias de `@plugin "daisyui/theme"` para gerar os tokens dos temas `zdark` e `zlight`; o `tailwind.config.js` permanece mínimo, sem replicar configurações.【F:styles/tailwind.css†L1-L74】【F:tailwind.config.js†L1-L6】
- O HTML raiz define `data-theme="zdark"` e usa `bg-base-100`/`text-base-content`; se aparecer fundo claro, indica ausência de variáveis ou tema errado em runtime.【F:app/layout.jsx†L18-L25】
- A página `/login` depende apenas de tokens DaisyUI (`bg-base-*`, `text-base-content`, `btn`, `card`) sem cores fixas; se estiver branca, o tema carregado não é o zdark.【F:app/login/page.jsx†L133-L219】
- Overrides globais estão mínimos, herdando tokens do tema; qualquer clareamento vem de falta de variáveis e não de CSS hardcoded.【F:styles/globals.css†L1-L20】

## 2. Configuração Tailwind + DaisyUI
- `styles/tailwind.css` é o entry único: importa Tailwind e registra o plugin `daisyui` com `themes: zdark --default, zlight --prefersdark`. Os tokens completos de ambos os temas são declarados com `@plugin "daisyui/theme"`.【F:styles/tailwind.css†L1-L74】
- `tailwind.config.js` permanece mínimo, sem plugins adicionais; a migração para Tailwind 4 concentrou a configuração no CSS em vez do config JS.【F:tailwind.config.js†L1-L6】

##3. Tema aplicado no HTML/Layout
- `app/layout.jsx` define `<html lang="pt-BR" data-theme="zdark" className="min-h-dvh">` e `<body className="min-h-dvh font-sans bg-base-100 text-base-content">`, reforçando o tema escuro como padrão global.【F:app/layout.jsx†L18-L25】
- Não há outro `data-theme` no app; qualquer divergência visual decorre da ausência/colisão de variáveis geradas pelo DaisyUI.

## 4. Análise da página /login
- Estrutura em grid com `bg-base-300`, `text-base-content`, card `bg-base-100/95`, borda `border-base-300/60` e inputs `input input-bordered bg-base-200/80` — tudo baseado em tokens.【F:app/login/page.jsx†L79-L238】
- Não há hex codes nem `bg-white/bg-black`; cores decorativas usam `primary` e `secondary` do tema em bullets/botões.【F:app/login/page.jsx†L192-L238】

## 5. Overrides de CSS global
- `styles/globals.css` define `html, body { background-color: hsl(var(--b2)); color: hsl(var(--bc)); }`, confiando nas variáveis do tema para tonalidade de fundo.【F:styles/globals.css†L1-L20】
- `styles/tailwind.css` contém exclusivamente os blocos `@plugin "daisyui/theme"` para zdark e zlight; não há overrides de componentes conflitando com DaisyUI.【F:styles/tailwind.css†L1-L74】

## 6. Causas prováveis
- **Confirmada:** se o build não gerar as variáveis de tema (ex.: DaisyUI não processado), `--b*` ficam vazios e o fundo volta ao claro.【F:styles/globals.css†L8-L16】【F:styles/tailwind.css†L1-L74】
- **Possível:** divergência de nome do tema entre `data-theme="zdark"` e o nome registrado; atualmente coincidem, mas é ponto de verificação rápida.【F:app/layout.jsx†L18-L25】【F:tailwind.config.js†L1-L6】
- **Pouco provável:** CSS global ou página de login forçando cores claras; inspeção mostra apenas tokens de tema.【F:app/login/page.jsx†L79-L238】【F:styles/globals.css†L1-L20】

## 7. Checklist de correções sugeridas (não aplicado ainda)
- Manter o plugin DaisyUI carregando sem fallback e falhando em ausência do pacote, garantindo geração das variáveis.【F:tailwind.config.js†L1-L6】
- Validar em runtime se `data-theme="zdark"` está presente no `<html>` e se `--b1/--b2/--bc/--p` recebem valores (via DevTools ou widget de debug).
- Evitar reintroduzir overrides de `.btn`, `.card`, `.badge` com cores fixas; usar apenas tokens DaisyUI para qualquer customização mínima.
- Se precisar trocar para zlight em testes, alterar temporariamente `data-theme` no `<html>`; a página deve clarear sem quebrar layout graças aos tokens.
