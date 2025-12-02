# 🥋 **BJJ Academy — PWA (Next.js + Tailwind)**

Bem-vindo à base do novo **BJJ Academy PWA**, plataforma web progressiva focada na gestão completa de academias de Jiu-Jitsu. O projeto une a identidade "Zenko Focus" com uma camada visual gamificada inspirada nas versões mobile [`bjjacademyapp`](https://github.com/bruno2608/bjjacademyapp) e backend [`bjj-academy-api`](https://github.com/bruno2608/bjj-academy-api).

- PWA com cache inicial e ícones completos.
- Rotas protegidas por middleware + RBAC centralizado.
- Dados mockados em Zustand com persistência local para simular produção.

## 🧩 **Requisitos**

- **Node.js 18+**
- **npm** (ou compatível)

## 🛠️ **Como executar localmente**

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Comandos principais

- `npm run dev`: ambiente de desenvolvimento com hot reload.
- `npm run build`: build otimizado de produção (App Router).
- `npm run start`: sobe o build gerado.
- `npm run lint`: validações do Next.js + ESLint.

## 🔐 **Autenticação mock e perfis**

- Login em `/login` aceita qualquer e-mail/senha e gera token fake.
- Papéis são inferidos pelo e-mail (campos contendo `admin`, `ti`, `aluno`/`student`) ou pela seleção manual.
- Dados persistem em `localStorage`/cookies (`bjj_token`, `bjj_roles`, `bjj_user`), permitindo refresh sem perder sessão.

## 🚀 **Stack principal**

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS 3** com tema “Zenko Focus” (preto, branco, vermelho e cinzas)
- **Zustand** para estado global mockado
- **Lucide React** para ícones
- **next-pwa** com `manifest.json`, service worker custom e cache offline

## 🧱 **AppShell da área STAFF**

- As rotas de staff estão agrupadas em `app/(staff)` e compartilham o layout `app/(staff)/layout.jsx`, que aplica o `StaffAppShell` (`components/layout/StaffAppShell`).
- O Sidebar reutiliza a UI existente (`components/ui/Sidebar`) e lê os itens diretamente da configuração única de rotas em `config/staffRoutes.ts`, preservando o visual aprovado (gradiente, card “Zenko Focus / BJJ Academy” e estados de hover/ativo).
- No mobile/tablet, o menu hamburguer original (`components/ui/Header`) continua sendo exibido dentro do `StaffAppShell`, garantindo o comportamento de overlay/slide idêntico ao layout antigo.
- O header comum do staff (`components/layout/StaffHeader`) usa `STAFF_ROUTES` para mostrar breadcrumb/título e um usuário mockado, deixando o espaço pronto para integrar hooks de autenticação e perfis no futuro.
- Rotas atuais cobertas: `/dashboard`, `/presencas`, `/alunos`, `/alunos/[id]`, `/graduacoes` — os caminhos permanecem os mesmos por conta do group segment `app/(staff)`.
- Estrutura já preparada para diferenciar perfis (professor/instrutor/admin) e receber dados reais de usuário/academia quando a camada de auth for conectada.

Na visão do aluno, o AppShell mantém a navegação superior em abas/pills original (`components/ui/TabletNav`) sem alterações visuais, exibindo `Dashboard Aluno`, `Check-in do Aluno`, `Treinos do Aluno` e `Evolução` conforme o papel carregado.

## 🗺️ Mapa de telas e fontes de dados

### Visão do aluno

| Rota | Descrição | Hooks/Stores principais | Pronto para Supabase? |
| --- | --- | --- | --- |
| `/dashboard` | Cards de presença, progresso e últimos registros do aluno. | `useAlunoDashboard`, `usePresencasStore`, `useCurrentAluno` | Sim |
| `/evolucao` | Histórico de graduações e projeção da próxima faixa/grau. | `useAlunoDashboard`, `useGraduacoesStore`, `getFaixaConfigBySlug` | Sim |
| `/checkin` | Registro diário de presença pelo aluno. | `usePresencasStore`, `useTreinosStore`, `useAlunosStore`, `useCurrentAluno` | Sim |
| `/historico-presencas` | Linha do tempo de presenças com filtros. | `usePresencasStore`, `useTreinosStore`, `useAlunosStore`, `getFaixaConfigBySlug` | Sim |
| `/perfil` | Dados pessoais do aluno (somente leitura para faixa/grau). | `useCurrentAluno`, `useCurrentUser`, `useAlunosStore`, `getFaixaConfigBySlug` | Sim |
| `/treinos` | Agenda semanal em modo leitura. | `useTreinosStore` | Sim |

### Visão do professor/instrutor

| Rota | Descrição | Hooks/Stores principais | Pronto para Supabase? |
| --- | --- | --- | --- |
| `/dashboard` | Hub diário do professor com turmas do dia, pendências e destaques de alunos. | `useUserStore`, `useAcademiasStore`, `useTurmasStore`, `useAulasStore`, `usePresencasStore`, `useMatriculasStore`, `useAlunosStore`, `useGraduacoesStore` | Sim |
| `/alunos` | Gestão completa de cadastro, filtros e remoção. | `useAlunosStore`, `usePresencasStore`, `useStaffDashboard`, `getFaixaConfigBySlug` | Sim |
| `/presencas` | Conferência/fechamento de presenças do dia. | `usePresencasStore`, `useAlunosStore`, `useTreinosStore`, `calcularResumoPresencas` | Sim |
| `/historico-presencas` | Linha do tempo consolidada para staff. | `usePresencasStore`, `useTreinosStore`, `useAlunosStore`, `getFaixaConfigBySlug` | Sim |
| `/graduacoes` | Cards mobile-first de próximas graduações com filtros (busca, faixa, tipo, status, 30/60/90d) e histórico. | `useGraduacoesProfessorView`, `useGraduacoesStore`, `useAlunosStore`, `usePresencasStore`, `updateGraduacao`, `getFaixaConfigBySlug` | Sim |
| `/perfil` | Perfil de staff (nome/contatos/faixa). | `useCurrentStaff`, `useCurrentUser`, `useAlunosStore`, `getFaixaConfigBySlug` | Sim |
| `/configuracoes/*` | Hub administrativo (regras, treinos, tipos). | `useCurrentUser`, `useCurrentStaff` | Sim |
| `/relatorios` | Placeholder analítico (sem dados dinâmicos). | — | Sim |

### Rotas utilitárias/demonstração

- `/belt-demo`: demonstração visual dos componentes de faixa usando `MOCK_FAIXAS`/`getFaixaConfigBySlug` (depende diretamente dos mocks de faixa, não faz parte do fluxo produtivo).

**/dashboard (staff):** mostra treinos de hoje, presenças pendentes e destaques de alunos. Usa exclusivamente dados de academias, turmas, aulas_instancias, presencas, alunos e graduacoes via stores/services, em layout mobile first com cards empilhados e ações rápidas para `/presencas`, `/alunos` e `/graduacoes`.

## 🔄 Fluxo de dados centralizado

Pipeline padrão: **mocks em `/data` → services → stores (Zustand) → hooks → telas**. A troca para Supabase/API será feita na camada de services, mantendo contratos e UI intactos.

Mocks atuais (únicos pontos que devem ler dados fake):

- `data/mockAlunos.ts`
- `data/mockPresencas.ts`
- `data/mockGraduacoes.ts`
- `data/mockTreinos.ts`
- `data/mocks/bjjBeltMocks.ts` (config visual de faixas)
- `data/mocks/bjjBeltUtils.ts` (helpers de faixa)
- `data/mocks/mockAcademias.ts`
- `data/mocks/mockUsuarios.ts`
- `data/mocks/mockPapeis.ts`
- `data/mocks/mockUsuariosPapeis.ts`
- `data/mocks/mockMatriculas.ts`
- `data/mocks/mockTurmas.ts`
- `data/mocks/mockAulasInstancias.ts`

**Regra:** nenhuma página deve importar esses mocks diretamente. Apenas os services os consomem, popularão as stores e os hooks entregam os dados às telas.

### Modelo conceitual do banco (MVP)

Entidades já refletidas em mocks e prontas para virar tabelas (Supabase/Postgres):

- academias
- usuarios + usuarios_papeis
- alunos
- matriculas
- turmas
- aulas_instancias
- presencas
- faixas
- graduacoes

### Próximos passos (antes de login/cadastro/banco real)

Refatorar telas da visão professor/instrutor para usar as novas entidades de domínio:

- `/dashboard` (staff) → usar academias, turmas, aulas_instancias, presencasStore.
- `/presencas` → separar “Chamada do dia” e “Pendências”, usando turmas + aulas_instancias + presencas.
- `/alunos` e `/alunos/[id]` → continuar usando `useAlunosStore`, agora com contexto de matriculas/academia.
- `/graduacoes` → alinhar com graduacoesStore + faixas + presencas usando esse modelo de domínio.

Ajustar menus/navegação para destacar o fluxo principal do professor (Dashboard → Presenças → Alunos/Graduacoes).

Só depois dessas refatorações de tela, iniciar a implementação de:

- Tela de login (usuário)
- Cadastro self-service do aluno (com código de convite da academia)
- Criação/migração do banco real (Supabase/Postgres) refletindo esse mesmo modelo.

### 🆕 Atualizações mais recentes (25/11 — gestão de alunos)

- **/alunos alinhado aos stores**: a listagem, filtros e cards usam apenas `useAlunosStore`/`usePresencasStore`/`useStaffDashboard`, sem acessar mocks diretamente.
- **Filtros por faixa/status coerentes**: seleção por `faixaSlug` + `getFaixaConfigBySlug` e status normalizado (`ATIVO/INATIVO`), refletindo o mesmo pipeline do dashboard do aluno e staff.
- **Tabela sincronizada**: graduação e contato renderizados com o mesmo visual de faixa/graus (BjjBeltStrip) e dados imediatos das stores após criar/editar/remover aluno.

### 🆕 Atualizações mais recentes (25/11 — presenças)

- **Fonte única de presenças**: os mocks agora são consumidos exclusivamente por `services/presencasService.ts`, permitindo trocar para Supabase/API apenas alterando essa camada.
- **Stores e páginas desacopladas de mocks**: dashboards (aluno e staff), check-in, histórico e visão de presenças usam apenas hooks/stores (`usePresencasStore`), sem importar `data/mockPresencas` diretamente.
- **Contratos padronizados**: tipos de presença e treino (`types/presenca.ts`, `types/treino.ts`) unificam status `PENDENTE | PRESENTE | FALTA | JUSTIFICADA` e metadados de criação/atualização, evitando variações por tela.
- **Fluxo mock → service → store → tela**: as ações de check-in, atualização de status e fechamento de treino passam primeiro pelo service, que atualiza o estado global via store antes de chegar às páginas.
- **Totais consistentes**: cálculos de presenças/faltas/pendentes aproveitam os mesmos dados da store, garantindo que dashboards e histórico exibam números alinhados.

### 🆕 Atualizações anteriores (24/11)

- **Evolução alinhada ao dashboard**: a página `/evolucao` agora consome o hook centralizado `useAlunoDashboard`, unificando cálculos de presença e projeções de graduação.
- **Linha do tempo combinada**: histórico real do aluno e planos futuros são exibidos na mesma timeline, com indicação visual de grau/faixa, instrutor e data formatada.
- **Projeção detalhada**: cards destacam a próxima graduação com percentual, aulas realizadas x meta, estimativa de data e lembrete sobre check-ins pendentes fora do horário.
- **Resumo rápido**: blocos com início na academia, aulas concluídas no grau/faixa e última atualização, todos derivados dos dados normalizados da dashboard.

### 🆕 Atualizações de graduações e dashboards

- **/graduacoes (staff)**: cards e timeline agora usam o view model `useGraduacoesProfessorView`, que combina `graduacoesStore`, `useAlunosStore`, `usePresencasStore` e helpers de faixa. Busca, faixa, tipo, status e janela de 30/60/90 dias filtram a lista sem depender de mocks diretos, e os cards exibem faixas/graus com `BjjBeltStrip`.
- **Dashboard do aluno**: centralizado em `useAlunoDashboard`, sem import direto de `mockPresencas`/`mockGraduacoes`; cards de presença usam o mesmo estado de `usePresencasStore` consumido em `/checkin` e `/historico-presencas`.
- **Dashboard do staff**: métricas e pendências vêm de `useStaffDashboard` (que agrega `usePresencasStore`, `useAlunosStore`, `useTreinosStore`, `useGraduacoesStore`), mantendo cards e listas sincronizados com `/alunos` e `/presencas`.
- **/perfil (aluno e staff)**: formulário e hero usam `useCurrentAluno`/`useCurrentStaff` + `useAlunosStore`, garantindo que faixa/grau venham da mesma fonte dos dashboards.

### Status de preparação para Supabase

- **Alunos (`/alunos`)** — **Pronto**: somente `alunosService` + `useAlunosStore` (nenhum mock direto na página).
- **Presenças (aluno + staff)** — **Pronto**: todas as rotas usam `presencasService` → `usePresencasStore` (check-in, dashboards, histórico, staff).
- **Evolução (`/evolucao`)** — **Pronto**: calcula projeções via `useAlunoDashboard` + `useGraduacoesStore`; usa apenas helpers de faixa compartilhados.
- **Graduações (`/graduacoes`)** — **Pronto**: lista e timeline dependem apenas de `useGraduacoesProfessorView` (que orquestra `graduacoesStore` + `useAlunosStore` + `usePresencasStore`) e dos helpers visuais de faixa (`getFaixaConfigBySlug`/`BjjBeltStrip`). Não há imports diretos de mocks.
- **Dashboards (`/dashboard` aluno/staff)** — **Pronto**: não há imports diretos de mocks; todo dado vem de hooks centralizados.

### Pontos de atenção atuais

- **Graduações (staff)**: usa `useGraduacoesProfessorView` + `updateGraduacao` para sincronizar status e renderiza faixas/graus com `getFaixaConfigBySlug`/`BjjBeltStrip`. Os filtros de faixa/tipo/status/período (30/60/90 dias) operam sobre o view model centralizado, sem mocks diretos.
- **Dashboards**: `/dashboard` (aluno) consome apenas `useAlunoDashboard`; `/dashboard` (staff) consome apenas `useStaffDashboard`. Não foram encontrados imports diretos de mocks, mas qualquer nova métrica deve seguir o mesmo hook para evitar divergências.
- **Presenças**: `/checkin`, `/historico-presencas`, `/presencas` e dashboards leem `usePresencasStore`; status seguem `PENDENTE | PRESENTE | FALTA | JUSTIFICADA`. Se alguma nova rota usar presenças, deve evitar `data/mockPresencas.ts` direto e reutilizar o store.
- **Rotas utilitárias**: `/belt-demo` depende de `MOCK_FAIXAS` (propósito de demonstração). Não usar como base para telas produtivas ou para preparar a integração com Supabase.

## 👥 Gestão de Alunos (/alunos)

- **Fonte única**: a listagem, filtros e cards usam apenas `useAlunosStore`/`alunosService` como origem de alunos, complementados por `usePresencasStore` e `graduacoesStore` para estatísticas contextuais.
- **Nada de mocks diretos**: nenhuma página sob `/alunos` importa `data/mockAlunos` ou outros mocks; todo acesso passa pelo pipeline oficial (mock → service → store → hooks → tela), alinhado ao dashboard do aluno e staff.
- **Filtros coerentes**: busca por nome, faixa (`faixaSlug`) e status (`ATIVO/INATIVO`) reaproveitam os mesmos slugs/enums usados em dashboards e presenças; filtros de treino consultam `usePresencasStore`/`useTreinosStore` ao invés de arrays locais.
- **Visual das faixas**: os elementos de graduação da lista/detalhe usam `getFaixaConfigBySlug` + componentes `BjjBeltStrip`/`BjjBeltProgressCard`, garantindo cores/graus iguais às telas `/dashboard-aluno`, `/dashboard`, `/graduacoes` e `/evolucao`.
- **Contagens sincronizadas**: totais e alunos ativos mostrados no hero são os mesmos do `useStaffDashboard` (derivado das stores), mantendo consistência com `/dashboard` e com as telas de presenças.

## 📒 Gestão de Presenças (MVP)

### Fluxo

- **Check-in do aluno**: o usuário logado (`useCurrentAluno`) envia presença do treino do dia pela `usePresencasStore.registrarCheckin`, que cria/atualiza o registro com status `PENDENTE`.
- **Confirmação pelo professor**: a visão de staff/professor carrega presenças via `usePresencasStore.carregarTodas/PorTreino` e altera status com `atualizarStatus` (ex.: `PRESENTE`, `FALTA`, `JUSTIFICADA`).
- **Fechamento de treino**: o botão “Fechar treino” chama `presencasStore.fecharTreino`, aplicando a regra atual (pendentes viram `PRESENTE`; ausentes continuam `FALTA`/`JUSTIFICADA`) e bloqueando novos check-ins com `marcarTreinoFechado`.
- **Reflexo entre telas**: qualquer atualização passa pelo service → store, mantendo dashboard do aluno, check-in, histórico e visão de staff sincronizados.

### Status e significado

- `PENDENTE`: check-in enviado pelo aluno, aguardando confirmação do professor.
- `PRESENTE`: presença confirmada manualmente ou ao fechar o treino.
- `FALTA`: ausência registrada ou placeholder automático do dia.
- `JUSTIFICADA`: falta com justificativa lançada pelo professor/staff.

### Camada de dados

1. `data/mockPresencas.ts` → **somente** lido pelo `services/presencasService.ts`.
2. `services/presencasService.ts` → centraliza listagens, check-in, atualização de status e fechamento.
3. `store/presencasStore.ts` → expõe ações/estado para UI, recalculando métricas de alunos.
4. Telas `/dashboard-aluno`, `/checkin`, `/historico-presencas`, `/presencas` → consomem apenas hooks/stores (nenhum acesso direto a mocks).

### Exemplos de uso

**Check-in do aluno**

```tsx
const { user, aluno } = useCurrentAluno();
const registrarCheckin = usePresencasStore((s) => s.registrarCheckin);

const handleCheckin = async (treino) => {
  await registrarCheckin({ alunoId: aluno?.id || user?.alunoId, treinoId: treino.id, data: hoje });
};
```

**Lista/ação do professor**

```tsx
const presencas = usePresencasStore((s) => s.presencas);
const atualizarStatus = usePresencasStore((s) => s.atualizarStatus);

// Exemplo de confirmação
await atualizarStatus(registro.id, 'PRESENTE');
```

### Checklist de telas alinhadas

- ✅ Dashboard do aluno (sincronizado com presenças mock via service/store)
- ✅ Check-in do aluno (`/checkin`)
- ✅ Histórico de presenças do aluno (`/historico-presencas`)
- ✅ Presenças do professor/staff (`/presencas`)

## 👥 Perfis e dashboards

- **Perfis suportados**: `ALUNO`, `INSTRUTOR`, `PROFESSOR` (há `ADMIN/TI` mapeados, seguirão o mesmo padrão em fase futura).
- **Hooks de sessão**: `useCurrentUser` (dados básicos), `useCurrentAluno` (perfil de aluno), `useCurrentStaff` (perfil de professor/instrutor/admin derivado do `instrutoresStore`).
- **Dashboards**: `/dashboard` seleciona automaticamente entre visão de professor/instrutor (via `useStaffDashboard`/`useProfessorDashboard`) ou aluno (`useAlunoDashboard`).
- **Telas de presença por perfil**: Aluno → `/dashboard`, `/checkin`, `/historico-presencas`; Professor/Instrutor → `/presencas` (listar/fechar treinos) e cards de presença no dashboard staff.

`useStaffDashboard` centraliza as métricas do painel staff a partir das mesmas stores/services usados em outras telas:

- **Alunos ativos/total** = contagem do `alunosStore` (mesma da lista de alunos).
- **Aulas na semana / check-ins registrados / histórico na semana** = `treinosStore` + `presencasStore` filtrados pela semana corrente.
- **Check-ins por status e pendências** = agregação de `presencasStore` (PRESENTE/PENDENTE/FALTA/JUSTIFICADA) sem cálculos locais na página.

Arquitetura de fluxo (mocks → service → store → hooks → tela):

```
mockInstrutores/mockPresencas
        ↓ (services)
instrutoresService / presencasService
        ↓ (stores)
useInstrutoresStore / usePresencasStore / treinosStore
        ↓ (hooks)
useCurrentStaff · useCurrentAluno · useStaffDashboard · useAlunoDashboard
        ↓ (telas)
Dashboards · Check-in · Histórico · Presenças (staff)
```

- **Gestão de alunos (`/alunos`)** segue o mesmo pipeline: `mockAlunos` → `alunosService` → `useAlunosStore` → filtros/lista na página, reaproveitando `getFaixaConfigBySlug` e os mesmos contadores de alunos ativos/total exibidos no dashboard de staff.

## 🔄 Consistência de dados entre perfis

### Entidades centrais e fontes oficiais

- **CurrentUser** (`types/session.ts` + `useCurrentUser`) — nome/email/avatar e papéis carregados do `userStore`.
- **AlunoProfile** (`types/aluno.ts` + `useAlunosStore`) — nome/nomeCompleto, faixaSlug/grauAtual, status e academia; normalizado por `normalizeAluno`.
- **StaffProfile** (`types/user.ts` + `useCurrentStaff`) — nome/nomeCompleto, email/avatar, roles e faixa/grau derivados do `AuthUser` + `Aluno` relacionado (via `alunosStore`).
- **BjjBeltVisualConfig** (`data/mocks/bjjBeltMocks.ts` + `getFaixaConfigBySlug`) — única fonte para visuais de faixa/grau.
- **PresencaRegistro** (`types/presenca.ts` + `presencasStore`/`presencasService`) — check-ins, confirmações e faltas.

### Como cada perfil consome os dados

- **Aluno**: `/dashboard-aluno`, `/checkin`, `/evolucao`, `/historico-presencas`, `/perfil` usam `useCurrentAluno` + `useAlunoDashboard`/`presencasStore` para nome/faixa/presenças.
- **Instrutor/Professor**: `/dashboard`, `/dashboard-instrutor`, `/presencas`, `/alunos`, `/perfil` usam `useCurrentStaff` (derivado do `userStore` + `alunosStore`) e as mesmas stores de presenças/treinos/alunos.
- **Admin/TI**: acessos ampliados seguem o mesmo pipeline (mocks → services → stores), com TODO para expansão de regras específicas.

### Fluxo único para faixa/grau e presenças

- Faixas sempre resolvidas por `faixaSlug` + `getFaixaConfigBySlug` + `BjjBeltStrip` (sem arrays duplicados).
- Configurações de faixa (`MOCK_FAIXAS`/`BjjBeltVisualConfig`) devem sempre fornecer `slug`, `categoria`, `grausMaximos` e cores de faixa/ponteira/listras; telas como `/dashboard`, `/evolucao`, `/graduacoes` e `/perfil` assumem esses campos para evitar quebras ao renderizar progresso.
- Presenças sempre via `presencasService` → `presencasStore`; totais em dashboards, histórico e visão staff leem o mesmo estado.

### Fluxo de dados para perfis de Professor/Instrutor/Admin

- **StaffProfile**: tipo central (`types/user.ts`) com nome/email/avatar, roles (`UserRole[]`), faixaSlug/grauAtual e métricas agregadas opcionais (presenças do dia, alunos ativos, etc.).
- **Fonte de verdade**: `useCurrentStaff` resolve o staff atual a partir do `AuthUser` (papéis/ids do `userStore`), cruzando com o `Aluno` relacionado em `alunosStore` para faixa/grau/avatar/status. O mock `MOCK_INSTRUTORES` fica restrito ao `instrutoresService` para compatibilidade, não às telas.
- **Dashboards e métricas**: `useStaffDashboard` (e aliases `useProfessorDashboard`/`useTiDashboard`/`useAdminDashboard`) lê `usePresencasStore`, `useAlunosStore`, `useGraduacoesStore` e `useTreinosStore`, monta resumo diário de presenças (`calcularResumoPresencas`/`comporRegistrosDoDia`) e contagens semanais compartilhadas com `/presencas`.
- **Perímetro de uso**: `/dashboard`, `/presencas`, `/perfil` e menus de usuário devem consumir apenas `useCurrentStaff`/`useStaffDashboard` para nome/faixa/grau e números; novas telas de staff NÃO devem importar `MOCK_INSTRUTORES` diretamente.

### Visão do Professor/Instrutor: telas e dados

- **Telas principais**: `/dashboard`, `/alunos`, `/presencas`, `/historico-presencas`, `/perfil` e `/configuracoes/*` (regras, treinos, tipos) compartilham o mesmo pipeline.
- **Sessão**: `useCurrentUser` mantém identidade e papéis; `useCurrentStaff` entrega `StaffProfile` (nome/email/avatar/faixa/roles) como fonte única para cabeçalhos, menus e cards.
- **Métricas**: `useStaffDashboard` centraliza contagens (alunos ativos/total, graduacoesPendentes, checkins/presenças/faltas/pendentes) reaproveitando `usePresencasStore` + helpers `calcularResumoPresencas`/`comporRegistrosDoDia`; `/presencas` e `/historico-presencas` leem a mesma lógica.
- **Permissões**: visões de configurações verificam `user.roles` (`PROFESSOR`/`INSTRUTOR`/`ADMIN`/`TI`). Usuários sem esses papéis veem aviso de acesso restrito.
- **Regra de ouro**: novas telas de staff devem consumir hooks/stores (`useCurrentStaff`, `useStaffDashboard`, `usePresencasStore`, `useAlunosStore`, etc.) e nunca acessar mocks diretamente.

### Hierarquia de perfis (Aluno, Instrutor, Professor, Admin)

- Um único `AuthUser` (em `types/user.ts` + `userStore`) representa a sessão e contém `roles: UserRole[]`, `alunoId` e `academiaId`.
- Instrutor/Professor/Admin são o mesmo usuário com papéis adicionais; faixa/grau/status são lidos do `Aluno` apontado por `alunoId` (via `alunosStore`).
- `useCurrentUser` expõe os dados brutos da sessão; `useCurrentStaff` combina `AuthUser` + `Aluno` para entregar nome/email/avatar/faixa/grau/status.
- `MOCK_INSTRUTORES` permanece encapsulado em `instrutoresService`/`instrutoresStore` apenas para compatibilidade; novas telas não devem importar esse mock.

### Mapeamento atual (fontes de dados de professor/instrutor)

- `data/mockInstrutores.ts` + `services/instrutoresService.ts`: único ponto que ainda lê `MOCK_INSTRUTORES` para hidratar a store legada de instrutores.
- `store/userStore.ts`: seeds de sessão definem `DEFAULT_INSTRUTOR_ID`/`professorId` e relacionam `alunoId` ao mesmo usuário raiz (`AuthUser`).
- `hooks/useCurrentInstrutor.ts`: hook legado que ainda consulta `instrutoresStore` (nenhuma tela atual consome esse caminho).
- `app/dashboard/page.jsx` e `services/dashboard/useStaffDashboard.ts`: nome/avatar/faixa/grau/status do professor vêm de `useCurrentStaff` → `AuthUser` + `alunosStore`; métricas de presenças/alunos usam apenas stores e helpers compartilhados.
- `app/perfil/page.jsx`: perfil do professor usa `useCurrentStaff` para preencher headline/faixa/avatar/status e grava alterações via `useCurrentUser` + `useAlunosStore` (sem ler mocks diretos).
- `components/ui/AppShell.jsx`, `components/ui/Header.jsx`, `components/ui/UserMenu.jsx`: cabeçalhos e menus exibem nome/email/avatar via `useCurrentUser`/`useCurrentStaff`; não há imports diretos de mocks.

### Exemplo de atualização consistente

1) **Alterar nome/avatar do aluno X** → `alunosService.updateAluno` atualiza `useAlunosStore`, sincroniza presenças/graduacoes e reflete no `userStore` quando o usuário logado é o mesmo aluno.
2) **Alterar nome/avatar do instrutor Y** → `/perfil` (staff) usa `useCurrentStaff` + `useAlunosStore` + `useCurrentUser` para atualizar o mesmo usuário raiz; hero, header e dashboards refletem imediatamente.
3) Telas afetadas automaticamente: header/menu do app, `/dashboard-aluno`, `/historico-presencas`, `/presencas` (staff), `/perfil` e listas em `/alunos`.

