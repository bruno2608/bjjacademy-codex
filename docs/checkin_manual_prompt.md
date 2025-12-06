# Prompt: Implementação do Check-in Manual

> **Status:** Em revisão / contém visão futura. Atualizado em 06/12/2025  
> **Fonte principal:** [auth-and-checkin-flow.md](./auth-and-checkin-flow.md)

Use este prompt em uma nova conversa no Codex/Lovable. Ele descreve a implementação completa do módulo de check-in manual de presença (visões aluno e staff) para o projeto **bjjacademy-codex**.

---

Você está trabalhando no projeto **bjjacademy-codex** (Next.js 14 + Tailwind + DaisyUI + Zustand).

Nesta tarefa quero que você implemente o **módulo de Check-in de Presença (versão manual)**, tanto para **aluno** quanto para **professor/staff**, usando a arquitetura atual de **mocks → services → stores → telas**, em uma branch nova já atualizada a partir da `main`.

## 🎯 Objetivo

* Criar o **fluxo de check-in manual do aluno**:
  * uma tela hub “Meu Check-in”;
  * uma tela de confirmação “Check-in Manual” (1 clique).
* Criar/ajustar a **tela de Check-in de Alunos (professor)**:
  * cards-resumo + lista de alunos + ação de confirmar presença.
* Ajustar a **tela oficial de Revisão de Presenças (staff)**:
  * usar a versão agrupada por dia (últimos 30 dias) e assumir essa como tela canônica.
* Manter o visual **dark/compacto**, com **alto contraste** e **ícones legíveis**.
* NÃO mexer em auth e sem entrar em QR Code ainda.

## Contexto

Premissas do projeto:

* Estrutura existente:
  * `data/mocks` (presenças, alunos, etc.),
  * `services/` (ex.: `presencasService`, `alunosService`),
  * `store/` com Zustand (`presencasStore`, `alunosStore`, `userStore`),
  * componentes de layout (AppShell, navs, menus, etc.).
* Navegação:
  * Desktop: menu no topo;
  * Mobile: top bar com botão hamburguer abrindo drawer + avatar no canto direito.
* Auth mock já pronto:
  * `authMockService` + `userStore.login/logout`;
  * AppShell protege rotas e redireciona para `/login`.
* Design base: **BJJ Presence Flow** (cards largos, compactos, sem hero gigante, textos explicativos curtos em cards separados).

## ⚠️ Importante (o que NÃO fazer)

1. **Não alterar autenticação/login.**
   * Não mexer em `services/authMockService`, `store/userStore`, `app/login/page.*`, guards/AppShell.
2. **Não implementar QR Code ainda.**
   * Nada de rotas, leitura de câmera ou timers de QR.
3. **Não mudar layout global.**
   * Manter top bar + drawer mobile como estão; apenas registrar novas rotas/links quando necessário.
4. **Não criar segunda tela de revisão.**
   * Usar somente a versão agrupada por dia (últimos 30 dias).

## ✅ Itens para implementar

### 1. Fluxo ALUNO – “Meu Check-in” (Hub)

Rota sugerida: `app/aluno/checkin/page.tsx`.

Layout/UX:
* Header compacto com título **“Meu Check-in”** e subtítulo “Registre sua presença de forma rápida e fácil”.
* Lista vertical de cards full-width:
  1. **Card “Check-in Manual”** – ícone azul de mão/check, título “Check-in Manual”, texto “Registre sua presença com um clique”, card clicável → navega para tela de confirmação.
  2. **Card “Check-ins Recentes”** – lista dos últimos N check-ins do aluno logado (data amigável, horário, origem, badge de status: verde Presente, vermelho Falta, amarelo Pendente). Estado vazio com mensagem “Você ainda não tem check-ins registrados.”

Dados/lógica:
* Obter `alunoId` via `userStore`.
* Usar `presencasStore` / `presencasService` para carregar presenças do aluno, ordenar desc e filtrar últimos N.

### 2. Fluxo ALUNO – Tela “Check-in Manual”

Rota sugerida: `app/aluno/checkin/manual/page.tsx`.

