# ZEKAI UI – Relatório de Tema (Z-Dark / Z-Light)

## 1. Resumo
- DaisyUI está configurado no `tailwind.config.js` com apenas dois temas personalizados (`Z-Dark` e `Z-Light`) definidos em objetos JS e `darkTheme` apontando para `Z-Dark`, carregado diretamente sem fallback silencioso.
- O HTML raiz define `data-theme="Z-Dark"` e usa classes `bg-base-100`/`text-base-content`; se a tela clarear, indica que outro tema está sendo aplicado ou que as variáveis não foram geradas.
- A página `/login` usa tokens DaisyUI (`bg-base-*`, `text-base-content`, `btn`, `card`) e não contém cores hardcoded claras, então o fundo branco observado sugere que o tema aplicado é o claro, não um override local.
- O CSS global inclui overrides de componentes (`.btn`, `.card`, `.badge`, etc.) amarrados a tokens DaisyUI (`hsl(var(--b*))`, `hsl(var(--p))`), eliminando a paleta fixa `bjj-*` e respondendo ao tema ativo.
- O background padrão global (`html, body { background-color: hsl(var(--b2)); }`) depende de `--b2` estar definido; se o tema não for aplicado, o fallback do DaisyUI é claro, deixando a página branca.

## 2. Configuração Tailwind + DaisyUI
- `tailwind.config.js` carrega o plugin `daisyui` diretamente e registra apenas os temas customizados via objetos (`{ 'Z-Dark': zDark }`, `{ 'Z-Light': zLight }`) com `darkTheme: 'Z-Dark'`.【F:tailwind.config.js†L1-L58】
- As cores customizadas `bjj-*` continuam estendidas apenas para utilitários legados; o theming padrão depende exclusivamente dos tokens DaisyUI.【F:tailwind.config.js†L19-L34】

## 3. Tema aplicado no HTML/Layout
- O `app/layout.jsx` define `<html lang="pt-BR" data-theme="Z-Dark" className="min-h-dvh">` e `<body className="min-h-dvh font-sans bg-base-100 text-base-content">`, ou seja, a intenção é usar o tema escuro e tokens DaisyUI para fundo/texto.【F:app/layout.jsx†L18-L25】
- Não há outro `data-theme` no app; portanto, se o tema ativo for claro, é porque o tema Z-Dark não está sendo gerado/carregado ou está sendo sobrescrito pelos temas default do DaisyUI.

## 4. Análise da página /login
- Estrutura usa `<ZkPage>` com gradiente baseado em tokens (`from-base-300/60 via-base-200 to-base-100`) e `<ZkContainer>` para centralização. Card com `bg-base-100`, borda `border-base-300/60`, textos `text-base-content` e inputs com classes DaisyUI (`input`, `input-bordered`).【F:app/login/page.jsx†L79-L190】
- Não há `bg-white`, `bg-black` ou hex codes; os únicos toques de cor são via tokens `primary` nos bullets e botões sociais (`btn-outline`, `border-base-300`, `bg-base-100`).【F:app/login/page.jsx†L192-L238】
- Portanto, o layout não força modo claro/escuro; ele depende inteiramente das variáveis do tema ativo.

## 5. Overrides de CSS global
- `styles/globals.css` define `html, body { background-color: hsl(var(--b2)); color: hsl(var(--bc)); }`. Se as variáveis de tema não estiverem presentes ou se o tema default for claro, o fundo ficará claro.【F:styles/globals.css†L1-L20】
- `styles/zekai-themes.css` mantém apenas um bloco LEGADO comentado; o tema agora é gerado pelo DaisyUI a partir do `tailwind.config.js`, enquanto `styles/globals.css` importa o arquivo de legado e concentra os overrides componentizados baseados em tokens DaisyUI, sem paleta fixa.【F:styles/zekai-themes.css†L1-L4】【F:styles/globals.css†L1-L176】【F:tailwind.config.js†L1-L58】

## 6. Causas prováveis
- **Confirmada:** Se as variáveis de tema não forem geradas (ex.: build sem DaisyUI), o fallback do navegador usa valores claros para `--b*`, deixando a UI branca.【F:styles/globals.css†L8-L16】
- **Pouco provável:** Os overrides de `.btn`, `.card`, `.badge`, etc., em `styles/globals.css` usam apenas tokens DaisyUI (sem paleta fixa), portanto tendem a acompanhar o tema ativo.【F:styles/globals.css†L25-L176】
- **Possível:** `html, body` usam `background-color: hsl(var(--b2))`; se o tema não estiver aplicado (ou se o tema default cair para o claro), o fundo será branco. Isso explicaria a tela clara em `/login`.【F:styles/globals.css†L8-L16】
- **Pouco provável:** O `data-theme="Z-Dark"` estar incorreto por capitalização, pois o tema foi registrado com o mesmo nome no `tailwind.config.js`. Ainda assim, validar se o nome coincide exatamente com o build final do DaisyUI.【F:app/layout.jsx†L18-L25】【F:tailwind.config.js†L1-L58】
- **Pouco provável:** Classes do `/login` forçando cores claras; inspeção mostra apenas tokens de tema e nenhuma cor fixa clara.【F:app/login/page.jsx†L79-L238】

## 7. Checklist de correções sugeridas (não aplicado ainda)
- Garantir que o plugin DaisyUI continue carregando sem fallback e que a build falhe caso o pacote não exista, assegurando que as variáveis de tema sejam geradas.【F:tailwind.config.js†L7-L13】
- Verificar se o build inclui os temas `Z-Dark`/`Z-Light` e se não há temas padrão adicionais sendo injetados; manter `themes` contendo apenas os objetos `{ 'Z-Dark': zDark }` e `{ 'Z-Light': zLight }` e `darkTheme: 'Z-Dark'` conforme desejado.【F:tailwind.config.js†L44-L55】
- Confirmar que o `data-theme` do HTML permanece `Z-Dark` e que nenhum wrapper (ex.: AppShell) sobrescreve o atributo.
    - Auditar/ajustar os overrides de `.btn`, `.card`, `.badge` em `styles/globals.css` para garantir que continuem usando apenas tokens DaisyUI (ex.: `bg-base-200`, `text-base-content`) sem paleta fixa.【F:styles/globals.css†L25-L176】
- Revisar `html, body { background-color: hsl(var(--b2)); }` garantindo que o tema aplicado define `--b2`; caso contrário, setar uma cor de fallback que mantenha o dark (ex.: `var(--b1)` ou `bg-base-200` via classe).【F:styles/globals.css†L8-L16】
- Durante testes, inspecionar o DOM de `/login` para confirmar se `data-theme` em `<html>` corresponde ao tema ativo e se as variáveis CSS (`--b1`, `--b2`, `--bc`) refletem o palette Z-Dark.