### Checklist rápido

- Nenhuma página usa `MOCK_ALUNOS` ou `MOCK_INSTRUTORES` diretamente (sempre via services/stores).
- Hooks de sessão: `useCurrentUser` → identidade básica; `useCurrentAluno`/`useCurrentStaff` → perfis completos.
- Todas as telas de faixa usam `faixaSlug` + `getFaixaConfigBySlug`.
- Dashboards do aluno x histórico x presenças compartilham os mesmos nomes e totais vindos das stores.

## 🎯 **O que já está pronto**

| Área | Destaques |
| --- | --- |
| Autenticação | Tela de login remodelada com hero informativo, seleção de papéis mock e token persistido (localStorage). |
| Dashboard (staff) | Hero `PageHero`, cards gradiente e alternância entre visões **Geral · Presenças · Graduações**. |
| Alunos | CRUD mockado com formulário em modal, distribuição de faixas e destaques para próximos graduandos. |
| Presenças (staff) | Registro rápido focado no check-in do dia, dropdown de sessão do dia, múltiplos treinos e correção via modal dedicado. |
| Graduações | Tela inspirada no app com hero, cards progressivos, linha do tempo e agendamento por grau/faixa. |
| Configurações | Hub com Regras de Graduação editáveis, Horários de Treino com persistência local e Tipos de Treino customizáveis. |
| Permissões | Site map centralizado, middleware de RBAC e navegação (sidebar/mobile/tablet) filtrada pelos papéis do usuário. |
| Área do Aluno | Layout separado com dashboard próprio, check-in, treinos do aluno, evolução e perfil editável (nome/contato/foto) via `/perfil`; histórico de presenças e relatórios pessoais acessíveis pelo menu do usuário. |
| Check-in do Aluno | Tela dedicada com lógica automática/pendente conforme horário do treino e status visível ao professor. |
| PWA | Manifesto completo, service worker com cache básico e ícones em múltiplos tamanhos. |