Layout/UX (BJJ Presence Flow):
* Card central (`max-w-xl` desktop, quase full no mobile) com:
  1. Título **“Check-in Manual”** e subtítulo “Confirme sua presença na aula de hoje”.
  2. Ícone circular grande azul (mão levantada) centralizado.
  3. Saudação “Olá, {nome do aluno}!” usando `userStore`.
  4. Texto “Clique no botão abaixo para confirmar sua presença.”
  5. Linha com data/hora da aula (ícone calendário + texto “02 de dezembro, 2025 às 19:30”).
  6. **Botão CTA** quase full-width, primário azul, ícone check + texto “Confirmar Presença”, alto contraste.
* Abaixo, alert/card compacto: “Ao confirmar, sua presença será registrada automaticamente no sistema.”

Comportamento:
* Ao clicar: `presencasService.registrarCheckinManual(alunoId, dataHoraAtual)` → atualizar `presencasStore`.
* Bloquear botão durante loading; após sucesso desabilitar com texto “Presença Confirmada” e opcional badge de sucesso.
* Se já existir presença hoje (manual ou sistema), iniciar em estado “Presença Confirmada”.
* Erros exibidos inline (sem toast).

### 3. Fluxo STAFF – Tela “Check-in de Alunos”

Rota sugerida: `app/presencas/check-in/page.tsx`.

Layout/UX:
* Título **“Check-in de Alunos”** e subtítulo “Registre a presença dos alunos nas aulas”.
* Cards-resumo: “Total de Alunos” (ícone grupo), “Check-ins Hoje” (ícone check), “Pendentes” (ícone relógio/alerta).
* Filtro de busca por nome (input full-width, filtro dinâmico case-insensitive).
* Lista de alunos: avatar inicial, nome, badge de faixa/grau, badge de status (verde Presente, amarelo Pendente, vermelho Falta se usado), ação à direita (botão verde “Confirmar” para pendentes; badge “Confirmado” para presentes). Fundo verde suave para presentes.

Dados/lógica:
* Listar alunos via `alunosStore`.
* `presencasStore` / `presencasService` para checar presença hoje e status.
* Ação “Confirmar”: `presencasService.registrarCheckinManual(alunoId, dataHoraAtual, origem='PROFESSOR')` → atualizar store/UI.

### 4. Fluxo STAFF – Tela “Revisão de Presenças” (oficial)

Rota sugerida: `app/presencas/revisao/page.tsx`.

Layout/UX:
* Título **“Revisão de Presenças”** e subtítulo “Revise e corrija presenças registradas (últimos 30 dias)”.
* Alert âmbar logo abaixo: ícone de alerta + texto “Atenção ao revisar presenças” / “Alterações manuais devem ser feitas com cuidado. As presenças excluídas não poderão ser recuperadas.”
* Lista agrupada por dia: cabeçalho com ícone calendário + data extensa + badge “X presenças”; dentro, linhas com avatar, nome, horário, origem (Sistema/Manual/Professor) e botão de excluir (lixeira vermelha). Estado vazio amigável se não houver dados.

Dados/lógica:
* `presencasService.getPresencasUltimos30Dias()` (ordenado desc) e agrupar por dia (`yyyy-MM-dd`) antes de renderizar.
* Exclusão: confirmação simples (`window.confirm`), remover do `presencasStore` e atualizar UI.
* Descontinuar quaisquer abas antigas de revisão; `/presencas/revisao` é a tela canônica.

## 🎨 Diretrizes gerais

* Dark mode padrão; telas compactas com foco em cards e CTAs.
* Ícones com alto contraste (branco/claro em fundos escuros; evitar ícones pretos em cards escuros).
* Mensagens de erro/sucesso inline (sem toasts para validações locais).
* Reutilizar componentes existentes sempre que possível.

## 🧪 Checklist final

* Aluno:
  * Acessa `/aluno/checkin`, vê card “Check-in Manual”, abre `/aluno/checkin/manual`, registra presença manual, vê presença em “Check-ins Recentes”.
* Professor/Staff:
  * Acessa `/presencas/check-in`, vê cards-resumo, busca aluno por nome, confirma presença de pendentes.
* Revisão:
  * `/presencas/revisao` mostra presenças agrupadas por dia (últimos 30 dias) e permite excluir com confirmação.
  * Nenhuma segunda tela de revisão competindo com `/presencas/revisao`.
* Auth mock permanece inalterado.

---

Cole este prompt na nova conversa para guiar a implementação do fluxo de check-in manual.
