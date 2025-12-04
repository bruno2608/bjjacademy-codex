# ZEKAI UI – Relatório de Tema (Z-Dark / Z-Light)

## 1. Resumo
- DaisyUI está configurado no `tailwind.config.js` com apenas dois temas personalizados (`Z-Dark` e `Z-Light`) e `darkTheme` apontando para `Z-Dark`, mas há um fallback de plugin que vira no-op se o `require('daisyui')` falhar, o que impediria a geração das variáveis de tema.
- O HTML raiz define `data-theme="Z-Dark"` e usa classes `bg-base-100`/`text-base-content`, porém as variáveis do tema podem não existir se o plugin não carregar ou se outro tema (light padrão do DaisyUI) for injetado antes.
- A página `/login` usa tokens DaisyUI (`bg-base-*`, `text-base-content`, `btn`, `card`) e não contém cores hardcoded claras, então o fundo branco observado sugere que o tema aplicado é o claro, não um override local.
- O CSS global inclui muitas redefinições de componentes (`.btn`, `.card`, `.badge`, etc.) usando a paleta antiga `bjj-*`, o que pode conflitar com os estilos DaisyUI e mascarar o tema ativo, além de forçar cores neutras e bordas que não respondem ao tema.
- O background padrão global (`html, body { background-color: hsl(var(--b2)); }`) depende de `--b2` estar definido; se o tema não for aplicado, o fallback do DaisyUI é claro, deixando a página branca.

## 2. Configuração Tailwind + DaisyUI
- `tailwind.config.js` carrega o plugin `daisyui` dentro de um `try/catch`. Se o `require('daisyui')` falhar, o plugin vira uma função vazia, removendo todo o suporte de tema DaisyUI na build, apesar de `themes: ['Z-Dark', 'Z-Light']` e `darkTheme: 'Z-Dark'` estarem configurados.【F:tailwind.config.js†L1-L40】
- As cores customizadas `bjj-*` ainda estão estendidas em `theme.extend.colors`, coexistindo com DaisyUI e podendo alimentar utilitários legados que fogem dos tokens de tema.【F:tailwind.config.js†L19-L34】

## 3. Tema aplicado no HTML/Layout
- O `app/layout.jsx` define `<html lang="pt-BR" data-theme="Z-Dark" className="min-h-dvh">` e `<body className="min-h-dvh font-sans bg-base-100 text-base-content">`, ou seja, a intenção é usar o tema escuro e tokens DaisyUI para fundo/texto.【F:app/layout.jsx†L18-L25】
- Não há outro `data-theme` no app; portanto, se o tema ativo for claro, é porque o tema Z-Dark não está sendo gerado/carregado ou está sendo sobrescrito pelos temas default do DaisyUI.

## 4. Análise da página /login
- Estrutura usa `<ZkPage>` com gradiente baseado em tokens (`from-base-300/60 via-base-200 to-base-100`) e `<ZkContainer>` para centralização. Card com `bg-base-100`, borda `border-base-300/60`, textos `text-base-content` e inputs com classes DaisyUI (`input`, `input-bordered`).【F:app/login/page.jsx†L79-L190】
- Não há `bg-white`, `bg-black` ou hex codes; os únicos toques de cor são via tokens `primary` nos bullets e botões sociais (`btn-outline`, `border-base-300`, `bg-base-100`).【F:app/login/page.jsx†L192-L238】
- Portanto, o layout não força modo claro/escuro; ele depende inteiramente das variáveis do tema ativo.

## 5. Overrides de CSS global
- `styles/globals.css` define `html, body { background-color: hsl(var(--b2)); color: hsl(var(--bc)); }`. Se as variáveis de tema não estiverem presentes ou se o tema default for claro, o fundo ficará claro.【F:styles/globals.css†L1-L20】
- `styles/tailwind.css` registra os temas via `@plugin "daisyui/theme"`, mas também recria diversas classes (`.btn`, `.card`, `.badge`, `.btn-primary`, etc.) usando a paleta `bjj-*` fixa. Esses overrides podem sobrepor tokens DaisyUI e gerar inconsistência visual ou “clarear” componentes independentemente do tema.【F:styles/tailwind.css†L1-L90】【F:styles/tailwind.css†L91-L180】

## 6. Causas prováveis
- **Confirmada:** Fallback do plugin DaisyUI em `tailwind.config.js` pode tornar o plugin um no-op se o `require` falhar, removendo variáveis/temas e deixando o build com CSS padrão claro.【F:tailwind.config.js†L7-L13】
- **Possível:** Os overrides de `.btn`, `.card`, `.badge`, etc., em `styles/tailwind.css` usam cores fixas e podem neutralizar os tokens DaisyUI, fazendo componentes parecerem claros mesmo com o tema escuro ativo.【F:styles/tailwind.css†L56-L144】
- **Possível:** `html, body` usam `background-color: hsl(var(--b2))`; se o tema não estiver aplicado (ou se o tema default cair para o claro), o fundo será branco. Isso explicaria a tela clara em `/login`.【F:styles/globals.css†L8-L16】
- **Pouco provável:** O `data-theme="Z-Dark"` estar incorreto por capitalização, pois o tema foi registrado com o mesmo nome no `@plugin "daisyui/theme"`. Ainda assim, validar se o nome coincide exatamente com o build final do DaisyUI.【F:app/layout.jsx†L18-L25】【F:styles/tailwind.css†L1-L40】
- **Pouco provável:** Classes do `/login` forçando cores claras; inspeção mostra apenas tokens de tema e nenhuma cor fixa clara.【F:app/login/page.jsx†L79-L238】

## 7. Checklist de correções sugeridas (não aplicado ainda)
- Garantir que o plugin DaisyUI seja carregado sem fallback: remover o `try/catch` ou falhar explicitamente se `require('daisyui')` não estiver disponível, assegurando que as variáveis de tema sejam geradas.【F:tailwind.config.js†L7-L13】
- Verificar se o build inclui os temas `Z-Dark`/`Z-Light` e se não há temas padrão adicionais sendo injetados; manter `themes: ['Z-Dark', 'Z-Light']` e `darkTheme: 'Z-Dark'` conforme desejado.【F:tailwind.config.js†L35-L40】
- Confirmar que o `data-theme` do HTML permanece `Z-Dark` e que nenhum wrapper (ex.: AppShell) sobrescreve o atributo.
- Auditar/ajustar os overrides de `.btn`, `.card`, `.badge` em `styles/tailwind.css` para usarem tokens do tema (ex.: `bg-base-200`, `text-base-content`) ou mover para variantes DaisyUI, evitando paleta fixa `bjj-*`.【F:styles/tailwind.css†L56-L144】
- Revisar `html, body { background-color: hsl(var(--b2)); }` garantindo que o tema aplicado define `--b2`; caso contrário, setar uma cor de fallback que mantenha o dark (ex.: `var(--b1)` ou `bg-base-200` via classe).【F:styles/globals.css†L8-L16】
- Durante testes, inspecionar o DOM de `/login` para confirmar se `data-theme` em `<html>` corresponde ao tema ativo e se as variáveis CSS (`--b1`, `--b2`, `--bc`) refletem o palette Z-Dark.