## 🧪 **Mocks e persistência**

- Seeds em `data/` abastecem stores do Zustand (`alunos`, `presenças`, `treinos`, `graduacoes`).
- Alterações são guardadas em `localStorage` para simular ambiente real sem backend.
- Middleware (`middleware.ts`) lê papéis persistidos para redirecionar usuários não autorizados.

## 📍 **Rotas úteis**

- `/login`: seleção de papel e acesso inicial.
- `/dashboard`, `/dashboard-instrutor`: visões de staff.
- `/dashboard-aluno`, `/checkin`: jornada do aluno com status em tempo real.
- `/configuracoes/*`: gestão de regras de graduação, horários e tipos de treino.

## 🧭 **Mapa da estrutura**

```
app/
  (authenticated)/
    dashboard-instrutor/
    dashboard/
    alunos/
      [id]/
    presencas/
      historico/
    graduacoes/
    regras-graduacao/
    horarios/
    tipos-treino/
    configuracoes/
      graduacao/
      treinos/
      tipos-treino/
    relatorios/
    historico-presencas/
    perfil/
  (student)/
    dashboard-aluno/
    treinos/
    checkin/
    evolucao/
  login/
components/
  ui/
services/
  api.js
  alunosService.js
  presencasService.ts
  graduacoesService.js
store/
  userStore.ts
  treinosStore.ts
  tiposTreinoStore.ts
  graduationRulesStore.ts
public/
  icons/
  manifest.json
  service-worker.js
styles/
  globals.css
  tailwind.css
```

