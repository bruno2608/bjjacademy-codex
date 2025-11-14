# BJJ Academy PWA

Base inicial do Progressive Web App (PWA) da BJJ Academy construída com Next.js (App Router), React, Tailwind CSS e Zustand.

## Estrutura de pastas
```
app/
  layout.jsx
  page.jsx
  (authenticated)/
    layout.jsx
    dashboard/
      page.jsx
    alunos/
      page.jsx
      novo/
        page.jsx
      [id]/
        page.jsx
  login/
    page.jsx
components/
  ui/
    Header.jsx
    Sidebar.jsx
    Card.jsx
    Table.jsx
    AlunoForm.jsx
services/
  api.js
  alunosService.js
store/
  userStore.js
public/
  manifest.json
  service-worker.js
  icons/
    icon-192x192.svg
    icon-256x256.svg
    icon-512x512.svg
styles/
  globals.css
  tailwind.css
```

## Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O projeto já está configurado com suporte a PWA (manifest, icons, service worker), autenticação mock com Zustand, rotas protegidas e componentes reutilizáveis seguindo o estilo Zenko Focus.
