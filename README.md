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
- **Hooks de sessão**: `useCurrentUser` (dados básicos), `useCurrentAluno` (perfil de aluno), `useCurrentInstrutor` (perfil instrutor/professor via store de instrutores).
- **Dashboards**: `/dashboard` seleciona automaticamente entre visão de professor/instrutor (via `useProfessorDashboard`) ou aluno (`useAlunoDashboard`).
- **Telas de presença por perfil**: Aluno → `/dashboard`, `/checkin`, `/historico-presencas`; Professor/Instrutor → `/presencas` (listar/fechar treinos) e cards de presença no dashboard staff.

`useProfessorDashboard` centraliza as métricas do painel staff a partir das mesmas stores/services usados em outras telas:

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
useCurrentInstrutor · useCurrentAluno · useProfessorDashboard · useAlunoDashboard
        ↓ (telas)
Dashboards · Check-in · Histórico · Presenças (staff)
```

## 🔄 Consistência de dados entre perfis

### Entidades centrais e fontes oficiais

- **CurrentUser** (`types/session.ts` + `useCurrentUser`) — nome/email/avatar e papéis carregados do `userStore`.
- **AlunoProfile** (`types/aluno.ts` + `useAlunosStore`) — nome/nomeCompleto, faixaSlug/grauAtual, status e academia; normalizado por `normalizeAluno`.
- **InstrutorProfile** (`types/instrutor.ts` + `useInstrutoresStore`) — nome/nomeCompleto, faixaSlug/grauAtual, status e avatar derivados dos mocks centralizados.
- **BjjBeltVisualConfig** (`data/mocks/bjjBeltMocks.ts` + `getFaixaConfigBySlug`) — única fonte para visuais de faixa/grau.
- **PresencaRegistro** (`types/presenca.ts` + `presencasStore`/`presencasService`) — check-ins, confirmações e faltas.

### Como cada perfil consome os dados

- **Aluno**: `/dashboard-aluno`, `/checkin`, `/evolucao`, `/historico-presencas`, `/perfil` usam `useCurrentAluno` + `useAlunoDashboard`/`presencasStore` para nome/faixa/presenças.
- **Instrutor/Professor**: `/dashboard`, `/dashboard-instrutor`, `/presencas`, `/alunos`, `/perfil` usam `useCurrentInstrutor` (derivado do `userStore` + `instrutoresStore`) e as mesmas stores de presenças/treinos/alunos.
- **Admin/TI**: acessos ampliados seguem o mesmo pipeline (mocks → services → stores), com TODO para expansão de regras específicas.

### Fluxo único para faixa/grau e presenças

- Faixas sempre resolvidas por `faixaSlug` + `getFaixaConfigBySlug` + `BjjBeltStrip` (sem arrays duplicados).
- Presenças sempre via `presencasService` → `presencasStore`; totais em dashboards, histórico e visão staff leem o mesmo estado.

### Exemplo de atualização consistente

1) **Alterar nome/avatar do aluno X** → `alunosService.updateAluno` atualiza `useAlunosStore`, sincroniza presenças/graduacoes e reflete no `userStore` quando o usuário logado é o mesmo aluno.
2) **Alterar nome/avatar do instrutor Y** → `instrutoresStore.atualizar` (via `/perfil` do professor) atualiza o profile central e sincroniza o `userStore` para que hero, header e dashboards mostrem o mesmo dado.
3) Telas afetadas automaticamente: header/menu do app, `/dashboard-aluno`, `/historico-presencas`, `/presencas` (staff), `/perfil` e listas em `/alunos`.

### Checklist rápido

- Nenhuma página usa `MOCK_ALUNOS` ou `MOCK_INSTRUTORES` diretamente (sempre via services/stores).
- Hooks de sessão: `useCurrentUser` → identidade básica; `useCurrentAluno`/`useCurrentInstrutor` → perfis completos.
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