### Perfis e permissões

- **Aluno (`student`):** acessa `(student)` com `/dashboard-aluno`, `/checkin`, `/treinos`, `/evolucao`, histórico em `/presencas/historico`, `/perfil` (apenas nome/telefone/foto) e relatórios pessoais. Tentativas de abrir telas administrativas redirecionam para o dashboard do aluno.
- **Instrutor/Professor (`instructor`/`teacher`):** utilizam `(authenticated)` com `/dashboard-instrutor`, presenças, check-in manual, `/graduacoes`, `/regras-graduacao`, `/horarios`, `/tipos-treino`, `/relatorios`, `/presencas/historico` (qualquer aluno) e `/perfil` editável.
- **Admin/TI (`admin`/`ti`):** têm acesso total, incluindo as configurações da academia e cadastros avançados.
- **Site map + middleware:** `config/siteMap.ts`, `config/roles.ts` e `middleware.ts` filtram links e protegem as rotas com RBAC centralizado baseado no papel salvo via Zustand.

## 📌 Funções por perfil, telas e ações

| Perfil | Telas liberadas | Ações permitidas |
| --- | --- | --- |
| **Aluno (`aluno`/`student`)** | `/dashboard-aluno`, `/checkin`, `/treinos`, `/evolucao`, `/historico-presencas`, `/perfil`, `/relatorios` | Check-in próprio (status automático ou pendente), visualizar treinos do dia, acompanhar evolução e progresso de faixas, consultar histórico e relatórios pessoais, editar informações básicas do perfil. |
| **Instrutor (`instrutor`/`instructor`)** | Tudo do aluno + `/dashboard`, `/presencas`, `/alunos`, `/relatorios` | Registrar/editar presenças de qualquer aluno, aprovar/recusar check-ins pendentes, lançar ausências justificadas, cadastrar/editar alunos via modal, acessar relatórios e visão geral do painel staff. |
| **Professor (`professor`/`teacher`)** | Tudo do instrutor + `/configuracoes`, `/configuracoes/graduacao`, `/configuracoes/treinos`, `/configuracoes/tipos-treino`, `/graduacoes` | Fechar treinos do dia, configurar regras de graduação, horários e tipos de treino, criar/editar agendamentos de graduação, marcar treinos como fechados para impedir check-ins tardios. |
| **Admin/TI (`admin`/`ti`)** | Acesso total (qualquer rota) | Todas as ações anteriores, além de manutenção ampla de dados mockados, testes de RBAC e navegação irrestrita para QA. |

> As permissões são derivadas de `config/siteMap.ts` e normalizadas em `config/roles.ts`, garantindo coerência entre a navegação (sidebar, mobile e hero links) e o middleware de rota.

### Check-in do aluno (mock)

- **Treinos do dia** chegam via stores (`useTreinosStore` + `usePresencasStore`), sempre intermediados por `presencasService` — nenhuma página acessa os mocks diretamente.
- **Status padronizados:** check-ins criam/atualizam registros como `PENDENTE`; professores ou fechamento do treino convertem para `PRESENTE`, e ausências são registradas como `FALTA` ou `JUSTIFICADA` via atualização de status.
- **Limites:** um registro por treino/data; tentativas duplicadas retornam o mesmo registro para evitar múltiplos check-ins.

## 🧾 Regras de negócios principais

- **RBAC centralizado:** papéis são normalizados (`config/roles.ts`) e persistidos no `localStorage`/cookies pela `userStore`, aplicando o filtro de rotas no `middleware.ts` e nos componentes de navegação.
- **Fluxo de presenças centralizado:** os mocks vivem em `data/mockPresencas.ts`, são servidos por `services/presencasService.ts`, sincronizados em `store/presencasStore.ts` e consumidos pelas telas. Isso já deixa o código pronto para trocar os mocks por API apenas mudando o service.
- **Check-ins e status:** registros começam como `PENDENTE`; aprovação/fechamento de treino os torna `PRESENTE`, e ausências justificadas usam `FALTA` ou `JUSTIFICADA`. A store evita duplicidade para o mesmo aluno/treino/data e propaga contadores atualizados para `alunosStore`.
- **Fechamento de treino:** `presencasStore.fecharTreino` chama o service para marcar pendências como `PRESENTE` e sincroniza o snapshot completo de presenças, garantindo consistência das estatísticas nos dashboards.
- **Regras de graduação configuráveis:** matriz completa em `config/graduationRules.ts` com requisitos de idade mínima, tempo de faixa, aulas mínimas e faixas seguintes. A `graduationRulesStore` permite ajustes por faixa ou por grau (stripe) com persistência local.
- **Sincronização de alunos:** toda alteração de presença recalcula progressão de alunos (`presencasStore` → `alunosStore`), mantendo contadores de aulas no grau/faixa atual para dashboards e timelines.

## 🗺️ Mapa de telas e papéis

Visões e rotas principais separadas por perfil:

- **Aluno**
  - `/dashboard-aluno`: resumo pessoal (faixa atual, próximas graduações, presenças recentes).
  - `/evolucao`: linha do tempo de graduações e presenças individuais.
  - `/historico-presencas` (aluno): histórico completo de check-ins e confirmações.
  - `/checkin`: inicia presença com status `PENDENTE` antes da confirmação do professor.
- **Professor/Instrutor (staff)**
  - `/dashboard`: visão geral de alunos, presenças e graduações consolidadas.
  - `/presencas`: gestão diária de presenças, confirmação, justificativas e fechamento de treino.
  - `/historico-presencas`: linha do tempo das presenças de toda a academia com filtros avançados.
  - `/graduacoes`: promoções planejadas/em progresso/concluídas com filtro 30/60/90 dias e histórico recente.
  - `/alunos`: gestão de perfis, faixas, planos e status dos alunos.
- **Admin/Coordenação**
  - `/configuracoes/graduacao`: regras e matrizes de graduação (faixas, requisitos, idades mínimas).
  - `/configuracoes` (demais abas): cadastros estruturais (treinos, planos) que alimentam stores e serviços.
- **TI/Componentes compartilhados**
  - `components/bjj/*`: renderização de faixas/graus (`BjjBeltStrip`, `BjjBeltProgressCard`).
  - `components/ui/*`: base de UI (Modal, Table, inputs, selectors) utilizada por todas as rotas.
  - `services/*` + `store/*`: orquestram mocks centralizados e serão substituídos pela API oficial.

### Gestão de Presenças (visão staff)
- `/presencas` (professor/staff) usa o modelo de domínio novo: `academiasStore` + `turmasStore` + `aulasStore` + `matriculasStore` + `presencasStore` + `alunosStore`, sem importar mocks diretamente.
- Todas as operações de presença continuam passando por `presencasService`/`presencasStore`, facilitando a troca por API real.
- `/historico-presencas` (staff) reaproveita as mesmas stores e agregadores, mantendo consistência de status (`PENDENTE`, `PRESENTE`, `FALTA`, `JUSTIFICADA`) e filtros.

#### Tela `/presencas` (professor/instrutor)
- **Chamada do dia:** seleciona data + turma da academia do usuário, cria/resolve a `aula_instancia` correspondente e monta a lista de alunos a partir das matrículas ativas. Ações marcam `PRESENTE`, `FALTA` ou `JUSTIFICADA` via `presencasStore.registrarPresencaEmAula`; o botão "Fechar treino" troca todas as pendências da aula para `PRESENTE` e encerra a instância.
- **Pendências:** lista apenas presenças `PENDENTE` no intervalo escolhido (7/30 dias, etc.), exibindo aluno, turma e horário da aula. A aprovação/recusa usa `presencasStore.atualizarStatus`, mantendo o snapshot global alinhado com dashboards e histórico.
- Faixa/grau do aluno continuam vindo de `getFaixaConfigBySlug` e `alunosStore`, preservando o visual existente.

### Graduações (visão professor/instrutor)
- `/graduacoes` consome **somente** `useGraduacoesStore` (seedado pelo `graduacoesService`) e `useAlunosStore`, mais contexto de sessão via `useCurrentStaff`, para listar promoções planejadas e o histórico consolidado.
- Filtros por nome, faixa (via `faixaSlug` + `getFaixaConfigBySlug`), status e tipo reaproveitam os mesmos slugs e enums usados em dashboards, sem importar mocks diretamente na página.
- Totais de graduações pendentes/concluídas e a próxima cerimônia refletem o mesmo conjunto de dados usado pelo `useStaffDashboard`, garantindo números alinhados com os cards do dashboard.
- O histórico usa `historicoGraduacoes` dos alunos e os componentes modernos de faixa (`BjjBeltStrip`), mantendo o visual unificado com `/belt-demo`, com filtro rápido de 30/60/90 dias para focar nos registros mais recentes. Migrar de mocks para API exige apenas trocar o `graduacoesService`.

##### Seeds de graduação alinhados aos filtros 30/60/90 dias
- `data/mockGraduacoes.ts` agora gera datas relativas (15/45/75 dias atrás + previsões futuras) com `dataConclusao` para registros concluídos, garantindo que os botões 30d/60d/90d exibam sempre itens reais.
- `data/mockAlunos.ts` foi sincronizado com essas promoções recentes (faixas/graus e `historicoGraduacoes`), mantendo consistência em `/evolucao`, dashboards e timelines.
- `data/mockPresencas.ts` cobre os últimos 90 dias com diferentes status, reforçando métricas de presença das mesmas pessoas que aparecem em `/graduacoes` e `/dashboard`.

#### Futuro de `/graduacoes`
- Evoluir o "Histórico recente" para um relatório mais robusto, com filtros adicionais e exportação, mantendo a mesma fonte de dados centralizada e cronologia validada por faixas/graus.

### Componentes compartilhados de UI

- `PageHero`: cartão heroico reutilizado nas páginas do painel.
- `Card`, `Table`, `AttendanceTable`, `Modal`, `PresenceForm`, `GraduationList`, `GraduationTimeline`.
- Botões, inputs e cards seguem a mesma linguagem visual (bordas arredondadas, gradientes suaves, brilho vermelho).

## 🤝 **Contribuindo**

1. `git checkout -b feature/nova-feature`
2. `git commit -m "feat: descrição"`
3. Abra um Pull Request descrevendo a melhoria

## 📄 **Licença**

Projeto proprietário de **Bruno Alves França**.

---

> **BJJ Academy — Evolve Your Training**
>
> Estrutura pronta para conectar com a API oficial e escalar o sistema de gestão da sua academia.
